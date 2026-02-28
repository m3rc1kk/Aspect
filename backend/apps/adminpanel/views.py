from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.settings import api_settings
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate

from apps.accounts.models import User
from apps.accounts.serializers import UserStatsSerializer
from apps.posts.models import Post
from apps.reports.models import Report
from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer
from apps.comments.models import Comment
from rest_framework.permissions import IsAdminUser



class AdminPanelDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        chart_days = self.parse_chart_days(request)
        today = timezone.now().date()

        return Response({
            'metrics': self.get_metrics(today),
            'charts': self.get_charts(chart_days, today),
            'latest_reports': self.get_latest_reports(request),
            'latest_users': self.get_latest_users(request),
        })

    
    def parse_chart_days(self, request):
        try:
            days = int(request.query_params.get('chart_days', 30))
        except (TypeError, ValueError):
            days = 30
        return days if days in (7, 30, 90) else 30
    

    def get_metrics(self, today):
        return {
            'users_total': User.objects.count(),
            'users_today': User.objects.filter(date_joined__date=today).count(),
            'posts_total': Post.objects.count(),
            'posts_today': Post.objects.filter(created_at__date=today).count(),
            'reports_pending': Report.objects.filter(status=Report.Status.PENDING).count(),
            'organizations_total': Organization.objects.count(),
            'organizations_verified': Organization.objects.filter(is_verified=True).count(),
        }

    
    def get_charts(self, days, today):
        start_date = today - timezone.timedelta(days=days - 1)
        date_list = [start_date + timezone.timedelta(days=i) for i in range(days)]

        reg_qs = (
            User.objects
            .filter(date_joined__date__gte=start_date, date_joined__date__lte=today)
            .annotate(day=TruncDate('date_joined'))
            .values('day')
            .annotate(count=Count('id'))
        )
        reg_map = {r['day']: r['count'] for r in reg_qs}
        registrations_data = [reg_map.get(d, 0) for d in date_list]

        posts_qs = (
            Post.objects
            .filter(created_at__date__gte=start_date, created_at__date__lte=today)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
        )
        posts_map = {r['day']: r['count'] for r in posts_qs}

        comments_qs = (
            Comment.objects
            .filter(created_at__date__gte=start_date, created_at__date__lte=today)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
        )
        comments_map = {r['day']: r['count'] for r in comments_qs}

        labels = [f"{d.day}.{d.month}" for d in date_list]

        return {
            'registrations_by_day': {
                'labels': labels,
                'data': registrations_data,
            },
            'activity_by_day': {
                'labels': labels,
                'posts': [posts_map.get(d, 0) for d in date_list],
                'comments': [comments_map.get(d, 0) for d in date_list],
            },
        }

    def get_latest_reports(self, request):
        reports = (
            Report.objects
            .select_related('reporter', 'post', 'user')
            .order_by('-created_at')[:5]
        )
        result = []
        for r in reports:
            reporter_avatar = None
            if r.reporter.avatar:
                reporter_avatar = request.build_absolute_uri(r.reporter.avatar.url)
            target_display = None
            if r.target_type == Report.TargetType.POST and r.post:
                target_display = (r.post.content or '')[:40]
                if len(r.post.content or '') > 40:
                    target_display += '…'
            elif r.target_type == Report.TargetType.USER and r.user:
                target_display = r.user.username
            result.append({
                'id': r.id,
                'reporter_username': r.reporter.username,
                'reporter_avatar': reporter_avatar,
                'target_type': r.target_type.upper(),
                'target_display': target_display,
                'reason': r.get_reason_display(),
                'status': r.status,
                'created_at': r.created_at.strftime('%d.%m.%Y %H:%M'),
            })
        return result

    def get_latest_users(self, request):
        users = User.objects.order_by('-date_joined')[:5]
        result = []
        for u in users:
            avatar_url = request.build_absolute_uri(u.avatar.url) if u.avatar else None
            result.append({
                'id': u.id,
                'email': u.email,
                'username': u.username,
                'nickname': u.nickname,
                'avatar': avatar_url,
                'date_joined': u.date_joined.strftime('%d.%m.%Y'),
            })
        return result


class AdminUsersListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        paginator = api_settings.DEFAULT_PAGINATION_CLASS()
        qs = User.objects.order_by('-date_joined')
        page = paginator.paginate_queryset(qs, request)
        serializer = UserStatsSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class AdminOrganizationsListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        paginator = api_settings.DEFAULT_PAGINATION_CLASS()
        qs = Organization.objects.select_related('owner').order_by('-created_at')
        page = paginator.paginate_queryset(qs, request)
        serializer = OrganizationSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)