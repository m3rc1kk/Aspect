import pytest
from django.urls import reverse
from rest_framework import status

from apps.accounts.tests.factories import UserFactory
from apps.notifications.models import Notification
from apps.posts.tests.factories import PostFactory


@pytest.mark.django_db
class TestNotificationViewSet:
    def test_list_notifications_requires_auth(self, api_client):
        response = api_client.get(reverse('notification-list'))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_notifications_200(self, auth_client, user):
        other = UserFactory()
        post = PostFactory(author=user)
        Notification.objects.create(
            sender=other,
            recipient=user,
            notification_type=Notification.NotificationType.LIKE,
            post=post,
        )
        response = auth_client.get(reverse('notification-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()['results']) == 1

    def test_unread_count_200(self, auth_client):
        response = auth_client.get(reverse('notification-unread-count'))
        assert response.status_code == status.HTTP_200_OK
        assert 'unread_count' in response.json()
