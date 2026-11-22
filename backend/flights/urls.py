from django.urls import path
from .views import (
    FlightSearchView,
    FlightDetailView,
    FlightLiveStatusView,
    AdminFlightListCreateView,
    AdminFlightDetailView,
    AdminFlightStatusUpdateView,
)

urlpatterns = [
    # Flight endpoints
    path('flights/search/', FlightSearchView.as_view(), name='flights-search'),
    path('flights/<int:pk>/', FlightDetailView.as_view(), name='flight-detail'),
    path('flights/<int:pk>/live-status/', FlightLiveStatusView.as_view(), name='flight-live-status'),

    # Admin flight endpoints
    path('admin/flights/', AdminFlightListCreateView.as_view(), name='admin-flights-list-create'),
    path('admin/flights/<int:pk>/', AdminFlightDetailView.as_view(), name='admin-flight-detail'),
    path('admin/flights/<int:pk>/status/', AdminFlightStatusUpdateView.as_view(), name='admin-flight-status-update'),
]
