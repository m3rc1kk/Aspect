import random
import string
import redis
from django.conf import settings

def generate_code():
    return ''.join(random.choices(string.digits, k=6))

def get_redis():
    return redis.from_url(settings.CELERY_BROKER_URL, decode_responses=True)

def set_signup_code(email, code):
    r = get_redis()
    key = f"{settings.SIGNUP_CODE_REDIS_PREFIX}{email}"
    r.set(key, code, ex=settings.SIGNUP_CODE_TTL_SECONDS)


def get_signup_code(email):
    r = get_redis()
    key = f"{settings.SIGNUP_CODE_REDIS_PREFIX}{email}"
    return r.get(key)


def delete_signup_code(email):
    r = get_redis()
    key = f"{settings.SIGNUP_CODE_REDIS_PREFIX}{email}"
    r.delete(key)