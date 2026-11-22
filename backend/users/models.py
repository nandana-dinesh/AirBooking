from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'

    APPROVAL_STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    ROLE_CUSTOMER = 'customer'
    ROLE_ADMIN = 'admin'

    ROLE_CHOICES = [
        (ROLE_CUSTOMER, 'Customer'),
        (ROLE_ADMIN, 'Admin'),
    ]

    approval_status = models.CharField(
        max_length=20,
        choices=APPROVAL_STATUS_CHOICES,
        default=STATUS_PENDING,
        help_text='Approval status set by administrator'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CUSTOMER,
        help_text='User role in platform'
    )
    phone_number = models.CharField(max_length=25, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.is_superuser or self.is_staff:
            self.approval_status = self.STATUS_APPROVED
            self.role = self.ROLE_ADMIN
        super().save(*args, **kwargs)

    @property
    def is_approved(self):
        return self.approval_status == self.STATUS_APPROVED

    def __str__(self):
        return f"{self.username} ({self.approval_status})"
