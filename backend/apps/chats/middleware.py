from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken


def _get_anonymous_user():
    from django.contrib.auth.models import AnonymousUser
    return AnonymousUser()


@database_sync_to_async
def get_user_from_token(token_key):
    try:
        token = AccessToken(token_key)
        user_id = token.get('user_id')
        from django.apps import apps
        User = apps.get_model(settings.AUTH_USER_MODEL)
        return User.objects.get(pk=user_id)
    except Exception:
        return _get_anonymous_user()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        qs = parse_qs(query_string)
        token_list = qs.get('token') or qs.get('access')
        token = token_list[0] if token_list else None
        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = _get_anonymous_user()
        return await super().__call__(scope, receive, send)
