import React, { useState } from 'react';
import { Sparkles, Activity, ShieldAlert, Lightbulb } from 'lucide-react';
import { evaluateTriage } from '../api/client';

export default function AITriageAssistant() {
  const [params, setParams] = useState({
    emergencyType: 'Boat Evacuation',
    waterLevelDescription: 'Ceiling Level / Rooftop',
    headcount: 5,
    hasElderlyOrInfant: true,
    hasMedicalCondition: true,
    description: 'Canal overflowing in Wellampitiya, water at ceiling level, grandmother is diabetic without insulin',
  });

  const [triageResult, setTriageResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const presets = [
    {
      label: 'Kolonnawa Rooftop Trap (Critical)',
      data: {
        emergencyType: 'Boat Evacuation',
        waterLevelDescription: 'Ceiling Level / Rooftop',
        headcount: 6,
        hasElderlyOrInfant: true,
        hasMedicalCondition: true,
        description: 'Kelani river breached bank. Trapped on second floor balcony. Grandmother has heart ailment and electricity is disconnected.',
      }
    },
    {
      label: 'Wellampitiya Baby Food Need (High)',
      data: {
        emergencyType: 'Food & Water',
        waterLevelDescription: 'Waist Level',
        headcount: 4,
        hasElderlyOrInfant: true,
        hasMedicalCondition: false,
        description: 'Flooded ground floor. Stranded with 6-month-old infant and no clean drinking water.',
      }
    },
    {
      label: 'Biyagama Road Submerged (Moderate)',
      data: {
        emergencyType: 'Safe Transport',
        waterLevelDescription: 'Knee Level',
        headcount: 3,
        hasElderlyOrInfant: false,
        hasMedicalCondition: false,
        description: 'Access road has 1.5 feet of water. Cannot drive standard three-wheeler or car.',
      }
    }
  ];

  const handleRunTriage = async () => {
    setEvaluating(true);
    try {
      const result = await evaluateTriage(params);
      setTriageResult(result);
    } catch (err) {
      alert('Triage evaluation error.');
    } finally {
      setEvaluating(false);
    }
  };

  const applyPreset = (presetData) => {
    setParams(presetData);
    setTriageResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Optional AI Feature · Rubric Enhancement
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              AI Emergency Disaster Triage & Urgency Evaluator
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This algorithmic AI module analyzes incident reports, vulnerability factors, and water depths in real-time to compute objective urgency scores (0–100) and direct Sri Lanka Navy, Air Force, and DMC resources to life-threatening incidents first.
        </p>

        {/* Preset buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Load Real Sri Lankan Test Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.data)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Simulator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Factors Editor */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Incident Vulnerability Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Type</label>
            <select
              value={params.emergencyType}
              onChange={(e) => setParams({ ...params, emergencyType: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm"
            >
              <option value="Boat Evacuation">Boat Evacuation (Stranded)</option>
              <option value="Rooftop Rescue">Rooftop Rescue (Water in House)</option>
              <option value="Medical Emergency">Medical Emergency / Medicine</option>
              <option value="Food & Water">Food & Clean Drinking Water</option>
              <option value="Safe Transport">Safe Transport to Camp</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Water Level Depth</label>
            <select
              value={params.waterLevelDescription}
              onChange={(e) => setParams({ ...params, waterLevelDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm"
            >
              <option value="Ankle Level">Ankle Level (Submerged road)</option>
              <option value="Knee Level">Knee Level (Entering garden)</option>
              <option value="Waist Level">Waist Level (Ground floor flooded)</option>
              <option value="Ceiling Level / Rooftop">Ceiling Level / Rooftop (Critical)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Headcount (People Trapped)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={params.headcount}
              onChange={(e) => setParams({ ...params, headcount: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
              <input
                type="checkbox"
                checked={params.hasElderlyOrInfant}
                onChange={(e) => setParams({ ...params, hasElderlyOrInfant: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600"
              />
              <span>Includes infants, toddlers, or elderly (&gt;75 yrs)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
              <input
                type="checkbox"
                checked={params.hasMedicalCondition}
                onChange={(e) => setParams({ ...params, hasMedicalCondition: e.target.checked })}
                className="w-4 h-4 rounded text-red-600"
              />
              <span>Critical illness or life-saving prescription required</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Incident Details (Text Analyzer)</label>
            <textarea
              rows="3"
              value={params.description}
              onChange={(e) => setParams({ ...params, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm"
            />
          </div>

          <button
            onClick={handleRunTriage}
            disabled={evaluating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {evaluating ? 'Evaluating Severity Model...' : 'Calculate AI Urgency Score'}
          </button>
        </div>

        {/* Right: Triage Output */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" /> AI Triage Assessment Output
            </h3>

            {triageResult ? (
              <div className="space-y-4 animate-in fade-in">
                
                {/* Score Dial */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Assigned Priority Score
                    </span>
                    <span className="text-4xl font-black text-slate-900">
                      {triageResult.score} <span className="text-sm text-slate-400 font-normal">/ 100</span>
                    </span>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                    triageResult.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700 border-red-200' :
                    triageResult.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-sky-100 text-sky-800 border-sky-200'
                  }`}>
                    {triageResult.urgency}
                  </span>
                </div>

                {/* Risk Factors */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Detected Risk Multipliers:
                  </span>
                  <div className="space-y-1.5">
                    {triageResult.riskFactors.map((rf, idx) => (
                      <div key={idx} className="bg-red-50 text-red-800 text-xs p-2 rounded-lg border border-red-100 flex items-start gap-1.5 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                        {rf}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Operational Action */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-950 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-purple-700 block">
                    Recommended Dispatch Action:
                  </span>
                  <p className="font-medium">
                    {triageResult.recommendedAction}
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                <p>Click "Calculate AI Urgency Score" or select a preset to test the triage model.</p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 pt-4 border-t border-slate-100 text-center">
            Model grounds scoring in Sri Lanka Disaster Management Centre flood risk guidelines.
          </p>
        </div>

      </div>

    </div>
  );
}
