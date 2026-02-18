from django.db import IntegrityError
from rest_framework import serializers

from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer
from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer
from apps.subscriptions.models import Subscription, OrganizationSubscription


class SubscriptionSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'follower', 'following', 'created_at']


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    following = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Subscription
        fields = ['following']

    def validate_following(self, value):
        request = self.context.get('request')
        if request and request.user == value:
            raise serializers.ValidationError('You cannot follow yourself')
        return value

    def create(self, validated_data):
        validated_data['follower'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError('You are already following this user')


class OrganizationSubscriptionSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = OrganizationSerializer(read_only=True)


    class Meta:
        model = OrganizationSubscription
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'follower', 'following', 'created_at']


class OrganizationSubscriptionCreateSerializer(serializers.ModelSerializer):
    following = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())

    class Meta:
        model = OrganizationSubscription
        fields = ['following']

    def create(self, validated_data):
        validated_data['follower'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError('You are already subscribed to this organization')