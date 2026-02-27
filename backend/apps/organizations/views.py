from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.organizations.models import Organization
from apps.organizations.permissions import IsOwnerOrReadOnly
from apps.organizations.serializers import OrganizationSerializer, OrganizationCreateSerializer



class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    ordering = ['-created_at']


    def get_serializer_class(self):
        if self.action in ['update', 'partial_update', 'create']:
            return OrganizationCreateSerializer
        return OrganizationSerializer

    def get_queryset(self):
        qs = Organization.objects.select_related('owner')
        owner_id = self.request.query_params.get('owner')
        if owner_id:
            qs = qs.filter(owner__id=owner_id)
        return qs


    @action(detail=False, methods=['get'], url_path='my')
    def my_organizations(self, request):
        orgs = self.get_queryset().filter(owner=self.request.user)
        serializer = self.get_serializer(orgs, many=True, context={'request': request})
        return Response(serializer.data)



