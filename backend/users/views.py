from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
)
from .permissions import IsAdminUserOrStaff
from .tasks import trigger_approval_email

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for registering a new user.
    Creates an account in 'pending' status awaiting admin approval.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Registration successful! Your account is currently pending administrator approval.",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )


class CustomLoginView(TokenObtainPairView):
    """
    Public endpoint for user authentication.
    Issues JWT access/refresh tokens only if account approval_status == 'approved'.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(generics.RetrieveAPIView):
    """
    Returns authenticated user profile details.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class PendingUsersListView(generics.ListAPIView):
    """
    Admin endpoint to view all registrations waiting for approval.
    """
    permission_classes = [IsAdminUserOrStaff]
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(approval_status=User.STATUS_PENDING).order_by('-date_joined')


class AdminUsersListView(generics.ListAPIView):
    """
    Admin endpoint to view all users with optional status filtering.
    """
    permission_classes = [IsAdminUserOrStaff]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all().order_by('-date_joined')
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(approval_status=status_param)
        role_param = self.request.query_params.get('role')
        if role_param:
            queryset = queryset.filter(role=role_param)
        search_param = self.request.query_params.get('search')
        if search_param:
            queryset = queryset.filter(
                username__icontains=search_param
            ) | queryset.filter(email__icontains=search_param)
        return queryset


class ApproveUserView(APIView):
    """
    Admin endpoint to approve a pending user.
    Sets status to 'approved' and dispatches Celery email notification.
    """
    permission_classes = [IsAdminUserOrStaff]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.approval_status = User.STATUS_APPROVED
        user.save()

        # Trigger Celery background email task
        trigger_approval_email(user.id)

        return Response(
            {
                "message": f"User {user.username} has been approved. Activation notification email queued via Celery.",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )


class RejectUserView(APIView):
    """
    Admin endpoint to reject a pending user.
    Sets status to 'rejected'.
    """
    permission_classes = [IsAdminUserOrStaff]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.approval_status = User.STATUS_REJECTED
        user.save()

        return Response(
            {
                "message": f"User {user.username} has been rejected.",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )


class AdminUserDeleteView(generics.DestroyAPIView):
    """
    Admin endpoint to delete a user account.
    """
    permission_classes = [IsAdminUserOrStaff]
    queryset = User.objects.all()
