from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from apps.posts.models import Post, PostImage


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image', 'order']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'created_at', 'images']
        read_only_fields = ['id', 'author', 'created_at', 'images']


class PostCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField,
        required=False,
        allow_empty_file=False
    )

    class Meta:
        model = Post
        fields = ['content', 'images']

    def validate_images(self, value):
        if len(value)> 10:
            raise serializers.ValidationError(
                'Maximum 10 images'
            )
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        post = Post.objects.create(**validated_data)
        for i, img in enumerate(images_data):
            PostImage.objects.create(post=post, image=img, order=i)
        return post


