import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin mb-3" />
        <p className="text-slate-500 font-medium">Validating security session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600 mb-6">
          This section is restricted to AirBooking platform administrators.
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Return to Flights Home
        </a>
      </div>
    );
  }

  return children;
};
