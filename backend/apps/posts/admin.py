from django.contrib import admin

from apps.posts.models import Post, PostImage


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('content', 'author', 'created_at')

@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ('image', 'post')