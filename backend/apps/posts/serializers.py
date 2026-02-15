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
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'created_at', 'images', 'comments_count', 'likes_count', 'is_liked']
        read_only_fields = ['id', 'author', 'created_at', 'images']

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.likes.count()

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

    class Meta:
        model = Post
        fields = ['id', 'content', 'images']
        read_only_fields = ['id']

    def validate_images(self, value):
        if len(value) > 10:
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

    def to_representation(self, instance):
        return PostSerializer(instance, context=self.context).data


