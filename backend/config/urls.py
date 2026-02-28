from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.posts.urls')),
    path('api/v1/', include('apps.likes.urls')),
    path('api/v1/', include('apps.subscriptions.urls')),
    path('api/v1/', include('apps.comments.urls')),
    path('api/v1/', include('apps.organizations.urls')),
    path('api/v1/', include('apps.reports.urls')),
    path('api/v1/', include('apps.notifications.urls')),
    path('api/v1/', include('apps.adminpanel.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
