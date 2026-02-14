from django.contrib import admin

from apps.subscriptions.models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
