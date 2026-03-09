from django.contrib import admin
from .models import Chat, Message


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ['id', 'participant1', 'participant2', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['participant1__email', 'participant2__email']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'chat', 'sender', 'text', 'created_at', 'read_at']
    list_filter = ['created_at', 'read_at']
    search_fields = ['text', 'sender__email']
