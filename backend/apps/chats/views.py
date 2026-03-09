from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Chat, Message
from .permissions import IsChatParticipant
from .serializers import (
    ChatDetailSerializer,
    ChatListSerializer,
    MessageCreateSerializer,
    MessageSerializer,
)


class ChatViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ChatDetailSerializer
        return ChatListSerializer

    def get_queryset(self):
        user = self.request.user
        return (
            Chat.objects
            .filter(Q(participant1=user) | Q(participant2=user))
            .select_related('participant1', 'participant2')
            .prefetch_related('messages')
        )

    def create(self, request, *args, **kwargs):
        participant_id = request.data.get('participant_id')
        if not participant_id:
            return Response(
                {'participant_id': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            pid = int(participant_id)
        except (TypeError, ValueError):
            return Response(
                {'participant_id': ['Invalid value.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if pid == request.user.id:
            return Response(
                {'participant_id': ['You cannot start a chat with yourself.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        p1_id = min(request.user.id, pid)
        p2_id = max(request.user.id, pid)
        chat, created = Chat.objects.get_or_create(
            participant1_id=p1_id,
            participant2_id=p2_id,
            defaults={'participant1_id': p1_id, 'participant2_id': p2_id},
        )
        serializer = ChatDetailSerializer(chat, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_participant(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated, IsChatParticipant])
    def messages(self, request, pk=None):
        chat = self.get_object()
        if request.method == 'GET':
            qs = chat.messages.select_related('sender').order_by('-created_at')
            page = self.paginate_queryset(qs)
            if page is not None:
                serializer = MessageSerializer(page, many=True, context={'request': request})
                return self.get_paginated_response(serializer.data)
            serializer = MessageSerializer(qs, many=True, context={'request': request})
            return Response(serializer.data)
        serializer = MessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        msg = serializer.save(chat=chat, sender=request.user)
        channel_layer = get_channel_layer()
        if channel_layer:
            room = f'chat_{chat.id}'
            payload = {
                'type': 'chat_message',
                'message': {
                    'id': msg.id,
                    'sender_id': msg.sender_id,
                    'sender_nickname': msg.sender.nickname,
                    'text': msg.text,
                    'created_at': msg.created_at.isoformat(),
                    'read_at': msg.read_at.isoformat() if msg.read_at else None,
                },
            }
            try:
                async_to_sync(channel_layer.group_send)(room, payload)
            except Exception:
                pass
        out = MessageSerializer(msg, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)
