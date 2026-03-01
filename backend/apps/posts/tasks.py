import os

from celery import shared_task

from .models import PostImage
from .moderation import check_image_moderation


@shared_task(bind=True, max_retries=3)
def moderate_post_image(self, post_image_id):
    post_image = PostImage.objects.filter(pk=post_image_id).first()
    if not post_image or not post_image.image:
        return
    if post_image.moderation_status != PostImage.ModerationStatus.PENDING:
        return

    path = None
    try:
        path = post_image.image.path
    except (ValueError, NotImplementedError):
        from django.core.files.storage import default_storage
        import tempfile
        with default_storage.open(post_image.image.name, 'rb') as f:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                tmp.write(f.read())
                path = tmp.name

    try:
        passed, details = check_image_moderation(path)
        post_image.moderation_status = (
            PostImage.ModerationStatus.APPROVED if passed
            else PostImage.ModerationStatus.REJECTED
        )
        post_image.save(update_fields=['moderation_status'])
    except Exception:
        raise
    finally:
        if path and not getattr(post_image.image, 'path', None):
            try:
                os.unlink(path)
            except OSError:
                pass
