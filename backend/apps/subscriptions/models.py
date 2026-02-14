from django.db import models
from django.conf import settings
from rest_framework.exceptions import ValidationError


class Subscription(models.Model):
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['follower', 'following'],
                name='unique_subscription'
            )
        ]

        ordering = ['-created_at']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'


    def __str__(self):
        return f'{self.follower} | {self.following}'

    def clean(self):
        if self.follower == self.following:
            raise ValidationError('You cannot follow yourself!')

    def create(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)