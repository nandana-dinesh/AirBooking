import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Plane,
  Radar,
  Luggage,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                Air<span className="text-sky-600">Booking</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 rounded-full border border-orange-200">
                India 🇮🇳
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/flights"
              className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/flights') || isActive('/')
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Plane className="w-4 h-4 mr-1.5" />
              Find Flights
            </Link>

            <Link
              to="/live-tracker"
              className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/live-tracker')
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Radar className="w-4 h-4 mr-1.5 text-sky-600" />
              Live Radar
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-trips"
                className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/my-trips')
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Luggage className="w-4 h-4 mr-1.5" />
                My Trips
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin-portal"
                className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/admin-portal')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 mr-1.5 text-indigo-600" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 pl-3 py-1 pr-2 bg-slate-100/80 rounded-full border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.first_name || user?.username}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline" />
                      Approved
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/flights"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-sky-50"
          >
            <Plane className="w-4 h-4 mr-2 text-sky-600" />
            Find Flights
          </Link>
          <Link
            to="/live-tracker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-sky-50"
          >
            <Radar className="w-4 h-4 mr-2 text-sky-600" />
            Live Radar
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-trips"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-sky-50"
            >
              <Luggage className="w-4 h-4 mr-2 text-sky-600" />
              My Trips
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin-portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50"
            >
              <ShieldAlert className="w-4 h-4 mr-2 text-indigo-600" />
              Admin Portal
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {user?.first_name || user?.username}
                    </p>
                    <p className="text-xs text-emerald-600">Account Approved</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-sky-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
