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

class DifficultyInitialize(BaseModel):
    user_id: str
    topic: str

class DifficultyPrediction(BaseModel):
    user_id: str
    Easy: float
    Medium: float
    Hard: float
    predicted_difficulty: str

class DifficultyUpdate(BaseModel):
    user_id: str
    performance_signal: str # "EasySignal", "MediumSignal", "HardSignal"
    topic: str

class StrugglingDetectionResponse(BaseModel):
    user_id: str
    struggling: bool

class StrugglingDetectionInput(BaseModel):
    user_id: str
    attempt_num: int
    time_delta: float
    test_progress: float
    error_type: Optional[str] = None
    code_len_change: Optional[int] = None
    code_len_prev: Optional[int] = None
    similarity_to_solution: Optional[float] = None
    consecutive_same_error: Optional[int] = None