from django.urls import path
from . import views


urlpatterns = [
    path('admin-panel/dashboard/', views.AdminPanelDashboardView.as_view(), name='admin-panel-dashboard'),
    path('admin-panel/users/', views.AdminUsersListView.as_view(), name='admin-panel-users'),
    path('admin-panel/organizations/', views.AdminOrganizationsListView.as_view(), name='admin-panel-organizations'),
]

