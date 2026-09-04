import React, { useState } from 'react';
import { Waves, AlertTriangle, ShieldCheck, Home, Activity, Menu, X, Sparkles, Info, Building2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenProblemModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'gauges', label: 'River Gauges', icon: Waves },
    { id: 'sos-board', label: 'SOS Dispatch Board', icon: Activity },
    { id: 'shelters', label: 'Relief Shelters', icon: ShieldCheck },
    { id: 'shelter-form', label: 'Register Camp', icon: Building2 },
    { id: 'ai-triage', label: 'AI Triage Evaluator', icon: Sparkles },
    { id: 'sos-form', label: 'Request Evacuation', icon: AlertTriangle, highlight: true },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-800 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">ResQ</span>
                <span className="text-xl font-black tracking-tight text-sky-600">Lanka</span>
                <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-1">
                  SL · 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Flood Early-Warning & Community Dispatch
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="ml-2 flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all transform active:scale-95 animate-pulse"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }
              if (item.id === 'shelter-form') {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    + Register Camp
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Problem Info Button */}
            <button
              onClick={onOpenProblemModal}
              className="ml-2 flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-3 py-2 rounded-lg transition-colors"
              title="Learn about the Sri Lankan flood crisis context"
            >
              <Info className="w-4 h-4 text-slate-500" />
              Crisis Context
            </button>
          </nav>

          {/* Mobile header controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleSelect('shelter-form')}
              className="flex items-center gap-1 bg-sky-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-md"
              title="Register a new relief camp"
            >
              <Building2 className="w-3.5 h-3.5" /> + Camp
            </button>
            <button
              onClick={() => handleSelect('sos-form')}
              className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> SOS
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCamp = item.id === 'shelter-form';
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${
                  item.highlight
                    ? 'bg-red-600 text-white'
                    : isCamp
                    ? 'bg-sky-50 text-sky-800 border border-sky-200'
                    : isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {isCamp ? '+ Register New Relief Camp' : item.label}
              </button>
            );
          })}
          <button
            onClick={() => {
              onOpenProblemModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 border-t border-slate-100"
          >
            <Info className="w-4 h-4 text-slate-500" />
            The Sri Lankan Problem Context
          </button>
        </div>
      )}
    </header>
  );
}
