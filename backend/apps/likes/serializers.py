from django.db import IntegrityError
from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from apps.likes.models import Like
from apps.posts.models import Post
from apps.posts.serializers import PostSerializer


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'user', 'post', 'created_at']


class LikeCreateSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Like
        fields = ['post']


    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'post': 'You have already liked this post.'
            })