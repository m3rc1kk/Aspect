from rest_framework import viewsets, generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Post
from .permissions import IsAuthorOrReadOnly
from .serializers import PostSerializer, PostCreateSerializer
from ..accounts.models import User
from ..accounts.serializers import UserSerializer


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



class SearchView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = (request.query_params.get('q') or '').strip()
        if not q:
            return Response({
                'users': [],
                'posts': [],
            })

        users = User.objects.filter(
            Q(username__icontains=q) | Q(nickname__icontains=q))[:20]

        posts = Post.objects.filter(
            content__icontains=q
        ).select_related('author').prefetch_related('images')[:20]

        return Response({
            'users': UserSerializer(users, many=True, context={'request': request}).data,
            'posts': PostSerializer(posts, many=True, context={'request': request}).data,
        })
