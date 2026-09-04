import re
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

SL_PHONE_REGEX = r'^(\+94\d{9}|0\d{9})$'

class DistressRequestCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100, description='Full name of contact or reporter')
    phone: str = Field(..., description='Sri Lankan phone number (e.g., 0771234567 or +94771234567)')
    district: str = Field(..., min_length=2, description='Sri Lankan administrative district (e.g., Colombo, Gampaha)')
    division: str = Field(..., min_length=2, description='Grama Niladhari division or area (e.g., Kolonnawa, Biyagama)')
    address: str = Field(..., min_length=3, description='Specific location, street, landmark, or GPS reference')
    headcount: int = Field(..., ge=1, le=500, description='Number of trapped or affected individuals')
    hasElderlyOrInfant: bool = Field(default=False, description='Whether elderly, disabled individuals, or infants are present')
    hasMedicalCondition: bool = Field(default=False, description='Whether someone needs urgent medication or oxygen')
    emergencyType: str = Field(..., description='Type of distress: Boat Evacuation, Medical Emergency, Food & Water, Rooftop Rescue, Other')
    waterLevelDescription: str = Field(default='Knee Level', description='Current water level: Ankle Level, Knee Level, Waist Level, Ceiling Level / Rooftop')
    description: str = Field(default='', max_length=1000, description='Additional emergency details or landmark directions')

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r'[\s\-()]', '', v)
        if not re.match(SL_PHONE_REGEX, cleaned):
            raise ValueError('Must be a valid Sri Lankan mobile or landline number (e.g., 0771234567 or +94771234567)')
        return cleaned

class DistressStatusUpdate(BaseModel):
    status: str = Field(..., description='Status update: Pending, Responding, Resolved')

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = ['Pending', 'Responding', 'Resolved']
        if v not in allowed:
            raise ValueError(f'Status must be one of: {allowed}')
        return v

class TriageRequest(BaseModel):
    emergencyType: str
    waterLevelDescription: str
    headcount: int
    hasElderlyOrInfant: bool
    hasMedicalCondition: bool
    description: str = ''
