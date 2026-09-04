import React, { useState } from 'react';
import { Activity, Search, Phone, MapPin, Sparkles, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { updateDistressStatus } from '../api/client';

export default function SOSDispatchBoard({ requests, onStatusChanged }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || r.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateDistressStatus(id, newStatus);
      if (onStatusChanged) onStatusChanged(id, newStatus);
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getUrgencyBadge = (urgency, score) => {
    switch (urgency) {
      case 'CRITICAL':
        return (
          <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-1 rounded-full border border-red-200 flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> CRITICAL ({score}/100)
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
            HIGH PRIORITY ({score}/100)
          </span>
        );
      case 'MODERATE':
        return (
          <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-200">
            MODERATE ({score}/100)
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
            LOW ({score}/100)
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">PENDING</span>;
      case 'Responding':
        return <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">UNIT EN ROUTE</span>;
      case 'Resolved':
        return <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">RESCUED / SAFE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-600" />
              Live Emergency SOS & Triage Dispatch Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Prioritized dispatch queue for tri-forces, boat operators, and Grama Niladhari volunteer units.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, GN division..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Status:</span>
          {['ALL', 'Pending', 'Responding', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] ml-4">Urgency:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((u) => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                urgencyFilter === u ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filtered.map((r) => {
          const isCritical = r.urgency === 'CRITICAL';

          return (
            <div
              key={r.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                isCritical && r.status !== 'Resolved'
                  ? 'border-red-300 ring-2 ring-red-500/10 shadow-sm'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {getStatusBadge(r.status)}
                    {getUrgencyBadge(r.urgency, r.triageScore)}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {r.fullName} · {r.headcount} {r.headcount === 1 ? 'Person' : 'People'}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    {r.district} District · {r.division}
                  </p>
                </div>

                {/* Status Toggle Action Buttons */}
                <div className="flex items-center gap-2">
                  {r.status !== 'Pending' && (
                    <button
                      onClick={() => handleStatusUpdate(r.id, 'Pending')}
                      disabled={updatingId === r.id}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Set Pending
                    </button>
                  )}
                  {r.status !== 'Responding' && r.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(r.id, 'Responding')}
                      disabled={updatingId === r.id}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Dispatch Unit
                    </button>
                  )}
                  {r.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(r.id, 'Resolved')}
                      disabled={updatingId === r.id}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Rescued
                    </button>
                  )}
                </div>
              </div>

              {/* Exact address box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 my-3">
                <strong className="text-slate-900 block mb-0.5">Exact Location / Landmark:</strong>
                {r.address}
              </div>

              {/* Tags grid */}
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md font-bold">
                  Need: {r.emergencyType}
                </span>
                <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md font-medium">
                  Water Level: {r.waterLevelDescription}
                </span>
                {r.hasElderlyOrInfant && (
                  <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-md font-semibold">
                    Vulnerable: Infants / Elderly
                  </span>
                )}
                {r.hasMedicalCondition && (
                  <span className="bg-rose-50 text-rose-800 px-2.5 py-1 rounded-md font-bold">
                    Medical Attention Required
                  </span>
                )}
              </div>

              {/* Description & Action Plan */}
              {r.description && (
                <p className="text-xs text-slate-600 italic mb-3">
                  "{r.description}"
                </p>
              )}

              {/* Recommended Action */}
              {r.recommendedAction && (
                <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 text-xs text-sky-950 flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Recommended Operational Action:</strong>
                    {r.recommendedAction}
                  </div>
                </div>
              )}

              {/* Phone call footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">ID: {r.id}</span>
                <a
                  href={`tel:${r.phone}`}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call Victim: {r.phone}
                </a>
              </div>

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No emergency requests found matching this filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
