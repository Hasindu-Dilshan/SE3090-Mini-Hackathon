from fastapi import APIRouter
from typing import Optional, List
from database import db_manager

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
            query['district'] = {'': district, '': 'i'}
        if status:
            query['status'] = {'': status, '': 'i'}
        if search:
            query[''] = [
                {'name': {'': search, '': 'i'}},
                {'division': {'': search, '': 'i'}},
                {'address': {'': search, '': 'i'}}
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
