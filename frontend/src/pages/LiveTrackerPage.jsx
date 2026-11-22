import React, { useState, useEffect } from 'react';
import {
  Radar,
  Plane,
  Radio,
  RefreshCw,
  Compass,
  Gauge,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import api from '../api/client';

export const LiveTrackerPage = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load flight list
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoadingFlights(true);
        const res = await api.get('/flights/search/');
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setFlights(list);
        if (list.length > 0 && !selectedFlightId) {
          setSelectedFlightId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load flights for live radar', err);
      } finally {
        setLoadingFlights(false);
      }
    };
    fetchFlights();
  }, []);

  // Fetch telemetry whenever selectedFlightId changes
  const fetchTelemetry = async (flightId) => {
    if (!flightId) return;
    try {
      setLoadingTelemetry(true);
      const res = await api.get(`/flights/${flightId}/live-status/`);
      setTelemetry(res.data);
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    if (selectedFlightId) {
      fetchTelemetry(selectedFlightId);
    }
  }, [selectedFlightId]);

  // Periodic polling
  useEffect(() => {
    if (!autoRefresh || !selectedFlightId) return;
    const interval = setInterval(() => {
      fetchTelemetry(selectedFlightId);
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedFlightId, autoRefresh]);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <div className="relative">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">
                OpenSky Network & DGCA ADS-B Telemetry Stream
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Live Indian Airspace Radar & Telemetry
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Real-time transponder tracking across Indian domestic routes and international corridors. Live barometric altitude, true ground speed, and route trajectories.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                autoRefresh
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <span>Live Auto-Poll (8s)</span>
            </button>

            <button
              onClick={() => fetchTelemetry(selectedFlightId)}
              disabled={loadingTelemetry}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
              title="Manual Ping"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTelemetry ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Flights Sidebar + Radar Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Flights Selector */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3 h-fit max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Radar className="w-4 h-4 text-sky-600" />
              <span>Trackable Flights ({flights.length})</span>
            </h3>
          </div>

          {loadingFlights ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-600" />
              Loading active flights...
            </div>
          ) : (
            <div className="space-y-2">
              {flights.map((f) => {
                const isActive = selectedFlightId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFlightId(f.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-sky-50 border-sky-400 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-slate-900">{f.flight_number}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          f.status === 'ON_TIME'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.status === 'DELAYED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold">{f.airline}</span>
                      <span className="font-mono font-bold text-sky-700">
                        {f.origin_code} → {f.destination_code}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Live Telemetry Display */}
        <div className="lg:col-span-2 space-y-6">
          {telemetry ? (
            <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              {/* Flight Badge Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <span className="font-mono text-2xl font-black text-sky-400">
                    {telemetry.flight_number}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">{telemetry.airline}</h3>
                  <span className="text-xs text-slate-400">{telemetry.aircraft_model}</span>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Phase: {telemetry.flight_phase}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    Updated: {new Date(telemetry.last_updated).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Graphical Route Trajectory Canvas Card */}
              <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-black text-sky-400 font-mono">
                      {telemetry.route.origin.code}
                    </span>
                    <span className="text-xs text-slate-300 block">{telemetry.route.origin.city}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Dep: {formatTime(telemetry.route.origin.scheduled_departure)}
                    </span>
                  </div>

                  <div className="text-center px-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      Route Progress: {telemetry.progress_percentage}%
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {telemetry.delay_minutes > 0 ? `+${telemetry.delay_minutes} min delay` : 'On Schedule'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-black text-sky-400 font-mono">
                      {telemetry.route.destination.code}
                    </span>
                    <span className="text-xs text-slate-300 block">{telemetry.route.destination.city}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Arr: {formatTime(telemetry.route.destination.scheduled_arrival)}
                    </span>
                  </div>
                </div>

                {/* Simulated Great Circle Arc & Airborne Plane Icon */}
                <div className="relative w-full h-3 bg-slate-800 rounded-full my-6 overflow-visible">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(5, Math.min(100, telemetry.progress_percentage))}%` }}
                  ></div>

                  <div
                    className="absolute -top-3 transition-all duration-700"
                    style={{ left: `calc(${Math.max(4, Math.min(96, telemetry.progress_percentage))}% - 14px)` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/50 flex items-center justify-center transform -rotate-45 border-2 border-white">
                      <Plane className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Terminal {telemetry.route.origin.terminal} / Gate {telemetry.route.origin.gate}</span>
                  <span>{telemetry.route.destination.airport}</span>
                </div>
              </div>

              {/* Real-time Telemetry Metrics Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Altitude (Baro)
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-100">
                    {telemetry.telemetry.altitude_feet.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 block">feet</span>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Ground Speed
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-100">
                    {telemetry.telemetry.ground_speed_knots}
                  </span>
                  <span className="text-xs text-slate-400 block">knots ({telemetry.telemetry.ground_speed_kmh} km/h)</span>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    True Heading
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-100">
                    {telemetry.telemetry.heading_degrees}°
                  </span>
                  <span className="text-xs text-slate-400 block">{telemetry.telemetry.vertical_rate}</span>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Flight Status
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {telemetry.status}
                  </span>
                  <span className="text-xs text-slate-400 block">Transponder Active</span>
                </div>
              </div>

              {/* Coordinates & OpenSky Link */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
                <div className="font-mono">
                  Coordinates: Lat <span className="text-slate-200">{telemetry.telemetry.latitude}°</span>, Lon{' '}
                  <span className="text-slate-200">{telemetry.telemetry.longitude}°</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Integrated with OpenSky Network ADS-B Protocol</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              Select any flight from the left sidebar to view live radar telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
