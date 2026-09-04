import React, { useState } from 'react';
import { Waves, Search, TrendingUp, TrendingDown, Minus, AlertCircle, MapPin, ShieldAlert } from 'lucide-react';

export default function RiverGaugesView({ gauges }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [basinFilter, setBasinFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = gauges.filter((g) => {
    const matchesSearch =
      g.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.inundationRiskAreas.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBasin = basinFilter === 'ALL' || g.riverBasin.toLowerCase().includes(basinFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;

    return matchesSearch && matchesBasin && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Major Flood':
        return (
          <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-1 rounded-full border border-red-200 animate-pulse flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> MAJOR FLOOD
          </span>
        );
      case 'Minor Flood':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> MINOR FLOOD
          </span>
        );
      case 'Alert':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-200">ALERT STAGE</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">NORMAL</span>;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'RISING') {
      return <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><TrendingUp className="w-4 h-4" /> Rising</span>;
    }
    if (trend === 'FALLING') {
      return <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs"><TrendingDown className="w-4 h-4" /> Falling</span>;
    }
    return <span className="flex items-center gap-1 text-slate-500 font-semibold text-xs"><Minus className="w-4 h-4" /> Stable</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Waves className="w-6 h-6 text-sky-600" />
              River Basin Hydrological Gauges & Inundation Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live water levels from Irrigation Department & DMC monitoring stations across Sri Lanka.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search station, basin, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1">Basin:</span>
          {['ALL', 'Kelani', 'Kalu', 'Gin'].map((b) => (
            <button
              key={b}
              onClick={() => setBasinFilter(b)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                basinFilter === b ? 'bg-sky-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b === 'ALL' ? 'All Basins' : `${b} Ganga`}
            </button>
          ))}

          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] ml-4 mr-1">Alert Stage:</span>
          {['ALL', 'Major Flood', 'Minor Flood', 'Alert', 'Normal'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === s ? 'bg-slate-900 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((g) => {
          const pct = Math.min(100, Math.round((g.currentLevelMeters / g.majorFloodMeters) * 100));
          const isDanger = g.status === 'Major Flood';

          return (
            <div
              key={g.id}
              className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${
                isDanger ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">
                    {g.riverBasin} · {g.district}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight mt-0.5">
                    {g.stationName}
                  </h3>
                </div>
                {getStatusBadge(g.status)}
              </div>

              {/* Water Level Reading */}
              <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Current Gauge Height</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900">{g.currentLevelMeters.toFixed(2)}</span>
                    <span className="text-xs font-bold text-slate-500">meters</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-slate-500 block">Trend</span>
                  {getTrendIcon(g.trend)}
                </div>
              </div>

              {/* Progress Bar vs Flood Levels */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Alert: {g.alertLevelMeters}m</span>
                  <span>Minor: {g.minorFloodMeters}m</span>
                  <span className="font-bold text-red-600">Major: {g.majorFloodMeters}m</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger ? 'bg-red-600' : g.status === 'Minor Flood' ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Inundation Warning Villages */}
              <div className="pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Inundation Risk Zones:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {g.inundationRiskAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[10px] text-slate-400 text-right">
                Telemetry updated: {g.lastUpdated}
              </div>

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No river gauges found matching your search filter.</p>
        </div>
      )}

    </div>
  );
}
