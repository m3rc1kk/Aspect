import pytest
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status

from apps.likes.models import Like
from apps.posts.tests.factories import PostFactory


@pytest.mark.django_db
class TestLikeViewSet:
    def test_list_likes_requires_auth(self, api_client):
        response = api_client.get(reverse('like-list'))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @patch('apps.likes.views.incr_likes')
    def test_create_like_201(self, mock_incr, auth_client, user):
        post = PostFactory(author=user)
        response = auth_client.post(
            reverse('like-list'),
            {'post': post.id},
            format='json',
        )
        assert response.status_code == status.HTTP_201_CREATED
        mock_incr.assert_called_once_with(post.id)

    def test_create_like_duplicate_409(self, auth_client, user):
        post = PostFactory(author=user)
        Like.objects.create(user=user, post=post)
        with patch('apps.likes.views.incr_likes'):
            response = auth_client.post(
                reverse('like-list'),
                {'post': post.id},
                format='json',
            )
        assert response.status_code == status.HTTP_409_CONFLICT
