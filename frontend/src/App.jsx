import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EmergencyTicker from './components/EmergencyTicker';
import ProblemModal from './components/ProblemModal';
import MetricsOverview from './components/MetricsOverview';
import RiverGaugesView from './components/RiverGaugesView';
import ShelterDirectory from './components/ShelterDirectory';
import RegisterShelterForm from './components/RegisterShelterForm';
import EmergencyRequestForm from './components/EmergencyRequestForm';
import SOSDispatchBoard from './components/SOSDispatchBoard';
import AITriageAssistant from './components/AITriageAssistant';
import Footer from './components/Footer';
import { 
  getRiverGauges, 
  getShelters, 
  getShelterSummary, 
  getDistressRequests, 
  getSOSMetrics 
} from './api/client';
import { AlertTriangle, Waves, ShieldCheck, Activity, ArrowRight, Sparkles, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [problemModalOpen, setProblemModalOpen] = useState(false);

  // Application Data States
  const [gauges, setGauges] = useState([]);
  const [gaugeMode, setGaugeMode] = useState('simulation');
  const [isSyncingGauges, setIsSyncingGauges] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [shelterSummary, setShelterSummary] = useState({});
  const [requests, setRequests] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async (mode = gaugeMode) => {
    try {
      const [gData, sData, sSumm, rData, mData] = await Promise.all([
        getRiverGauges({ mode }),
        getShelters(),
        getShelterSummary(),
        getDistressRequests(),
        getSOSMetrics(),
      ]);
      setGauges(gData || []);
      setShelters(sData || []);
      setShelterSummary(sSumm || {});
      setRequests(rData || []);
      setMetrics(mData || {});
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGaugeMode = async (newMode) => {
    setGaugeMode(newMode);
    setIsSyncingGauges(true);
    try {
      const data = await getRiverGauges({ mode: newMode });
      setGauges(data || []);
    } catch (err) {
      console.error('Failed to switch gauge mode:', err);
    } finally {
      setIsSyncingGauges(false);
    }
  };

  useEffect(() => {
    loadData(gaugeMode);
    // Poll updates every 30 seconds
    const interval = setInterval(() => loadData(gaugeMode), 30000);
    return () => clearInterval(interval);
  }, [gaugeMode]);

  const handleRequestSubmitted = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    // Refresh metrics
    getSOSMetrics().then(setMetrics);
  };

  const handleShelterSubmitted = (newShelter) => {
    setShelters((prev) => [newShelter, ...prev]);
    // Refresh shelter summary
    getShelterSummary().then(setShelterSummary);
  };

  const handleStatusChanged = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    // Refresh metrics
    getSOSMetrics().then(setMetrics);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Top breaking bulletin */}
      <EmergencyTicker />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProblemModal={() => setProblemModalOpen(true)}
      />

      {/* Problem Explanation Modal (Requirement 2) */}
      <ProblemModal
        isOpen={problemModalOpen}
        onClose={() => setProblemModalOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: DASHBOARD HOME */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Hero Banner with Call to Action */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Southwest Monsoon Response Network · Sri Lanka
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Coordinated Flood Response & Live River Monitoring.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Connecting stranded flood victims in Kolonnawa, Biyagama, Kaduwela, and Ratnapura with the Sri Lanka Navy, disaster response volunteers, and nearby relief camps.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('sos-form')}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Request Emergency Evacuation (SOS)
                  </button>
                  <button
                    onClick={() => setActiveTab('sos-board')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl backdrop-blur transition-all flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-sky-400" />
                    View Live Dispatch Queue
                  </button>
                  <button
                    onClick={() => setProblemModalOpen(true)}
                    className="text-xs text-sky-300 hover:text-white underline underline-offset-4 py-2 px-1"
                  >
                    Why this matters for Sri Lanka &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Situational Counters */}
            <MetricsOverview
              metrics={metrics}
              shelterSummary={shelterSummary}
              gauges={gauges}
            />

            {/* Split Section: High-Priority River Gauges & Critical SOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: River Basin Alerts Preview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        River Basin Flood Warning Stages
                      </h3>
                      <p className="text-xs text-slate-500">Real-time gauge heights</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('gauges')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                  >
                    All Stations <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {gauges.slice(0, 3).map((g) => (
                    <div key={g.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-slate-900">{g.stationName}</strong>
                          <span className="text-[11px] text-slate-500">({g.riverBasin})</span>
                        </div>
                        <span className="text-xs text-slate-500">Risk: {g.inundationRiskAreas.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">{g.currentLevelMeters.toFixed(2)}m</div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${g.status === "Major Flood" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>{g.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Active High-Priority Distress Calls Preview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Active Emergency Dispatch Queue
                      </h3>
                      <p className="text-xs text-slate-500">AI-ranked by life safety severity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('sos-board')}
                    className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    Open Console <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {requests.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-slate-900">{r.fullName}</strong>
                          <span className="text-xs text-slate-500 font-medium">({r.headcount} people)</span>
                        </div>
                        <span className="text-xs text-slate-500">{r.division}, {r.district}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full block mb-1 ${r.urgency === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>{r.urgency} ({r.triageScore}/100)</span>
                        <span className="text-[11px] text-slate-500 font-medium capitalize">
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Action Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div 
                onClick={() => setActiveTab('gauges')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-500/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Waves className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">River Basin Monitor</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Monitor Kelani, Kalu, and Gin Ganga gauges with alert levels, river stage trends, and village vulnerability alerts.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('shelters')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Shelter Directory</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Find safe temple & school camps with live available capacity, on-site doctors, clean water, and urgently needed donations.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('ai-triage')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">AI Triage Simulator</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Interactive AI decision-support evaluator calculating priority scores, risk factors, and military rescue actions.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: RIVER GAUGES */}
        {activeTab === 'gauges' && (
          <div className="animate-in fade-in duration-200">
            <RiverGaugesView
              gauges={gauges}
              gaugeMode={gaugeMode}
              onToggleMode={handleToggleGaugeMode}
              isSyncing={isSyncingGauges}
            />
          </div>
        )}

        {/* TAB 3: SOS DISPATCH BOARD */}
        {activeTab === 'sos-board' && (
          <div className="animate-in fade-in duration-200">
            <SOSDispatchBoard
              requests={requests}
              onStatusChanged={handleStatusChanged}
            />
          </div>
        )}

        {/* TAB 4: SHELTER DIRECTORY */}
        {activeTab === 'shelters' && (
          <div className="animate-in fade-in duration-200">
            <ShelterDirectory
              shelters={shelters}
              summary={shelterSummary}
              onNavigateToRegister={() => setActiveTab('shelter-form')}
            />
          </div>
        )}

        {/* TAB 5: AI TRIAGE SIMULATOR */}
        {activeTab === 'ai-triage' && (
          <div className="animate-in fade-in duration-200">
            <AITriageAssistant />
          </div>
        )}

        {/* TAB 6: EMERGENCY REQUEST FORM */}
        {activeTab === 'sos-form' && (
          <div className="animate-in fade-in duration-200">
            <EmergencyRequestForm
              onRequestSubmitted={handleRequestSubmitted}
              onNavigateToBoard={() => setActiveTab('sos-board')}
            />
          </div>
        )}

        {/* TAB 7: REGISTER RELIEF SHELTER FORM */}
        {activeTab === 'shelter-form' && (
          <div className="animate-in fade-in duration-200">
            <RegisterShelterForm
              onShelterRegistered={handleShelterSubmitted}
              onNavigateToDirectory={() => setActiveTab('shelters')}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onOpenProblemModal={() => setProblemModalOpen(true)} />

    </div>
  );
}
