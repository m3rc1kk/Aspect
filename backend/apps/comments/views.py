from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from apps.comments.models import Comment
from apps.comments.serializers import CommentSerializer, CommentCreateSerializer, CommentDetailSerializer



class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        elif self.action == 'retrieve':
            return CommentDetailSerializer
        return CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.select_related('author').prefetch_related('replies')

        post_id = self.request.query_params.get('post')
        if post_id:
            queryset = queryset.filter(post=post_id, parent=None)

        return queryset

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        output = CommentSerializer(comment, context=self.get_serializer_context())
        return Response(output.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def replies(self, request, pk=None):
        comment = self.get_object()
        replies = comment.replies.select_related('author')
        serializer = self.get_serializer(replies, many=True)
        return Response(serializer.data)