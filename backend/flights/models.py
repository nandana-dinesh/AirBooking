from django.db import models
from django.utils import timezone

class Flight(models.Model):
    STATUS_ON_TIME = 'ON_TIME'
    STATUS_DELAYED = 'DELAYED'
    STATUS_CANCELLED = 'CANCELLED'
    STATUS_BOARDING = 'BOARDING'
    STATUS_DEPARTED = 'DEPARTED'
    STATUS_ARRIVED = 'ARRIVED'

    STATUS_CHOICES = [
        (STATUS_ON_TIME, 'On-Time'),
        (STATUS_DELAYED, 'Delayed'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_BOARDING, 'Boarding'),
        (STATUS_DEPARTED, 'Departed'),
        (STATUS_ARRIVED, 'Arrived'),
    ]

    flight_number = models.CharField(max_length=20, unique=True, db_index=True)
    airline = models.CharField(max_length=100)
    airline_code = models.CharField(max_length=10, blank=True)
    aircraft_model = models.CharField(max_length=100, default='Airbus A320neo')

    origin_code = models.CharField(max_length=10, db_index=True)
    origin_city = models.CharField(max_length=100)
    origin_airport = models.CharField(max_length=200)

    destination_code = models.CharField(max_length=10, db_index=True)
    destination_city = models.CharField(max_length=100)
    destination_airport = models.CharField(max_length=200)

    departure_time = models.DateTimeField(db_index=True)
    arrival_time = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(help_text='Duration in minutes')

    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.PositiveIntegerField(default=180)
    available_seats = models.PositiveIntegerField(default=180)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ON_TIME)
    terminal = models.CharField(max_length=20, default='T2')
    gate = models.CharField(max_length=20, default='B4')
    delay_minutes = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['departure_time']

    def __str__(self):
        return f"{self.flight_number}: {self.origin_code} -> {self.destination_code} ({self.status})"
