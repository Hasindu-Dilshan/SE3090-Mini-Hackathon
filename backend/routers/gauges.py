from fastapi import APIRouter
from typing import Optional, List
from database import db_manager
from services.sri_lanka_river_api import fetch_live_river_gauges

router = APIRouter(prefix='/api/gauges', tags=['River Gauges'])

@router.get('/live')
def get_live_gauges(
    basin: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None
):
    """
    Fetches real-time river telemetry from the official Sri Lanka Irrigation
    Department ArcGIS FeatureServer (behind rivermonitorsl.homerelieflk.org).
    """
    items = fetch_live_river_gauges()
    filtered = items
    if basin:
        filtered = [x for x in filtered if basin.lower() in x.get('riverBasin', '').lower()]
    if district:
        filtered = [x for x in filtered if district.lower() in x.get('district', '').lower()]
    if status:
        filtered = [x for x in filtered if status.lower() in x.get('status', '').lower()]
    return filtered

@router.get('')
@router.get('/')
def get_river_gauges(
    basin: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None,
    mode: Optional[str] = 'simulation'
):
    if mode == 'live':
        return get_live_gauges(basin=basin, district=district, status=status)

    col = db_manager.get_collection('river_gauges')
    if col is not None:
        query = {}
        if basin:
            query['riverBasin'] = {'$regex': basin, '$options': 'i'}
        if district:
            query['district'] = {'$regex': district, '$options': 'i'}
        if status:
            query['status'] = {'$regex': status, '$options': 'i'}
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

