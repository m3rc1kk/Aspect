from rest_framework import viewsets, permissions
from apps.reports.models import Report
from apps.reports.serializers import ReportSerializer, ReportCreateSerializer, ReportStatusSerializer


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.select_related('reporter', 'post', 'user')
    serializer_class = ReportSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        elif self.action in ['update']:
            return ReportStatusSerializer
        return ReportSerializer

    def get_queryset(self):
        queryset = Report.objects.select_related('reporter', 'post', 'user')

        reporter_id = self.request.query_params.get('reporter')
        if reporter_id:
            queryset = queryset.filter(reporter=reporter_id)

        return queryset



