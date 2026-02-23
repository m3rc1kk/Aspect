from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('sign-up/', views.UserRegistrationView.as_view(), name='register'),
    path('sign-up/verify/', views.UserRegistrationVerifyView.as_view(), name='register-verify'),
    path('sign-in/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('profile/<int:pk>/', views.UserProfileView.as_view(), name='profile-detail'),
    path('password/reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_done'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]