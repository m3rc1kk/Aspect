from django.urls import path
from . import views


urlpatterns = [
    path('admin-panel/dashboard/', views.AdminPanelDashboardView.as_view(), name='admin-panel-dashboard'),
    path('admin-panel/users/', views.AdminUsersListView.as_view(), name='admin-panel-users'),
    path('admin-panel/users/<int:user_id>/', views.AdminUserActiveView.as_view(), name='admin-panel-user-active'),
    path('admin-panel/users/<int:user_id>/chats/', views.AdminUserChatsView.as_view(), name='admin-panel-user-chats'),
    path('admin-panel/users/<int:user_id>/chats/<int:chat_id>/messages/', views.AdminUserChatMessagesView.as_view(), name='admin-panel-user-chat-messages'),
    path('admin-panel/organizations/', views.AdminOrganizationsListView.as_view(), name='admin-panel-organizations'),
]

