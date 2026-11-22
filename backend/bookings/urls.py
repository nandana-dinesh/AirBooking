from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    BookingCancelView,
    AdminStatsView,
)

urlpatterns = [
    # Booking endpoints
    path('bookings/', BookingListCreateView.as_view(), name='bookings-list-create'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),

    # Admin stats endpoint
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]
