from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

User = get_user_model()

class AuthenticationAndApprovalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin_test',
            email='admin_test@airbooking.com',
            password='Password123!',
            role=User.ROLE_ADMIN,
            approval_status=User.STATUS_APPROVED
        )
        self.approved_user = User.objects.create_user(
            username='approved_test',
            email='approved@airbooking.com',
            password='Password123!',
            approval_status=User.STATUS_APPROVED
        )
        self.pending_user = User.objects.create_user(
            username='pending_test',
            email='pending@airbooking.com',
            password='Password123!',
            approval_status=User.STATUS_PENDING
        )
        self.rejected_user = User.objects.create_user(
            username='rejected_test',
            email='rejected@airbooking.com',
            password='Password123!',
            approval_status=User.STATUS_REJECTED
        )

    def test_user_registration_creates_pending_status(self):
        """Registering a new account sets approval_status to 'pending'."""
        data = {
            'username': 'new_traveller',
            'email': 'new_traveller@example.com',
            'first_name': 'New',
            'last_name': 'Traveller',
            'phone_number': '+1234567890',
            'password': 'SecurePassword123!',
            'password2': 'SecurePassword123!'
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='new_traveller')
        self.assertEqual(user.approval_status, User.STATUS_PENDING)

    def test_pending_user_login_is_blocked(self):
        """A user with 'pending' status cannot login."""
        response = self.client.post('/api/auth/login/', {
            'username': 'pending_test',
            'password': 'Password123!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("pending admin approval", response.data.get('detail', ''))

    def test_rejected_user_login_is_blocked(self):
        """A user with 'rejected' status cannot login."""
        response = self.client.post('/api/auth/login/', {
            'username': 'rejected_test',
            'password': 'Password123!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("rejected", response.data.get('detail', ''))

    def test_approved_user_login_succeeds(self):
        """An approved user receives JWT access & refresh tokens."""
        response = self.client.post('/api/auth/login/', {
            'username': 'approved_test',
            'password': 'Password123!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    @patch('users.views.trigger_approval_email')
    def test_admin_approve_user_flow(self, mock_email):
        """Admin approves pending user and email notification is triggered."""
        self.client.force_authenticate(user=self.admin_user)
        # Check pending list
        response = self.client.get('/api/admin/users/pending/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Approve
        approve_resp = self.client.post(f'/api/admin/users/{self.pending_user.id}/approve/')
        self.assertEqual(approve_resp.status_code, status.HTTP_200_OK)
        self.pending_user.refresh_from_db()
        self.assertEqual(self.pending_user.approval_status, User.STATUS_APPROVED)
        mock_email.assert_called_once_with(self.pending_user.id)
