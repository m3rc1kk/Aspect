from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from apps.comments.models import Comment
from apps.posts.models import Post
from apps.posts.serializers import PostSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'parent', 'content', 'created_at', 'replies_count']
        read_only_fields = ['id', 'author', 'created_at']

    def get_replies_count(self, obj):
        return obj.replies.count()


class CommentDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'parent', 'content', 'created_at', 'replies']
        read_only_fields = ['id', 'author', 'created_at']


    def get_replies(self, obj):
        if obj.parent is None:
            replies = obj.replies.select_related('author')
            return CommentSerializer(replies, many=True).data
        return []


class CommentCreateSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Comment
        fields = ['post', 'parent', 'content']

    def validate(self, data):
        parent = data.get('parent')
        post = data.get('post')

        if parent and parent.post != post:
            raise serializers.ValidationError({
                'parent': 'Parent comment must belong to the same post'
            })

        if parent and parent.parent:
            raise serializers.ValidationError({
                'parent': 'Cannot reply to a reply.'
            })

        return data

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
