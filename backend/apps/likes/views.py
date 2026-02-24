from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer
from apps.likes.models import Like
from apps.likes.redis_counters import incr_likes, decr_likes
from apps.likes.serializers import LikeSerializer, LikeCreateSerializer
from apps.posts.models import Post
from apps.posts.serializers import PostSerializer


class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user=self.request.user).select_related('post', 'user', 'post__author').prefetch_related('post__images')

    def get_serializer_class(self):
        if self.action == 'create':
            return LikeCreateSerializer
        return LikeSerializer

    def list(self, request):
        likes = self.get_queryset()
        posts = [like.post for like in likes]
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.validated_data['post']
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            return Response(
                {'detail': 'Already liked'},
                status=status.HTTP_409_CONFLICT
            )

        incr_likes(post.id)

        return Response(
            LikeSerializer(like).data,
            status=status.HTTP_201_CREATED
        )

    def destroy(self, request, pk=None):
        like = get_object_or_404(Like, user=request.user, post_id=pk)
        post_id = like.post_id
        like.delete()
        decr_likes(post_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


    @action(detail=False, methods=['get'], url_path='post/(?P<post_pk>[^/.]+)')
    def by_post(self, request, post_pk=None):
        post = get_object_or_404(Post, id=post_pk)
        user_ids = Like.objects.filter(post=post).values_list('user_id', flat=True)
        users = User.objects.filter(id__in=user_ids)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)





