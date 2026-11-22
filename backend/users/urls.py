from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomLoginView,
    CurrentUserView,
    PendingUsersListView,
    AdminUsersListView,
    ApproveUserView,
    RejectUserView,
    AdminUserDeleteView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', CustomLoginView.as_view(), name='auth-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='auth-me'),

    # Admin user endpoints
    path('admin/users/pending/', PendingUsersListView.as_view(), name='admin-users-pending'),
    path('admin/users/', AdminUsersListView.as_view(), name='admin-users-list'),
    path('admin/users/<int:pk>/approve/', ApproveUserView.as_view(), name='admin-user-approve'),
    path('admin/users/<int:pk>/reject/', RejectUserView.as_view(), name='admin-user-reject'),
    path('admin/users/<int:pk>/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
]
