from django.db import models

from apps.posts.models import Post
from django.conf import settings



class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        content = self.content or ''
        max_len = 50
        display = content[:max_len] + ('...' if len(content) > max_len else '')
        return f'{self.author} - {display}'

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        indexes = [
            models.Index(fields=['post', 'parent', '-created_at'], name='comment_post_parent_idx'),
        ]


