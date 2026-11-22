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
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const HomePage = () => {
  const popularHubs = [
    { code: 'DEL', city: 'New Delhi',  state: 'Delhi NCR',   label: 'Indira Gandhi Intl',   emoji: '🏛️' },
    { code: 'BOM', city: 'Mumbai',     state: 'Maharashtra', label: 'CSM International',    emoji: '🌊' },
    { code: 'BLR', city: 'Bengaluru',  state: 'Karnataka',   label: 'Kempegowda Intl',      emoji: '🌿' },
    { code: 'GOI', city: 'Goa',        state: 'Goa',         label: 'Dabolim / Mopa',       emoji: '🏖️' },
    { code: 'COK', city: 'Kochi',      state: 'Kerala',      label: 'Cochin International', emoji: '🌴' },
    { code: 'HYD', city: 'Hyderabad',  state: 'Telangana',   label: 'Rajiv Gandhi Intl',    emoji: '💎' },
  ];

  const popularRoutes = [
    { from: 'DEL', to: 'BOM', fromCity: 'New Delhi',  toCity: 'Mumbai',    fare: '₹7,599',  airline: 'Akasa Air',          duration: '2h 20m' },
    { from: 'BOM', to: 'BLR', fromCity: 'Mumbai',     toCity: 'Bengaluru', fare: '₹6,499',  airline: 'IndiGo',             duration: '1h 40m' },
    { from: 'BLR', to: 'GOI', fromCity: 'Bengaluru',  toCity: 'Goa',       fare: '₹4,499',  airline: 'IndiGo',             duration: '1h 10m' },
    { from: 'BOM', to: 'DXB', fromCity: 'Mumbai',     toCity: 'Dubai',     fare: '₹32,500', airline: 'Air India',          duration: '3h 35m' },
    { from: 'DEL', to: 'SIN', fromCity: 'New Delhi',  toCity: 'Singapore', fare: '₹46,800', airline: 'Singapore Airlines', duration: '5h 35m' },
    { from: 'DEL', to: 'GOI', fromCity: 'New Delhi',  toCity: 'Goa',       fare: '₹10,850', airline: 'IndiGo',             duration: '2h 40m' },
  ];

  return (
    <div className="space-y-16 pb-16">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>India's Smartest Flight Booking Platform 🇮🇳</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Book Flights Across India &amp; the World.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400">
              Instantly. Transparently.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compare IndiGo, Air India, Vistara, Akasa Air, Emirates &amp; Singapore Airlines.
            Pick your seat on a live cabin map, pay with UPI, RuPay, or NetBanking — and get
            your DGCA boarding pass in seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/flights"
              className="w-full sm:w-auto px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 transition flex items-center justify-center space-x-2"
            >
              <Plane className="w-4 h-4 -rotate-45" />
              <span>Search Flights</span>
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

        {/* dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl font-black text-sky-600 font-mono block">22+</span>
            <span className="text-xs text-slate-500 font-medium">Live Flights Searchable</span>
          </div>
          <div>
            <span className="text-3xl font-black text-indigo-600 font-mono block">₹0</span>
            <span className="text-xs text-slate-500 font-medium">Convenience Fee via UPI</span>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-600 font-mono block">Live</span>
            <span className="text-xs text-slate-500 font-medium">ADS-B Radar Tracking</span>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-500 font-mono block">DGCA</span>
            <span className="text-xs text-slate-500 font-medium">Compliant Boarding Pass</span>
          </div>
        </div>
      </section>

      {/* ── Popular Routes ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Routes &amp; Starting Fares
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real prices · No hidden charges · Instant seat lock</p>
          </div>
          <Link to="/flights" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center">
            <span>All Flights</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((r) => (
            <Link
              key={`${r.from}-${r.to}`}
              to={`/flights?origin=${r.from}&destination=${r.to}`}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-sky-400 hover:shadow-md transition group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm font-black text-slate-900">
                  <span>{r.fromCity}</span>
                  <Plane className="w-3.5 h-3.5 text-sky-500 -rotate-45 shrink-0" />
                  <span>{r.toCity}</span>
                </div>
                <div className="text-[11px] text-slate-400">{r.airline} · {r.duration} · Non-stop</div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-base font-black text-sky-700 group-hover:text-sky-600 transition block">{r.fare}</span>
                <span className="text-[10px] text-slate-400">onwards</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Everything You Need to Fly Confidently
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Designed for Indian travellers — from first-time flyers to frequent business flyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck, bg: 'bg-sky-100', text: 'text-sky-600',
              title: 'Verified Passenger Accounts',
              desc: 'Every account is reviewed before booking. Keeps fares fair, seats secure, and prevents fraudulent reservations — just like a real airline portal.',
            },
            {
              icon: Armchair, bg: 'bg-indigo-100', text: 'text-indigo-600',
              title: 'Pick Your Exact Seat',
              desc: 'View the actual aircraft cabin map — window, middle, aisle, and extra-legroom rows. Your seat is locked in real-time the moment you pay.',
            },
            {
              icon: CreditCard, bg: 'bg-emerald-100', text: 'text-emerald-600',
              title: 'Pay Your Way — UPI, Cards & Net',
              desc: 'Google Pay, PhonePe, Paytm BHIM UPI, RuPay, Visa/Mastercard, and all major Indian NetBanking portals. Zero convenience fee on UPI.',
            },
            {
              icon: QrCode, bg: 'bg-amber-100', text: 'text-amber-600',
              title: 'Instant DGCA Boarding Pass',
              desc: 'A printable, scannable boarding pass with your PNR, seat, barcode, and gate details — ready the moment your payment clears.',
            },
            {
              icon: Radar, bg: 'bg-rose-100', text: 'text-rose-600',
              title: 'Live ADS-B Flight Radar',
              desc: 'Watch your flight live on the radar — altitude, speed, GPS coordinates, and trajectory streamed from the OpenSky Network.',
            },
            {
              icon: Clock, bg: 'bg-violet-100', text: 'text-violet-600',
              title: 'My Trips & Easy Cancellation',
              desc: 'View all upcoming trips with live departure countdowns. Cancel any refundable booking with one click and get instant seat release + refund.',
            },
          ].map(({ icon: Icon, bg, text, title, desc }) => (
            <div key={title} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className={`w-12 h-12 rounded-2xl ${bg} ${text} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Hubs ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Top Indian Airports We Fly From
            </h2>
            <p className="text-xs text-slate-500">Tap a city to see departing flights</p>
          </div>
          <Link to="/flights" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center">
            <span>View All Flights</span>
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
              <span className="text-2xl block mb-1">{hub.emoji}</span>
              <span className="text-lg font-black text-slate-900 font-mono group-hover:text-sky-600 transition block">
                {hub.code}
              </span>
              <span className="text-xs font-semibold text-slate-800 block truncate mt-0.5">{hub.city}</span>
              <span className="text-[10px] text-slate-400 block">{hub.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-3xl border border-sky-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-black text-slate-900">Safe, Simple &amp; Made for India ✈️</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              AirBooking India uses bank-grade seat locking, UPI-first payments, and real airline
              data to give you the most reliable booking experience.
            </p>
          </div>
          <div className="flex items-center gap-8 shrink-0">
            {[
              { label: 'RuPay Accepted', color: 'text-emerald-600' },
              { label: 'UPI Zero Fee',   color: 'text-sky-600'     },
              { label: 'INR Pricing',    color: 'text-indigo-600'  },
            ].map(({ label, color }) => (
              <div key={label} className="flex flex-col items-center space-y-1">
                <CheckCircle2 className={`w-5 h-5 ${color}`} />
                <span className="text-[10px] font-semibold text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
