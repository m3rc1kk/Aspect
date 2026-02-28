from django.contrib.auth import authenticate
from apps.accounts.redis_utils import generate_code, set_signup_code, get_signup_code, delete_signup_code
from apps.accounts.tasks import send_password_reset_email, send_verification_code_email
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from apps.accounts.models import User

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from apps.subscriptions.models import Subscription
from config.settings import FRONTEND_URL


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'nickname', 'email', 'avatar', 'badge', 'awards', 'is_staff', 'is_active']
        read_only_fields = ['id', 'email', 'is_staff', 'is_active', 'badge', 'awards']


class UserStatsSerializer(UserSerializer):
    is_following = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['date_joined', 'is_following', 'followers_count', 'following_count', 'comments_count', 'likes_count', 'post_count']

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Subscription.objects.filter(follower=request.user, following=obj).exists()
        return False

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_post_count(self, obj):
        return obj.posts.count()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
    )

    confirm_password = serializers.CharField(
            write_only=True,
    )

    class Meta:
        model = User
        fields = ['username', 'nickname', 'email', 'avatar', 'password', 'confirm_password']

        extra_kwargs = {
            'email': {'validators': []},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError('Passwords must match.')
        return attrs

    def validate_username(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('Username must be 30 characters or fewer.')
        return value

    def validate_nickname(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('Nickname must be 30 characters or fewer.')
        return value

    def validate_avatar(self, value):
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError(
                'Image size should be less than 5MB'
            )

        valid_extensions = ['jpeg', 'png', 'jpg', 'webp']
        ext = value.name.split('.')[-1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                'This is not an image'
            )
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data['email']

        User.objects.filter(email=email, is_active=False).delete()
        user = User.objects.create_user(
            **validated_data,
            is_active=False
        )
        code = generate_code()
        set_signup_code(email, code)
        send_verification_code_email.delay(email, code)
        return user

class UserRegistrationVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code').strip()
        user = User.objects.filter(email=email, is_active=False).first()
        if not user:
            raise serializers.ValidationError('No pending registration for this email. Please sign up first.')
        stored_code = get_signup_code(email)
        if not stored_code or stored_code != code:
            raise serializers.ValidationError('Invalid or expired code.')
        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.is_active = True
        user.save(update_fields=['is_active'])
        delete_signup_code(user.email)
        return user



class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password,
            )

            if not user:
                raise serializers.ValidationError(
                    'Invalid email or password'
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    'Your account is disabled'
                )

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'Email and password are required.'
            )

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'nickname', 'avatar']

    def validate_avatar(self, value):
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError(
                'Image size should be less than 5MB'
            )

        valid_extensions = ['jpeg', 'png', 'jpg', 'webp']
        ext = value.name.split('.')[-1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                'This is not an image'
            )
        return value

    def validate_username(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('Username must be 30 characters or fewer.')
        user = self.instance
        if User.objects.filter(username=value).exclude(pk=user.id).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_nickname(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('Nickname must be 30 characters or fewer.')
        return value

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_link = f'{FRONTEND_URL}/password/reset/{uid}/{token}'

            send_password_reset_email.delay(
                email=email,
                subject='Aspect - Reset Password',
                message=f'Follow the link to reset your password: {reset_link}',
            )


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                'Passwords must match.'
            )

        try:
            uid = urlsafe_base64_decode(attrs['uid']).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError('Invalid UID')

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError('Invalid or expired token')

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=True)

