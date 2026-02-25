from django.core.cache import cache
from rest_framework import viewsets, generics
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Post
from .permissions import IsAuthorOrReadOnly
from .serializers import PostSerializer, PostCreateSerializer
from ..accounts.models import User
from ..accounts.serializers import UserSerializer
from ..organizations.models import Organization
from ..organizations.serializers import OrganizationSerializer

SEARCH_CACHE_TIMEOUT = 120

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().select_related('author', 'organization').prefetch_related('images')
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['post', 'get', 'delete']

    def get_queryset(self):
        queryset = Post.objects.all().select_related('author', 'organization').prefetch_related('images')
        

        author_id = self.request.query_params.get('author', None)
        if author_id is not None:
            queryset = queryset.filter(author_id=author_id)
        organization_id = self.request.query_params.get('organization', None)
        if organization_id is not None:
            queryset = queryset.filter(organization_id=organization_id)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        return PostSerializer


    def perform_create(self, serializer):
        org_id = self.request.data.get('organization')
        organization = None
        if org_id:
            org = Organization.objects.filter(pk=org_id, owner=self.request.user).first()
            if not org:
                raise ValidationError('Organization not found or you are not the owner')
            organization = org
        serializer.save(author=self.request.user, organization=organization)



class SearchView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = (request.query_params.get('q') or '').strip()
        if not q:
            return Response({
                'users': [],
                'posts': [],
                'organizations': [],
            })

        cache_key = f"search:{q.lower()}"

        cached = cache.get(cache_key)
        if cached is not None:
            return Response(cached)


        users = User.objects.filter(
            Q(username__icontains=q) | Q(nickname__icontains=q))[:20]

        posts = Post.objects.filter(
            content__icontains=q
        ).select_related('author', 'organization').prefetch_related('images')[:20]

        organizations = Organization.objects.filter(
            Q(username__icontains=q) | Q(nickname__icontains=q))[:20]

        data = {
            'users': UserSerializer(users, many=True, context={'request': request}).data,
            'posts': PostSerializer(posts, many=True, context={'request': request}).data,
            'organizations': OrganizationSerializer(organizations, many=True, context={'request': request}).data,
        }

        cache.set(cache_key, data, timeout=SEARCH_CACHE_TIMEOUT)

        return Response(data)
