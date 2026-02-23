from django.db import models

from django.conf import settings

from apps.posts.models import Post


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        LIKE = 'like', 'Like'
        SUBSCRIPTION = 'subscription', 'Subscription'

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_notifications',
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )

    notification_type = models.CharField(max_length=20, choices=NotificationType.choices)

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True, blank=True
    )
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} | {self.recipient} | {self.notification_type} | {self.post}'

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
