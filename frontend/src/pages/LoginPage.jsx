import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/flights';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin' || result.user.is_staff) {
        navigate('/admin-portal');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-sky-500/20 mb-4">
            <Plane className="w-7 h-7 -rotate-45" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to AirBooking</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to search, book, and manage your flights</p>
        </div>

        {/* Demo Quick Logins Helper Box */}
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 border border-sky-100 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-800 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Quick Demo Credentials</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'adminpassword123')}
              className="text-left px-3 py-2 bg-white rounded-xl border border-sky-200/80 hover:border-sky-400 hover:shadow-xs transition flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">Admin Account</span>
                <span className="text-[11px] text-slate-500 block">admin / adminpassword123</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                Full Access
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('john_doe', 'userpassword123')}
              className="text-left px-3 py-2 bg-white rounded-xl border border-sky-200/80 hover:border-sky-400 hover:shadow-xs transition flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">Approved Customer</span>
                <span className="text-[11px] text-slate-500 block">john_doe / userpassword123</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Approved
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('sarah_connor', 'userpassword123')}
              className="text-left px-3 py-2 bg-white rounded-xl border border-amber-200/80 hover:border-amber-400 hover:shadow-xs transition flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800">Pending User (Test Workflow)</span>
                <span className="text-[11px] text-slate-500 block">sarah_connor / userpassword123</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center">
                <Clock className="w-3 h-3 mr-0.5" /> Pending
              </span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6 md:p-8">
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-900 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Access Restricted</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. john_doe or admin"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm transition font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm transition font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2 text-sm"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to AirBooking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an approved account yet?{' '}
            <Link to="/register" className="font-bold text-sky-600 hover:text-sky-700">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
