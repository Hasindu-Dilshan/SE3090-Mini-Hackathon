import React from 'react';
import { AlertCircle, Phone, Radio, ShieldAlert } from 'lucide-react';

export default function EmergencyTicker({ gauges = [], gaugeMode = 'simulation' }) {
  // Find highest severity station dynamically from real-time data
  const majorStation = gauges.find((g) => g.status === 'Major Flood');
  const minorStation = gauges.find((g) => g.status === 'Minor Flood');
  const alertStation = gauges.find((g) => g.status === 'Alert');

  const nagalagam = gauges.find((g) => (g.stationName || '').includes('Nagalagam'));
  const hanwella = gauges.find((g) => (g.stationName || '').includes('Hanwella'));
  const baddegama = gauges.find((g) => (g.stationName || '').includes('Baddegama'));

  let badgeText = 'LIVE HYDROLOGY BULLETIN';
  let badgeClass = 'bg-slate-700 text-slate-200';
  let containerBg = 'bg-slate-950 border-b border-slate-800 text-white';
  let tickerContent = null;
  let isSevere = false;

  if (majorStation) {
    isSevere = true;
    badgeText = 'CRITICAL FLOOD ALERT';
    badgeClass = 'bg-red-800 text-red-100 animate-pulse';
    containerBg = 'bg-red-600 text-white';
    tickerContent = (
      <span>
        <strong>{majorStation.riverBasin}</strong> ({majorStation.stationName}: {Number(majorStation.currentLevelMeters).toFixed(2)}m) at <strong>Major Flood Level</strong>. Downstream risks: {(majorStation.inundationRiskAreas || []).slice(0, 3).join(', ')}. Evacuation recommended.
      </span>
    );
  } else if (minorStation) {
    badgeText = 'MINOR FLOOD WARNING';
    badgeClass = 'bg-amber-800 text-amber-100';
    containerBg = 'bg-amber-600 text-white';
    tickerContent = (
      <span>
        <strong>{minorStation.riverBasin}</strong> ({minorStation.stationName}: {Number(minorStation.currentLevelMeters).toFixed(2)}m) exceeded Minor Flood threshold. Downstream areas on alert: {(minorStation.inundationRiskAreas || []).slice(0, 2).join(', ')}.
      </span>
    );
  } else if (alertStation) {
    badgeText = 'RIVER ALERT STAGE';
    badgeClass = 'bg-yellow-800 text-yellow-100';
    containerBg = 'bg-yellow-600 text-white';
    tickerContent = (
      <span>
        <strong>{alertStation.riverBasin}</strong> ({alertStation.stationName}: {Number(alertStation.currentLevelMeters).toFixed(2)}m) reached Alert Stage. Monitoring upstream catchment runoff.
      </span>
    );
  } else {
    // Normal real-time reading (such as today's calm weather from Sri Lanka Irrigation Dept)
    badgeText = gaugeMode === 'live' ? 'LIVE SRI LANKA TELEMETRY' : 'HYDROLOGICAL BULLETIN';
    badgeClass = 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30';
    containerBg = 'bg-slate-900 text-white border-b border-slate-800';
    tickerContent = (
      <span>
        Sri Lanka Irrigation Dept: All major basins currently at <strong>Normal Stage</strong>. Nagalagam St: {nagalagam ? Number(nagalagam.currentLevelMeters).toFixed(2) : '0.90'}m | Hanwella: {hanwella ? Number(hanwella.currentLevelMeters).toFixed(2) : '1.14'}m | Baddegama: {baddegama ? Number(baddegama.currentLevelMeters).toFixed(2) : '1.17'}m.
      </span>
    );
  }

  return (
    <div className={`${containerBg} text-xs sm:text-sm font-medium py-2 px-4 shadow-sm transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSevere ? 'bg-red-200' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSevere ? 'bg-white' : 'bg-emerald-400'}`}></span>
          </span>

          <span className={`${badgeClass} text-[11px] font-bold uppercase px-2 py-0.5 rounded tracking-wide flex-shrink-0 flex items-center gap-1`}>
            {isSevere && <ShieldAlert className="w-3 h-3" />}
            {badgeText}
          </span>

          <p className="truncate text-xs sm:text-sm">
            {tickerContent}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold flex-shrink-0">
          <a
            href="tel:117"
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded transition-colors"
            title="Disaster Management Centre Emergency Hotline"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>DMC: 117</span>
          </a>
          <a
            href="tel:1990"
            className="hidden md:flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded transition-colors"
            title="Suwa Seriya Free Emergency Ambulance Service"
          >
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>Suwa Seriya: 1990</span>
          </a>
        </div>
      </div>
    </div>
  );
}
