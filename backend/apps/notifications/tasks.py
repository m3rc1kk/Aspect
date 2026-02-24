from datetime import timedelta
from django.utils import timezone

from celery import shared_task
from django.contrib.auth import get_user_model

from apps.notifications.models import Notification
from apps.posts.models import Post

User = get_user_model()

@shared_task
def notify_like(recipient_id, sender_id, post_id):
    recipient = User.objects.filter(pk=recipient_id).first()
    sender = User.objects.filter(pk=sender_id).first()
    post = Post.objects.filter(pk=post_id).first()
    if not recipient or not sender or not post:
        return
    if recipient_id == sender_id:
        return

    Notification.objects.create(
        recipient=recipient,
        sender=sender,
        post=post,
        notification_type='like',
    )

@shared_task
def notify_subscription(recipient_id, sender_id):
    recipient = User.objects.filter(pk=recipient_id).first()
    sender = User.objects.filter(pk=sender_id).first()
    if not recipient or not sender:
        return
    if recipient_id == sender_id:
        return

    Notification.objects.create(
        recipient=recipient,
        sender=sender,
        notification_type='subscription',
    )

@shared_task
def cleanup_old_notifications(days=7):
    threshold = timezone.now() - timedelta(days=days)
    deleted_count, _ = Notification.objects.filter(created_at__lt=threshold).delete()
    return deleted_count