import React from 'react';
import { Waves, AlertTriangle, Users, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function MetricsOverview({ metrics, shelterSummary, gauges }) {
  const activeAlerts = gauges.filter(g => g.status === 'Major Flood' || g.status === 'Minor Flood' || g.status === 'Alert').length;
  const majorFloods = gauges.filter(g => g.status === 'Major Flood').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      
      {/* Gauge Floods */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
          <Waves className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Flood Warnings
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{activeAlerts}</span>
            <span className="text-[11px] font-semibold text-red-600">({majorFloods} Major)</span>
          </div>
        </div>
      </div>

      {/* Pending Distress Requests */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending SOS
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{metrics.pending || 0}</span>
            <span className="text-[11px] font-semibold text-amber-600">({metrics.criticalUnresolved || 0} Critical)</span>
          </div>
        </div>
      </div>

      {/* Displaced / Trapped Persons */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Affected Citizens
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{metrics.totalPeopleAffected || 0}</span>
            <span className="text-[11px] font-semibold text-sky-600">Reported</span>
          </div>
        </div>
      </div>

      {/* Shelters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Shelters Open
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{shelterSummary.totalShelters || 0}</span>
            <span className="text-[11px] font-semibold text-emerald-600">
              {shelterSummary.availableSpaces || 0} Beds Free
            </span>
          </div>
        </div>
      </div>

      {/* Rescued / Dispatched */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5 col-span-2 md:col-span-1">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Dispatched / Safe
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">
              {(metrics.responding || 0) + (metrics.resolved || 0)}
            </span>
            <span className="text-[11px] font-semibold text-blue-600">({metrics.resolved || 0} Resolved)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
