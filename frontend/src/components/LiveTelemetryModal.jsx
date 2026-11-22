import React, { useState, useEffect } from 'react';
import { X, Plane, Radio, Compass, Gauge, ArrowUpRight, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../api/client';

export const LiveTelemetryModal = ({ isOpen, onClose, flightId }) => {
  if (!isOpen || !flightId) return null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/flights/${flightId}/live-status/`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load telemetry', err);
      setError('Unable to fetch live telemetry stream. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000); // Poll every 10s while open
    return () => clearInterval(interval);
  }, [flightId]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-slate-950 text-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Radar Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <Radio className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                Live Radar Telemetry — {data ? data.flight_number : 'Loading...'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {data?.airline} • {data?.aircraft_model}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchTelemetry}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-400" />
            <p className="text-sm">Connecting to global radar transponders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : data ? (
          <div className="p-6 space-y-6">
            {/* Live Progress Track */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-black text-sky-400">{data.route.origin.code}</span>
                  <span className="text-xs text-slate-400 block">{data.route.origin.city}</span>
                </div>
                <div className="text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Phase: {data.flight_phase}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    Progress: {data.progress_percentage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-sky-400">{data.route.destination.code}</span>
                  <span className="text-xs text-slate-400 block">{data.route.destination.city}</span>
                </div>
              </div>

              {/* Progress Bar with Airplane Icon */}
              <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-visible my-3">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, Math.min(100, data.progress_percentage))}%` }}
                ></div>
                <div
                  className="absolute -top-2 transition-all duration-500"
                  style={{ left: `calc(${Math.max(3, Math.min(97, data.progress_percentage))}% - 10px)` }}
                >
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white shadow-lg flex items-center justify-center transform -rotate-45">
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-3">
                <span>Terminal {data.route.origin.terminal} / Gate {data.route.origin.gate}</span>
                <span>Destination: {data.route.destination.airport}</span>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Altitude
                </span>
                <span className="text-xl font-mono font-bold text-slate-100">
                  {data.telemetry.altitude_feet.toLocaleString()} <span className="text-xs text-slate-400">ft</span>
                </span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Ground Speed
                </span>
                <span className="text-xl font-mono font-bold text-slate-100">
                  {data.telemetry.ground_speed_knots} <span className="text-xs text-slate-400">kts</span>
                </span>
                <span className="text-[10px] text-slate-500 block">({data.telemetry.ground_speed_kmh} km/h)</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Heading
                </span>
                <span className="text-xl font-mono font-bold text-slate-100">
                  {data.telemetry.heading_degrees}°
                </span>
                <span className="text-[10px] text-slate-500 block">{data.telemetry.vertical_rate}</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Delay Status
                </span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {data.delay_minutes > 0 ? `+${data.delay_minutes}m` : 'On Time'}
                </span>
                <span className="text-[10px] text-slate-500 block">Scheduled</span>
              </div>
            </div>

            {/* Live GPS Coordinates & OpenSky Network Status */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-2">
              <div className="font-mono">
                Lat: <span className="text-slate-200">{data.telemetry.latitude}°</span>, Lon:{' '}
                <span className="text-slate-200">{data.telemetry.longitude}°</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-medium">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Source: OpenSky Network Live ADS-B Feed</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
