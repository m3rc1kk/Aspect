from django.db import models
from django.conf import settings

class Post(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        content = self.content or ''
        max_len = 50
        display = content[:max_len] + ('...' if len(content) > max_len else '')
        return f'{self.author} - {display}'

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'



class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='posts/%Y/%m/%d/')
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.post} - {self.image}'

    class Meta:
        ordering = ['order']
        verbose_name = 'Image'
        verbose_name_plural = 'Images'