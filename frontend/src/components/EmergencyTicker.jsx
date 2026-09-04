import React from 'react';
import { AlertCircle, Phone, BellRing } from 'lucide-react';

export default function EmergencyTicker() {
  return (
    <div className="bg-red-600 text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="bg-red-800 text-red-100 text-[11px] font-bold uppercase px-2 py-0.5 rounded tracking-wide flex-shrink-0">
            CRITICAL FLOOD ALERT
          </span>
          <p className="truncate">
            Kelani Ganga (Nagalagam St: 7.20m) at <strong>Major Flood Level</strong>. Rising waters affecting Kolonnawa, Wellampitiya & Biyagama. Evacuation ordered for low-lying areas.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold flex-shrink-0">
          <span className="flex items-center gap-1 bg-red-700 px-2.5 py-1 rounded">
            <Phone className="w-3.5 h-3.5" /> DMC Hotline: 117
          </span>
          <span className="hidden md:flex items-center gap-1 bg-red-700 px-2.5 py-1 rounded">
            <Phone className="w-3.5 h-3.5" /> Suwa Seriya: 1990
          </span>
        </div>
      </div>
    </div>
  );
}
