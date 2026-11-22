import os
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from flights.models import Flight
from bookings.models import Booking

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with realistic Indian domestic & international flights with authentic fares, schedules and airline data.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting AirBooking India database seed...'))

        # ── 1. Admin ─────────────────────────────────────────────────────────
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
            self.stdout.write(self.style.SUCCESS('  Created admin: admin / adminpassword123'))
        else:
            self.stdout.write('  Admin already exists.')

        # ── 2. Approved Passengers ───────────────────────────────────────────
        rahul, _ = User.objects.get_or_create(
            username='rahul_sharma',
            defaults={
                'email': 'rahul.sharma@gmail.com',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+91 98201 98765',
            }
        )
        rahul.set_password('userpassword123')
        rahul.save()

        john, _ = User.objects.get_or_create(
            username='john_doe',
            defaults={
                'email': 'john.doe@gmail.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+91 98765 43210',
            }
        )
        john.set_password('userpassword123')
        john.save()

        ananya, _ = User.objects.get_or_create(
            username='ananya_singh',
            defaults={
                'email': 'ananya.singh@gmail.com',
                'first_name': 'Ananya',
                'last_name': 'Singh',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_APPROVED,
                'phone_number': '+91 97654 32198',
            }
        )
        ananya.set_password('userpassword123')
        ananya.save()

        # ── 3. Pending Passengers ────────────────────────────────────────────
        priya, _ = User.objects.get_or_create(
            username='priya_patel',
            defaults={
                'email': 'priya.patel@gmail.com',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_PENDING,
                'phone_number': '+91 97123 45678',
            }
        )
        priya.set_password('userpassword123')
        priya.save()

        arjun, _ = User.objects.get_or_create(
            username='arjun_nair',
            defaults={
                'email': 'arjun.nair@gmail.com',
                'first_name': 'Arjun',
                'last_name': 'Nair',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_PENDING,
                'phone_number': '+91 98888 77777',
            }
        )
        arjun.set_password('userpassword123')
        arjun.save()

        # ── 4. Rejected ──────────────────────────────────────────────────────
        banned, _ = User.objects.get_or_create(
            username='banned_user',
            defaults={
                'email': 'banned@airbooking.in',
                'first_name': 'Blocked',
                'last_name': 'Account',
                'role': User.ROLE_CUSTOMER,
                'approval_status': User.STATUS_REJECTED,
                'phone_number': '+91 99999 00000',
            }
        )
        banned.set_password('userpassword123')
        banned.save()

        self.stdout.write(self.style.SUCCESS('  User accounts seeded.'))

        # ── 5. Flights ───────────────────────────────────────────────────────
        now = timezone.now()
        base = now.replace(minute=0, second=0, microsecond=0)

        # fmt: off
        tpl = [

            # ══════════════════════════════════════════════════════════════════
            # SHORT HAUL  (< 600 km)   ~₹4,500 – ₹5,800
            # ══════════════════════════════════════════════════════════════════

            # BLR → GOI  480 km  — IndiGo budget morning
            {
                'flight_number': '6E-442',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'BLR', 'origin_city': 'Bengaluru',
                'origin_airport': 'Kempegowda International Airport',
                'destination_code': 'GOI', 'destination_city': 'Goa',
                'destination_airport': 'Goa International Airport (Dabolim)',
                'distance_km': 480,
                'hour_dep': 6, 'min_dep': 20,
                'duration_minutes': 70,
                'price': 4499.00,
                'total_seats': 186, 'available_seats': 161,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1', 'gate': '7',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Wraps, Sandwiches & Beverages',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Early Morning Saver',
            },

            # BLR → GOI  480 km  — IndiGo afternoon
            {
                'flight_number': '6E-446',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'BLR', 'origin_city': 'Bengaluru',
                'origin_airport': 'Kempegowda International Airport',
                'destination_code': 'GOI', 'destination_city': 'Goa',
                'destination_airport': 'Goa International Airport (Dabolim)',
                'distance_km': 480,
                'hour_dep': 14, 'min_dep': 10,
                'duration_minutes': 70,
                'price': 5199.00,
                'total_seats': 186, 'available_seats': 142,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1', 'gate': '8',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Wraps, Sandwiches & Beverages',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Weekend Getaway',
            },

            # BOM → GOI  592 km  — SpiceJet / Akasa
            {
                'flight_number': 'QP-203',
                'airline': 'Akasa Air',
                'airline_code': 'QP',
                'aircraft_model': 'Boeing 737 MAX 8',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'GOI', 'destination_city': 'Goa',
                'destination_airport': 'Goa International Airport (Dabolim)',
                'distance_km': 592,
                'hour_dep': 9, 'min_dep': 45,
                'duration_minutes': 65,
                'price': 4890.00,
                'total_seats': 189, 'available_seats': 174,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '11',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Cafe Akasa — Pre-book Meals for Best Prices',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Best Value to Goa',
            },

            # ══════════════════════════════════════════════════════════════════
            # MEDIUM HAUL  (700 – 1,300 km)   ~₹6,500 – ₹11,500
            # ══════════════════════════════════════════════════════════════════

            # BOM → BLR  840 km  — IndiGo early morning
            {
                'flight_number': '6E-512',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'BLR', 'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'distance_km': 840,
                'hour_dep': 6, 'min_dep': 5,
                'duration_minutes': 100,
                'price': 6499.00,
                'total_seats': 186, 'available_seats': 178,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1', 'gate': '11',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Snacks & Hot Beverages',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Most Punctual Route',
            },

            # BOM → BLR  840 km  — Air India full-service evening
            {
                'flight_number': 'AI-503',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 787-8 Dreamliner',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'BLR', 'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'distance_km': 840,
                'hour_dep': 17, 'min_dep': 30,
                'duration_minutes': 105,
                'price': 7850.00,
                'total_seats': 256, 'available_seats': 231,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': 'C14',
                'baggage_info': '25 kg Check-in + 8 kg Cabin',
                'meal_info': 'Complimentary Hot Snacks & Non-Alcoholic Beverages',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Full-Service Dreamliner',
            },

            # BOM → HYD  712 km  — IndiGo midday
            {
                'flight_number': '6E-376',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A320',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'HYD', 'destination_city': 'Hyderabad',
                'destination_airport': 'Rajiv Gandhi International Airport',
                'distance_km': 712,
                'hour_dep': 11, 'min_dep': 20,
                'duration_minutes': 90,
                'price': 6799.00,
                'total_seats': 186, 'available_seats': 164,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T1', 'gate': '23',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Wraps & Cold Drinks',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Quick City Hop',
            },

            # BOM → COK  1,070 km  — Air India Express
            {
                'flight_number': 'IX-421',
                'airline': 'Air India Express',
                'airline_code': 'IX',
                'aircraft_model': 'Boeing 737-800',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'COK', 'destination_city': 'Kochi',
                'destination_airport': 'Cochin International Airport',
                'distance_km': 1070,
                'hour_dep': 10, 'min_dep': 30,
                'duration_minutes': 115,
                'price': 7399.00,
                'total_seats': 189, 'available_seats': 173,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '44',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Express Hot Meals — Pre-book at Discount',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Coastal Express',
            },

            # DEL → BOM  1,148 km  — Akasa budget
            {
                'flight_number': 'QP-1302',
                'airline': 'Akasa Air',
                'airline_code': 'QP',
                'aircraft_model': 'Boeing 737 MAX 8',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM', 'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 7, 'min_dep': 0,
                'duration_minutes': 140,
                'price': 7599.00,
                'total_seats': 189, 'available_seats': 162,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '16',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Cafe Akasa — Dosas, Parathas & Fresh Juice',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Best Value on Busiest Route',
            },

            # DEL → BOM  1,148 km  — IndiGo dawn departure
            {
                'flight_number': '6E-2041',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM', 'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 5, 'min_dep': 55,
                'duration_minutes': 135,
                'price': 8299.00,
                'total_seats': 222, 'available_seats': 207,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '24A',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Hot Breakfast Rolls & Coffee',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'First Flight of the Day',
            },

            # DEL → BOM  1,148 km  — Air India evening  (delayed)
            {
                'flight_number': 'AI-865',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Airbus A350-900',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM', 'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 19, 'min_dep': 45,
                'duration_minutes': 135,
                'price': 9499.00,
                'total_seats': 316, 'available_seats': 289,
                'status': Flight.STATUS_DELAYED,
                'terminal': 'T3', 'gate': '18B',
                'delay_minutes': 25,
                'baggage_info': '25 kg Check-in + 8 kg Cabin',
                'meal_info': 'Complimentary Full-Course Dinner + Dessert',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': '25 kg Generous Baggage Allowance',
            },

            # DEL → BOM  1,148 km  — Vistara premium economy
            {
                'flight_number': 'UK-955',
                'airline': 'Vistara',
                'airline_code': 'UK',
                'aircraft_model': 'Airbus A320neo',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM', 'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 8, 'min_dep': 30,
                'duration_minutes': 130,
                'price': 10499.00,
                'total_seats': 164, 'available_seats': 139,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3', 'gate': '32',
                'baggage_info': '20 kg Check-in + 7 kg Cabin',
                'meal_info': 'Gourmet Hot Meal + Dessert + Welcome Drink',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Premium Full-Service Experience',
            },

            # DEL → BOM  1,148 km  — Vistara noon
            {
                'flight_number': 'UK-961',
                'airline': 'Vistara',
                'airline_code': 'UK',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BOM', 'destination_city': 'Mumbai',
                'destination_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'distance_km': 1148,
                'hour_dep': 12, 'min_dep': 15,
                'duration_minutes': 130,
                'price': 9899.00,
                'total_seats': 196, 'available_seats': 181,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3', 'gate': '33',
                'baggage_info': '20 kg Check-in + 7 kg Cabin',
                'meal_info': 'Gourmet Lunch + Juices Included',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Noon Business Favourite',
            },

            # DEL → HYD  1,261 km  — IndiGo
            {
                'flight_number': '6E-874',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'HYD', 'destination_city': 'Hyderabad',
                'destination_airport': 'Rajiv Gandhi International Airport',
                'distance_km': 1261,
                'hour_dep': 7, 'min_dep': 40,
                'duration_minutes': 155,
                'price': 8799.00,
                'total_seats': 222, 'available_seats': 199,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '28',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Idli Box, Poha & Chai',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Tech City Connect',
            },

            # DEL → BLR  1,740 km  — Air India
            {
                'flight_number': 'AI-801',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 787-8 Dreamliner',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'BLR', 'destination_city': 'Bengaluru',
                'destination_airport': 'Kempegowda International Airport',
                'distance_km': 1740,
                'hour_dep': 9, 'min_dep': 20,
                'duration_minutes': 170,
                'price': 10999.00,
                'total_seats': 256, 'available_seats': 232,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3', 'gate': '21',
                'baggage_info': '25 kg Check-in + 8 kg Cabin',
                'meal_info': 'Full Indian Thali Meal Service',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Delhi to Silicon Valley of India',
            },

            # ══════════════════════════════════════════════════════════════════
            # LONG HAUL DOMESTIC  (1,500 – 2,500 km)   ~₹11,000 – ₹16,000
            # ══════════════════════════════════════════════════════════════════

            # DEL → GOI  1,515 km  — IndiGo
            {
                'flight_number': '6E-5311',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'GOI', 'destination_city': 'Goa',
                'destination_airport': 'Goa International Airport (Dabolim)',
                'distance_km': 1515,
                'hour_dep': 11, 'min_dep': 5,
                'duration_minutes': 160,
                'price': 10850.00,
                'total_seats': 222, 'available_seats': 193,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '36',
                'baggage_info': '15 kg Check-in + 7 kg Cabin',
                'meal_info': 'Buy on Board — Meal Boxes, Snacks & Cold Coffee',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Delhi to Beach Paradise',
            },

            # DEL → COK  2,070 km  — Vistara
            {
                'flight_number': 'UK-891',
                'airline': 'Vistara',
                'airline_code': 'UK',
                'aircraft_model': 'Airbus A321neo',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'COK', 'destination_city': 'Kochi',
                'destination_airport': 'Cochin International Airport',
                'distance_km': 2070,
                'hour_dep': 6, 'min_dep': 50,
                'duration_minutes': 215,
                'price': 13850.00,
                'total_seats': 196, 'available_seats': 174,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3', 'gate': '41',
                'baggage_info': '20 kg Check-in + 7 kg Cabin',
                'meal_info': 'Full Kerala Sadya Breakfast Thali',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'North to South Non-stop',
            },

            # ══════════════════════════════════════════════════════════════════
            # INTERNATIONAL  (> 2,000 km)   ~₹32,000 – ₹55,000
            # ══════════════════════════════════════════════════════════════════

            # BOM → DXB  1,930 km  — Emirates wide-body morning
            {
                'flight_number': 'EK-507',
                'airline': 'Emirates',
                'airline_code': 'EK',
                'aircraft_model': 'Airbus A380-800',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'DXB', 'destination_city': 'Dubai',
                'destination_airport': 'Dubai International Airport (Terminal 3)',
                'distance_km': 1930,
                'hour_dep': 2, 'min_dep': 45,
                'duration_minutes': 215,
                'price': 36500.00,
                'total_seats': 517, 'available_seats': 491,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '54',
                'baggage_info': '30 kg Check-in + 7 kg Cabin',
                'meal_info': 'Multi-Course Gourmet Meal + Full Bar Service',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Emirates A380 Flagship',
            },

            # BOM → DXB  1,930 km  — Air India evening
            {
                'flight_number': 'AI-131',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 777-300ER',
                'origin_code': 'BOM', 'origin_city': 'Mumbai',
                'origin_airport': 'Chhatrapati Shivaji Maharaj International Airport',
                'destination_code': 'DXB', 'destination_city': 'Dubai',
                'destination_airport': 'Dubai International Airport (Terminal 3)',
                'distance_km': 1930,
                'hour_dep': 22, 'min_dep': 20,
                'duration_minutes': 215,
                'price': 32500.00,
                'total_seats': 342, 'available_seats': 318,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '61',
                'baggage_info': '30 kg Check-in + 8 kg Cabin',
                'meal_info': 'Full Indian-International Dinner + Dessert',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Overnight to Dubai',
            },

            # DEL → SIN  4,150 km  — Singapore Airlines
            {
                'flight_number': 'SQ-403',
                'airline': 'Singapore Airlines',
                'airline_code': 'SQ',
                'aircraft_model': 'Boeing 787-10 Dreamliner',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'SIN', 'destination_city': 'Singapore',
                'destination_airport': 'Singapore Changi Airport (Terminal 3)',
                'distance_km': 4150,
                'hour_dep': 9, 'min_dep': 45,
                'duration_minutes': 335,
                'price': 46800.00,
                'total_seats': 337, 'available_seats': 311,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3', 'gate': '22',
                'baggage_info': '30 kg Check-in + 7 kg Cabin',
                'meal_info': 'World Gourmet Cuisine + Premium Bar Included',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': "World's Best Airline 2024",
            },

            # DEL → LHR  6,730 km  — Air India wide-body
            {
                'flight_number': 'AI-111',
                'airline': 'Air India',
                'airline_code': 'AI',
                'aircraft_model': 'Boeing 787-9 Dreamliner',
                'origin_code': 'DEL', 'origin_city': 'New Delhi',
                'origin_airport': 'Indira Gandhi International Airport',
                'destination_code': 'LHR', 'destination_city': 'London',
                'destination_airport': 'London Heathrow Airport (Terminal 4)',
                'distance_km': 6730,
                'hour_dep': 14, 'min_dep': 20,
                'duration_minutes': 540,
                'price': 54800.00,
                'total_seats': 256, 'available_seats': 228,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T3', 'gate': '24',
                'baggage_info': '30 kg Check-in + 8 kg Cabin',
                'meal_info': 'Full Multi-Course Meal + Dessert + In-flight Entertainment',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'Delhi to London Non-stop',
            },

            # BLR → SIN  3,780 km  — IndiGo long-haul
            {
                'flight_number': '6E-56',
                'airline': 'IndiGo',
                'airline_code': '6E',
                'aircraft_model': 'Airbus A321XLR',
                'origin_code': 'BLR', 'origin_city': 'Bengaluru',
                'origin_airport': 'Kempegowda International Airport',
                'destination_code': 'SIN', 'destination_city': 'Singapore',
                'destination_airport': 'Singapore Changi Airport (Terminal 2)',
                'distance_km': 3780,
                'hour_dep': 23, 'min_dep': 50,
                'duration_minutes': 345,
                'price': 38900.00,
                'total_seats': 220, 'available_seats': 198,
                'status': Flight.STATUS_ON_TIME,
                'terminal': 'T2', 'gate': '56',
                'baggage_info': '20 kg Check-in + 7 kg Cabin',
                'meal_info': 'Full In-flight Meal Service Included',
                'refundable': True, 'stops': 'Non-stop',
                'flight_tag': 'South India to South Asia Direct',
            },
        ]
        # fmt: on

        created_flights = []
        for tf in tpl:
            dep = base.replace(hour=tf['hour_dep'], minute=tf['min_dep'])
            if dep <= now:
                dep += timedelta(days=1)
            arr = dep + timedelta(minutes=tf['duration_minutes'])

            fields = {k: v for k, v in tf.items() if k not in ('hour_dep', 'min_dep')}
            fields['departure_time'] = dep
            fields['arrival_time'] = arr

            obj, _ = Flight.objects.update_or_create(
                flight_number=tf['flight_number'],
                defaults=fields,
            )
            created_flights.append(obj)

        self.stdout.write(self.style.SUCCESS(f'  Seeded {len(created_flights)} flights.'))

        # ── 6. Sample Bookings ───────────────────────────────────────────────
        # Rahul's confirmed booking: Akasa DEL→BOM
        akasa_del_bom = next((f for f in created_flights if f.flight_number == 'QP-1302'), None)
        if akasa_del_bom:
            Booking.objects.update_or_create(
                booking_reference='PNR9482X',
                defaults={
                    'user': rahul,
                    'flight': akasa_del_bom,
                    'passenger_name': 'Rahul Sharma',
                    'passenger_email': 'rahul.sharma@gmail.com',
                    'passenger_phone': '+91 98201 98765',
                    'seat_numbers': '14A, 14B',
                    'seat_count': 2,
                    'cabin_class': Booking.CABIN_ECONOMY,
                    'total_price': 15198.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'UPI — Google Pay',
                    'payment_transaction_id': 'UPI82940491GY',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

        # John's confirmed business class: Vistara DEL→BOM
        vistara_del_bom = next((f for f in created_flights if f.flight_number == 'UK-955'), None)
        if vistara_del_bom:
            Booking.objects.update_or_create(
                booking_reference='PNR3174K',
                defaults={
                    'user': john,
                    'flight': vistara_del_bom,
                    'passenger_name': 'John Doe',
                    'passenger_email': 'john.doe@gmail.com',
                    'passenger_phone': '+91 98765 43210',
                    'seat_numbers': '3C',
                    'seat_count': 1,
                    'cabin_class': Booking.CABIN_BUSINESS,
                    'total_price': 23098.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'RuPay Platinum Card',
                    'payment_transaction_id': 'TXN-RUPAY-00128847',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

        # Ananya's Emirates BOM→DXB booking
        emirates_bom_dxb = next((f for f in created_flights if f.flight_number == 'EK-507'), None)
        if emirates_bom_dxb:
            Booking.objects.update_or_create(
                booking_reference='PNR7291E',
                defaults={
                    'user': ananya,
                    'flight': emirates_bom_dxb,
                    'passenger_name': 'Ananya Singh',
                    'passenger_email': 'ananya.singh@gmail.com',
                    'passenger_phone': '+91 97654 32198',
                    'seat_numbers': '28A',
                    'seat_count': 1,
                    'cabin_class': Booking.CABIN_ECONOMY,
                    'total_price': 36500.00,
                    'payment_status': Booking.PAYMENT_COMPLETED,
                    'payment_method': 'NetBanking — HDFC Bank',
                    'payment_transaction_id': 'TXN-HDFC-20241129',
                    'booking_status': Booking.STATUS_CONFIRMED,
                }
            )

        self.stdout.write(self.style.SUCCESS('  Sample bookings seeded.'))
        self.stdout.write(self.style.SUCCESS('\nAirBooking India database seeded successfully!'))
        self.stdout.write('')
        self.stdout.write('  Test Accounts:')
        self.stdout.write('  admin          / adminpassword123  (Admin)')
        self.stdout.write('  rahul_sharma   / userpassword123   (Approved Passenger)')
        self.stdout.write('  john_doe       / userpassword123   (Approved Passenger)')
        self.stdout.write('  ananya_singh   / userpassword123   (Approved Passenger)')
        self.stdout.write('  priya_patel    / userpassword123   (Pending Approval)')
        self.stdout.write('  arjun_nair     / userpassword123   (Pending Approval)')
        self.stdout.write('  banned_user    / userpassword123   (Rejected)')
