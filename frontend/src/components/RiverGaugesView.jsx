import React, { useState } from 'react';
import { Waves, Search, TrendingUp, TrendingDown, Minus, AlertCircle, MapPin, ShieldAlert, CloudRain, RefreshCw, Radio, ExternalLink } from 'lucide-react';

export default function RiverGaugesView({ gauges, gaugeMode = 'simulation', onToggleMode, isSyncing = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [basinFilter, setBasinFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = (gauges || []).filter((g) => {
    const matchesSearch =
      (g.stationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.district || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.inundationRiskAreas || []).some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBasin = basinFilter === 'ALL' || (g.riverBasin || '').toLowerCase().includes(basinFilter.toLowerCase());
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
      
      {/* Telemetry Source & Mode Switcher Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 rounded-3xl p-6 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-sky-400/30">
              <Radio className={`w-3.5 h-3.5 ${gaugeMode === 'live' ? 'text-emerald-400 animate-pulse' : 'text-sky-300'}`} />
              {gaugeMode === 'live' ? 'Live Sri Lanka Irrigation Dept Feed Active' : 'Monsoon Disaster Simulation Active'}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Hydrological River Basin Gauges & Early Warning Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time water levels and rainfall telemetry sourced from official Sri Lanka Irrigation Department monitoring stations, powered by{' '}
              <a
                href="https://rivermonitorsl.homerelieflk.org/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-300 underline underline-offset-2 hover:text-white font-semibold inline-flex items-center gap-0.5"
              >
                rivermonitorsl.homerelieflk.org <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 flex gap-1.5 backdrop-blur">
              <button
                type="button"
                onClick={() => onToggleMode && onToggleMode('live')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  gaugeMode === 'live'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${gaugeMode === 'live' ? 'bg-white animate-ping' : 'bg-emerald-400'}`} />
                Live Sri Lanka Feed
              </button>

              <button
                type="button"
                onClick={() => onToggleMode && onToggleMode('simulation')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  gaugeMode === 'simulation'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                Monsoon Crisis Scenario
              </button>
            </div>

            {onToggleMode && (
              <button
                type="button"
                onClick={() => onToggleMode(gaugeMode)}
                disabled={isSyncing}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                title="Sync latest live telemetry from ArcGIS"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Feed'}
              </button>
            )}
          </div>
        </div>

        {/* Informational Subtext */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            {gaugeMode === 'live' ? (
              <span className="text-emerald-300 font-medium">
                Showing authentic real-time staff gauge heights and rainfall recorded today across Sri Lanka.
              </span>
            ) : (
              <span className="text-amber-300 font-medium">
                Showing Southwest Monsoon crisis scenario to demonstrate high-water flood thresholds, risk badges, and triage routing for examiners.
              </span>
            )}
          </div>
          <div className="font-mono text-slate-400">
            Source: Irrigation Dept ArcGIS FeatureServer
          </div>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Waves className="w-5 h-5 text-sky-600" />
              Monitoring Stations ({filtered.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by river basin, alert stage, or search by landmark village.
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
          {['ALL', 'Kelani', 'Kalu', 'Gin', 'Nilwala'].map((b) => (
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
          const pct = Math.min(100, Math.round(((g.currentLevelMeters || 0) / (g.majorFloodMeters || 1)) * 100));
          const isDanger = g.status === 'Major Flood';

          return (
            <div
              key={g.id}
              className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                isDanger ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200'
              }`}
            >
              <div>
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
                <div className="my-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 block">Water Staff Gauge</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900">{Number(g.currentLevelMeters).toFixed(2)}</span>
                      <span className="text-xs font-bold text-slate-500">meters</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-slate-500 block">Trend</span>
                    {getTrendIcon(g.trend)}
                  </div>
                </div>

                {/* Rainfall & Live Indicator */}
                <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-sky-50/60 rounded-lg border border-sky-100 mb-3 text-sky-900">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CloudRain className="w-4 h-4 text-sky-600" />
                    Catchment Rainfall: <strong>{g.rainfallMm !== undefined ? `${g.rainfallMm} mm` : '0.0 mm'}</strong>
                  </span>
                  {g.isLive && (
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Live Telemetry
                    </span>
                  )}
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
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>

                {/* Inundation Warning Villages */}
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> Downstream Risk Zones:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(g.inundationRiskAreas || []).map((area, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{g.source || 'Irrigation Dept Feed'}</span>
                <span>{g.lastUpdated}</span>
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
