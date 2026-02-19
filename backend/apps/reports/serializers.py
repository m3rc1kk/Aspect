from django.db import IntegrityError
from rest_framework import serializers
from .models import Report
from ..accounts.serializers import UserSerializer


class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'reporter', 'target_type', 'post', 'user',
            'reason', 'status', 'created_at',
        ]
        read_only_fields = [
            'id', 'reporter', 'target_type', 'post', 'user',
            'reason', 'status', 'created_at',
        ]


class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = [
            'target_type', 'post', 'user',
            'reason'
        ]

    def validate(self, attrs):
        target_type = attrs.get('target_type')
        target_post = attrs.get('post')
        target_user = attrs.get('user')

        if target_type == Report.TargetType.POST:
            if not target_post:
                raise serializers.ValidationError({'target_post': 'Required for post reports.'})
            if target_user:
                raise serializers.ValidationError({'target_user': 'Must be empty for post reports.'})

        if target_type == Report.TargetType.USER:
            if not target_user:
                raise serializers.ValidationError({'target_user': 'Required for user reports.'})
            if target_post:
                raise serializers.ValidationError({'target_post': 'Must be empty for user reports.'})

        request = self.context['request']
        if target_type == Report.TargetType.USER and target_user == request.user:
            raise serializers.ValidationError({'target_user': 'You cannot report yourself.'})

        return attrs

    def validate_post(self, value):
        request = self.context['request']
        if value and Report.objects.filter(reporter=request.user, post=value).exists():
            raise serializers.ValidationError('You have already reported this post.')
        return value

    def validate_user(self, value):
        request = self.context['request']
        if value and Report.objects.filter(reporter=request.user, user=value).exists():
            raise serializers.ValidationError('You have already reported this user.')
        return value

    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        validated_data['status'] = Report.Status.PENDING
        return super().create(validated_data)

class ReportStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['status']

    def validate_status(self, value):
        if value not in dict(Report.Status.choices):
            raise serializers.ValidationError({'status': 'Must be one of: ' + str(Report.Status.choices)})
        return value