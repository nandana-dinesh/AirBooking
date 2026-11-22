import uuid
from django.db import models
from django.conf import settings
from flights.models import Flight

def generate_booking_reference():
    # 6 uppercase alphanumeric characters
    return f"AB{uuid.uuid4().hex[:6].upper()}"

class Booking(models.Model):
    STATUS_CONFIRMED = 'CONFIRMED'
    STATUS_CANCELLED = 'CANCELLED'

    BOOKING_STATUS_CHOICES = [
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    PAYMENT_PENDING = 'PENDING'
    PAYMENT_COMPLETED = 'COMPLETED'
    PAYMENT_FAILED = 'FAILED'
    PAYMENT_REFUNDED = 'REFUNDED'

    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_PENDING, 'Pending'),
        (PAYMENT_COMPLETED, 'Completed'),
        (PAYMENT_FAILED, 'Failed'),
        (PAYMENT_REFUNDED, 'Refunded'),
    ]

    CABIN_ECONOMY = 'ECONOMY'
    CABIN_BUSINESS = 'BUSINESS'
    CABIN_FIRST = 'FIRST'

    CABIN_CHOICES = [
        (CABIN_ECONOMY, 'Economy'),
        (CABIN_BUSINESS, 'Business Class'),
        (CABIN_FIRST, 'First Class'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='bookings')
    booking_reference = models.CharField(max_length=12, unique=True, default=generate_booking_reference, db_index=True)

    passenger_name = models.CharField(max_length=150)
    passenger_email = models.EmailField()
    passenger_phone = models.CharField(max_length=30, blank=True)

    seat_numbers = models.CharField(max_length=120, help_text='Comma-separated seat numbers, e.g. 12A, 12B')
    seat_count = models.PositiveIntegerField(default=1)
    cabin_class = models.CharField(max_length=20, choices=CABIN_CHOICES, default=CABIN_ECONOMY)

    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_COMPLETED)
    payment_method = models.CharField(max_length=50, default='Card Payment (Simulated)')
    payment_transaction_id = models.CharField(max_length=100, blank=True)

    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default=STATUS_CONFIRMED)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_reference} - {self.passenger_name} ({self.flight.flight_number})"
