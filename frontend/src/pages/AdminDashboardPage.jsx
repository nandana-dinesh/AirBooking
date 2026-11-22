import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Plane,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
  Trash2,
  Send,
  IndianRupee,
} from 'lucide-react';
import api from '../api/client';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'flights', 'users', 'stats'

  // Data states
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // New Flight Modal State with Indian route defaults
  const [isNewFlightModalOpen, setIsNewFlightModalOpen] = useState(false);
  const [flightFormData, setFlightFormData] = useState({
    flight_number: '',
    airline: 'IndiGo',
    aircraft_model: 'Airbus A321neo',
    origin_code: 'DEL',
    origin_city: 'New Delhi',
    origin_airport: 'Indira Gandhi International Airport',
    destination_code: 'BOM',
    destination_city: 'Mumbai',
    destination_airport: 'Chhatrapati Shivaji Maharaj International Airport',
    departure_time: '',
    arrival_time: '',
    duration_minutes: 130,
    price: 4950.00,
    total_seats: 222,
    available_seats: 222,
    terminal: 'T2',
    gate: '18A',
  });

  // User search/filter
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users/pending/');
      setPendingUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load pending users', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (userStatusFilter) params.status = userStatusFilter;
      if (userSearch) params.search = userSearch;
      const res = await api.get('/admin/users/', { params });
      setAllUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load all users', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch flights
  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/flights/');
      setFlights(res.data || []);
    } catch (err) {
      console.error('Failed to load flights', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats/');
      setStats(res.data || null);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') fetchPendingUsers();
    if (activeTab === 'flights') fetchFlights();
    if (activeTab === 'users') fetchAllUsers();
    if (activeTab === 'stats') fetchStats();
  }, [activeTab]);

  // Handle Approve User
  const handleApproveUser = async (userId, username) => {
    try {
      const res = await api.post(`/admin/users/${userId}/approve/`);
      setActionMessage({
        type: 'success',
        text: `User ${username} approved! Activation email dispatched via Celery.`,
      });
      fetchPendingUsers();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: 'Failed to approve user. Please try again.',
      });
    }
  };

  // Handle Reject User
  const handleRejectUser = async (userId, username) => {
    try {
      await api.post(`/admin/users/${userId}/reject/`);
      setActionMessage({
        type: 'warning',
        text: `User ${username} rejected.`,
      });
      fetchPendingUsers();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: 'Failed to reject user.',
      });
    }
  };

  // Handle Flight Status Update
  const handleUpdateFlightStatus = async (flightId, newStatus) => {
    try {
      let delayMins = 0;
      if (newStatus === 'DELAYED') {
        const input = prompt('Enter delay in minutes:', '30');
        if (input === null) return;
        delayMins = parseInt(input) || 30;
      }

      await api.put(`/admin/flights/${flightId}/status/`, {
        status: newStatus,
        delay_minutes: delayMins,
      });

      setActionMessage({
        type: 'success',
        text: `Flight status updated to ${newStatus}.`,
      });
      fetchFlights();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: 'Failed to update flight status.',
      });
    }
  };

  // Handle Create Flight
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/flights/', flightFormData);
      setIsNewFlightModalOpen(false);
      setActionMessage({
        type: 'success',
        text: `Flight ${flightFormData.flight_number} created successfully!`,
      });
      fetchFlights();
    } catch (err) {
      alert('Failed to create flight. Please check inputs.');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">AirBooking India Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Central Aviation Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review user registrations, update live flight operational statuses, manage aircraft inventory, and monitor booking metrics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl text-xs font-bold text-slate-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'flights' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flight Management</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Platform Analytics</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage.text && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : actionMessage.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage({ type: '', text: '' })}
            className="text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending User Approvals</h2>
              <p className="text-xs text-slate-500">
                New accounts require administrator approval. Approving queues an activation notification email via Celery.
              </p>
            </div>
            <button
              onClick={fetchPendingUsers}
              className="p-2 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-50 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
              Loading pending accounts...
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800">No Pending Approvals</h3>
              <p className="text-xs text-slate-500">
                All registered passenger accounts have been reviewed and approved.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map((pUser) => (
                <div
                  key={pUser.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {pUser.first_name} {pUser.last_name}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">@{pUser.username}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center">
                      <Clock className="w-3 h-3 mr-0.5" /> Pending
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Email</span>
                      <span className="font-medium">{pUser.email}</span>
                    </div>
                    {pUser.phone_number && (
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Mobile Number</span>
                        <span className="font-medium">{pUser.phone_number}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registered Date</span>
                      <span className="font-medium">{formatDate(pUser.date_joined)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex space-x-2">
                    <button
                      onClick={() => handleApproveUser(pUser.id, pUser.username)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Notify</span>
                    </button>
                    <button
                      onClick={() => handleRejectUser(pUser.id, pUser.username)}
                      className="px-3 py-2 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Flight Management */}
      {activeTab === 'flights' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Flight Inventory & Statuses</h2>
              <p className="text-xs text-slate-500">
                Update flight operational status (On-Time / Delayed / Cancelled / Boarding) or schedule new flights.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsNewFlightModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Flight</span>
              </button>
              <button
                onClick={fetchFlights}
                className="p-2 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Flight</th>
                  <th className="py-3 px-4">Airline</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Fare (INR)</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4">Live Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {flights.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{f.flight_number}</td>
                    <td className="py-3.5 px-4 font-medium">{f.airline}</td>
                    <td className="py-3.5 px-4 font-bold text-sky-700">
                      {f.origin_code} → {f.destination_code}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {formatTime(f.departure_time)} - {formatTime(f.arrival_time)}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono">₹{Number(f.price).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-[11px]">
                          {f.total_seats - f.available_seats}/{f.total_seats} ({f.occupancy_rate}%)
                        </span>
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-600 rounded-full"
                            style={{ width: `${f.occupancy_rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'ON_TIME'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.status === 'DELAYED'
                            ? 'bg-amber-100 text-amber-800'
                            : f.status === 'BOARDING'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {f.status} {f.delay_minutes > 0 ? `(+${f.delay_minutes}m)` : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={f.status}
                        onChange={(e) => handleUpdateFlightStatus(f.id, e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="ON_TIME">Set On-Time</option>
                        <option value="BOARDING">Set Boarding</option>
                        <option value="DELAYED">Set Delayed...</option>
                        <option value="DEPARTED">Set Departed</option>
                        <option value="ARRIVED">Set Arrived</option>
                        <option value="CANCELLED">Set Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Accounts Directory</h2>
              <p className="text-xs text-slate-500">
                Overview of all registered users and their current platform approval statuses.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              >
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={fetchAllUsers}
                className="p-2 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : u.username}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">@{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.approval_status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.approval_status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.approval_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(u.date_joined)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {u.approval_status === 'pending' && (
                        <button
                          onClick={() => handleApproveUser(u.id, u.username)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px]"
                        >
                          Approve
                        </button>
                      )}
                      {u.approval_status !== 'rejected' && u.role !== 'admin' && (
                        <button
                          onClick={() => handleRejectUser(u.id, u.username)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-[11px]"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Platform Analytics & Stats */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <span className="text-xl font-bold">₹</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Bookings Value
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  ₹{Number(stats.metrics.total_revenue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirmed PNRs
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {stats.metrics.confirmed_bookings}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Scheduled Flights
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {stats.metrics.total_flights}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pending Approvals
                </span>
                <span className="text-2xl font-black text-amber-600 font-mono">
                  {stats.metrics.pending_users_count}
                </span>
              </div>
            </div>
          </div>

          {/* Popular Indian Routes Table & Recent Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Most Booked Indian Sectors</h3>
              <div className="divide-y divide-slate-100">
                {stats.popular_routes.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No sector data accumulated yet.</p>
                ) : (
                  stats.popular_routes.map((r, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">
                          {r.flight__origin_code} → {r.flight__destination_code}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sky-700">{r.booking_count} bookings</span>
                        <span className="text-[10px] text-slate-400 block">
                          {r.total_passengers} passengers
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Recent Confirmed Bookings</h3>
              <div className="divide-y divide-slate-100">
                {stats.recent_bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{b.passenger_name}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {b.booking_reference} • {b.flight?.flight_number} ({b.seat_numbers})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 font-mono">
                        ₹{Number(b.total_price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{b.cabin_class}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Flight Modal */}
      {isNewFlightModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Schedule New Flight</h3>
              <button
                onClick={() => setIsNewFlightModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFlight} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.flight_number}
                    onChange={(e) => setFlightFormData({ ...flightFormData, flight_number: e.target.value.toUpperCase() })}
                    placeholder="e.g. 6E-2051"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Airline</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.airline}
                    onChange={(e) => setFlightFormData({ ...flightFormData, airline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origin Code (e.g. DEL)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={flightFormData.origin_code}
                    onChange={(e) => setFlightFormData({ ...flightFormData, origin_code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origin City</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.origin_city}
                    onChange={(e) => setFlightFormData({ ...flightFormData, origin_city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Code (e.g. BOM)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={flightFormData.destination_code}
                    onChange={(e) => setFlightFormData({ ...flightFormData, destination_code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.destination_city}
                    onChange={(e) => setFlightFormData({ ...flightFormData, destination_city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightFormData.departure_time}
                    onChange={(e) => setFlightFormData({ ...flightFormData, departure_time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arrival Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightFormData.arrival_time}
                    onChange={(e) => setFlightFormData({ ...flightFormData, arrival_time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={flightFormData.price}
                    onChange={(e) => setFlightFormData({ ...flightFormData, price: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Seats</label>
                  <input
                    type="number"
                    required
                    value={flightFormData.total_seats}
                    onChange={(e) => setFlightFormData({ ...flightFormData, total_seats: parseInt(e.target.value), available_seats: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={flightFormData.duration_minutes}
                    onChange={(e) => setFlightFormData({ ...flightFormData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewFlightModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Publish Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
