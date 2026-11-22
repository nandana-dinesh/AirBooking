from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'booking_reference', 'passenger_name', 'flight',
        'seat_numbers', 'total_price', 'payment_status', 'booking_status', 'created_at'
    )
    list_filter = ('booking_status', 'payment_status', 'cabin_class')
    search_fields = ('booking_reference', 'passenger_name', 'passenger_email', 'flight__flight_number')
