from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from flights.models import Flight
from bookings.models import Booking

User = get_user_model()

class BookingAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='booking_user',
            password='Password123!',
            email='book@example.com',
            approval_status=User.STATUS_APPROVED
        )
        self.flight = Flight.objects.create(
            flight_number='TEST-202',
            airline='SkyWays',
            origin_code='JFK',
            origin_city='New York',
            origin_airport='JFK Airport',
            destination_code='LHR',
            destination_city='London',
            destination_airport='Heathrow',
            departure_time=timezone.now() + timedelta(days=2),
            arrival_time=timezone.now() + timedelta(days=2, hours=7),
            duration_minutes=420,
            price=500.00,
            total_seats=100,
            available_seats=100,
            status=Flight.STATUS_ON_TIME
        )

    def test_create_booking_reserves_seat_and_decrements_availability(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'flight_id': self.flight.id,
            'passenger_name': 'Jane Doe',
            'passenger_email': 'jane.doe@example.com',
            'seat_numbers': '14A, 14B',
            'seat_count': 2,
            'cabin_class': 'ECONOMY',
        }
        response = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = Booking.objects.get(booking_reference=response.data['booking']['booking_reference'])
        self.assertEqual(booking.seat_count, 2)
        self.assertEqual(booking.booking_status, Booking.STATUS_CONFIRMED)
        
        # Verify seats decremented
        self.flight.refresh_from_db()
        self.assertEqual(self.flight.available_seats, 98)

    def test_cannot_double_book_same_seat(self):
        self.client.force_authenticate(user=self.user)
        # First booking
        self.client.post('/api/bookings/', {
            'flight_id': self.flight.id,
            'passenger_name': 'Jane Doe',
            'passenger_email': 'jane.doe@example.com',
            'seat_numbers': '14A',
            'seat_count': 1,
            'cabin_class': 'ECONOMY',
        }, format='json')

        # Second booking attempting seat 14A
        response = self.client.post('/api/bookings/', {
            'flight_id': self.flight.id,
            'passenger_name': 'Another Person',
            'passenger_email': 'another@example.com',
            'seat_numbers': '14A',
            'seat_count': 1,
            'cabin_class': 'ECONOMY',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already been reserved", str(response.data))

    def test_cancel_booking_refunds_seats(self):
        self.client.force_authenticate(user=self.user)
        create_resp = self.client.post('/api/bookings/', {
            'flight_id': self.flight.id,
            'passenger_name': 'Jane Doe',
            'passenger_email': 'jane.doe@example.com',
            'seat_numbers': '15C',
            'seat_count': 1,
            'cabin_class': 'ECONOMY',
        }, format='json')
        booking_id = create_resp.data['booking']['id']

        self.flight.refresh_from_db()
        self.assertEqual(self.flight.available_seats, 99)

        # Cancel
        cancel_resp = self.client.post(f'/api/bookings/{booking_id}/cancel/')
        self.assertEqual(cancel_resp.status_code, status.HTTP_200_OK)
        
        self.flight.refresh_from_db()
        self.assertEqual(self.flight.available_seats, 100)
        
        booking = Booking.objects.get(id=booking_id)
        self.assertEqual(booking.booking_status, Booking.STATUS_CANCELLED)
        self.assertEqual(booking.payment_status, Booking.PAYMENT_REFUNDED)
