import random
import string
from datetime import timezone, timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length = 30)
    avatar = models.ImageField(upload_to='avatars/%Y/%m/%d/', null=True)
    badge = models.CharField(max_length = 25, blank = True, null = True)
    awards = models.JSONField(default=list, blank=True)  # e.g. ["flay"]

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} - {self.nickname} - {self.email}"

