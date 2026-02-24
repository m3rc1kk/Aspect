import redis
from django.conf import settings


def get_redis():
    return redis.from_url(settings.CELERY_BROKER_URL, decode_responses=True)

def incr_likes(post_id):
    r = get_redis()
    key = f'{settings.LIKE_CODE_REDIS_PREFIX}{post_id}'
    return r.incr(key)

def decr_likes(post_id):
    r = get_redis()
    key = f'{settings.LIKE_CODE_REDIS_PREFIX}{post_id}'
    val = r.decr(key)
    if val < 0:
        r.set(key, 0)
        return 0
    return val

def get_likes_count(post):
    r = get_redis()
    post_id = getattr(post, 'id', post)
    key = f'{settings.LIKE_CODE_REDIS_PREFIX}{post_id}'

    count = r.get(key)
    if count is not None:
        return int(count)

    if isinstance(post, int):
        from apps.posts.models import Post
        post = Post.objects.get(pk=post_id)
    count = post.likes.count()
    r.set(key, count)
    return count
