import pytest
from django.urls import reverse
from rest_framework import status

from apps.organizations.tests.factories import OrganizationFactory


@pytest.mark.django_db
class TestOrganizationViewSet:
    def test_list_organizations_requires_auth(self, api_client):
        response = api_client.get(reverse('organization-list'))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_organizations_200(self, auth_client):
        OrganizationFactory.create_batch(2)
        response = auth_client.get(reverse('organization-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()['results']) == 2

    def test_create_organization_201(self, auth_client, user):
        response = auth_client.post(
            reverse('organization-list'),
            {'username': 'myorg', 'nickname': 'My Org'},
            format='json',
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()['username'] == 'myorg'
