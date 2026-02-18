from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.serializers import UserStatsSerializer
from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer
from apps.subscriptions.models import Subscription, OrganizationSubscription
from apps.subscriptions.serializers import SubscriptionCreateSerializer, SubscriptionSerializer, \
    OrganizationSubscriptionCreateSerializer, OrganizationSubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Subscription.objects.all()
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_class(self):
        if self.action == 'create':
            return SubscriptionCreateSerializer
        elif self.action in ['followers', 'following', 'list', 'user_followers', 'user_following']:
            return UserStatsSerializer
        return SubscriptionSerializer

    def get_queryset(self):
        if self.action in ['followers', 'following', 'user_followers', 'user_following']:
            return User.objects.all()
        return Subscription.objects.select_related('follower', 'following')


    def list(self, request):
        subscriptions = self.get_queryset().filter(
            follower=request.user,
        ).select_related('following')

        users = [sub.following for sub in subscriptions]
        serializer = self.get_serializer(
            users, many=True, context={'request': request}
        )
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        following_user = serializer.validated_data['following']
        subscription, created = Subscription.objects.get_or_create(
            follower=request.user,
            following=following_user,
        )

        if not created:
            return Response(
                {'detail': 'You are already following this user.'},
                status=status.HTTP_409_CONFLICT)

        return Response(
            SubscriptionSerializer(subscription, context={'request': request}).data,
            status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        subscription = get_object_or_404(
            Subscription,
            follower=request.user,
            following_id=pk
        )

        subscription.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def followers(self, request):
        follower_ids = Subscription.objects.filter(
            following=request.user,
        ).values_list('follower_id', flat=True)

        users = self.get_queryset().filter(id__in=follower_ids)
        serializer = self.get_serializer(users, many=True, context={'request': request})

        return Response(serializer.data)


    @action(detail=True, methods=['get'], url_path='followers')
    def user_followers(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)

        follower_ids = Subscription.objects.filter(
            following=user,
        ).values_list('follower_id', flat=True)

        users = self.get_queryset().filter(id__in=follower_ids)
        serializer = self.get_serializer(users, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='following')
    def user_following(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)

        following_ids = Subscription.objects.filter(
            follower=user,
        ).values_list('following_id', flat=True)

        users = self.get_queryset().filter(id__in=following_ids)
        serializer = self.get_serializer(users, many=True, context={'request': request})

        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='check')
    def check_subscription(self, request, pk=None):
        is_subscribed = self.get_queryset().filter(
            follower=request.user,
            following_id=pk
        ).exists()

        return Response(
            {
            'is_subscribed': is_subscribed,
            'user_id': pk
            })



class OrganizationSubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = OrganizationSubscription.objects.all()
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_class(self):
        if self.action == 'create':
            return OrganizationSubscriptionCreateSerializer
        elif self.action in ['list']:
            return OrganizationSerializer
        elif self.action in ['followers', 'org_followers']:
            return UserStatsSerializer
        return OrganizationSubscriptionSerializer

    def get_queryset(self):
        if self.action in ['followers', 'org_followers']:
            return User.objects.all()
        if self.action == 'following':
            return Organization.objects.all()
        return OrganizationSubscription.objects.select_related('follower', 'following')

    def list(self, request):
        subscriptions = self.get_queryset().filter(
            follower=request.user,
        ).select_related('following')

        organizations = [sub.following for sub in subscriptions]
        serializer = self.get_serializer(
            organizations, many=True, context={'request': request}
        )
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        following_org = serializer.validated_data['following']
        subscription, created = OrganizationSubscription.objects.get_or_create(
            follower=request.user,
            following=following_org,
        )

        if not created:
            return Response(
                {'detail': 'You are already subscribed to this organization.'},
                status=status.HTTP_409_CONFLICT)

        return Response(
            OrganizationSubscriptionSerializer(subscription, context={'request': request}).data,
            status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        subscription = get_object_or_404(
            OrganizationSubscription,
            follower=request.user,
            following_id=pk,
        )
        subscription.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='followers')
    def org_followers(self, request, pk=None):
        get_object_or_404(Organization, pk=pk)

        follower_ids = OrganizationSubscription.objects.filter(
            following_id=pk,
        ).values_list('follower_id', flat=True)

        users = self.get_queryset().filter(id__in=follower_ids)
        serializer = self.get_serializer(
            users, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='check')
    def check_subscription(self, request, pk=None):
        is_subscribed = OrganizationSubscription.objects.filter(
            follower=request.user,
            following_id=pk,
        ).exists()
        return Response({
            'is_subscribed': is_subscribed,
            'organization_id': pk,
        })

