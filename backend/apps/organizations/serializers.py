from django.contrib.auth.validators import UnicodeUsernameValidator

from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from apps.organizations.models import Organization

_username_validator = UnicodeUsernameValidator()


class OrganizationSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    followers_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'username', 'nickname', 'owner', 'avatar', 'is_verified','followers_count', 'is_following', 'created_at']
        read_only_fields = ['id', 'username', 'nickname', 'owner', 'avatar', 'is_verified', 'followers_count', 'is_following', 'created_at']

    def get_followers_count(self, obj):
        return obj.orgFollowing.count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.orgFollowing.filter(follower=request.user).exists()
        return False


class OrganizationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'username', 'nickname', 'avatar']

    def validate_username(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('Username must be 30 characters or fewer.')
        _username_validator(value)
        qs = Organization.objects.filter(username=value)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_avatar(self, value):
        if value:
            max_size = 5 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError('Image size should be less than 5MB')
            valid_extensions = ['jpeg', 'png', 'jpg', 'webp']
            ext = value.name.split('.')[-1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError('This is not an image')
        return value

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return Organization.objects.create(**validated_data)



