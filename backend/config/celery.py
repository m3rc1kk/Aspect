from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'cleanup-old-notifications-daily': {
        'task': 'apps.notifications.tasks.cleanup_old_notifications',
        'schedule': 24*60*60,
    },
    'sync-likes-count-from-db': {
        'task': 'apps.likes.tasks.sync_likes_count_from_db',
        'schedule': 10 * 60,
    },
}