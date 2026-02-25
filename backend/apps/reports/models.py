from django.db import models
from django.conf import settings
from rest_framework.exceptions import ValidationError

from apps.posts.models import Post


class Report(models.Model):
    class Reason(models.TextChoices):
        SPAM = 'spam', 'Spam'
        HARASSMENT = 'harassment', 'Harassment'
        INAPPROPRIATE = 'inappropriate', 'Inappropriate content'
        MISINFORMATION = 'misinformation', 'Misinformation'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        REVIEWED = 'reviewed', 'Reviewed'
        RESOLVED = 'resolved', 'Resolved'
        DISMISSED = 'dismissed', 'Dismissed'

    class TargetType(models.TextChoices):
        POST = 'post', 'Post'
        USER = 'user', 'User'

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_sent')
    reason = models.TextField(max_length=20 ,choices=Reason.choices)
    status = models.TextField(max_length=10, choices=Status.choices)

    target_type = models.TextField(max_length=10, choices=TargetType.choices)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True, related_name='reports_received')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='reports_received')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'

        constraints = [
            models.UniqueConstraint(
                fields=['reporter', 'post'],
                condition=models.Q(post__isnull=False),
                name='unique_report_per_post',
            ),
            models.UniqueConstraint(
                fields=['reporter', 'user'],
                condition=models.Q(user__isnull=False),
                name='unique_report_per_user',
            ),
        ]

        indexes = [
            models.Index(fields=['reporter', '-created_at'], name='report_reporter_created_idx'),
            models.Index(fields=['status', '-created_at'], name='report_status_created_idx'),
        ]

    def __str__(self):
        return f'{self.reporter} - {self.target_type} - {self.reason}'



