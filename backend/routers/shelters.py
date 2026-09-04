import uuid
from fastapi import APIRouter, status
from typing import Optional, List
from database import db_manager
from models import ShelterCreate

router = APIRouter(prefix='/api/shelters', tags=['Relief Shelters'])

@router.get('')
@router.get('/')
def get_shelters(
    search: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None
):
    col = db_manager.get_collection('shelters')
    if col is not None:
        query = {}
        if district:
            query['district'] = {'$regex': district, '$options': 'i'}
        if status:
            query['status'] = {'$regex': status, '$options': 'i'}
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'division': {'$regex': search, '$options': 'i'}},
                {'address': {'$regex': search, '$options': 'i'}}
            ]
        return list(col.find(query, {'_id': 0}))

    items = db_manager.memory_store['shelters']
    filtered = items
    if district:
        filtered = [x for x in filtered if district.lower() in x.get('district', '').lower()]
    if status:
        filtered = [x for x in filtered if status.lower() in x.get('status', '').lower()]
    if search:
        s = search.lower()
        filtered = [
            x for x in filtered
            if s in x.get('name', '').lower()
            or s in x.get('division', '').lower()
            or s in x.get('address', '').lower()
        ]
    return filtered

@router.post('', status_code=status.HTTP_201_CREATED)
@router.post('/', status_code=status.HTTP_201_CREATED)
def create_shelter(shelter: ShelterCreate):
    """
    Registers a new community relief shelter / safe haven camp in the system.
    """
    record = shelter.model_dump()
    record['id'] = f'shelter-{uuid.uuid4().hex[:6]}'
    
    # Auto-calculate status based on occupancy
    occ = record.get('currentOccupancy', 0)
    cap = max(1, record.get('capacity', 1))
    ratio = occ / cap
    if ratio >= 1.0:
        record['status'] = 'Full'
    elif ratio >= 0.8:
        record['status'] = 'Nearly Full'
    else:
        record['status'] = 'Available'

    col = db_manager.get_collection('shelters')
    if col is not None:
        col.insert_one(dict(record))
        record.pop('_id', None)
    else:
        db_manager.memory_store['shelters'].append(record)

    return record

@router.get('/summary')
def get_shelter_summary():
    shelters = get_shelters(search=None, district=None, status=None)
    total_capacity = sum(s.get('capacity', 0) for s in shelters)
    total_occupancy = sum(s.get('currentOccupancy', 0) for s in shelters)
    available_spaces = max(0, total_capacity - total_occupancy)
    occupancy_rate = round((total_occupancy / total_capacity * 100), 1) if total_capacity > 0 else 0

    return {
        'totalShelters': len(shelters),
        'totalCapacity': total_capacity,
        'totalOccupancy': total_occupancy,
        'availableSpaces': available_spaces,
        'occupancyPercentage': occupancy_rate
    }

