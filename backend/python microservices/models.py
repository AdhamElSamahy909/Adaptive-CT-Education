from pydantic import BaseModel
from typing import Optional

class ColdStartInput(BaseModel):
    user_id: str
    visual_score: str   # "Pass" or "Fail"
    verbal_score: str   # "Pass" or "Fail"

class BehaviorUpdate(BaseModel):
    user_id: str
    behavior_signal: str  # "VisualDominant" or "VerbalDominant"
    visual_score: str   # "Pass" or "Fail"
    verbal_score: str   # "Pass" or "Fail"

class StylePrediction(BaseModel):
    user_id: str
    Visual: float
    Verbal: float
    predicted_style: str