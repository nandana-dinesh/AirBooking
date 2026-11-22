import React, { useState, useEffect } from 'react';
import {
  Luggage,
  Calendar,
  Clock,
  MapPin,
  Plane,
  QrCode,
  Radio,
  XCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Printer,
  ChevronRight,
} from 'lucide-react';
import api from '../api/client';
import { BoardingPassModal } from '../components/BoardingPassModal';
import { LiveTelemetryModal } from '../components/LiveTelemetryModal';

export const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'

  const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);
  const [activeTelemetryFlightId, setActiveTelemetryFlightId] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'upcoming' || filter === 'past') {
        params.timeframe = filter;
      } else if (filter === 'cancelled') {
        params.status = 'CANCELLED';
      }

      const res = await api.get('/bookings/', { params });
      const tripList = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setTrips(tripList);
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [filter]);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    try {
      setIsCancelling(true);
      const res = await api.post(`/bookings/${cancelModalBooking.id}/cancel/`);
      setMessage(`Booking ${cancelModalBooking.booking_reference} cancelled successfully. Seats refunded.`);
      setCancelModalBooking(null);
      setIsCancelling(false);
      fetchTrips();
    } catch (err) {
      console.error('Cancellation failed', err);
      setIsCancelling(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 mb-1">
            <Luggage className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Trip Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Booked Flights & Trips
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your active itineraries, download electronic boarding passes, and track live flights.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'past' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'cancelled' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage('')} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Trips List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading your itineraries...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <Luggage className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No bookings found in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Ready for your next voyage? Search available flights across major airlines now.
            </p>
          </div>
          <a
            href="/flights"
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-sky-700 transition"
          >
            Find Flights
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((booking) => {
            const flight = booking.flight || {};
            const isCancelled = booking.booking_status === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition overflow-hidden ${
                  isCancelled ? 'opacity-70 bg-slate-50/50' : ''
                }`}
              >
                {/* Top strip */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      PNR: {booking.booking_reference}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">
                      Booked on {formatDate(booking.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isCancelled
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      {booking.cabin_class}
                    </span>
                  </div>
                </div>

                {/* Body Row */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Airline & Number */}
                  <div className="min-w-[130px]">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {flight.flight_number}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{flight.airline}</h4>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {flight.aircraft_model}
                    </span>
                  </div>

                  {/* Route & Times */}
                  <div className="flex-1 flex items-center justify-between max-w-md">
                    <div>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                        {formatTime(flight.departure_time)}
                      </span>
                      <span className="text-xs font-bold text-slate-700 block">
                        {flight.origin_code}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[110px]">
                        {formatDate(flight.departure_time)}
                      </span>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <span className="text-[10px] font-bold text-slate-400 mb-1">
                        {flight.duration_minutes ? `${Math.floor(flight.duration_minutes / 60)}h ${flight.duration_minutes % 60}m` : 'Direct'}
                      </span>
                      <div className="flex items-center space-x-1 w-20 sm:w-28">
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                        <Plane className="w-3.5 h-3.5 text-sky-600 rotate-90 shrink-0" />
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">Non-stop</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                        {formatTime(flight.arrival_time)}
                      </span>
                      <span className="text-xs font-bold text-slate-700 block">
                        {flight.destination_code}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[110px] ml-auto">
                        {formatDate(flight.arrival_time)}
                      </span>
                    </div>
                  </div>

                  {/* Passenger & Seat details */}
                  <div className="text-xs space-y-1 min-w-[140px] border-l border-slate-100 pl-4">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Passenger</span>
                      <span className="font-bold text-slate-800">{booking.passenger_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Seats</span>
                      <span className="font-bold text-sky-700 font-mono">{booking.seat_numbers}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Fare Paid</span>
                      <span className="text-lg font-black text-slate-900 font-mono">
                        ₹{Number(booking.total_price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForPass(booking)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                        title="Boarding Pass"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Boarding Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTelemetryFlightId(flight.id)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-emerald-600 text-xs font-bold rounded-xl transition"
                        title="Live Radar Telemetry"
                      >
                        <Radio className="w-4 h-4" />
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(booking)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition"
                          title="Cancel Booking"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Boarding Pass Modal */}
      <BoardingPassModal
        isOpen={Boolean(selectedBookingForPass)}
        onClose={() => setSelectedBookingForPass(null)}
        booking={selectedBookingForPass}
      />

      {/* Live Telemetry Modal */}
      <LiveTelemetryModal
        isOpen={Boolean(activeTelemetryFlightId)}
        onClose={() => setActiveTelemetryFlightId(null)}
        flightId={activeTelemetryFlightId}
      />

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cancel Flight Reservation?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you wish to cancel booking{' '}
                <span className="font-mono font-bold text-slate-800">
                  {cancelModalBooking.booking_reference}
                </span>
                ? Reserved seat(s) will be returned to the airline inventory and the payment will be marked refunded.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 text-xs hover:bg-slate-50 transition"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelBooking}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
