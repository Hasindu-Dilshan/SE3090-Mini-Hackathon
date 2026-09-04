import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, Phone, MapPin, Sparkles } from 'lucide-react';
import { submitDistressRequest } from '../api/client';

export default function EmergencyRequestForm({ onRequestSubmitted, onNavigateToBoard }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    district: 'Colombo',
    division: '',
    address: '',
    headcount: 1,
    hasElderlyOrInfant: false,
    hasMedicalCondition: false,
    emergencyType: 'Boat Evacuation',
    waterLevelDescription: 'Waist Level',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  const SL_PHONE_REGEX = /^(\+94|0)[0-9]{9}$/;

  const validate = () => {
    const errs = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required so rescue teams know who to contact.';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Name should be at least 3 characters long.';
    }

    const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Contact phone number is required.';
    } else if (!SL_PHONE_REGEX.test(cleanPhone)) {
      errs.phone = 'Please enter a valid Sri Lankan phone number (e.g. 077 123 4567 or +94771234567).';
    }

    if (!formData.division.trim()) {
      errs.division = 'Grama Niladhari division or village name is required for local rescue routing.';
    }

    if (!formData.address.trim()) {
      errs.address = 'Specific address, landmark or road name is required.';
    } else if (formData.address.trim().length < 5) {
      errs.address = 'Please provide more details (landmarks, house number, nearest temple/school).';
    }

    const count = parseInt(formData.headcount, 10);
    if (isNaN(count) || count < 1) {
      errs.headcount = 'Headcount must be at least 1 person.';
    } else if (count > 500) {
      errs.headcount = 'For large community evacuations (>500), please call DMC Hotline 117 directly.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        headcount: parseInt(formData.headcount, 10),
      };
      const result = await submitDistressRequest(payload);
      setSuccessResult(result);
      if (onRequestSubmitted) onRequestSubmitted(result);
    } catch (err) {
      alert('Error submitting emergency request. Please try again or dial 117.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-emerald-200 shadow-lg text-center space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            SOS Request Dispatched
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Emergency Alert Registered Successfully!
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Your distress request is now visible to the Sri Lanka Navy, volunteer boat responders, and Grama Niladhari relief coordinators.
          </p>
        </div>

        {/* AI Triage Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-sky-600" /> AI Triage Assessment:
            </span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              successResult.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {successResult.urgency} (Priority Score: {successResult.triageScore}/100)
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">
            <strong>Recommended Action:</strong> {successResult.recommendedAction}
          </p>
          <p className="text-[11px] text-slate-500">
            <strong>Dispatch ID:</strong> {successResult.id} · Registered for: {successResult.fullName} ({successResult.headcount} persons)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setSuccessResult(null);
              setFormData({
                fullName: '',
                phone: '',
                district: 'Colombo',
                division: '',
                address: '',
                headcount: 1,
                hasElderlyOrInfant: false,
                hasMedicalCondition: false,
                emergencyType: 'Boat Evacuation',
                waterLevelDescription: 'Waist Level',
                description: '',
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Submit Another Request
          </button>

          <button
            onClick={onNavigateToBoard}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white shadow transition-all"
          >
            View on Live Dispatch Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Form Header */}
      <div className="bg-red-600 text-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center text-white flex-shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-200">
              Community Emergency Dispatch
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Request Flood Evacuation or Emergency Relief
            </h2>
            <p className="text-xs sm:text-sm text-red-100 mt-0.5">
              Fill this verified form to immediately alert rescue boats, tri-forces, and volunteer response units in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name or Contact Person *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., Sunil Perera"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.fullName ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-sky-500'
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Sri Lankan Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Contact Phone Number *</span>
              <span className="text-[10px] text-slate-400 font-normal">Sri Lankan mobile (07X)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="077 123 4567 or +94771234567"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                  errors.phone ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.phone}</p>
            )}
          </div>

        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Administrative District *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
            >
              <option value="Colombo">Colombo (Kelani Basin / Kolonnawa / Kaduwela)</option>
              <option value="Gampaha">Gampaha (Biyagama / Kelaniya / Wattala)</option>
              <option value="Kalutara">Kalutara (Kalu Basin / Bulathsinhala)</option>
              <option value="Ratnapura">Ratnapura (Kalu Basin / Elapatha)</option>
              <option value="Galle">Galle (Gin Ganga / Baddegama)</option>
              <option value="Matara">Matara (Nilwala Basin)</option>
              <option value="Kegalle">Kegalle (Dehiowita / Avissawella)</option>
            </select>
          </div>

          {/* GN Division */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Grama Niladhari (GN) Division or Village *
            </label>
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              placeholder="e.g., Kolonnawa 512, Kotikawatta East"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.division ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-sky-500'
              }`}
            />
            {errors.division && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.division}</p>
            )}
          </div>

        </div>

        {/* Specific Address & Landmark */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Exact Location, House Number, Road & Landmarks *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., No. 34, Ferry Road, 200m past the temple towards canal bank (Yellow 2-storey house)"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.address ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-sky-500'
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-red-600 font-medium mt-1">{errors.address}</p>
          )}
        </div>

        {/* Emergency Type, Headcount, Water Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Emergency Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Emergency Assistance Needed *
            </label>
            <select
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
            >
              <option value="Boat Evacuation">Boat Evacuation (Stranded)</option>
              <option value="Rooftop Rescue">Rooftop Rescue (Water in House)</option>
              <option value="Medical Emergency">Medical Emergency / Medicine</option>
              <option value="Food & Water">Food & Clean Drinking Water</option>
              <option value="Safe Transport">Safe Road Transport to Camp</option>
            </select>
          </div>

          {/* Current Water Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Current Water Depth *
            </label>
            <select
              name="waterLevelDescription"
              value={formData.waterLevelDescription}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
            >
              <option value="Ankle Level">Ankle Level (Submerged road)</option>
              <option value="Knee Level">Knee Level (Entering garden)</option>
              <option value="Waist Level">Waist Level (Ground floor submerged)</option>
              <option value="Ceiling Level / Rooftop">Ceiling / Rooftop (Critical)</option>
            </select>
          </div>

          {/* Headcount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Persons Trapped / Needing Help *
            </label>
            <input
              type="number"
              name="headcount"
              min="1"
              max="500"
              value={formData.headcount}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.headcount ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-sky-500'
              }`}
            />
            {errors.headcount && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.headcount}</p>
            )}
          </div>

        </div>

        {/* Vulnerability Checklist */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Vulnerability Factors (Assists AI Triage Priority):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasElderlyOrInfant"
                checked={formData.hasElderlyOrInfant}
                onChange={handleChange}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="text-slate-700 font-medium">
                Infants, toddlers, pregnant mothers, or elderly present
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasMedicalCondition"
                checked={formData.hasMedicalCondition}
                onChange={handleChange}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-slate-700 font-medium">
                Bedridden, oxygen-dependent, or urgent medication needed
              </span>
            </label>
          </div>
        </div>

        {/* Additional Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Urgent Notes / Special Circumstances (Optional)
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Power is disconnected, water rising rapidly from nearby canal, grandmother has high fever, need infant milk formula..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
          >
            {submitting ? (
              <span>Submitting SOS & Calculating AI Triage...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Dispatch Emergency Request (Submit SOS)
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Your request will be prioritized automatically using our AI triage assessment protocol.
          </p>
        </div>

      </form>

    </div>
  );
}
