import os
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from flights.models import Flight
from bookings.models import Booking

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with realistic Indian domestic & international flights with fares scaled by distance and sector.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Beginning database seeding for distance-calibrated Indian flights...'))

        # 1. Create Admin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@airbooking.in',
                'first_name': 'Central',
                'last_name': 'Operations',
                'role': User.ROLE_ADMIN,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+91 98100 12345',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('adminpassword123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user: admin / adminpassword123'))
        else:
            self.stdout.write('Admin user already exists.')

        # 2. Create Approved Customer (Rahul Sharma)
        rahul, created = User.objects.get_or_create(
            username='rahul_sharma',
            defaults={
                'email': 'rahul.sharma@example.in',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+91 98201 98765',
            }
        )
        if created:
            rahul.set_password('userpassword123')
            rahul.save()
            self.stdout.write(self.style.SUCCESS('Created approved passenger: rahul_sharma / userpassword123'))

        # Also maintain john_doe
        john, _ = User.objects.get_or_create(
            username='john_doe',
            defaults={
                'email': 'john.doe@airbooking.in',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+91 98765 43210',
            }
        )
        john.set_password('userpassword123')
        john.save()

        # 3. Create Pending Customer (Priya Patel)
        priya, created = User.objects.get_or_create(
            username='priya_patel',
            defaults={
                'email': 'priya.patel@example.in',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_PENDING,
                'phone_number': '+91 97123 45678',
            }
        )
        if created:
            priya.set_password('userpassword123')
            priya.save()
            self.stdout.write(self.style.SUCCESS('Created pending applicant: priya_patel / userpassword123'))

        sarah, _ = User.objects.get_or_create(
            username='sarah_connor',
            defaults={
                'email': 'sarah.connor@example.com',
                'first_name': 'Sarah',
                'last_name': 'Connor',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_PENDING,
                'phone_number': '+91 98888 77777',
            }
        )
        sarah.set_password('userpassword123')
        sarah.save()

        # 4. Create Rejected Customer
        banned, created = User.objects.get_or_create(
            username='banned_user',
            defaults={
                'email': 'banned@airbooking.in',
                'first_name': 'Banned',
                'last_name': 'User',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_REJECTED,
                'phone_number': '+91 99999 00000',
            }
        )
        if created:
            banned.set_password('userpassword123')
            banned.save()

        now = timezone.now()
        base_date = now.replace(minute=0, second=0, microsecond=0)

        # Distance-calibrated authentic Indian flight schedules
        template_flights = [
            # 1. Short Haul (480 km): Bengaluru -> Goa
            {
                'flight_number': '6E-442',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'BLR',
                'origin_city': 'Bengaluru',
                'origin_airport': 'Kempegowda International Airport',
                'destination_code': 'GOI',
                'destination_city': 'Goa',
                'destination_airport': 'Dabolim Airport',
                'distance_km': 480,
                'hour_dep': 8, 'min_dep': 0,
                'duration_minutes': 70,
                'price': 4890.00,
                'total_seats': 186,
                'available_seats': 172,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1',
                'gate': '7',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Cookies & Beverages on board',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Short 1h 10m Hop',
            },

            # 2. Medium Haul (840 km): Mumbai -> Bengaluru
            {
                'flight_number': '6E-512',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'BLR',
                'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'distance_km': 840,
                'hour_dep': 7, 'min_dep': 15,
                'duration_minutes': 105,
                'price': 6750.00,
                'total_seats': 186,
                'available_seats': 178,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1',
                'gate': '11',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Snacks available for purchase',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Popular Business Flight',
            },
            {
                'flight_number': 'AI-503',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 787-8 Dreamliner',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'BLR',
                'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'distance_km': 840,
                'hour_dep': 16, 'min_dep': 45,
                'duration_minutes': 110,
                'price': 7450.00,
                'total_seats': 256,
                'available_seats': 240,
                'status': Flight.STATUS_BOARDING,
                'terminal': 'T2',
                'gate': 'C14',
                'baggage_info': '25 kg Check-in • 7 kg Cabin',
                'meal_info': 'Complimentary Hot Snacks Included',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Dreamliner Full-Service',
            },

            # 3. Medium Haul (1,070 km): Mumbai -> Kochi
            {
                'flight_number': 'IX-421',
                'airline': 'Air India Express',
                'airline_code': 'IX',
                'aircraft_model': 'Boeing 737-800',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'COK',
                'destination_city': 'Kochi',
                'destination_airport': 'Cochin International Airport',
                'distance_km': 1070,
                'hour_dep': 10, 'min_dep': 30,
                'duration_minutes': 115,
                'price': 7650.00,
                'total_seats': 189,
                'available_seats': 180,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '44',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Pre-book Express Meals',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Coastal Express',
            },

            # 4. Major Trunk Sector (1,148 km): Delhi -> Mumbai
            {
                'flight_number': 'QP-1302',
                'airline': 'Akasa Air',
                'airline_code': 'QP',
                'aircraft_model': 'Boeing 737 MAX 8',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 14, 'min_dep': 45,
                'duration_minutes': 140,
                'price': 7950.00,
                'total_seats': 189,
                'available_seats': 175,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '16',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Cafe Akasa In-Flight Dining',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Best Value Non-stop',
            },
            {
                'flight_number': '6E-2041',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo (Sharklets)',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 6, 'min_dep': 15,
                'duration_minutes': 135,
                'price': 8650.00,
                'total_seats': 222,
                'available_seats': 214,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '24A',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Buy-on-board Snacks & Beverages',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Early Morning Business',
            },
            {
                'flight_number': 'AI-865',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Airbus A350-900 (New Cabin)',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 19, 'min_dep': 30,
                'duration_minutes': 135,
                'price': 9250.00,
                'total_seats': 316,
                'available_seats': 302,
                'status': Flight.STATUS_DELAYED,
                'terminal': 'T3',
                'gate': '18B',
                'delay_minutes': 25,
                'baggage_info': '25 kg Check-in • 7 kg Cabin',
                'meal_info': 'Complimentary Hot Dinner Included',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Generous 25kg Baggage',
            },
            {
                'flight_number': 'UK-955',
                'airline': 'Vistara',
                'airline_code': 'UK',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 8, 'min_dep': 30,
                'duration_minutes': 130,
                'price': 10450.00,
                'total_seats': 164,
                'available_seats': 148,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '32',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Complimentary Hot Gourmet Meal',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Premium Flying Experience',
            },

            # 5. Long Haul Domestic (1,260 km): Delhi -> Hyderabad
            {
                'flight_number': '6E-874',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'HYD',
                'destination_city': 'Hyderabad',
                'destination_airport': 'Rajiv Gandhi International Airport',
                'distance_km': 1260,
                'hour_dep': 11, 'min_dep': 15,
                'duration_minutes': 130,
                'price': 8450.00,
                'total_seats': 222,
                'available_seats': 210,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '19',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Snacks available for purchase',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Trunk Route',
            },

            # 6. Long Haul Domestic (1,515 km): Delhi -> Goa
            {
                'flight_number': '6E-354',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'GOI',
                'destination_city': 'Goa',
                'destination_airport': 'Dabolim Airport',
                'distance_km': 1515,
                'hour_dep': 9, 'min_dep': 10,
                'duration_minutes': 155,
                'price': 10850.00,
                'total_seats': 222,
                'available_seats': 208,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '14',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Buy-on-board Snacks & Beverages',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Popular Holiday Non-stop',
            },
            {
                'flight_number': 'UK-957',
                'airline': 'Vistara',
                'airline_code': 'UK',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'GOI',
                'destination_city': 'Goa',
                'destination_airport': 'Dabolim Airport',
                'distance_km': 1515,
                'hour_dep': 13, 'min_dep': 25,
                'duration_minutes': 160,
                'price': 12450.00,
                'total_seats': 164,
                'available_seats': 152,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '21',
                'baggage_info': '15 kg Check-in • 7 kg Cabin',
                'meal_info': 'Complimentary Hot Lunch Included',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Premium Leisure Experience',
            },

            # 7. Cross-Country Long Haul (2,080 km): Delhi -> Kochi
            {
                'flight_number': 'AI-479',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'COK',
                'destination_city': 'Kochi',
                'destination_airport': 'Cochin International Airport',
                'distance_km': 2080,
                'hour_dep': 6, 'min_dep': 0,
                'duration_minutes': 195,
                'price': 13850.00,
                'total_seats': 180,
                'available_seats': 168,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '26',
                'baggage_info': '25 kg Check-in • 7 kg Cabin',
                'meal_info': 'Complimentary Hot Breakfast',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Cross-Country Non-stop',
            },

            # 8. International Middle East (1,930 km): Mumbai -> Dubai
            {
                'flight_number': 'EK-505',
                'airline': 'Emirates',
                'airline_code': 'EK',
                'aircraft_model': 'Airbus A380-800 Double Decker',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'DXB',
                'destination_city': 'Dubai',
                'destination_airport': 'Dubai International Airport',
                'distance_km': 1930,
                'hour_dep': 10, 'min_dep': 15,
                'duration_minutes': 210,
                'price': 38500.00,
                'total_seats': 480,
                'available_seats': 462,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '68',
                'baggage_info': '30 kg Check-in • 7 kg Cabin',
                'meal_info': 'Multi-course International Meal & Bar',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'Emirates A380 Experience',
            },

            # 9. International Southeast Asia (4,150 km): Delhi -> Singapore
            {
                'flight_number': 'SQ-403',
                'airline': 'Singapore Airlines',
                'airline_code': 'SQ',
                'aircraft_model': 'Boeing 787-10 Dreamliner',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'SIN',
                'destination_city': 'Singapore',
                'destination_airport': 'Singapore Changi Airport',
                'distance_km': 4150,
                'hour_dep': 9, 'min_dep': 45,
                'duration_minutes': 330,
                'price': 46800.00,
                'total_seats': 337,
                'available_seats': 324,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '22',
                'baggage_info': '30 kg Check-in • 7 kg Cabin',
                'meal_info': 'World Gourmet Cuisine Included',
                'refundable': True,
                'stops': 'Non-stop',
                'flight_tag': 'World 5-Star Airline',
            }
        ]

        created_flights = []
        for tf in template_flights:
            dep_time = base_date.replace(hour=tf['hour_dep'], minute=tf['min_dep'])
            if dep_time < now:
                dep_time = dep_time + timedelta(days=1)
            arr_time = dep_time + timedelta(minutes=tf['duration_minutes'])

            flight_fields = {k: v for k, v in tf.items() if k not in ['hour_dep', 'min_dep']}
            flight_fields['departure_time'] = dep_time
            flight_fields['arrival_time'] = arr_time

            f_obj, _ = Flight.objects.update_or_create(
                flight_number=tf['flight_number'],
                defaults=flight_fields
            )
            created_flights.append(f_obj)

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(created_flights)} distance-calibrated Indian flights.'))

        # 6. Seed Sample Bookings
        if created_flights:
            f1 = created_flights[4] # QP-1302 Akasa DEL -> BOM
            Booking.objects.update_or_create(
                booking_reference='AB9482X',
                defaults={
                    'user': rahul,
                    'flight': f1,
                    'passenger_name': 'Rahul Sharma',
                    'passenger_email': 'rahul.sharma@example.in',
                    'passenger_phone': '+91 98201 98765',
                    'seat_numbers': '12A, 12B',
                    'seat_count': 2,
                    'cabin_class': Booking.CABIN_ECONOMY,
                    'total_price': 15900.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'UPI (Google Pay)',
                    'payment_transaction_id': 'UPI-IND-84920491',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

            Booking.objects.update_or_create(
                booking_reference='AB3174K',
                defaults={
                    'user': john,
                    'flight': created_flights[7], # UK-955 Vistara DEL -> BOM Business
                    'passenger_name': 'John Doe',
                    'passenger_email': 'john.doe@airbooking.in',
                    'passenger_phone': '+91 98765 43210',
                    'seat_numbers': '3A',
                    'seat_count': 1,
                    'cabin_class': Booking.CABIN_BUSINESS,
                    'total_price': 22990.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'RuPay Platinum Card',
                    'payment_transaction_id': 'TXN-RUPAY-0012',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

        self.stdout.write(self.style.SUCCESS('Database seeding with distance-calibrated fares completed successfully!'))
