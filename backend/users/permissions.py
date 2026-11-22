from rest_framework import permissions

class IsAdminUserOrStaff(permissions.BasePermission):
    """
    Allows access only to admin users or staff.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.role == 'admin' or request.user.is_superuser)
        )
