from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from flights.models import Flight

User = get_user_model()

class FlightAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='flyer',
            password='Password123!',
            approval_status=User.STATUS_APPROVED
        )
        self.admin = User.objects.create_superuser(
            username='admin_flyer',
            password='Password123!',
            role=User.ROLE_ADMIN,
            approval_status=User.STATUS_APPROVED
        )
        self.flight = Flight.objects.create(
            flight_number='TEST-101',
            airline='SkyWays',
            origin_code='DEL',
            origin_city='New Delhi',
            origin_airport='IGI Airport',
            destination_code='BOM',
            destination_city='Mumbai',
            destination_airport='CSMI Airport',
            departure_time=timezone.now() + timedelta(hours=5),
            arrival_time=timezone.now() + timedelta(hours=7),
            duration_minutes=120,
            price=200.00,
            total_seats=150,
            available_seats=150,
            status=Flight.STATUS_ON_TIME
        )

    def test_search_flights(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/flights/search/?origin=DEL&destination=BOM')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Search returns array or results in pagination
        results = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertTrue(len(results) >= 1)
        self.assertEqual(results[0]['flight_number'], 'TEST-101')

    def test_live_status_endpoint(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/flights/{self.flight.id}/live-status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('telemetry', response.data)
        self.assertIn('flight_phase', response.data)

    def test_admin_update_flight_status(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(
            f'/api/admin/flights/{self.flight.id}/status/',
            {'status': Flight.STATUS_DELAYED, 'delay_minutes': 30},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.flight.refresh_from_db()
        self.assertEqual(self.flight.status, Flight.STATUS_DELAYED)
        self.assertEqual(self.flight.delay_minutes, 30)
