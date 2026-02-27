import pytest
from django.urls import reverse
from rest_framework import status

from apps.reports.models import Report
from apps.posts.tests.factories import PostFactory


@pytest.mark.django_db
class TestReportViewSet:
    def test_create_report_requires_auth(self, api_client):
        post = PostFactory()
        response = api_client.post(
            reverse('report-list'),
            {
                'reason': Report.Reason.SPAM,
                'target_type': Report.TargetType.POST,
                'post': post.id,
            },
            format='json',
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_report_post_201(self, auth_client, user):
        post = PostFactory(author=user)
        response = auth_client.post(
            reverse('report-list'),
            {
                'reason': Report.Reason.SPAM,
                'target_type': Report.TargetType.POST,
                'post': post.id,
            },
            format='json',
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Report.objects.filter(reporter=user, post=post).exists()
