import React from 'react';
import { Plane, Shield, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-bold text-lg">
                Air<span className="text-sky-400">Booking</span> India
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's smart flight booking and live radar tracking network.
              Book domestic and international flights, reserve seats with real-time aircraft maps,
              and track live airborne flights across Indian airways.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Popular Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/flights?origin=DEL" className="hover:text-white transition">New Delhi (DEL)</a></li>
              <li><a href="/flights?origin=BOM" className="hover:text-white transition">Mumbai (BOM)</a></li>
              <li><a href="/flights?origin=BLR" className="hover:text-white transition">Bengaluru (BLR)</a></li>
              <li><a href="/flights?origin=GOI" className="hover:text-white transition">Goa (GOI / GOX)</a></li>
              <li><a href="/flights?origin=COK" className="hover:text-white transition">Kochi (COK)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Aviation Partners</h4>
            <ul className="space-y-2 text-xs">
              <li>IndiGo Airlines</li>
              <li>Air India & AI Express</li>
              <li>Vistara (Tata SIA)</li>
              <li>Akasa Air</li>
              <li>Emirates & Singapore Airlines</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">24x7 Passenger Support</h4>
            <p className="text-xs text-slate-400 mb-2">
              Assisting flyers across India with bookings, seat reservations, and flight alerts.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>support@airbooking.in</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Toll-Free: 1800-120-AIRBOOK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AirBooking India. All rights reserved. Made for Indian Flyers.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span className="inline-flex items-center text-emerald-400">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Verified Passenger Safety & Approval System
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
