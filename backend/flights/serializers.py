from decimal import Decimal
from rest_framework import serializers
from .models import Flight
from bookings.models import Booking

class FlightSerializer(serializers.ModelSerializer):
    occupied_seats = serializers.SerializerMethodField()
    occupancy_rate = serializers.SerializerMethodField()
    base_fare = serializers.SerializerMethodField()
    taxes_and_fees = serializers.SerializerMethodField()

    class Meta:
        model = Flight
        fields = [
            'id', 'flight_number', 'airline', 'airline_code', 'aircraft_model',
            'origin_code', 'origin_city', 'origin_airport',
            'destination_code', 'destination_city', 'destination_airport',
            'departure_time', 'arrival_time', 'duration_minutes',
            'price', 'total_seats', 'available_seats',
            'status', 'terminal', 'gate', 'delay_minutes',
            'baggage_info', 'meal_info', 'refundable', 'stops', 'flight_tag',
            'base_fare', 'taxes_and_fees',
            'occupied_seats', 'occupancy_rate', 'created_at', 'updated_at'
        ]

    def get_base_fare(self, obj):
        # Realistic airfare breakdown: 82% base fare
        return round(float(obj.price) * 0.82, 2)

    def get_taxes_and_fees(self, obj):
        # 18% Aviation Security Fee (ASF), User Development Fee (UDF), and GST
        return round(float(obj.price) * 0.18, 2)

    def get_occupied_seats(self, obj):
        bookings = Booking.objects.filter(flight=obj, booking_status=Booking.STATUS_CONFIRMED)
        seats = []
        for b in bookings:
            if b.seat_numbers:
                for s in b.seat_numbers.split(','):
                    seat_clean = s.strip()
                    if seat_clean:
                        seats.append(seat_clean)
        return sorted(list(set(seats)))

    def get_occupancy_rate(self, obj):
        if obj.total_seats > 0:
            booked = obj.total_seats - obj.available_seats
            return round((booked / obj.total_seats) * 100, 1)
        return 0.0


class FlightCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class FlightStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ['status', 'delay_minutes', 'gate', 'terminal']
