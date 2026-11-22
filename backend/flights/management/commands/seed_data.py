import os
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from flights.models import Flight
from bookings.models import Booking

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with initial users, flights, and bookings for testing.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Beginning database seeding...'))

        # 1. Create Admin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@airbooking.com',
                'first_name': 'System',
                'last_name': 'Administrator',
                'role': User.ROLE_ADMIN,
                'approval_status': User.STATUS_APPROVED,
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

        # 2. Create Approved Customer
        john, created = User.objects.get_or_create(
            username='john_doe',
            defaults={
                'email': 'john.doe@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+1 (555) 234-5678',
            }
        )
        if created:
            john.set_password('userpassword123')
            john.save()
            self.stdout.write(self.style.SUCCESS('Created approved customer: john_doe / userpassword123'))

        # 3. Create Pending Customer (to test Admin Approval)
        sarah, created = User.objects.get_or_create(
            username='sarah_connor',
            defaults={
                'email': 'sarah.connor@example.com',
                'first_name': 'Sarah',
                'last_name': 'Connor',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_PENDING,
                'phone_number': '+1 (555) 876-5432',
            }
        )
        if created:
            sarah.set_password('userpassword123')
            sarah.save()
            self.stdout.write(self.style.SUCCESS('Created pending customer: sarah_connor / userpassword123'))

        # 4. Create Rejected Customer
        banned, created = User.objects.get_or_create(
            username='banned_user',
            defaults={
                'email': 'banned@example.com',
                'first_name': 'Alex',
                'last_name': 'Smith',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_REJECTED,
                'phone_number': '+1 (555) 000-1111',
            }
        )
        if created:
            banned.set_password('userpassword123')
            banned.save()
            self.stdout.write(self.style.SUCCESS('Created rejected customer: banned_user / userpassword123'))

        # 5. Seed Realistic Flights
        now = timezone.now()
        flights_data = [
            {
                'flight_number': 'AI-202',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 787-9 Dreamliner',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM',
                'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'departure_time': now + timedelta(hours=3),
                'arrival_time': now + timedelta(hours=5, minutes=15),
                'duration_minutes': 135,
                'price': 149.00,
                'total_seats': 180,
                'available_seats': 176,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '14B',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'EK-501',
                'airline': 'Emirates',
                'airline_code': 'EK',
                'aircraft_model': 'Airbus A380-800',
                'origin_code': 'BOM',
                'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'DXB',
                'destination_city': 'Dubai',
                'destination_airport': 'Dubai International Airport',
                'departure_time': now + timedelta(hours=6),
                'arrival_time': now + timedelta(hours=9, minutes=30),
                'duration_minutes': 210,
                'price': 380.00,
                'total_seats': 350,
                'available_seats': 342,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': 'C12',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'BA-142',
                'airline': 'British Airways',
                'airline_code': 'BA',
                'aircraft_model': 'Boeing 777-300ER',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'LHR',
                'destination_city': 'London',
                'destination_airport': 'Heathrow Airport',
                'departure_time': now + timedelta(hours=14),
                'arrival_time': now + timedelta(hours=23, minutes=45),
                'duration_minutes': 585,
                'price': 720.00,
                'total_seats': 260,
                'available_seats': 245,
                'status': Flight.STATUS_DELAYED,
                'terminal': 'T3',
                'gate': '28',
                'delay_minutes': 45,
            },
            {
                'flight_number': 'UA-882',
                'airline': 'United Airlines',
                'airline_code': 'UA',
                'aircraft_model': 'Boeing 787-10',
                'origin_code': 'JFK',
                'origin_city': 'New York',
                'origin_airport': 'John F. Kennedy International Airport',
                'destination_code': 'LHR',
                'destination_city': 'London',
                'destination_airport': 'Heathrow Airport',
                'departure_time': now + timedelta(days=1, hours=2),
                'arrival_time': now + timedelta(days=1, hours=9),
                'duration_minutes': 420,
                'price': 650.00,
                'total_seats': 240,
                'available_seats': 228,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T7',
                'gate': '4A',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'SQ-406',
                'airline': 'Singapore Airlines',
                'airline_code': 'SQ',
                'aircraft_model': 'Airbus A350-900',
                'origin_code': 'DEL',
                'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'SIN',
                'destination_city': 'Singapore',
                'destination_airport': 'Singapore Changi Airport',
                'departure_time': now + timedelta(days=1, hours=8),
                'arrival_time': now + timedelta(days=1, hours=14),
                'duration_minutes': 360,
                'price': 420.00,
                'total_seats': 253,
                'available_seats': 239,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3',
                'gate': '17',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'DL-440',
                'airline': 'Delta Air Lines',
                'airline_code': 'DL',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'JFK',
                'origin_city': 'New York',
                'origin_airport': 'John F. Kennedy International Airport',
                'destination_code': 'SFO',
                'destination_city': 'San Francisco',
                'destination_airport': 'San Francisco International Airport',
                'departure_time': now + timedelta(hours=1, minutes=30),
                'arrival_time': now + timedelta(hours=7, minutes=30),
                'duration_minutes': 360,
                'price': 295.00,
                'total_seats': 194,
                'available_seats': 188,
                'status': Flight.STATUS_BOARDING,
                'terminal': 'T4',
                'gate': 'B22',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'AF-112',
                'airline': 'Air France',
                'airline_code': 'AF',
                'aircraft_model': 'Boeing 777-200ER',
                'origin_code': 'CDG',
                'origin_city': 'Paris',
                'origin_airport': 'Charles de Gaulle Airport',
                'destination_code': 'JFK',
                'destination_city': 'New York',
                'destination_airport': 'John F. Kennedy International Airport',
                'departure_time': now + timedelta(days=2, hours=4),
                'arrival_time': now + timedelta(days=2, hours=12),
                'duration_minutes': 480,
                'price': 690.00,
                'total_seats': 280,
                'available_seats': 270,
                'status': Flight.STATUS_ON_TIME,
                'terminal': '2E',
                'gate': 'K34',
                'delay_minutes': 0,
            },
            {
                'flight_number': 'NH-828',
                'airline': 'All Nippon Airways',
                'airline_code': 'NH',
                'aircraft_model': 'Boeing 787-8',
                'origin_code': 'SIN',
                'origin_city': 'Singapore',
                'origin_airport': 'Singapore Changi Airport',
                'destination_code': 'HND',
                'destination_city': 'Tokyo',
                'destination_airport': 'Haneda Airport',
                'departure_time': now + timedelta(days=2, hours=10),
                'arrival_time': now + timedelta(days=2, hours=17),
                'duration_minutes': 420,
                'price': 540.00,
                'total_seats': 240,
                'available_seats': 235,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2',
                'gate': 'F11',
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

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(created_flights)} flights across global routes.'))

        # 6. Seed Sample Bookings for John Doe
        if created_flights:
            f1 = created_flights[0] # AI-202
            Booking.objects.get_or_create(
                booking_reference='AB9482X',
                defaults={
                    'user': john,
                    'flight': f1,
                    'passenger_name': 'John Doe',
                    'passenger_email': 'john.doe@example.com',
                    'passenger_phone': '+1 (555) 234-5678',
                    'seat_numbers': '14A, 14B',
                    'seat_count': 2,
                    'cabin_class': Booking.CABIN_ECONOMY,
                    'total_price': 298.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'Credit Card (Simulated)',
                    'payment_transaction_id': 'TXN-AIR-SEED01',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

            f2 = created_flights[1] # EK-501
            Booking.objects.get_or_create(
                booking_reference='AB3174K',
                defaults={
                    'user': john,
                    'flight': f2,
                    'passenger_name': 'John Doe',
                    'passenger_email': 'john.doe@example.com',
                    'passenger_phone': '+1 (555) 234-5678',
                    'seat_numbers': '3A',
                    'seat_count': 1,
                    'cabin_class': Booking.CABIN_BUSINESS,
                    'total_price': 836.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'Credit Card (Simulated)',
                    'payment_transaction_id': 'TXN-AIR-SEED02',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )
            self.stdout.write(self.style.SUCCESS('Seeded sample bookings for john_doe.'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
