import pytest
from django.urls import reverse
from rest_framework import status

from apps.posts.tests.factories import PostFactory


@pytest.mark.django_db
class TestPostViewSet:
    def test_list_posts_200(self, api_client):
        PostFactory.create_batch(2)
        response = api_client.get(reverse('post-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()['results']) == 2

    def test_create_post_requires_auth(self, api_client):
        response = api_client.post(
            reverse('post-list'),
            {'content': 'Test post'},
            format='json',
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_post_201(self, auth_client, user):
        response = auth_client.post(
            reverse('post-list'),
            {'content': 'New post content'},
            format='json',
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()['content'] == 'New post content'
        assert response.json()['author']['email'] == user.email
