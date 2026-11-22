from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import Booking
from .serializers import BookingCreateSerializer, BookingDetailSerializer
from flights.models import Flight
from users.permissions import IsAdminUserOrStaff

User = get_user_model()

class BookingListCreateView(generics.ListCreateAPIView):
    """
    POST /api/bookings/ -> Reserve seats & create booking with simulated payment.
    GET /api/bookings/ -> Retrieve the current user's bookings ("My Trips").
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingDetailSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.filter(user=user).select_related('flight', 'user')

        booking_status = self.request.query_params.get('status')
        if booking_status:
            queryset = queryset.filter(booking_status=booking_status)

        timeframe = self.request.query_params.get('timeframe')
        now = timezone.now()
        if timeframe == 'upcoming':
            queryset = queryset.filter(flight__departure_time__gte=now)
        elif timeframe == 'past':
            queryset = queryset.filter(flight__departure_time__lt=now)

        return queryset.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(
            {
                "message": "Flight booked and payment processed successfully!",
                "booking": BookingDetailSerializer(booking).data
            },
            status=status.HTTP_201_CREATED
        )


class BookingDetailView(generics.RetrieveAPIView):
    """
    GET /api/bookings/{id}/ -> Retrieve specific booking details.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingDetailSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        user = self.request.user
        if user.is_staff or getattr(user, 'role', '') == 'admin' or user.is_superuser:
            return get_object_or_404(Booking.objects.select_related('flight', 'user'), pk=pk)
        return get_object_or_404(Booking.objects.select_related('flight', 'user'), pk=pk, user=user)


class BookingCancelView(APIView):
    """
    POST /api/bookings/{id}/cancel/ -> Cancel an existing booking and refund seats.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', '') == 'admin' or user.is_superuser:
            booking = get_object_or_404(Booking, pk=pk)
        else:
            booking = get_object_or_404(Booking, pk=pk, user=user)

        if booking.booking_status == Booking.STATUS_CANCELLED:
            return Response(
                {"error": "This booking is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            booking.booking_status = Booking.STATUS_CANCELLED
            booking.payment_status = Booking.PAYMENT_REFUNDED
            booking.save(update_fields=['booking_status', 'payment_status', 'updated_at'])

            flight = Flight.objects.select_for_update().get(id=booking.flight.id)
            flight.available_seats = min(flight.total_seats, flight.available_seats + booking.seat_count)
            flight.save(update_fields=['available_seats'])

        return Response(
            {
                "message": f"Booking {booking.booking_reference} has been cancelled successfully. Refund processed.",
                "booking": BookingDetailSerializer(booking).data
            },
            status=status.HTTP_200_OK
        )


class AdminStatsView(APIView):
    """
    GET /api/admin/stats/ -> Comprehensive overview of application statistics for admin dashboard.
    """
    permission_classes = [IsAdminUserOrStaff]

    def get(self, request):
        total_bookings = Booking.objects.count()
        confirmed_bookings = Booking.objects.filter(booking_status=Booking.STATUS_CONFIRMED).count()
        total_revenue = Booking.objects.filter(
            booking_status=Booking.STATUS_CONFIRMED,
            payment_status=Booking.PAYMENT_COMPLETED
        ).aggregate(Sum('total_price'))['total_price__sum'] or 0

        pending_users_count = User.objects.filter(approval_status=User.STATUS_PENDING).count()
        approved_users_count = User.objects.filter(approval_status=User.STATUS_APPROVED).count()
        total_flights = Flight.objects.count()

        # Popular routes
        popular_routes = (
            Booking.objects.filter(booking_status=Booking.STATUS_CONFIRMED)
            .values('flight__origin_code', 'flight__destination_code')
            .annotate(booking_count=Count('id'), total_passengers=Sum('seat_count'))
            .order_by('-booking_count')[:5]
        )

        # Recent bookings
        recent_bookings = BookingDetailSerializer(
            Booking.objects.select_related('flight', 'user').order_by('-created_at')[:8],
            many=True
        ).data

        return Response({
            "metrics": {
                "total_bookings": total_bookings,
                "confirmed_bookings": confirmed_bookings,
                "total_revenue": float(total_revenue),
                "pending_users_count": pending_users_count,
                "approved_users_count": approved_users_count,
                "total_flights": total_flights,
            },
            "popular_routes": popular_routes,
            "recent_bookings": recent_bookings,
        }, status=status.HTTP_200_OK)
