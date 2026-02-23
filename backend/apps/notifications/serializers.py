from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from apps.posts.serializers import PostSerializer
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'recipient', 'sender', 'post', 'read', 'created_at']