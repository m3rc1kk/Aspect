from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Post
from .permissions import IsAuthorOrReadOnly
from .serializers import PostSerializer, PostCreateSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().select_related('author').prefetch_related('images')
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['post', 'get', 'delete']

    def get_queryset(self):
        queryset = Post.objects.all().select_related('author').prefetch_related('images')
        

        author_id = self.request.query_params.get('author', None)
        if author_id is not None:
            queryset = queryset.filter(author_id=author_id)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        return PostSerializer


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)