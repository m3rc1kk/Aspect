from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Chat, Message

User = get_user_model()


class UserChatListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nickname', 'avatar']


class LastMessageSerializer(serializers.ModelSerializer):
    sender_nickname = serializers.CharField(source='sender.nickname', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'text', 'sender_nickname', 'created_at', 'read_at']


class ChatListSerializer(serializers.ModelSerializer):
    other_participant = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            'id', 'other_participant', 'last_message', 'unread_count',
            'updated_at', 'created_at',
        ]

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        other = obj.get_other_participant(request.user)
        return UserChatListSerializer(other).data

    def get_last_message(self, obj):
        last = obj.messages.order_by('-created_at').first()
        if not last:
            return None
        return LastMessageSerializer(last).data

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        return obj.messages.filter(read_at__isnull=True).exclude(sender=request.user).count()


class ChatDetailSerializer(serializers.ModelSerializer):
    other_participant = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'other_participant', 'created_at', 'updated_at']

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        other = obj.get_other_participant(request.user)
        return UserChatListSerializer(other).data


class MessageSerializer(serializers.ModelSerializer):
    sender_nickname = serializers.CharField(source='sender.nickname', read_only=True)
    sender_avatar = serializers.ImageField(source='sender.avatar', read_only=True)
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'chat', 'sender', 'sender_nickname', 'sender_avatar',
            'text', 'created_at', 'read_at', 'is_mine',
        ]
        read_only_fields = ['id', 'chat', 'sender', 'created_at', 'read_at', 'sender_nickname', 'sender_avatar', 'is_mine']

    def get_is_mine(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        return obj.sender_id == request.user.id


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['text']

    def validate_text(self, value):
        value = (value or '').strip()
        if not value:
            raise serializers.ValidationError('Text cannot be empty.')
        return value
