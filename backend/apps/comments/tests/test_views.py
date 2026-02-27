import pytest
from django.urls import reverse
from rest_framework import status

from apps.comments.models import Comment
from apps.posts.tests.factories import PostFactory


@pytest.mark.django_db
class TestCommentViewSet:
    def test_list_comments_200(self, api_client):
        response = api_client.get(reverse('comment-list'))
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_comment_201(self, auth_client, user):
        post = PostFactory(author=user)
        response = auth_client.post(
            reverse('comment-list'),
            {'post': post.id, 'content': 'First comment'},
            format='json',
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()['content'] == 'First comment'
        assert Comment.objects.filter(post=post, author=user).exists()

    def test_create_comment_requires_auth(self, api_client):
        post = PostFactory()
        response = api_client.post(
            reverse('comment-list'),
            {'post': post.id, 'content': 'Hi'},
            format='json',
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
