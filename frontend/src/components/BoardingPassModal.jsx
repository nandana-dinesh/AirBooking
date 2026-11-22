import React from 'react';
import { X, Printer, Plane, QrCode, CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';

export const BoardingPassModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const flight = booking.flight || {};

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:p-0">
        {/* Modal Controls (Hidden in print) */}
        <div className="bg-slate-900 px-6 py-3 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Plane className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sm">Official Electronic Boarding Pass</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Ticket Container */}
        <div className="p-6 md:p-8 bg-slate-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            {/* Top Brand Banner */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 block">
                  Airline Boarding Document
                </span>
                <span className="text-xl font-black">{flight.airline || 'AirBooking Airways'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 block">
                  Electronic Ticket PNR
                </span>
                <span className="text-lg font-mono font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
                  {booking.booking_reference}
                </span>
              </div>
            </div>

            {/* Flight Route Details */}
            <div className="p-6 border-b border-dashed border-slate-300">
              <div className="flex items-center justify-between mb-6">
                {/* Origin */}
                <div>
                  <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {flight.origin_code}
                  </span>
                  <span className="block text-sm font-semibold text-slate-600">
                    {flight.origin_city}
                  </span>
                  <span className="block text-[11px] text-slate-400 max-w-[150px] truncate">
                    {flight.origin_airport}
                  </span>
                </div>

                {/* Plane Center Graphic */}
                <div className="flex flex-col items-center px-4">
                  <span className="text-[11px] font-bold text-sky-600 mb-1">
                    {flight.duration_minutes ? `${Math.floor(flight.duration_minutes / 60)}h ${flight.duration_minutes % 60}m` : 'Direct'}
                  </span>
                  <div className="flex items-center space-x-1.5 w-24 md:w-36">
                    <div className="h-0.5 flex-1 bg-sky-200"></div>
                    <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <Plane className="w-3.5 h-3.5 rotate-90" />
                    </div>
                    <div className="h-0.5 flex-1 bg-sky-200"></div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 mt-1">Non-Stop</span>
                </div>

                {/* Destination */}
                <div className="text-right">
                  <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {flight.destination_code}
                  </span>
                  <span className="block text-sm font-semibold text-slate-600">
                    {flight.destination_city}
                  </span>
                  <span className="block text-[11px] text-slate-400 max-w-[150px] truncate ml-auto">
                    {flight.destination_airport}
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Passenger</span>
                  <span className="font-bold text-slate-800 text-sm">{booking.passenger_name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Flight No.</span>
                  <span className="font-bold text-slate-800 text-sm">{flight.flight_number}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Departure Date</span>
                  <span className="font-bold text-slate-800 text-sm">{formatDate(flight.departure_time)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Dep. Time</span>
                  <span className="font-bold text-sky-700 text-sm">{formatTime(flight.departure_time)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Assigned Seats</span>
                  <span className="font-bold text-sky-700 text-base">{booking.seat_numbers}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Cabin Class</span>
                  <span className="font-bold text-slate-800">{booking.cabin_class || 'Economy'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Terminal / Gate</span>
                  <span className="font-bold text-slate-800">{flight.terminal || 'T2'} / Gate {flight.gate || '12'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Booking Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {booking.booking_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Barcode Section */}
            <div className="px-6 py-4 bg-slate-100/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-700 block">
                    ETKT-{booking.id.toString().padStart(8, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Present mobile screen or printed copy at security & boarding gate.
                  </span>
                </div>
              </div>

              {/* Simulated Linear Barcode Graphic */}
              <div className="flex items-center space-x-0.5 h-8 opacity-80">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 2, 4, 3, 2, 5, 1, 3, 6, 2, 4, 1, 3, 5].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 h-full"
                    style={{ width: `${w * 1.5}px` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
