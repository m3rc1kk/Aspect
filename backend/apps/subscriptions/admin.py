from django.contrib import admin

from apps.subscriptions.models import Subscription, OrganizationSubscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')

@admin.register(OrganizationSubscription)
class OrganizationSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('follower','following', 'created_at')