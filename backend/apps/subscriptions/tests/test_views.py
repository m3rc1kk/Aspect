import pytest
from django.urls import reverse
from rest_framework import status

from apps.accounts.tests.factories import UserFactory
from apps.subscriptions.models import Subscription


@pytest.mark.django_db
class TestSubscriptionViewSet:
    def test_list_subscriptions_requires_auth(self, api_client):
        response = api_client.get(reverse('subscription-list'))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_subscriptions_200(self, auth_client, user):
        response = auth_client.get(reverse('subscription-list'))
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_subscription_201(self, auth_client, user):
        other = UserFactory()
        response = auth_client.post(
            reverse('subscription-list'),
            {'following': other.id},
            format='json',
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Subscription.objects.filter(follower=user, following=other).exists()

    def test_create_subscription_duplicate_409(self, auth_client, user):
        other = UserFactory()
        Subscription.objects.create(follower=user, following=other)
        response = auth_client.post(
            reverse('subscription-list'),
            {'following': other.id},
            format='json',
        )
        assert response.status_code == status.HTTP_409_CONFLICT
