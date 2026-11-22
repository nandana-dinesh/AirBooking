import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plane,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Users,
  ChevronRight,
  ShieldCheck,
  Armchair,
  CreditCard,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SeatMapModal } from '../components/SeatMapModal';
import { PaymentModal } from '../components/PaymentModal';
import { BoardingPassModal } from '../components/BoardingPassModal';
import { LiveTelemetryModal } from '../components/LiveTelemetryModal';

export const FlightSearchPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Search filter states
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [airline, setAirline] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState('departure_time');

  // Flight data states
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking flow states
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatCount, setSeatCount] = useState(1);
  const [cabinClass, setCabinClass] = useState('ECONOMY');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState(
    user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.username || '')
  );
  const [passengerEmail, setPassengerEmail] = useState(user?.email || '');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone_number || '+91 98765 43210');

  // Modals state
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [activeTelemetryFlightId, setActiveTelemetryFlightId] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Fetch flights
  const fetchFlights = async () => {
    try {
      setLoading(true);
      const params = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (date) params.date = date;
      if (airline) params.airline = airline;
      if (statusFilter) params.status = statusFilter;
      if (maxPrice < 30000) params.max_price = maxPrice;
      if (sortBy) params.ordering = sortBy;

      const res = await api.get('/flights/search/', { params });
      const flightResults = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setFlights(flightResults);
    } catch (err) {
      console.error('Failed to load flights', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [origin, destination, date, airline, statusFilter, maxPrice, sortBy]);

  useEffect(() => {
    if (user) {
      if (!passengerName) setPassengerName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username);
      if (!passengerEmail) setPassengerEmail(user.email || '');
      if (user.phone_number) setPassengerPhone(user.phone_number);
    }
  }, [user]);

  const handleStartBooking = (flight) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSelectedFlight(flight);
    setSelectedSeats([]);
    setSeatCount(1);
    setBookingError('');
  };

  const calculateTotalPrice = () => {
    if (!selectedFlight) return 0;
    const base = Number(selectedFlight.price);
    let multiplier = 1.0;
    if (cabinClass === 'BUSINESS') multiplier = 2.2;
    if (cabinClass === 'FIRST') multiplier = 3.5;
    return Number((base * seatCount * multiplier).toFixed(2));
  };

  const handleProceedToPayment = () => {
    if (!passengerName.trim() || !passengerEmail.trim()) {
      setBookingError('Please enter passenger full name and notification email.');
      return;
    }
    if (selectedSeats.length !== seatCount) {
      setBookingError(`Please select exactly ${seatCount} seat${seatCount > 1 ? 's' : ''} on the aircraft seat map.`);
      return;
    }
    setBookingError('');
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = async (paymentDetails) => {
    try {
      setIsBookingSubmitting(true);
      const payload = {
        flight_id: selectedFlight.id,
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        passenger_phone: passengerPhone,
        seat_numbers: selectedSeats.join(', '),
        seat_count: seatCount,
        cabin_class: cabinClass,
        card_number: paymentDetails.card_number,
        card_expiry: paymentDetails.card_expiry,
        card_cvv: paymentDetails.card_cvv,
      };

      const res = await api.post('/bookings/', payload);
      setIsBookingSubmitting(false);
      setIsPaymentOpen(false);

      const newBooking = res.data.booking;
      setConfirmedBooking(newBooking);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsBoardingPassOpen(true);
      fetchFlights();
      setSelectedFlight(null);
    } catch (err) {
      setIsBookingSubmitting(false);
      setIsPaymentOpen(false);
      const msg =
        err.response?.data?.seat_numbers ||
        err.response?.data?.seats ||
        err.response?.data?.detail ||
        'Booking transaction could not be completed.';
      setBookingError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 uppercase tracking-widest inline-block mb-3">
            Domestic & International Flights
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Book Flights in India with Real-Time Seat Availability
          </h1>
          <p className="text-sky-100 text-sm mt-2">
            Compare fares on IndiGo, Air India, Vistara, and Akasa Air. Reserve your seat and pay via UPI, RuPay, or Cards.
          </p>
        </div>

        {/* Search Bar Inputs */}
        <div className="relative z-10 mt-6 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-sky-100 uppercase mb-1">From (City or Code)</label>
            <div className="relative">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. DEL, New Delhi, BOM, BLR"
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-sky-100 uppercase mb-1">To (Destination)</label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. BOM, Mumbai, GOI, COK"
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-sky-100 uppercase mb-1">Date of Travel</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-400 text-slate-700"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchFlights}
              className="w-full py-2 px-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition"
            >
              <Search className="w-4 h-4" />
              <span>Search Flights</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Filter className="w-4 h-4 text-sky-600" />
              <span>Filter Flights</span>
            </div>
            <button
              onClick={() => {
                setOrigin('');
                setDestination('');
                setDate('');
                setAirline('');
                setStatusFilter('');
                setMaxPrice(30000);
              }}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-700"
            >
              Reset
            </button>
          </div>

          {/* Max Price Slider in INR */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Max Fare</span>
              <span className="text-sky-700 font-mono font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="30000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>

          {/* Indian Airline Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Preferred Airline</label>
            <select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="">All Airlines</option>
              <option value="IndiGo">IndiGo</option>
              <option value="Air India">Air India</option>
              <option value="Vistara">Vistara</option>
              <option value="Akasa Air">Akasa Air</option>
              <option value="Air India Express">Air India Express</option>
              <option value="Emirates">Emirates</option>
              <option value="Singapore Airlines">Singapore Airlines</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Flight Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="ON_TIME">On-Time</option>
              <option value="BOARDING">Boarding</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="departure_time">Departure (Earliest first)</option>
              <option value="price">Price (Lowest first)</option>
              <option value="-price">Price (Highest first)</option>
              <option value="duration_minutes">Duration (Shortest first)</option>
            </select>
          </div>
        </aside>

        {/* Flights List / Booking Drawer */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-slate-700">
              Showing <span className="text-sky-700 font-extrabold">{flights.length}</span> Scheduled Flights
            </span>
            <button
              onClick={fetchFlights}
              className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-sky-600"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh schedules</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
              <p className="text-sm text-slate-500 font-medium">Scanning Indian aviation routes...</p>
            </div>
          ) : flights.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Plane className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No flights matched your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for major Indian hubs like DEL, BOM, BLR, GOI, HYD, or COK.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => {
                const isSelected = selectedFlight?.id === flight.id;
                const statusColor =
                  flight.status === 'ON_TIME'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : flight.status === 'DELAYED'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : flight.status === 'BOARDING'
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : 'bg-slate-100 text-slate-800 border-slate-200';

                return (
                  <div
                    key={flight.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'border-sky-500 shadow-lg ring-2 ring-sky-500/20'
                        : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Flight Card Main Row */}
                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Left: Airline info */}
                      <div className="space-y-1 min-w-[140px]">
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          {flight.flight_number}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">{flight.airline}</h4>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {flight.aircraft_model}
                        </span>
                        <div className="pt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}
                          >
                            {flight.status === 'DELAYED' && flight.delay_minutes > 0
                              ? `Delayed (+${flight.delay_minutes}m)`
                              : flight.status}
                          </span>
                        </div>
                      </div>

                      {/* Center: Route & Times */}
                      <div className="flex-1 flex items-center justify-between max-w-md px-2">
                        {/* Origin */}
                        <div>
                          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                            {formatTime(flight.departure_time)}
                          </span>
                          <span className="text-xs font-bold text-slate-600 block">
                            {flight.origin_code}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[100px]">
                            {flight.origin_city}
                          </span>
                        </div>

                        {/* Mid indicator */}
                        <div className="flex flex-col items-center px-3">
                          <span className="text-[10px] font-bold text-slate-400 mb-1">
                            {Math.floor(flight.duration_minutes / 60)}h {flight.duration_minutes % 60}m
                          </span>
                          <div className="flex items-center space-x-1 w-20 sm:w-28">
                            <div className="h-0.5 flex-1 bg-slate-200"></div>
                            <Plane className="w-3.5 h-3.5 text-sky-600 rotate-90 shrink-0" />
                            <div className="h-0.5 flex-1 bg-slate-200"></div>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold mt-1">Non-stop</span>
                        </div>

                        {/* Destination */}
                        <div className="text-right">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                            {formatTime(flight.arrival_time)}
                          </span>
                          <span className="text-xs font-bold text-slate-600 block">
                            {flight.destination_code}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[100px] ml-auto">
                            {flight.destination_city}
                          </span>
                        </div>
                      </div>

                      {/* Right: Pricing & CTA */}
                      <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 min-w-[160px]">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Fare from</span>
                          <span className="text-2xl font-black text-slate-900 font-mono">
                            ₹{Number(flight.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {flight.available_seats} seats remaining
                          </span>
                        </div>

                        <div className="flex space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setActiveTelemetryFlightId(flight.id)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                            title="Live Radar Telemetry"
                          >
                            <Radio className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartBooking(flight)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                              isSelected
                                ? 'bg-sky-700 text-white shadow-xs'
                                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20'
                            }`}
                          >
                            <span>{isSelected ? 'Selecting' : 'Book'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Booking Drawer */}
                    {isSelected && (
                      <div className="bg-slate-50 border-t border-slate-200 p-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-sky-600" />
                            <span>Passenger Details & Aircraft Seat Picker</span>
                          </h4>
                          <button
                            onClick={() => setSelectedFlight(null)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>

                        {bookingError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                            <span>{bookingError}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                              Travel Class
                            </label>
                            <select
                              value={cabinClass}
                              onChange={(e) => setCabinClass(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                            >
                              <option value="ECONOMY">Economy Class (Standard)</option>
                              <option value="BUSINESS">Business Class (2.2x)</option>
                              <option value="FIRST">First Class (3.5x)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                              Passengers Count
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={Math.min(6, flight.available_seats)}
                              value={seatCount}
                              onChange={(e) => {
                                const count = Math.max(1, parseInt(e.target.value) || 1);
                                setSeatCount(count);
                                setSelectedSeats([]);
                              }}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                              Aircraft Seat Map
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsSeatMapOpen(true)}
                              className="w-full p-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-between transition"
                            >
                              <div className="flex items-center space-x-1.5">
                                <Armchair className="w-4 h-4 text-sky-600" />
                                <span>
                                  {selectedSeats.length > 0
                                    ? `Seats: ${selectedSeats.join(', ')}`
                                    : `Choose ${seatCount} Seat${seatCount > 1 ? 's' : ''}`}
                                </span>
                              </div>
                              <span className="text-[10px] bg-sky-200 px-1.5 py-0.5 rounded-md font-mono">
                                Seat Map
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Passenger Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                              Full Name (As per Govt. ID)
                            </label>
                            <input
                              type="text"
                              required
                              value={passengerName}
                              onChange={(e) => setPassengerName(e.target.value)}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={passengerEmail}
                              onChange={(e) => setPassengerEmail(e.target.value)}
                              placeholder="rahul@example.in"
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                              Mobile Number (for SMS & WhatsApp alerts)
                            </label>
                            <input
                              type="text"
                              value={passengerPhone}
                              onChange={(e) => setPassengerPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                            />
                          </div>
                        </div>

                        {/* Bottom Summary & Confirm */}
                        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <span className="text-xs text-slate-500 block">Total Payable Amount</span>
                            <span className="text-2xl font-black text-sky-800 font-mono">
                              ₹{calculateTotalPrice().toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Inclusive of all airport taxes and passenger service fees
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleProceedToPayment}
                            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Continue to Payment (UPI / RuPay / Cards)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Interactive Seat Map Modal */}
      {selectedFlight && (
        <SeatMapModal
          isOpen={isSeatMapOpen}
          onClose={() => setIsSeatMapOpen(false)}
          occupiedSeats={selectedFlight.occupied_seats || []}
          seatCount={seatCount}
          selectedSeats={selectedSeats}
          onConfirmSeats={(seats) => setSelectedSeats(seats)}
          cabinClass={cabinClass}
        />
      )}

      {/* Simulated Payment Modal */}
      {selectedFlight && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          bookingDetails={{
            flight: selectedFlight,
            passenger_name: passengerName,
            passenger_email: passengerEmail,
            seat_numbers: selectedSeats.join(', '),
            seat_count: seatCount,
            cabin_class: cabinClass,
            total_price: calculateTotalPrice(),
          }}
          onConfirmPayment={handleConfirmPayment}
          isProcessing={isBookingSubmitting}
        />
      )}

      {/* Boarding Pass Confirmation Modal */}
      <BoardingPassModal
        isOpen={isBoardingPassOpen}
        onClose={() => setIsBoardingPassOpen(false)}
        booking={confirmedBooking}
      />

      {/* Live Telemetry Modal */}
      <LiveTelemetryModal
        isOpen={Boolean(activeTelemetryFlightId)}
        onClose={() => setActiveTelemetryFlightId(null)}
        flightId={activeTelemetryFlightId}
      />
    </div>
  );
};
