import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Radar,
  ShieldCheck,
  Armchair,
  CreditCard,
  QrCode,
  ArrowRight,
  Sparkles,
  Globe,
  Clock,
  Compass,
} from 'lucide-react';

export const HomePage = () => {
  const popularHubs = [
    { code: 'DEL', city: 'New Delhi', country: 'India', img: '🇮🇳' },
    { code: 'BOM', city: 'Mumbai', country: 'India', img: '🇮🇳' },
    { code: 'DXB', city: 'Dubai', country: 'UAE', img: '🇦🇪' },
    { code: 'LHR', city: 'London', country: 'United Kingdom', img: '🇬🇧' },
    { code: 'JFK', city: 'New York', country: 'United States', img: '🇺🇸' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore', img: '🇸🇬' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AirBooking — Take-Home Project for YUAI Soft Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Seamless Global Flight Bookings,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              Real-Time Radar & Approval Workflows
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Full-stack flight reservation system featuring custom user approval security,
            interactive aircraft cabin seat selection, simulated transactions, and live OpenSky Network telemetry.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/flights"
              className="w-full sm:w-auto px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 transition flex items-center justify-center space-x-2"
            >
              <Plane className="w-4 h-4 -rotate-45" />
              <span>Explore Flights & Book</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/live-tracker"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold rounded-2xl border border-slate-700 transition flex items-center justify-center space-x-2"
            >
              <Radar className="w-4 h-4 text-emerald-400" />
              <span>Open Live Radar</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl font-black text-sky-600 font-mono block">100%</span>
            <span className="text-xs text-slate-500 font-medium">Full Stack Architecture</span>
          </div>
          <div>
            <span className="text-3xl font-black text-indigo-600 font-mono block">8+</span>
            <span className="text-xs text-slate-500 font-medium">Intercontinental Hubs</span>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-600 font-mono block">Live</span>
            <span className="text-xs text-slate-500 font-medium">OpenSky ADS-B Radar</span>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-500 font-mono block">Celery</span>
            <span className="text-xs text-slate-500 font-medium">Email Dispatch Tasks</span>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Key Architecture & Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered precisely according to all business and technical specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Admin Approval Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              New accounts start in <span className="font-semibold text-slate-700">Pending</span> status. Administrators review registrations, approve/reject them, and trigger background Celery email notifications.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Armchair className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Interactive Seat Selection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real aircraft cabin map layout with Window, Middle, and Aisle seats. Automatically displays booked seats and prevents double-booking via database transactions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Radar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">OpenSky Live Telemetry</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time flight tracking integrating OpenSky Network ADS-B telemetry, calculating 3D coordinates, barometric altitude, true ground speed, and route progress.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Hubs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Flight Hubs
            </h2>
            <p className="text-xs text-slate-500">Major international gateways served by AirBooking</p>
          </div>
          <Link to="/flights" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularHubs.map((hub) => (
            <Link
              key={hub.code}
              to={`/flights?origin=${hub.code}`}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center hover:border-sky-400 hover:shadow-sm transition group"
            >
              <span className="text-2xl mb-1 block">{hub.img}</span>
              <span className="text-base font-black text-slate-900 font-mono group-hover:text-sky-600 transition">
                {hub.code}
              </span>
              <span className="text-xs font-semibold text-slate-700 block truncate">{hub.city}</span>
              <span className="text-[10px] text-slate-400 block">{hub.country}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
