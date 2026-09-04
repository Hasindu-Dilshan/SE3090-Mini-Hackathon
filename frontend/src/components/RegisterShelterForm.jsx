import React, { useState } from 'react';
import { ShieldCheck, Send, CheckCircle2, Phone, MapPin, Users, PackageOpen, Check, Building2, Plus, X } from 'lucide-react';
import { submitShelter } from '../api/client';

const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Ratnapura',
  'Galle',
  'Matara',
  'Kegalle',
  'Kurunegala',
  'Puttalam',
  'Kandy',
  'Badulla'
];

const PRESET_FACILITIES = [
  'Clean Water Tank',
  'Medical Post',
  'Community Kitchen',
  'Generator Power',
  'Restrooms',
  'Infant Care Area',
  'Doctor on Call',
  'Dry Storage',
  'Large Assembly Hall',
  'Police Security'
];

const COMMON_NEEDED_ITEMS = [
  'Infant Milk Powder',
  'Dry Rations',
  'Bottled Water (5L)',
  'Panadol / Paracetamol',
  'Mosquito Nets',
  'Sanitary Packs',
  'Bedding Sheets',
  'Cooked Meals',
  'Torch Lights & Batteries',
  'Baby Diapers'
];

export default function RegisterShelterForm({ onShelterRegistered, onNavigateToDirectory }) {
  const [formData, setFormData] = useState({
    name: '',
    district: 'Colombo',
    division: '',
    address: '',
    capacity: 250,
    currentOccupancy: 0,
    contactPerson: '',
    contactPhone: '',
    status: 'Available',
    facilities: ['Clean Water Tank', 'Community Kitchen', 'Restrooms'],
    neededItems: ['Bottled Water (5L)', 'Dry Rations']
  });

  const [customItem, setCustomItem] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  const SL_PHONE_REGEX = /^(\+94|0)[0-9]{9}$/;

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Camp or shelter name is required (e.g., Sedawatta Purana Rajamaha Viharaya).';
    } else if (formData.name.trim().length < 4) {
      errs.name = 'Camp name should be at least 4 characters long.';
    }

    if (!formData.division.trim()) {
      errs.division = 'Grama Niladhari division or area name is required (e.g., Kolonnawa, Biyagama).';
    }

    if (!formData.address.trim()) {
      errs.address = 'Detailed address or landmark is required for displaced families to locate the camp.';
    } else if (formData.address.trim().length < 5) {
      errs.address = 'Please provide more specific directions or nearest road.';
    }

    const cap = parseInt(formData.capacity, 10);
    if (isNaN(cap) || cap < 1) {
      errs.capacity = 'Total bed/lodging capacity must be at least 1 space.';
    } else if (cap > 10000) {
      errs.capacity = 'Capacity exceeds reasonable camp limits (maximum 10,000).';
    }

    const occ = parseInt(formData.currentOccupancy, 10);
    if (isNaN(occ) || occ < 0) {
      errs.currentOccupancy = 'Current occupancy cannot be negative.';
    } else if (occ > cap) {
      errs.currentOccupancy = `Current occupancy (${occ}) cannot exceed total camp capacity (${cap}).`;
    }

    if (!formData.contactPerson.trim()) {
      errs.contactPerson = 'Coordinator name or designated GN officer is required.';
    } else if (formData.contactPerson.trim().length < 3) {
      errs.contactPerson = 'Contact name should be at least 3 characters long.';
    }

    const cleanPhone = formData.contactPhone.replace(/[\s\-()]/g, '');
    if (!cleanPhone) {
      errs.contactPhone = 'Camp coordinator phone number is required.';
    } else if (!SL_PHONE_REGEX.test(cleanPhone)) {
      errs.contactPhone = 'Please enter a valid Sri Lankan phone number (e.g., 011 253 1234 or 077 123 4567).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleFacility = (facility) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility]
      };
    });
  };

  const toggleNeededItem = (item) => {
    setFormData((prev) => {
      const exists = prev.neededItems.includes(item);
      return {
        ...prev,
        neededItems: exists
          ? prev.neededItems.filter((i) => i !== item)
          : [...prev.neededItems, item]
      };
    });
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    const trimmed = customItem.trim();
    if (trimmed && !formData.neededItems.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        neededItems: [...prev.neededItems, trimmed]
      }));
      setCustomItem('');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      neededItems: prev.neededItems.filter((i) => i !== itemToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const cap = parseInt(formData.capacity, 10);
      const occ = parseInt(formData.currentOccupancy, 10);
      const ratio = occ / cap;
      const computedStatus = ratio >= 1.0 ? 'Full' : ratio >= 0.8 ? 'Nearly Full' : 'Available';

      const payload = {
        ...formData,
        capacity: cap,
        currentOccupancy: occ,
        status: computedStatus,
        facilities: formData.facilities,
        neededItems: formData.neededItems
      };

      const result = await submitShelter(payload);
      setSuccessResult(result);
      if (onShelterRegistered) onShelterRegistered(result);
    } catch (err) {
      alert('Error registering relief shelter. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successResult) {
    const freeSpaces = Math.max(0, successResult.capacity - successResult.currentOccupancy);
    const occPct = Math.min(100, Math.round((successResult.currentOccupancy / successResult.capacity) * 100));

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Relief Shelter Registered
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Camp Added to Emergency Directory!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Your safe haven camp is now published and visible to disaster relief committees, volunteer flotillas, and flood-displaced families.
          </p>
        </div>

        {/* Camp Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
                {successResult.district} District · {successResult.division}
              </span>
              <h3 className="text-base font-black text-slate-900">
                {successResult.name}
              </h3>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              successResult.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {successResult.status}
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {successResult.address}
          </p>

          {/* Occupancy bar */}
          <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Occupancy: <strong>{successResult.currentOccupancy} / {successResult.capacity}</strong></span>
              <span className="font-bold text-slate-900">{occPct}% Full</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${occPct >= 90 ? 'bg-red-500' : occPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${occPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 text-right">
              <span className="font-bold text-emerald-600">{freeSpaces} beds available</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span>Coordinator: <strong>{successResult.contactPerson}</strong></span>
            <span className="font-mono">{successResult.contactPhone}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onNavigateToDirectory && (
            <button
              onClick={onNavigateToDirectory}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
              View in Shelter Directory &rarr;
            </button>
          )}
          <button
            onClick={() => {
              setSuccessResult(null);
              setFormData({
                name: '',
                district: 'Colombo',
                division: '',
                address: '',
                capacity: 250,
                currentOccupancy: 0,
                contactPerson: '',
                contactPhone: '',
                status: 'Available',
                facilities: ['Clean Water Tank', 'Community Kitchen', 'Restrooms'],
                neededItems: ['Bottled Water (5L)', 'Dry Rations']
              });
            }}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all"
          >
            Register Another Camp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-400/30">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Disaster Management & Relief Committee Portal
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Register Relief Shelter & Safe Haven Camp
        </h2>
        <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl leading-relaxed">
          Designate temples, schools, and community centers as official flood evacuation shelters in Sri Lanka to balance community occupancy and route relief donations.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Section 1: Camp Location & Name */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" /> 1. Shelter Identification & Location
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Camp or Facility Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sedawatta Purana Rajamaha Viharaya Camp / Biyagama Central College"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.name ? 'border-red-400 focus:ring-red-200 bg-red-50/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {errors.name && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d} District</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grama Niladhari (GN) Division / Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="division"
                value={formData.division}
                onChange={handleChange}
                placeholder="e.g., Kolonnawa, Wellampitiya, Mabima"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.division ? 'border-red-400 focus:ring-red-200 bg-red-50/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.division && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.division}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Address & Landmarks <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., Kelani Temple Road, Sedawatta (Near Bridge Junction)"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.address ? 'border-red-400 focus:ring-red-200 bg-red-50/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {errors.address && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.address}</p>}
          </div>
        </div>

        {/* Section 2: Capacity & Coordinator */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-600" /> 2. Safe Lodging Capacity & Coordinator
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Bed / Hall Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                max="10000"
                value={formData.capacity}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.capacity ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.capacity && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.capacity}</p>}
              <span className="text-[11px] text-slate-400 mt-0.5 block">Max persons the facility can house safely</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Number of Occupants
              </label>
              <input
                type="number"
                name="currentOccupancy"
                min="0"
                value={formData.currentOccupancy}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.currentOccupancy ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.currentOccupancy && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.currentOccupancy}</p>}
              <span className="text-[11px] text-slate-400 mt-0.5 block">Persons currently residing at the camp</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Camp Coordinator / Person in Charge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="e.g., Ven. Dhammarathana Thero / Officer Bandara"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.contactPerson ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.contactPerson && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.contactPerson}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Coordinator Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="e.g., 011 253 1234 or 077 123 4567"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.contactPhone ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.contactPhone && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.contactPhone}</p>}
              <span className="text-[11px] text-slate-400 mt-0.5 block">Sri Lankan landline or mobile</span>
            </div>
          </div>
        </div>

        {/* Section 3: Facilities Checkboxes */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> 3. Available On-Site Facilities
          </h3>
          <p className="text-xs text-slate-500">
            Select all provisions ready for evacuees at this facility:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {PRESET_FACILITIES.map((facility) => {
              const checked = formData.facilities.includes(facility);
              return (
                <button
                  type="button"
                  key={facility}
                  onClick={() => toggleFacility(facility)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center gap-2 ${
                    checked
                      ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 text-white ${
                    checked ? 'bg-sky-600' : 'border border-slate-300 bg-white'
                  }`}>
                    {checked && <Check className="w-3 h-3" />}
                  </span>
                  <span className="truncate">{facility}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Urgent Relief Supplies Needed */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <PackageOpen className="w-4 h-4 text-amber-600" /> 4. Urgent Relief Supplies & Donation Needs
          </h3>
          <p className="text-xs text-slate-500">
            Click to tag items that local volunteers and donors should supply to this camp:
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_NEEDED_ITEMS.map((item) => {
              const selected = formData.neededItems.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleNeededItem(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    selected
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {selected ? `✓ ${item}` : `+ ${item}`}
                </button>
              );
            })}
          </div>

          {/* Custom item input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder="Add another specific item (e.g., D-Battery Torches)..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Selected tags list */}
          {formData.neededItems.length > 0 && (
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold text-amber-800 mr-1">Current Donation List:</span>
              {formData.neededItems.map((item) => (
                <span
                  key={item}
                  className="bg-white border border-amber-200 text-amber-900 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    className="hover:text-red-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Registering Camp...' : 'Publish Relief Camp to Directory'}
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Published camps will appear with live capacity meters in the Community Shelter Directory.
          </p>
        </div>

      </form>

    </div>
  );
}
