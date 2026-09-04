import React, { useState } from 'react';
import { ShieldCheck, Search, Phone, MapPin, Users, PackageOpen, Check, Plus } from 'lucide-react';

export default function ShelterDirectory({ shelters, summary, onNavigateToRegister }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = shelters.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.neededItems.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict = districtFilter === 'ALL' || s.district.toLowerCase() === districtFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === 'Available') {
      return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">Available</span>;
    }
    if (status === 'Nearly Full') {
      return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">Nearly Full</span>;
    }
    return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">At Max Capacity</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-r from-sky-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-sky-300" />
              <h2 className="text-xl sm:text-2xl font-black">
                Community Emergency Relief Shelters & Safe Havens
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
              Designated temples, schools, and community centers equipped with safe lodging, food distribution, and medical care in flood-affected districts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {onNavigateToRegister && (
              <button
                onClick={onNavigateToRegister}
                className="bg-white hover:bg-sky-50 text-sky-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-sky-700" />
                Register New Camp
              </button>
            )}

            {/* Aggregate Calculation Cards */}
            <div className="flex flex-wrap items-center gap-3 text-slate-900">
              <div className="bg-white/95 backdrop-blur rounded-xl p-3 px-4 text-center min-w-[100px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Shelters</span>
                <span className="text-2xl font-black text-slate-900">{summary.totalShelters || shelters.length}</span>
              </div>
              <div className="bg-white/95 backdrop-blur rounded-xl p-3 px-4 text-center min-w-[100px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Capacity</span>
                <span className="text-2xl font-black text-slate-900">{summary.totalCapacity || 0}</span>
              </div>
              <div className="bg-white/95 backdrop-blur rounded-xl p-3 px-4 text-center min-w-[100px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Available Beds</span>
                <span className="text-2xl font-black text-emerald-600">{summary.availableSpaces || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search shelter by name, GN division, or needed supply (e.g. Milk Powder)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">District:</span>
            {['ALL', 'Colombo', 'Gampaha', 'Ratnapura'].map((d) => (
              <button
                key={d}
                onClick={() => setDistrictFilter(d)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  districtFilter === d ? 'bg-sky-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}

            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] ml-2">Status:</span>
            {['ALL', 'Available', 'Nearly Full', 'Full'].map((st) => (
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
          </div>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => {
          const occPercent = Math.min(100, Math.round((s.currentOccupancy / s.capacity) * 100));
          const freeBeds = Math.max(0, s.capacity - s.currentOccupancy);

          return (
            <div key={s.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">
                      {s.district} District · {s.division}
                    </span>
                    <h3 className="text-base font-black text-slate-900 leading-snug mt-0.5">
                      {s.name}
                    </h3>
                  </div>
                  {getStatusBadge(s.status)}
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {s.address}
                </p>

                {/* Capacity Progress */}
                <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" /> Occupancy: <strong>{s.currentOccupancy} / {s.capacity}</strong>
                    </span>
                    <span className="font-black text-slate-800">{occPercent}% Full</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occPercent >= 90 ? 'bg-red-500' : occPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Remaining safe spaces:</span>
                    <span className="font-bold text-emerald-600">{freeBeds} spaces available</span>
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-1 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    On-Site Facilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.facilities.map((fac, idx) => (
                      <span key={idx} className="bg-sky-50 text-sky-700 text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-sky-600" /> {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Needed Relief Items */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                    <PackageOpen className="w-3.5 h-3.5" /> Urgent Relief Supplies Needed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.neededItems.map((item, idx) => (
                      <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact / Call Coordinator */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="truncate mr-2">
                  <span className="text-[11px] text-slate-400 block">Camp Coordinator:</span>
                  <strong className="text-slate-800 truncate block">{s.contactPerson}</strong>
                </div>
                <a
                  href={`tel:${s.contactPhone}`}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" /> {s.contactPhone}
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
