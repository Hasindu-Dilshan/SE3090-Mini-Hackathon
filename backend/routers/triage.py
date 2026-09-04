from fastapi import APIRouter
from models import TriageRequest

router = APIRouter(prefix='/api/triage', tags=['AI Triage'])

@router.post('/evaluate')
def evaluate_triage(req: TriageRequest):
    """
    AI-powered Emergency Triage & Urgency Evaluation Engine.
    Analyzes situational severity, vulnerability markers, water level,
    and text description to determine a priority score (0-100) and rescue classification.
    """
    score = 30
    reasons = []

    # Water level factor
    water_levels = {
        'Ankle Level': 5,
        'Knee Level': 15,
        'Waist Level': 30,
        'Chest Level': 45,
        'Ceiling Level / Rooftop': 55
    }
    wl_score = water_levels.get(req.waterLevelDescription, 20)
    score += wl_score
    if wl_score >= 30:
        reasons.append(f'Severe water depth ({req.waterLevelDescription})')

    # Vulnerability factors
    if req.hasElderlyOrInfant:
        score += 20
        reasons.append('Infants, elderly, or disabled individuals requiring specialized care')

    if req.hasMedicalCondition:
        score += 20
        reasons.append('Critical medical condition or life-saving medication needed')

    # Emergency type factor
    if req.emergencyType in ['Boat Evacuation', 'Rooftop Rescue']:
        score += 15
        reasons.append(f'Urgent rescue modality required ({req.emergencyType})')
    elif req.emergencyType == 'Medical Emergency':
        score += 15
        reasons.append('Active medical emergency reported')

    # Headcount factor
    if req.headcount >= 10:
        score += 10
        reasons.append(f'Large group trapped ({req.headcount} individuals)')
    elif req.headcount >= 5:
        score += 5

    # Text sentiment/keywords analysis
    desc_lower = req.description.lower()
    critical_keywords = ['submerged', 'drowning', 'unconscious', 'heart', 'oxygen', 'pregnant', 'baby', 'cannot breathe', 'electrocution', 'collapsed']
    matched_keywords = [kw for kw in critical_keywords if kw in desc_lower]
    if matched_keywords:
        score += 10
        kw_str = ', '.join(matched_keywords)
        reasons.append(f'High-risk keywords identified: {kw_str}')

    score = min(100, max(10, score))

    if score >= 85:
        urgency = 'CRITICAL'
        recommended_action = 'Dispatch Sri Lanka Navy / Disaster Response Boat & Medical Team immediately.'
    elif score >= 65:
        urgency = 'HIGH'
        recommended_action = 'Prioritize for 4WD rescue vehicle or volunteer flotilla within 1-2 hours.'
    elif score >= 45:
        urgency = 'MODERATE'
        recommended_action = 'Coordinate with Grama Niladhari division for dry ration and clean water delivery.'
    else:
        urgency = 'LOW'
        recommended_action = 'Monitor situation and verify evacuation routes with local disaster committee.'

    return {
        'score': score,
        'urgency': urgency,
        'recommendedAction': recommended_action,
        'riskFactors': reasons
    }
