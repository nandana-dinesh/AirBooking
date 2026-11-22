import os
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from flights.models import Flight
from bookings.models import Booking

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with Indian domestic & international flights, Indian users, and test bookings.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Beginning database seeding for Indian flight network...'))

        # 1. Create Admin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@airbooking.in',
                'first_name': 'AirBooking',
                'last_name': 'Administrator',
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

        # 2. Create Approved Customer (Rahul Sharma / John Doe)
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
            self.stdout.write(self.style.SUCCESS('Created approved customer: rahul_sharma / userpassword123'))

        # Also maintain john_doe for backwards-compatibility
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

        # 3. Create Pending Customer (Priya Patel / Sarah Connor for approval testing)
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
            self.stdout.write(self.style.SUCCESS('Created pending customer: priya_patel / userpassword123'))

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
                'last_name': 'Account',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_REJECTED,
                'phone_number': '+91 99999 00000',
            }
        )
        if created:
            banned.set_password('userpassword123')
            banned.save()

        # 5. Seed Realistic Indian & Global Flights (INR Pricing)
        now = timezone.now()
        flights_data = [
            {
                'flight_number': '6E-2041',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'departure_time': now + timedelta(hours=2, minutes=30),
                'arrival_time': now + timedelta(hours=4, minutes=45),
                'duration_minutes': 135,
                'price': 4850.00,
                'total_seats': 222,
                'available_seats': 218,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '24A',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'AI-865',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Airbus A350-900',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'BLR',
                'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'departure_time': now + timedelta(hours=4),
                'arrival_time': now + timedelta(hours=5, minutes=45),
                'duration_minutes': 105,
                'price': 3690.00,
                'total_seats': 316,
                'available_seats': 310,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': 'C14',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'UK-955',
                'airline': 'Vistara',
                'airline_code': 'UK',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'GOI',
                'destination_city': 'Goa',
                'destination_airport': 'Dabolim Airport',
                'departure_time': now + timedelta(hours=6),
                'arrival_time': now + timedelta(hours=8, minutes=35),
                'duration_minutes': 155,
                'price': 5450.00,
                'total_seats': 164,
                'available_seats': 158,
                'status': Flight.STATUS_DELAYED,
                'terminal': 'T3',
                'gate': '17B',
                'delay_minutes': 25,
            },
            {
                'flight_number': 'QP-1302',
                'airline': 'Akasa Air',
                'airline_code': 'QP',
                'aircraft_model': 'Boeing 737 MAX 8',
                'origin_code': 'BLR',
                'origin_city': 'Bengaluru',
                'origin_airport': 'Kempegowda International Airport',
                'destination_code': 'DEL',
                'destination_city': 'New Delhi',
                'destination_airport': 'Indira Gandhi International Airport',
                'departure_time': now + timedelta(hours=1, minutes=15),
                'arrival_time': now + timedelta(hours=3, minutes=55),
                'duration_minutes': 160,
                'price': 4990.00,
                'total_seats': 189,
                'available_seats': 184,
                'status': Flight.STATUS_BOARDING,
                'terminal': 'T1',
                'gate': '8',
                'delay_minutes': 0,
            },
            {
                'flight_number': '6E-512',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'HYD',
                'origin_city': 'Hyderabad',
                'origin_airport': 'Rajiv Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'departure_time': now + timedelta(hours=8),
                'arrival_time': now + timedelta(hours=9, minutes=30),
                'duration_minutes': 90,
                'price': 3250.00,
                'total_seats': 186,
                'available_seats': 180,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1',
                'gate': '12',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'AI-503',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 787-8 Dreamliner',
                'origin_code': 'MAA',
                'origin_city': 'Chennai',
                'origin_airport': 'Chennai International Airport',
                'destination_code': 'DEL',
                'destination_city': 'New Delhi',
                'destination_airport': 'Indira Gandhi International Airport',
                'departure_time': now + timedelta(days=1, hours=3),
                'arrival_time': now + timedelta(days=1, hours=5, minutes=45),
                'duration_minutes': 165,
                'price': 4400.00,
                'total_seats': 256,
                'available_seats': 250,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T4',
                'gate': '5',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'IX-421',
                'airline': 'Air India Express',
                'airline_code': 'IX',
                'aircraft_model': 'Boeing 737-800',
                'origin_code': 'COK',
                'origin_city': 'Kochi',
                'origin_airport': 'Cochin International Airport',
                'destination_code': 'BLR',
                'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'departure_time': now + timedelta(days=1, hours=6),
                'arrival_time': now + timedelta(days=1, hours=7, minutes=15),
                'duration_minutes': 75,
                'price': 2850.00,
                'total_seats': 180,
                'available_seats': 175,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1',
                'gate': '3A',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'EK-505',
                'airline': 'Emirates',
                'airline_code': 'EK',
                'aircraft_model': 'Airbus A380-800',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'DXB',
                'destination_city': 'Dubai',
                'destination_airport': 'Dubai International Airport',
                'departure_time': now + timedelta(hours=10),
                'arrival_time': now + timedelta(hours=13, minutes=30),
                'duration_minutes': 210,
                'price': 16800.00,
                'total_seats': 480,
                'available_seats': 472,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': '68',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'SQ-403',
                'airline': 'Singapore Airlines',
                'airline_code': 'SQ',
                'aircraft_model': 'Boeing 787-10',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'SIN',
                'destination_city': 'Singapore',
                'destination_airport': 'Singapore Changi Airport',
                'departure_time': now + timedelta(days=1, hours=9),
                'arrival_time': now + timedelta(days=1, hours=14, minutes=30),
                'duration_minutes': 330,
                'price': 18900.00,
                'total_seats': 337,
                'available_seats': 328,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '19',
                'delay_minutes': 0,
            }
        ]

        created_flights = []
        for f_data in flights_data:
            flight_obj, _ = Flight.objects.update_or_create(
                flight_number=f_data['flight_number'],
                defaults=f_data
            )
            created_flights.append(flight_obj)

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(created_flights)} Indian flights.'))

        # 6. Seed Sample Bookings for Rahul Sharma & John Doe
        if created_flights:
            f1 = created_flights[0] # 6E-2041 DEL -> BOM
            Booking.objects.get_or_create(
                booking_reference='AB9482X',
                defaults={
                    'user': rahul,
                    'flight': f1,
                    'passenger_name': 'Rahul Sharma',
                    'passenger_email': 'rahul.sharma@example.in',
                    'passenger_phone': '+91 98201 98765',
                    'seat_numbers': '14A, 14B',
                    'seat_count': 2,
                    'cabin_class': Booking.CABIN_ECONOMY,
                    'total_price': 9700.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'UPI (Google Pay)',
                    'payment_transaction_id': 'UPI-IND-84920491',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

            # Also seed for john_doe
            Booking.objects.get_or_create(
                booking_reference='AB3174K',
                defaults={
                    'user': john,
                    'flight': f1,
                    'passenger_name': 'John Doe',
                    'passenger_email': 'john.doe@airbooking.in',
                    'passenger_phone': '+91 98765 43210',
                    'seat_numbers': '3A',
                    'seat_count': 1,
                    'cabin_class': Booking.CABIN_BUSINESS,
                    'total_price': 10670.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'RuPay Card',
                    'payment_transaction_id': 'TXN-RUPAY-0012',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )
            self.stdout.write(self.style.SUCCESS('Seeded sample bookings.'))

        self.stdout.write(self.style.SUCCESS('Indian Flight Network seeding completed successfully!'))
