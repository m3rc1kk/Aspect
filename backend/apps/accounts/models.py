from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)
    nickname = models.CharField(max_length = 50)
    avatar = models.ImageField(upload_to='avatars/%Y/%m/%d/', blank=True, null=True) # Изменить на деплое

    def __str__(self):
        return f"{self.username} - {self.nickname} - {self.email}"