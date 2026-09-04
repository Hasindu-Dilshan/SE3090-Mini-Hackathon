import uuid
from datetime import datetime, timezone
from database import db_manager

SAMPLE_GAUGES = [
    {
        'id': 'gauge-1',
        'stationName': 'Nagalagam Street',
        'riverBasin': 'Kelani Ganga',
        'district': 'Colombo',
        'currentLevelMeters': 7.20,
        'alertLevelMeters': 5.00,
        'minorFloodMeters': 6.00,
        'majorFloodMeters': 7.00,
        'status': 'Major Flood',
        'trend': 'RISING',
        'lastUpdated': '5 mins ago',
        'inundationRiskAreas': ['Kolonnawa', 'Wellampitiya', 'Kotikawatta', 'Sedawatta']
    },
    {
        'id': 'gauge-2',
        'stationName': 'Hanwella',
        'riverBasin': 'Kelani Ganga',
        'district': 'Colombo',
        'currentLevelMeters': 9.40,
        'alertLevelMeters': 7.00,
        'minorFloodMeters': 8.50,
        'majorFloodMeters': 10.00,
        'status': 'Minor Flood',
        'trend': 'STABLE',
        'lastUpdated': '12 mins ago',
        'inundationRiskAreas': ['Hanwella Town', 'Ranala', 'Kaduwela Lower']
    },
    {
        'id': 'gauge-3',
        'stationName': 'Glencorse',
        'riverBasin': 'Kelani Ganga',
        'district': 'Kegalle / Colombo',
        'currentLevelMeters': 15.60,
        'alertLevelMeters': 15.00,
        'minorFloodMeters': 16.50,
        'majorFloodMeters': 18.00,
        'status': 'Alert',
        'trend': 'RISING',
        'lastUpdated': '18 mins ago',
        'inundationRiskAreas': ['Dehiowita', 'Avissawella Lowlands']
    },
    {
        'id': 'gauge-4',
        'stationName': 'Putupaula',
        'riverBasin': 'Kalu Ganga',
        'district': 'Kalutara',
        'currentLevelMeters': 4.30,
        'alertLevelMeters': 3.00,
        'minorFloodMeters': 4.00,
        'majorFloodMeters': 5.00,
        'status': 'Minor Flood',
        'trend': 'FALLING',
        'lastUpdated': '25 mins ago',
        'inundationRiskAreas': ['Bulathsinhala', 'Palinda Nuwara', 'Millaniya']
    },
    {
        'id': 'gauge-5',
        'stationName': 'Ratnapura City Station',
        'riverBasin': 'Kalu Ganga',
        'district': 'Ratnapura',
        'currentLevelMeters': 20.80,
        'alertLevelMeters': 19.00,
        'minorFloodMeters': 20.50,
        'majorFloodMeters': 22.00,
        'status': 'Minor Flood',
        'trend': 'RISING',
        'lastUpdated': '8 mins ago',
        'inundationRiskAreas': ['Ratnapura Town', 'Elapatha', 'Wewelwatta Road']
    },
    {
        'id': 'gauge-6',
        'stationName': 'Baddegama',
        'riverBasin': 'Gin Ganga',
        'district': 'Galle',
        'currentLevelMeters': 3.40,
        'alertLevelMeters': 3.50,
        'minorFloodMeters': 4.00,
        'majorFloodMeters': 4.80,
        'status': 'Normal',
        'trend': 'STABLE',
        'lastUpdated': '30 mins ago',
        'inundationRiskAreas': ['Baddegama Town', 'Nagoda', 'Udugama Road']
    }
]

SAMPLE_SHELTERS = [
    {
        'id': 'shelter-1',
        'name': 'Sedawatta Purana Rajamaha Viharaya Camp',
        'district': 'Colombo',
        'division': 'Kolonnawa',
        'address': 'Kelani Temple Road, Sedawatta',
        'capacity': 300,
        'currentOccupancy': 265,
        'contactPerson': 'Ven. Dhammarathana Thero / GN Officer Bandara',
        'contactPhone': '0112531234',
        'status': 'Nearly Full',
        'facilities': ['Clean Water Tank', 'Medical Post', 'Community Kitchen', 'Generator'],
        'neededItems': ['Infant Milk Powder', 'Dry Rations', 'Panadol Syrup', 'Mosquito Nets']
    },
    {
        'id': 'shelter-2',
        'name': 'Biyagama Central College Relief Center',
        'district': 'Gampaha',
        'division': 'Biyagama',
        'address': 'Biyagama South Junction',
        'capacity': 450,
        'currentOccupancy': 180,
        'contactPerson': 'Principal Senarath / Red Cross Volunteer Nalin',
        'contactPhone': '0112487890',
        'status': 'Available',
        'facilities': ['Restrooms', 'Infant Care Area', 'Doctor on Call', 'Dry Storage'],
        'neededItems': ['Bottled Water (5L)', 'Sanitary Packs', 'Bedding Sheets']
    },
    {
        'id': 'shelter-3',
        'name': 'Kaduwela Sri Mahindarama Community Hall',
        'district': 'Colombo',
        'division': 'Kaduwela',
        'address': 'Avissawella Road, Kaduwela',
        'capacity': 200,
        'currentOccupancy': 195,
        'contactPerson': 'Officer Karunaratne (Disaster Management Coordinator)',
        'contactPhone': '0714567890',
        'status': 'Full',
        'facilities': ['Community Kitchen', 'Basic First Aid'],
        'neededItems': ['Cooked Meals', 'Drinking Water', 'Adult Diapers']
    },
    {
        'id': 'shelter-4',
        'name': 'Ratnapura Ferguson High School Camp',
        'district': 'Ratnapura',
        'division': 'Ratnapura Town',
        'address': 'Hospital Road, Ratnapura',
        'capacity': 350,
        'currentOccupancy': 140,
        'contactPerson': 'Disaster Relief Officer Mrs. Jayasinghe',
        'contactPhone': '0452223456',
        'status': 'Available',
        'facilities': ['Large Hall', 'Direct Access to Main Hospital', 'Police Security'],
        'neededItems': ['Surgical Masks', 'Torch Lights & Batteries', 'Dry Biscuits']
    }
]

SAMPLE_DISTRESS_REQUESTS = [
    {
        'id': 'sos-1',
        'fullName': 'Sunil Shantha Perera',
        'phone': '0773456789',
        'district': 'Colombo',
        'division': 'Kolonnawa - Kotikawatta',
        'address': 'No. 24, Ferry Lane, Kotikawatta (Near Canal Bank)',
        'headcount': 6,
        'hasElderlyOrInfant': True,
        'hasMedicalCondition': True,
        'emergencyType': 'Boat Evacuation',
        'waterLevelDescription': 'Ceiling Level / Rooftop',
        'description': 'Water has entered 2nd floor balcony. 84-year-old grandmother requires heart medication and cannot walk. Need immediate Navy/volunteer boat.',
        'triageScore': 98,
        'urgency': 'CRITICAL',
        'status': 'Pending',
        'createdAt': '2026-09-04T08:15:00Z'
    },
    {
        'id': 'sos-2',
        'fullName': 'Farzana Rizwan',
        'phone': '0718901234',
        'district': 'Colombo',
        'division': 'Wellampitiya - Brandiyawatta',
        'address': '45/3 Mosque Road, Brandiyawatta',
        'headcount': 4,
        'hasElderlyOrInfant': True,
        'hasMedicalCondition': False,
        'emergencyType': 'Food & Water',
        'waterLevelDescription': 'Waist Level',
        'description': 'Stranded on upper floor since yesterday morning. Clean drinking water and baby formula finished. Two children aged 2 and 4.',
        'triageScore': 85,
        'urgency': 'HIGH',
        'status': 'Responding',
        'createdAt': '2026-09-04T08:45:00Z'
    },
    {
        'id': 'sos-3',
        'fullName': 'Gamini Wijesinghe',
        'phone': '0765544332',
        'district': 'Gampaha',
        'division': 'Biyagama - Mabima',
        'address': 'Temple Road, Mabima South',
        'headcount': 3,
        'hasElderlyOrInfant': False,
        'hasMedicalCondition': False,
        'emergencyType': 'Safe Transport',
        'waterLevelDescription': 'Knee Level',
        'description': 'Access road is submerged by 2 feet of water. Vehicles cannot pass. Need guidance or truck transport to Biyagama Central shelter.',
        'triageScore': 55,
        'urgency': 'MODERATE',
        'status': 'Resolved',
        'createdAt': '2026-09-04T07:30:00Z'
    }
]

def seed_database():
    col_gauges = db_manager.get_collection('river_gauges')
    col_shelters = db_manager.get_collection('shelters')
    col_distress = db_manager.get_collection('distress_requests')

    if db_manager.is_connected_to_mongo:
        if col_gauges.count_documents({}) == 0:
            col_gauges.insert_many([dict(x) for x in SAMPLE_GAUGES])
        if col_shelters.count_documents({}) == 0:
            col_shelters.insert_many([dict(x) for x in SAMPLE_SHELTERS])
        if col_distress.count_documents({}) == 0:
            col_distress.insert_many([dict(x) for x in SAMPLE_DISTRESS_REQUESTS])
    else:
        # Seed memory store
        if not db_manager.memory_store['river_gauges']:
            db_manager.memory_store['river_gauges'] = list(SAMPLE_GAUGES)
        if not db_manager.memory_store['shelters']:
            db_manager.memory_store['shelters'] = list(SAMPLE_SHELTERS)
        if not db_manager.memory_store['distress_requests']:
            db_manager.memory_store['distress_requests'] = list(SAMPLE_DISTRESS_REQUESTS)
