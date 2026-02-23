from django.dispatch import receiver
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.likes.models import Like
from apps.subscriptions.models import Subscription
from .tasks import notify_like, notify_subscription

@receiver(post_save, sender=Like)
def on_like_created(sender, instance, created, **kwargs):
    if not created:
        return
    if instance.user_id == instance.post.author_id:
        return

    notify_like.delay(
        instance.post.author_id,
        instance.user_id,
        instance.post_id,
    )

@receiver(post_save, sender=Subscription)
def on_subscription_created(sender, instance, created, **kwargs):
    if not created:
        return
    if instance.follower_id == instance.following_id:
        return

    notify_subscription.delay(
        instance.following_id,
        instance.follower_id,
    )