from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.google_auth import verify_google_id_token
from apps.accounts.models import User
from apps.accounts.serializers import UserRegistrationSerializer, UserSerializer, UserLoginSerializer, \
    UserUpdateSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, UserStatsSerializer, \
    UserRegistrationVerifySerializer, GoogleAuthSerializer
from apps.accounts.tasks import send_welcome_email
from apps.posts.permissions import IsAuthorOrReadOnly
from config.settings import GOOGLE_CLIENT_ID


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = User.objects.exclude(id=self.request.user.id)
        if self.request.query_params.get('popular'):
            qs = qs.annotate(followers_count=Count('followers')).order_by('-followers_count')[:10]
        else:
            qs = qs.order_by('-date_joined')[:50]
        return qs


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'message': 'Confirmation code sent to your email.',
            'email': user.email,
        }, status=status.HTTP_201_CREATED)

class UserRegistrationVerifyView(generics.CreateAPIView):
    serializer_class = UserRegistrationVerifySerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_welcome_email.delay(user.id)
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Email verified. You are registered.',
        }, status=status.HTTP_200_OK)

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User Logged In!'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserStatsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk:
            return generics.get_object_or_404(User, pk=pk)
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UserUpdateSerializer
        return UserStatsSerializer


class UserLogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({
                    'message': 'User Logged Out!'
                }, status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response({
                    'message': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'message': 'Invalid Token'
            }, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': 'Password Reset Email Sent'
        }, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': 'Password has been reset successfully'
        }, status=status.HTTP_200_OK)


class GoogleAuthView(generics.GenericAPIView):
    serializer_class = GoogleAuthSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_token_str=serializer.validated_data['id_token']

        if not GOOGLE_CLIENT_ID:
            return Response(
                {'detail': 'Google auth is not configured.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        payload = verify_google_id_token(id_token_str, GOOGLE_CLIENT_ID)

        if not payload:
            return Response(
                {'detail': 'Invalid or expired Google token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = payload.get('email')
        if not email:
            return Response(
                {'detail': 'Email not provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        name = payload.get('name') or email.split('@')[0]

        user, created = User.objects.get_or_create(
            email=email,
            defaults = {
                'username': email,
                'nickname': name[:30],
                'is_active': True,
            }
        )

        if created:
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Logged in with Google.',
        }, status=status.HTTP_200_OK)