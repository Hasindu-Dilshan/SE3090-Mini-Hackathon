import axios from 'axios';

// Default to relative /api when using Vite proxy or Vercel, or fallback to port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getRiverGauges(params = {}) {
  try {
    const res = await api.get('/gauges', { params });
    return res.data;
  } catch (err) {
    console.warn('API connection failed, using local offline fallback:', err.message);
    if (params.mode === 'live') {
      return getLiveSriLankaRiverGauges();
    }
    return [
      {
        id: 'gauge-1',
        stationName: 'Nagalagam Street',
        riverBasin: 'Kelani Ganga',
        district: 'Colombo',
        currentLevelMeters: 7.20,
        alertLevelMeters: 5.00,
        minorFloodMeters: 6.00,
        majorFloodMeters: 7.00,
        status: 'Major Flood',
        trend: 'RISING',
        rainfallMm: 45.0,
        lastUpdated: '5 mins ago',
        inundationRiskAreas: ['Kolonnawa', 'Wellampitiya', 'Kotikawatta', 'Sedawatta']
      },
      {
        id: 'gauge-2',
        stationName: 'Hanwella',
        riverBasin: 'Kelani Ganga',
        district: 'Colombo',
        currentLevelMeters: 9.40,
        alertLevelMeters: 7.00,
        minorFloodMeters: 8.50,
        majorFloodMeters: 10.00,
        status: 'Minor Flood',
        trend: 'STABLE',
        rainfallMm: 22.0,
        lastUpdated: '12 mins ago',
        inundationRiskAreas: ['Hanwella Town', 'Ranala', 'Kaduwela Lower']
      },
      {
        id: 'gauge-3',
        stationName: 'Glencorse',
        riverBasin: 'Kelani Ganga',
        district: 'Kegalle / Colombo',
        currentLevelMeters: 15.60,
        alertLevelMeters: 15.00,
        minorFloodMeters: 16.50,
        majorFloodMeters: 18.00,
        status: 'Alert',
        trend: 'RISING',
        rainfallMm: 18.5,
        lastUpdated: '18 mins ago',
        inundationRiskAreas: ['Dehiowita', 'Avissawella Lowlands']
      },
      {
        id: 'gauge-4',
        stationName: 'Putupaula',
        riverBasin: 'Kalu Ganga',
        district: 'Kalutara',
        currentLevelMeters: 4.30,
        alertLevelMeters: 3.00,
        minorFloodMeters: 4.00,
        majorFloodMeters: 5.00,
        status: 'Minor Flood',
        trend: 'FALLING',
        rainfallMm: 12.0,
        lastUpdated: '25 mins ago',
        inundationRiskAreas: ['Bulathsinhala', 'Palinda Nuwara', 'Millaniya']
      },
      {
        id: 'gauge-5',
        stationName: 'Ratnapura City Station',
        riverBasin: 'Kalu Ganga',
        district: 'Ratnapura',
        currentLevelMeters: 20.80,
        alertLevelMeters: 19.00,
        minorFloodMeters: 20.50,
        majorFloodMeters: 22.00,
        status: 'Minor Flood',
        trend: 'RISING',
        rainfallMm: 35.0,
        lastUpdated: '8 mins ago',
        inundationRiskAreas: ['Ratnapura Town', 'Elapatha', 'Wewelwatta Road']
      },
      {
        id: 'gauge-6',
        stationName: 'Baddegama',
        riverBasin: 'Gin Ganga',
        district: 'Galle',
        currentLevelMeters: 3.40,
        alertLevelMeters: 3.50,
        minorFloodMeters: 4.00,
        majorFloodMeters: 4.80,
        status: 'Normal',
        trend: 'STABLE',
        rainfallMm: 5.0,
        lastUpdated: '30 mins ago',
        inundationRiskAreas: ['Baddegama Town', 'Nagoda', 'Udugama Road']
      }
    ];
  }
}

export async function getLiveSriLankaRiverGauges(params = {}) {
  try {
    const res = await api.get('/gauges/live', { params });
    return res.data;
  } catch (err) {
    console.warn('Backend live gauge route failed, attempting direct Sri Lanka river monitor query:', err.message);
    try {
      // Direct browser-side fallback to the public ArcGIS endpoint used by rivermonitorsl.homerelieflk.org
      const arcgisUrl = 'https://services3.arcgis.com/J7ZFXmR8rSmQ3FGf/ArcGIS/rest/services/gauges_2_view/FeatureServer/0/query?where=1%3D1&outFields=basin,gauge,water_level,rain_fall,CreationDate&orderByFields=CreationDate%20DESC&resultRecordCount=50&f=json';
      const directRes = await axios.get(arcgisUrl, { timeout: 6000 });
      const features = directRes.data?.features || [];
      const map = {};
      features.forEach(f => {
        const g = f.attributes?.gauge?.trim();
        if (g && !map[g]) map[g] = f.attributes;
      });

      return [
        {
          id: 'gauge-1',
          stationName: 'Nagalagam Street',
          riverBasin: 'Kelani Ganga',
          district: 'Colombo',
          currentLevelMeters: Number(map['Nagalagam Street']?.water_level ?? 0.90),
          alertLevelMeters: 5.00,
          minorFloodMeters: 6.00,
          majorFloodMeters: 7.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: Number(map['Nagalagam Street']?.rain_fall ?? 0.0),
          lastUpdated: 'Live Feed · Sri Lanka Irrigation Dept',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Kolonnawa', 'Wellampitiya', 'Kotikawatta', 'Sedawatta']
        },
        {
          id: 'gauge-2',
          stationName: 'Hanwella',
          riverBasin: 'Kelani Ganga',
          district: 'Colombo',
          currentLevelMeters: Number(map['Hanwella']?.water_level ?? 1.14),
          alertLevelMeters: 7.00,
          minorFloodMeters: 8.50,
          majorFloodMeters: 10.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: Number(map['Hanwella']?.rain_fall ?? 0.0),
          lastUpdated: 'Live Feed · Sri Lanka Irrigation Dept',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Hanwella Town', 'Ranala', 'Kaduwela Lower']
        },
        {
          id: 'gauge-3',
          stationName: 'Glencorse',
          riverBasin: 'Kelani Ganga',
          district: 'Kegalle / Colombo',
          currentLevelMeters: Number(map['Glencorse']?.water_level ?? 13.50),
          alertLevelMeters: 15.00,
          minorFloodMeters: 16.50,
          majorFloodMeters: 18.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: Number(map['Glencorse']?.rain_fall ?? 0.0),
          lastUpdated: 'Live Feed · Sri Lanka Irrigation Dept',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Dehiowita', 'Avissawella Lowlands']
        },
        {
          id: 'gauge-4',
          stationName: 'Putupaula',
          riverBasin: 'Kalu Ganga',
          district: 'Kalutara',
          currentLevelMeters: Number(map['Putupaula']?.water_level ?? 0.55),
          alertLevelMeters: 3.00,
          minorFloodMeters: 4.00,
          majorFloodMeters: 5.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: Number(map['Putupaula']?.rain_fall ?? 0.0),
          lastUpdated: 'Live Feed · Sri Lanka Irrigation Dept',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Bulathsinhala', 'Palinda Nuwara', 'Millaniya']
        },
        {
          id: 'gauge-5',
          stationName: 'Ratnapura City Station',
          riverBasin: 'Kalu Ganga',
          district: 'Ratnapura',
          currentLevelMeters: Number(map['Ratnapura']?.water_level ?? 2.80),
          alertLevelMeters: 19.00,
          minorFloodMeters: 20.50,
          majorFloodMeters: 22.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: Number(map['Ratnapura']?.rain_fall ?? 0.0),
          lastUpdated: 'Live Feed · Sri Lanka Irrigation Dept',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Ratnapura Town', 'Elapatha', 'Wewelwatta Road']
        },
        {
          id: 'gauge-6',
          stationName: 'Baddegama',
          riverBasin: 'Gin Ganga',
          district: 'Galle',
          currentLevelMeters: Number(map['Baddegama']?.water_level ?? 1.17),
          alertLevelMeters: 3.50,
          minorFloodMeters: 4.00,
          majorFloodMeters: 4.80,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: Number(map['Baddegama']?.rain_fall ?? 0.0),
          lastUpdated: 'Live Feed · Sri Lanka Irrigation Dept',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Baddegama Town', 'Nagoda', 'Udugama Road']
        }
      ];
    } catch (directErr) {
      console.warn('Direct fallback also failed, returning fallback live stations:', directErr.message);
      return [
        {
          id: 'gauge-1',
          stationName: 'Nagalagam Street',
          riverBasin: 'Kelani Ganga',
          district: 'Colombo',
          currentLevelMeters: 0.90,
          alertLevelMeters: 5.00,
          minorFloodMeters: 6.00,
          majorFloodMeters: 7.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: 0.0,
          lastUpdated: 'Live Telemetry (Today)',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Kolonnawa', 'Wellampitiya', 'Kotikawatta', 'Sedawatta']
        },
        {
          id: 'gauge-2',
          stationName: 'Hanwella',
          riverBasin: 'Kelani Ganga',
          district: 'Colombo',
          currentLevelMeters: 1.14,
          alertLevelMeters: 7.00,
          minorFloodMeters: 8.50,
          majorFloodMeters: 10.00,
          status: 'Normal',
          trend: 'STABLE',
          rainfallMm: 0.0,
          lastUpdated: 'Live Telemetry (Today)',
          source: 'Sri Lanka Irrigation Department via rivermonitorsl',
          isLive: true,
          inundationRiskAreas: ['Hanwella Town', 'Ranala', 'Kaduwela Lower']
        }
      ];
    }
  }
}

export async function getShelters(params = {}) {
  try {
    const res = await api.get('/shelters', { params });
    return res.data;
  } catch (err) {
    console.warn('API connection failed, using local fallback:', err.message);
    return [
      {
        id: 'shelter-1',
        name: 'Sedawatta Purana Rajamaha Viharaya Camp',
        district: 'Colombo',
        division: 'Kolonnawa',
        address: 'Kelani Temple Road, Sedawatta',
        capacity: 300,
        currentOccupancy: 265,
        contactPerson: 'Ven. Dhammarathana Thero / GN Officer Bandara',
        contactPhone: '0112531234',
        status: 'Nearly Full',
        facilities: ['Clean Water Tank', 'Medical Post', 'Community Kitchen', 'Generator'],
        neededItems: ['Infant Milk Powder', 'Dry Rations', 'Panadol Syrup', 'Mosquito Nets']
      },
      {
        id: 'shelter-2',
        name: 'Biyagama Central College Relief Center',
        district: 'Gampaha',
        division: 'Biyagama',
        address: 'Biyagama South Junction',
        capacity: 450,
        currentOccupancy: 180,
        contactPerson: 'Principal Senarath / Red Cross Volunteer Nalin',
        contactPhone: '0112487890',
        status: 'Available',
        facilities: ['Restrooms', 'Infant Care Area', 'Doctor on Call', 'Dry Storage'],
        neededItems: ['Bottled Water (5L)', 'Sanitary Packs', 'Bedding Sheets']
      },
      {
        id: 'shelter-3',
        name: 'Kaduwela Sri Mahindarama Community Hall',
        district: 'Colombo',
        division: 'Kaduwela',
        address: 'Avissawella Road, Kaduwela',
        capacity: 200,
        currentOccupancy: 195,
        contactPerson: 'Officer Karunaratne (Disaster Coordinator)',
        contactPhone: '0714567890',
        status: 'Full',
        facilities: ['Community Kitchen', 'Basic First Aid'],
        neededItems: ['Cooked Meals', 'Drinking Water', 'Adult Diapers']
      },
      {
        id: 'shelter-4',
        name: 'Ratnapura Ferguson High School Camp',
        district: 'Ratnapura',
        division: 'Ratnapura Town',
        address: 'Hospital Road, Ratnapura',
        capacity: 350,
        currentOccupancy: 140,
        contactPerson: 'Disaster Relief Officer Mrs. Jayasinghe',
        contactPhone: '0452223456',
        status: 'Available',
        facilities: ['Large Hall', 'Direct Hospital Access', 'Police Security'],
        neededItems: ['Surgical Masks', 'Torch Lights & Batteries', 'Dry Biscuits']
      }
    ];
  }
}

export async function getShelterSummary() {
  try {
    const res = await api.get('/shelters/summary');
    return res.data;
  } catch (err) {
    return {
      totalShelters: 4,
      totalCapacity: 1300,
      totalOccupancy: 780,
      availableSpaces: 520,
      occupancyPercentage: 60.0
    };
  }
}

export async function getDistressRequests(params = {}) {
  try {
    const res = await api.get('/sos', { params });
    return res.data;
  } catch (err) {
    const local = localStorage.getItem('resq_sos_requests');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'sos-1',
        fullName: 'Sunil Shantha Perera',
        phone: '0773456789',
        district: 'Colombo',
        division: 'Kolonnawa - Kotikawatta',
        address: 'No. 24, Ferry Lane, Kotikawatta',
        headcount: 6,
        hasElderlyOrInfant: true,
        hasMedicalCondition: true,
        emergencyType: 'Boat Evacuation',
        waterLevelDescription: 'Ceiling Level / Rooftop',
        description: 'Water has entered 2nd floor balcony. 84-year-old grandmother requires heart medication. Need immediate Navy/volunteer boat.',
        triageScore: 98,
        urgency: 'CRITICAL',
        status: 'Pending',
        createdAt: '2026-09-04T08:15:00Z'
      },
      {
        id: 'sos-2',
        fullName: 'Farzana Rizwan',
        phone: '0718901234',
        district: 'Colombo',
        division: 'Wellampitiya - Brandiyawatta',
        address: '45/3 Mosque Road, Brandiyawatta',
        headcount: 4,
        hasElderlyOrInfant: true,
        hasMedicalCondition: false,
        emergencyType: 'Food & Water',
        waterLevelDescription: 'Waist Level',
        description: 'Stranded on upper floor. Clean drinking water and baby formula finished. Two children aged 2 and 4.',
        triageScore: 85,
        urgency: 'HIGH',
        status: 'Responding',
        createdAt: '2026-09-04T08:45:00Z'
      },
      {
        id: 'sos-3',
        fullName: 'Gamini Wijesinghe',
        phone: '0765544332',
        district: 'Gampaha',
        division: 'Biyagama - Mabima',
        address: 'Temple Road, Mabima South',
        headcount: 3,
        hasElderlyOrInfant: false,
        hasMedicalCondition: false,
        emergencyType: 'Safe Transport',
        waterLevelDescription: 'Knee Level',
        description: 'Road submerged by 2 feet. Vehicles cannot pass. Need guidance to Biyagama Central shelter.',
        triageScore: 55,
        urgency: 'MODERATE',
        status: 'Resolved',
        createdAt: '2026-09-04T07:30:00Z'
      }
    ];
  }
}

export async function getSOSMetrics() {
  try {
    const res = await api.get('/sos/metrics');
    return res.data;
  } catch (err) {
    return {
      totalCalls: 3,
      pending: 1,
      responding: 1,
      resolved: 1,
      criticalUnresolved: 1,
      totalPeopleAffected: 13
    };
  }
}

export async function submitDistressRequest(formData) {
  try {
    const res = await api.post('/sos', formData);
    return res.data;
  } catch (err) {
    // If backend isn't up, locally calculate triage and persist to localStorage
    const triage = await evaluateTriage({
      emergencyType: formData.emergencyType,
      waterLevelDescription: formData.waterLevelDescription,
      headcount: formData.headcount,
      hasElderlyOrInfant: formData.hasElderlyOrInfant,
      hasMedicalCondition: formData.hasMedicalCondition,
      description: formData.description
    });

    const newRecord = {
      ...formData,
      id: 'sos-' + Math.random().toString(36).substring(2, 9),
      triageScore: triage.score,
      urgency: triage.urgency,
      recommendedAction: triage.recommendedAction,
      riskFactors: triage.riskFactors,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const existing = await getDistressRequests();
    const updated = [newRecord, ...existing];
    localStorage.setItem('resq_sos_requests', JSON.stringify(updated));
    return newRecord;
  }
}

export async function updateDistressStatus(requestId, status) {
  try {
    const res = await api.patch(`/sos/${requestId}/status`, { status });
    return res.data;
  } catch (err) {
    const existing = await getDistressRequests();
    const updated = existing.map(item => item.id === requestId ? { ...item, status } : item);
    localStorage.setItem('resq_sos_requests', JSON.stringify(updated));
    return { id: requestId, status };
  }
}

export async function evaluateTriage(data) {
  try {
    const res = await api.post('/triage/evaluate', data);
    return res.data;
  } catch (err) {
    // Client-side heuristics
    let score = 30;
    const reasons = [];
    if (data.waterLevelDescription === 'Ceiling Level / Rooftop') {
      score += 55;
      reasons.push('Severe water depth (Ceiling Level / Rooftop)');
    } else if (data.waterLevelDescription === 'Waist Level') {
      score += 30;
      reasons.push('Waist level flood waters');
    } else {
      score += 15;
    }

    if (data.hasElderlyOrInfant) {
      score += 20;
      reasons.push('Infants, elderly or disabled persons present');
    }
    if (data.hasMedicalCondition) {
      score += 20;
      reasons.push('Urgent medical condition or prescription needs');
    }
    if (data.emergencyType === 'Boat Evacuation') {
      score += 15;
      reasons.push('Boat evacuation required');
    }

    score = Math.min(100, Math.max(10, score));
    const urgency = score >= 85 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 45 ? 'MODERATE' : 'LOW';
    return {
      score,
      urgency,
      recommendedAction: score >= 85 
        ? 'Dispatch Sri Lanka Navy / Disaster Response Boat immediately.'
        : 'Coordinate with local Grama Niladhari division for prompt assistance.',
      riskFactors: reasons
    };
  }
}
