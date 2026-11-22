import uuid
from decimal import Decimal
from rest_framework import serializers
from django.db import transaction
from .models import Booking
from flights.models import Flight
from flights.serializers import FlightSerializer
from users.serializers import UserSerializer

class BookingCreateSerializer(serializers.ModelSerializer):
    flight_id = serializers.IntegerField(write_only=True)
    card_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    card_expiry = serializers.CharField(write_only=True, required=False, allow_blank=True)
    card_cvv = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'flight_id', 'passenger_name', 'passenger_email',
            'passenger_phone', 'seat_numbers', 'seat_count', 'cabin_class',
            'card_number', 'card_expiry', 'card_cvv',
            'booking_reference', 'total_price', 'payment_status',
            'booking_status', 'created_at'
        ]
        read_only_fields = ['id', 'booking_reference', 'total_price', 'payment_status', 'booking_status', 'created_at']

    def validate(self, attrs):
        flight_id = attrs.get('flight_id')
        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            raise serializers.ValidationError({"flight_id": "Flight not found."})

        seat_count = attrs.get('seat_count', 1)
        if seat_count < 1:
            raise serializers.ValidationError({"seat_count": "At least 1 seat must be reserved."})

        if flight.available_seats < seat_count:
            raise serializers.ValidationError({"seats": f"Only {flight.available_seats} seats remaining on this flight."})

        seat_numbers_str = attrs.get('seat_numbers', '')
        if seat_numbers_str:
            requested_seats = [s.strip().upper() for s in seat_numbers_str.split(',') if s.strip()]
            if len(requested_seats) != seat_count:
                raise serializers.ValidationError({
                    "seat_numbers": f"Selected {len(requested_seats)} seat numbers, but seat count is {seat_count}."
                })

            # Check if any requested seat is already taken
            existing_bookings = Booking.objects.filter(
                flight=flight,
                booking_status=Booking.STATUS_CONFIRMED
            )
            occupied_seats = set()
            for b in existing_bookings:
                if b.seat_numbers:
                    for s in b.seat_numbers.split(','):
                        occupied_seats.add(s.strip().upper())

            for seat in requested_seats:
                if seat in occupied_seats:
                    raise serializers.ValidationError({
                        "seat_numbers": f"Seat {seat} has already been reserved by another passenger. Please select another seat."
                    })

        attrs['flight'] = flight
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        flight = validated_data.pop('flight')
        validated_data.pop('flight_id', None)
        validated_data.pop('card_number', None)
        validated_data.pop('card_expiry', None)
        validated_data.pop('card_cvv', None)

        seat_count = validated_data.get('seat_count', 1)
        cabin_class = validated_data.get('cabin_class', Booking.CABIN_ECONOMY)

        # Price calculation with cabin multiplier
        base_price = Decimal(str(flight.price))
        multiplier = Decimal('1.0')
        if cabin_class == Booking.CABIN_BUSINESS:
            multiplier = Decimal('2.2')
        elif cabin_class == Booking.CABIN_FIRST:
            multiplier = Decimal('3.5')

        total_price = round(base_price * Decimal(seat_count) * multiplier, 2)

        # Transaction to safely decrement available seats
        with transaction.atomic():
            flight = Flight.objects.select_for_update().get(id=flight.id)
            if flight.available_seats < seat_count:
                raise serializers.ValidationError({"error": "Seats no longer available."})

            flight.available_seats -= seat_count
            flight.save(update_fields=['available_seats'])

            simulated_tx_id = f"TXN-AIR-{uuid.uuid4().hex[:10].upper()}"
            booking = Booking.objects.create(
                user=user,
                flight=flight,
                total_price=total_price,
                payment_status=Booking.PAYMENT_COMPLETED,
                payment_method='Credit Card (Simulated)',
                payment_transaction_id=simulated_tx_id,
                booking_status=Booking.STATUS_CONFIRMED,
                **validated_data
            )

        return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    flight = FlightSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_reference', 'user', 'flight',
            'passenger_name', 'passenger_email', 'passenger_phone',
            'seat_numbers', 'seat_count', 'cabin_class',
            'total_price', 'payment_status', 'payment_method',
            'payment_transaction_id', 'booking_status',
            'created_at', 'updated_at'
        ]
