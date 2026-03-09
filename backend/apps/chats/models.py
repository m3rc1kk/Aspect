from django.conf import settings
from django.db import models


class Chat(models.Model):
    participant1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chats_as_participant1',
    )
    participant2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chats_as_participant2',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['participant1', 'participant2'],
                name='unique_chat_participants',
            ),
        ]
        indexes = [
            models.Index(fields=['participant1', '-updated_at'], name='chat_p1_updated_idx'),
            models.Index(fields=['participant2', '-updated_at'], name='chat_p2_updated_idx'),
        ]
        ordering = ['-updated_at']

    def __str__(self):
        return f'Chat {self.participant1_id}-{self.participant2_id}'

    def get_other_participant(self, user):
        return self.participant2 if user == self.participant1 else self.participant1

    def is_participant(self, user):
        return user in (self.participant1, self.participant2)


class Message(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['chat', '-created_at'], name='msg_chat_created_idx'),
        ]
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'

    def __str__(self):
        return f'{self.sender} in {self.chat}: {self.text[:50]}'
