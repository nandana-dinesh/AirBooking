from datetime import datetime
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Flight
from .serializers import (
    FlightSerializer,
    FlightCreateUpdateSerializer,
    FlightStatusUpdateSerializer
)
from .services.flight_tracker import calculate_live_flight_telemetry
from users.permissions import IsAdminUserOrStaff

class FlightSearchView(generics.ListAPIView):
    """
    Search and filter flights based on:
    - origin (code, city, or airport name)
    - destination (code, city, or airport name)
    - date (YYYY-MM-DD)
    - airline
    - status
    - min_price, max_price
    - ordering (price, -price, departure_time, duration_minutes)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FlightSerializer

    def get_queryset(self):
        queryset = Flight.objects.all()

        origin = self.request.query_params.get('origin')
        if origin:
            origin = origin.strip()
            queryset = queryset.filter(
                Q(origin_code__iexact=origin) |
                Q(origin_city__icontains=origin) |
                Q(origin_airport__icontains=origin)
            )

        destination = self.request.query_params.get('destination')
        if destination:
            destination = destination.strip()
            queryset = queryset.filter(
                Q(destination_code__iexact=destination) |
                Q(destination_city__icontains=destination) |
                Q(destination_airport__icontains=destination)
            )

        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                date_val = datetime.strptime(date_str, '%Y-%m-%d').date()
                queryset = queryset.filter(departure_time__date=date_val)
            except ValueError:
                pass

        airline = self.request.query_params.get('airline')
        if airline:
            queryset = queryset.filter(airline__icontains=airline)

        flight_status = self.request.query_params.get('status')
        if flight_status:
            queryset = queryset.filter(status=flight_status)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        available_only = self.request.query_params.get('available_only')
        if available_only in ['true', 'True', '1']:
            queryset = queryset.filter(available_seats__gt=0)

        ordering = self.request.query_params.get('ordering', 'departure_time')
        if ordering in ['price', '-price', 'departure_time', '-departure_time', 'duration_minutes']:
            queryset = queryset.order_by(ordering)

        return queryset


class FlightDetailView(generics.RetrieveAPIView):
    """
    Retrieve flight details along with seat occupancy map.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FlightSerializer
    queryset = Flight.objects.all()


class FlightLiveStatusView(APIView):
    """
    Real-time flight status display integrating with OpenSky Network telemetry.
    Returns calculated 3D coordinates, progress %, altitude, speed, and real-time flight phase.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        flight = get_object_or_404(Flight, pk=pk)
        telemetry_data = calculate_live_flight_telemetry(flight)
        return Response(telemetry_data, status=status.HTTP_200_OK)


# Admin Flight Endpoints
class AdminFlightListCreateView(generics.ListCreateAPIView):
    """
    Admin endpoint to view all flights or create a new flight.
    """
    permission_classes = [IsAdminUserOrStaff]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FlightCreateUpdateSerializer
        return FlightSerializer

    def get_queryset(self):
        return Flight.objects.all().order_by('-created_at')


class AdminFlightDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin endpoint to view, edit, or delete a flight.
    """
    permission_classes = [IsAdminUserOrStaff]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return FlightCreateUpdateSerializer
        return FlightSerializer

    queryset = Flight.objects.all()


class AdminFlightStatusUpdateView(APIView):
    """
    Admin endpoint to update flight status (e.g., On-Time, Delayed, Cancelled).
    PUT /api/admin/flights/{id}/status/
    """
    permission_classes = [IsAdminUserOrStaff]

    def put(self, request, pk):
        flight = get_object_or_404(Flight, pk=pk)
        serializer = FlightStatusUpdateSerializer(flight, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": f"Flight {flight.flight_number} status updated to {flight.status}.",
                "flight": FlightSerializer(flight).data
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):
        return self.put(request, pk)
