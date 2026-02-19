from django.contrib import admin

from apps.reports.models import Report


@admin.register(Report)
class Report(admin.ModelAdmin):
    list_display = ['target_type', 'reporter', 'post', 'user', 'reason',  'status', 'created_at']
