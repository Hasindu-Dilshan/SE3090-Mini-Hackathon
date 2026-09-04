import React from 'react';
import { Phone, Shield, Waves, Heart } from 'lucide-react';

export default function Footer({ onOpenProblemModal }) {
  return (
    <footer className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs sm:text-sm">
          
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight">ResQ Lanka</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built for Sri Lanka to bridge communication during monsoonal floods in the Kelani, Kalu, Gin, and Nilwala river basins.
            </p>
            <button
              onClick={onOpenProblemModal}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2"
            >
              Read Full Sri Lankan Problem Statement & Solution Impact &rarr;
            </button>
          </div>

          {/* Col 2: Emergency Hotlines */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
              Sri Lanka Emergency Hotlines
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg">
                <span>Disaster Management Centre (DMC)</span>
                <a href="tel:117" className="font-bold text-amber-400">117</a>
              </li>
              <li className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg">
                <span>Suwa Seriya Emergency Ambulance</span>
                <a href="tel:1990" className="font-bold text-red-400">1990</a>
              </li>
              <li className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg">
                <span>Sri Lanka Navy Search & Rescue Ops</span>
                <a href="tel:0112434251" className="font-bold text-sky-400">011 243 4251</a>
              </li>
              <li className="flex items-center justify-between bg-slate-800/60 p-2 rounded-lg">
                <span>Sri Lanka Police Operations</span>
                <a href="tel:119" className="font-bold text-emerald-400">119</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic / Hackathon Info */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
              Assessment Metadata
            </h4>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <p><strong>Module:</strong> SE3090 – Software Engineering Frameworks</p>
              <p><strong>Degree:</strong> BSc (Hons) in IT – Software Engineering / AI</p>
              <p><strong>Institution:</strong> SLIIT Faculty of Computing</p>
              <p><strong>Stack:</strong> React (JS), FastAPI (Python), MongoDB</p>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; 2026 ResQ Lanka · Developed for Sri Lanka Community Disaster Relief.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for public benefit.
          </p>
        </div>

      </div>
    </footer>
  );
}
