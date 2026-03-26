from pydantic import BaseModel
from typing import Optional, Any

class ColdStartInput(BaseModel):
    user_id: str
    visual_score: str   # "Pass" or "Fail"
    verbal_score: str   # "Pass" or "Fail"

class BehaviorUpdate(BaseModel):
    user_id: str
    behavior_signal: str  # "VisualDominant" or "VerbalDominant"

class StylePrediction(BaseModel):
    user_id: str
    Visual: float
    Verbal: float
    predicted_style: str

class TestResult(BaseModel):
    test_case: int
    passed: bool
    output: Any = None
    expected: Any = None
    error: Optional[str] = None

class ExecuteCodeResponse(BaseModel):
    code: str
    title: str
    test_case: dict
    timeout: int
    test_case_num: int