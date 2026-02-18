from django.db import models
from django.conf import settings

class Organization(models.Model):
    username = models.CharField(max_length=50, unique=True)
    nickname = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars/org/%Y/%m/%d/', blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organizations')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.owner.username} - {self.username}'

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
