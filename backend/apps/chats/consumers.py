import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Chat, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'
        self.user = self.scope.get('user')

        if not self.user or not self.user.is_authenticated:
            await self.close(code=4401)
            return

        is_participant = await self.check_chat_access()
        if not is_participant:
            await self.close(code=4403)
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return
        try:
            data = json.loads(text_data)
            text = (data.get('text') or '').strip()
        except (json.JSONDecodeError, TypeError):
            text = text_data.strip()
        if not text:
            return

        message = await self.save_message(text)
        if message:
            payload = {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'sender_id': self.user.id,
                    'sender_nickname': self.user.nickname,
                    'text': message.text,
                    'created_at': message.created_at.isoformat(),
                    'read_at': message.read_at.isoformat() if message.read_at else None,
                },
            }
            await self.channel_layer.group_send(self.room_group_name, payload)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def check_chat_access(self):
        try:
            chat = Chat.objects.get(pk=self.chat_id)
            return chat.is_participant(self.user)
        except Chat.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, text):
        try:
            chat = Chat.objects.get(pk=self.chat_id)
            if not chat.is_participant(self.user):
                return None
            return Message.objects.create(chat=chat, sender=self.user, text=text)
        except Chat.DoesNotExist:
            return None
