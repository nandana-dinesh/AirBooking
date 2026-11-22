import React from 'react';
import { Plane, Heart, Shield, Sparkles } from 'lucide-react';

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
              <span className="font-bold text-lg">AirBooking</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-Stack Developer Take-Home Platform developed for YUAI Soft Solutions Pvt. Ltd.
              Real-time flight search, seat reservations, and admin approval workflows.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/flights" className="hover:text-white transition">Flight Search & Booking</a></li>
              <li><a href="/live-tracker" className="hover:text-white transition">OpenSky Live Radar</a></li>
              <li><a href="/my-trips" className="hover:text-white transition">My Trips & E-Tickets</a></li>
              <li><a href="/admin-portal" className="hover:text-white transition">Admin Management Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-xs">
              <li>Django 5.2 & Django REST Framework</li>
              <li>SimpleJWT Token Authentication</li>
              <li>Celery Email Activation Task</li>
              <li>React 19 + Vite + Tailwind CSS</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Assignment</h4>
            <p className="text-xs text-slate-400 mb-2">
              YUAI Soft Solutions Pvt. Ltd. Full Stack Engineer Assignment.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
              <span className="block font-semibold text-sky-400">Company Contact:</span>
              yuaisoftsolutions@gmail.com
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AirBooking Platform. Built with care for YUAI Soft Solutions.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span className="inline-flex items-center text-emerald-400">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Admin Approval Security Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
