from decouple import config
if config('DJANGO_ENV', default='dev') == 'prod':
    from .settings.prod import *
else:
    from .settings.dev import *