import pytest
from django.urls import reverse
from rest_framework import status

from apps.accounts.models import User
from apps.accounts.tests.factories import UserFactory

@pytest.mark.django_db
class TestUserRegistrationView:
    def test_register_returns_201_and_message(self, api_client):
        url = reverse('register')
        payload = {
            'email': 'new@example.com',
            'username': 'newuser',
            'nickname': 'New User',
            'password': 'securepass123',
            'confirm_password': 'securepass123',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data['email'] == 'new@example.com'
        assert 'message' in data
        assert User.objects.filter(email='new@example.com').exists()

    def test_register_invalid_email_returns_400(self, api_client):
        url = reverse('register')
        payload = {
            'email': 'not-an-email',
            'username': 'u',
            'nickname': 'U',
            'password': 'pass123',
            'confirm_password': 'pass123',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
class TestUserLoginView:
    def test_login_returns_tokens_and_user(self, api_client, user):
        url = reverse('login')
        response = api_client.post(
            url,
            {'email': user.email, 'password': 'defaulttestpass123'},
            format='json',
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert 'access' in data
        assert 'refresh' in data
        assert 'user' in data
        assert data['user']['email'] == user.email

    def test_login_wrong_password_returns_400(self, api_client, user):
        url = reverse('login')
        response = api_client.post(
            url,
            {'email': user.email, 'password': 'wrong'},
            format='json',
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserProfileView:
    def test_profile_requires_auth(self, api_client):
        url = reverse('profile')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_profile_returns_current_user(self, auth_client, user):
        url = reverse('profile')
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()['email'] == user.email