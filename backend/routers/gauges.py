from fastapi import APIRouter
from typing import Optional, List
from database import db_manager

router = APIRouter(prefix='/api/gauges', tags=['River Gauges'])

@router.get('')
@router.get('/')
def get_river_gauges(
    basin: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None
):
    col = db_manager.get_collection('river_gauges')
    if col is not None:
        query = {}
        if basin:
            query['riverBasin'] = {'': basin, '': 'i'}
        if district:
            query['district'] = {'': district, '': 'i'}
        if status:
            query['status'] = {'': status, '': 'i'}
        items = list(col.find(query, {'_id': 0}))
        return items

    items = db_manager.memory_store['river_gauges']
    filtered = items
    if basin:
        filtered = [x for x in filtered if basin.lower() in x.get('riverBasin', '').lower()]
    if district:
        filtered = [x for x in filtered if district.lower() in x.get('district', '').lower()]
    if status:
        filtered = [x for x in filtered if status.lower() in x.get('status', '').lower()]
    return filtered
