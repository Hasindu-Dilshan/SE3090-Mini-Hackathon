import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List
from models import DistressRequestCreate, DistressStatusUpdate, TriageRequest
from routers.triage import evaluate_triage
from database import db_manager

router = APIRouter(prefix='/api/sos', tags=['Distress Requests'])

@router.get('/')
@router.get('')
def get_distress_requests(
    status: Optional[str] = None,
    district: Optional[str] = None,
    urgency: Optional[str] = None
):
    col = db_manager.get_collection('distress_requests')
    if col is not None:
        query = {}
        if status:
            query['status'] = status
        if district:
            query['district'] = {'$regex': district, '$options': 'i'}
        if urgency:
            query['urgency'] = urgency
        items = list(col.find(query, {'_id': 0}).sort('triageScore', -1))
        return items

    # Memory store fallback
    items = db_manager.memory_store['distress_requests']
    filtered = items
    if status:
        filtered = [x for x in filtered if x.get('status') == status]
    if district:
        filtered = [x for x in filtered if district.lower() in x.get('district', '').lower()]
    if urgency:
        filtered = [x for x in filtered if x.get('urgency') == urgency]
    
    # Sort by triage score descending (most urgent first)
    filtered = sorted(filtered, key=lambda x: x.get('triageScore', 0), reverse=True)
    return filtered

@router.post('/', status_code=status.HTTP_201_CREATED)
@router.post('', status_code=status.HTTP_201_CREATED)
def create_distress_request(req: DistressRequestCreate):
    """
    Accepts user distress request with validation, runs AI triage urgency scoring,
    and saves to MongoDB.
    """
    # AI Triage assessment
    triage_input = TriageRequest(
        emergencyType=req.emergencyType,
        waterLevelDescription=req.waterLevelDescription,
        headcount=req.headcount,
        hasElderlyOrInfant=req.hasElderlyOrInfant,
        hasMedicalCondition=req.hasMedicalCondition,
        description=req.description
    )
    triage_result = evaluate_triage(triage_input)

    record = req.model_dump()
    record['id'] = f'sos-{uuid.uuid4().hex[:8]}'
    record['triageScore'] = triage_result['score']
    record['urgency'] = triage_result['urgency']
    record['recommendedAction'] = triage_result['recommendedAction']
    record['riskFactors'] = triage_result['riskFactors']
    record['status'] = 'Pending'
    record['createdAt'] = datetime.now(timezone.utc).isoformat()

    col = db_manager.get_collection('distress_requests')
    if col is not None:
        col.insert_one(dict(record))
        record.pop('_id', None)
    else:
        db_manager.memory_store['distress_requests'].append(record)

    return record

@router.patch('/{request_id}/status')
def update_request_status(request_id: str, update: DistressStatusUpdate):
    col = db_manager.get_collection('distress_requests')
    if col is not None:
        result = col.update_one({'id': request_id}, {'$set': {'status': update.status}})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail='Distress request not found')
        updated = col.find_one({'id': request_id}, {'_id': 0})
        return updated

    # Memory store
    for item in db_manager.memory_store['distress_requests']:
        if item.get('id') == request_id:
            item['status'] = update.status
            return item
    raise HTTPException(status_code=404, detail='Distress request not found')

@router.get('/metrics')
def get_sos_metrics():
    requests = get_distress_requests()
    total_calls = len(requests)
    pending = sum(1 for r in requests if r.get('status') == 'Pending')
    responding = sum(1 for r in requests if r.get('status') == 'Responding')
    resolved = sum(1 for r in requests if r.get('status') == 'Resolved')
    critical = sum(1 for r in requests if r.get('urgency') == 'CRITICAL' and r.get('status') != 'Resolved')
    people_affected = sum(r.get('headcount', 0) for r in requests)

    return {
        'totalCalls': total_calls,
        'pending': pending,
        'responding': responding,
        'resolved': resolved,
        'criticalUnresolved': critical,
        'totalPeopleAffected': people_affected
    }
