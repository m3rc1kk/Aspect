from celery import shared_task
from django.db.models import Count
from apps.posts.models import Post
import redis
from django.conf import settings



@shared_task
def sync_likes_count_from_db():
    r = redis.from_url(settings.CELERY_BROKER_URL, decode_responses=True)
    counts = (
        Post.objects.values("id")
        .annotate(like_count=Count("likes"))
        .filter(like_count__gt=0)
    )
    for row in counts:
        key = f"{settings.LIKE_CODE_REDIS_PREFIX}{row['id']}"
        r.set(key, row["like_count"])