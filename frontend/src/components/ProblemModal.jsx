import React from 'react';
import { X, AlertOctagon, MapPin, Users, Activity, CheckCircle2, Waves } from 'lucide-react';

export default function ProblemModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
              SLIIT SE3090 · Mini Hackathon Theme
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              The Sri Lankan Problem: Monsoon Inundation & Rescue Delays
            </h2>
          </div>
        </div>

        {/* Problem Body */}
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium">
            <strong>Ground Reality in Sri Lanka:</strong> During the Southwest and Inter-monsoon rains, sudden heavy downpours inundate low-lying river basins within hours, stranding thousands of vulnerable citizens in Colombo, Gampaha, Kalutara, and Ratnapura districts.
          </div>

          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            Key Affected River Basins & Communities
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block">Kelani Ganga Basin:</strong>
              Kolonnawa, Wellampitiya, Kotikawatta, Sedawatta, Kaduwela, Biyagama, Hanwella.
            </li>
            <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block">Kalu Ganga Basin:</strong>
              Ratnapura, Elapatha, Ayagama, Bulathsinhala, Millaniya, Palinda Nuwara.
            </li>
            <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block">Gin & Nilwala Basins:</strong>
              Baddegama, Nagoda, Akuressa, Thihagoda, Matara lowlands.
            </li>
            <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block">Vulnerable Demographics:</strong>
              Elderly citizens, bedridden patients, and infants stranded without clean water or electricity.
            </li>
          </ul>

          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-2">
            <Activity className="w-4 h-4 text-red-600" />
            Current Pain Points & Bottlenecks
          </h3>
          <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm">
            <li>
              <strong>Information Fragmentation:</strong> Irrigation Department hydrological bulletins are published as static PDFs or radio updates that local villagers cannot easily search or filter by their Grama Niladhari division.
            </li>
            <li>
              <strong>Distress Request Jam:</strong> Official emergency hotlines (117, 119) experience acute congestion, leading to delays in identifying life-threatening emergencies (e.g. rooftop rescues vs. dry ration needs).
            </li>
            <li>
              <strong>Relief Misallocation:</strong> Volunteer organizations and tri-forces lack real-time visibility into shelter capacities and specific urgent supply deficits (e.g. baby milk formula, chronic medication).
            </li>
          </ul>

          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            How ResQ Lanka Bridges the Gap
          </h3>
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 space-y-2 text-xs sm:text-sm text-sky-950">
            <p>
              1. <strong>Real-Time River Gauges:</strong> Live flood warning levels (Nagalagam Street, Hanwella, Putupaula) with direct inundation warnings for adjacent villages.
            </p>
            <p>
              2. <strong>Rapid SOS Dispatch Form:</strong> Validated digital distress submission with Sri Lankan phone verification, GPS/landmark coordinates, and headcount.
            </p>
            <p>
              3. <strong>AI Emergency Triage:</strong> Automatically evaluates vulnerability parameters to score priority (0–100) and direct Navy boat crews to critical rooftop rescues first.
            </p>
            <p>
              4. <strong>Live Shelter & Inventory Directory:</strong> Shows real-time bed capacity and required donation items across temples and school relief centers.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow transition-colors"
          >
            Close & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
