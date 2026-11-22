from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'approval_status', 'is_staff')
    list_filter = ('approval_status', 'role', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('AirBooking Approval & Role', {
            'fields': ('approval_status', 'role', 'phone_number'),
        }),
    )
