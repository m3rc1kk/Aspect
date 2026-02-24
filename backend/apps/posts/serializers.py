from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from apps.likes.redis_counters import get_likes_count
from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer
from apps.posts.models import Post, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image', 'order']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    organization = OrganizationSerializer(read_only=True, allow_null=True)
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'organization', 'created_at', 'images', 'comments_count', 'likes_count', 'is_liked']
        read_only_fields = ['id', 'author', 'created_at', 'images']

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return get_likes_count(obj)

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False),
        required=False,
        write_only=True,
    )
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = Post
        fields = ['id', 'content', 'images', 'organization']
        read_only_fields = ['id']

    def validate_images(self, value):
        if len(value) > 10:
            raise serializers.ValidationError(
                'Maximum 10 images'
            )
        max_size = 5 * 1024 * 1024
        valid_extensions = ['jpeg', 'png', 'jpg', 'webp']
        for img in value:
            if img.size > max_size:
                raise serializers.ValidationError(
                    'Image size should be less than 5MB'
                )
            ext = (img.name or '').split('.')[-1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(
                    'This is not an image'
                )
        return value

    def validate_content(self, value):
        content = (value or '').strip()
        if not content:
            raise serializers.ValidationError('Content cannot be empty.')
        max_length = 1000
        if len(content) > max_length:
            raise serializers.ValidationError(
                f'Content must be at most {max_length} characters'
            )
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        post = Post.objects.create(**validated_data)
        for i, img in enumerate(images_data):
            PostImage.objects.create(post=post, image=img, order=i)
        return post

    def to_representation(self, instance):
        return PostSerializer(instance, context=self.context).data


