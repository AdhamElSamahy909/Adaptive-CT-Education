from fastapi import FastAPI, HTTPException
from network import build_model, infer_style, load_model, update_prior, build_difficulty_model, load_difficulty_model, infer_difficulty_level, update_difficulty_prior, model_to_doc
from models import ColdStartInput, BehaviorUpdate, ExecuteCodeResponse, StylePrediction, TestResult, ExecuteCodeResponse, DifficultyPrediction, DifficultyUpdate, DifficultyInitialize, StrugglingDetectionInput, StrugglingDetectionResponse
from motor.motor_asyncio import AsyncIOMotorClient
from serializable import dict_to_cpd
import os
import logging
import docker
import json
import time
import asyncio
import uuid
from test_runner import create_test_runner
import traceback
from model.load_model import load_detector_model
from typing import Dict, List, Optional
import torch
import logging
# from dotenv import load_dotenv

# load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

docker_client = docker.DockerClient(base_url="unix://var/run/docker.sock")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "Adaptive_CT_Education"

client = AsyncIOMotorClient(MONGO_URI)
db = client["adaptive-ct-education-db"]

LEARNING_STYLE_COLLECTION = "user_learning_style_networks"
DIFFICULTY_COLLECTION     = "user_difficulty_networks"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

struggling_detector_model = load_detector_model()

@app.on_event("startup")
async def startup_db_client():
    await client.admin.command('ping')
    print("Connected to MongoDB!")

async def _get_user_doc(user_id: str, collection: str, topic: Optional[str]) -> dict:
    if topic:
        doc = await db[collection].find_one({"user_id": user_id, "topic": topic})
    else:
        doc = await db[collection].find_one({"user_id": user_id})
    if not doc:
        raise HTTPException(
            status_code=404,
            detail=f"No network found for user '{user_id}'. Call /init first."
        )
    return doc

async def _save_model(user_id: str, model, collection: str, topic: Optional[str]) -> None:
    network_type = ("learning_style" if collection == LEARNING_STYLE_COLLECTION else "difficulty")
    doc = model_to_doc(user_id, model.cpds, network_type=network_type)
    if topic:
        await db[collection].update_one(
            {"user_id": user_id, "topic": topic},
            {"$set": doc},
            upsert=True
        )
    else:
        await db[collection].update_one(
            {"user_id": user_id},
            {"$set": doc},
            upsert=True
        )

@app.post("/cold-start", response_model=StylePrediction)
async def cold_start(data: ColdStartInput):
    print(f"Received data: {data}")
    model = build_model()
    evidence = {
        "VisualScore": data.visual_score,
        "VerbalScore": data.verbal_score
    }
    print(f"Evidence for inference: {evidence}")
    try:
        posterior = infer_style(model, evidence)
        print(f"Inference result: {posterior}")

        model = update_prior(model, posterior)
        await _save_model(data.user_id, model, LEARNING_STYLE_COLLECTION, None)
    except Exception as e:
        logger.exception("Inference failed for user %s", data.user_id)
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return StylePrediction(user_id=data.user_id, **posterior, predicted_style=predicted)

@app.post("/update-learning-style", response_model=StylePrediction)
async def update_from_behavior(data: BehaviorUpdate):
    doc = await _get_user_doc(data.user_id, LEARNING_STYLE_COLLECTION, None)
    model = load_model(doc)
    evidence = {"BehaviorSignal": data.behavior_signal}

    try:
        posterior = infer_style(model, evidence)

        model = update_prior(model, posterior)
        await _save_model(data.user_id, model, LEARNING_STYLE_COLLECTION, None)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return StylePrediction(user_id=data.user_id, **posterior, predicted_style=predicted)

@app.get("/infer-learning-style/{user_id}", response_model=StylePrediction)
async def get_current_style(user_id: str):
    doc = await _get_user_doc(user_id, LEARNING_STYLE_COLLECTION, topic=None)

    prior_cpd = next(c for c in doc["cpds"] if c["variable"] == "LearningStyle")
    cpd = dict_to_cpd(prior_cpd)
    values = cpd.get_values().flatten().tolist()
    states = cpd.state_names["LearningStyle"]
    posterior = dict(zip(states, values))

    predicted = max(posterior, key=posterior.get)
    return StylePrediction(user_id=user_id, **posterior, predicted_style=predicted)

@app.post("/execute-code", response_model=TestResult)
async def run_test_case_in_docker(request: ExecuteCodeResponse):
    code = request.code
    title = request.title
    test_case = request.test_case
    timeout = request.timeout
    test_case_num = request.test_case_num

    try:
        test_runner_code = create_test_runner(code, title, test_case)

        print(f"Starting Docker STDIN execution for test case {test_case_num}")
        test_start_time = time.time()

        process = await asyncio.create_subprocess_exec(
            "docker", "run", "--rm", "-i",
            "--user", "sandbox",
            "--net", "none",
            "--memory", "256m",
            "--memory-swap", "256m",
            "--cpu-period", "100000",
            "--cpu-quota", "50000",
            "--security-opt", "no-new-privileges:true",
            "--cap-drop", "ALL",
            "python-sandbox:latest",
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(input=test_runner_code.encode('utf-8')),
                timeout=timeout
            )
            status_code = process.returncode
            logs = stdout.decode('utf-8')
            error_logs = stderr.decode('utf-8')
        except asyncio.TimeoutError:
            process.kill()
            await process.wait()
            return TestResult(
                test_case=test_case_num,
                passed=False,
                error=f"Timeout after {timeout} seconds.",
                execution_time=timeout
            )
    
        execution_time = time.time() - test_start_time
        print(f"Test case {test_case_num} cmpleted in {execution_time:.2f}s")

        full_logs = logs if status_code == 0 else logs + "\n" + error_logs

        if status_code == 0:
            for line in full_logs.strip().split("\n"):
                if line.startswith('{'):
                    try:
                        output_data = json.loads(line)
                        return TestResult(
                            test_case=test_case_num,
                            passed=output_data.get("passed", False),
                            output=output_data.get("output"),
                            expected=output_data.get("expected"),
                            error=output_data.get("error"),
                            execution_time=execution_time
                        )
                    except json.JSONDecodeError:
                        pass
                
            return TestResult(
                test_case=test_case_num,
                passed=False,
                error=f"Execution failed with status code: {status_code}:\n{full_logs}",
                execution_time=execution_time
            )
        else:
            return TestResult(
                test_case=test_case_num,
                passed=False,
                error=f"Execution failed with status code {status_code}:\n{full_logs}",
                execution_time=execution_time
            )
    except Exception as e:
        execution_time = time.time() - test_start_time if "test_start_time" in locals() else 0
        return TestResult(
            test_case=test_case_num,
            passed=False,
            error=f"Execution error: {str(e)}",
            execution_time=execution_time
        )

@app.post("/initialize-difficulty-network")
async def initialize_difficulty_network(data: DifficultyInitialize):
    try:
        model = build_difficulty_model()
        await _save_model(data.user_id, model, DIFFICULTY_COLLECTION, data.topic)

    except Exception as e:
        print(f"Error initializing difficulty network for user {data.user_id}: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/infer-difficulty/{user_id}/{topic}", response_model=DifficultyPrediction)
async def infer_difficulty(user_id: str, topic: str):
    doc = await _get_user_doc(user_id, DIFFICULTY_COLLECTION, topic)

    prior_cpd = next(c for c in doc["cpds"] if c["variable"] == "DifficultyLevel")
    cpd = dict_to_cpd(prior_cpd)
    values = cpd.get_values().flatten().tolist()
    states = cpd.state_names["DifficultyLevel"]
    posterior = dict(zip(states, values))

    predicted = max(posterior, key=posterior.get)
    return DifficultyPrediction(user_id=user_id, **posterior, predicted_difficulty=predicted)

@app.post("/update-difficulty", response_model=DifficultyPrediction)
async def update_difficulty(data: DifficultyUpdate):
    doc = await _get_user_doc(data.user_id, DIFFICULTY_COLLECTION, data.topic)
    model = load_difficulty_model(doc)
    evidence = {"PerformanceSignal": data.performance_signal}

    try:
        posterior = infer_difficulty_level(model, evidence)

        model = update_difficulty_prior(model, posterior)
        await _save_model(data.user_id, model, DIFFICULTY_COLLECTION, data.topic)
    except Exception as e:
        logger.exception("Error: ", exc_info=e)
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return DifficultyPrediction(user_id=data.user_id, **posterior, predicted_difficulty=predicted)

user_sessions: Dict[str, List[List[float]]] = {}

TIME_MEAN = 61.7803
TIME_STD = 71.5069
MAX_ATTEMPTS = 10

DIFFICULTY_MAPPING = {
    'easy': 0.0,
    'medium': 0.5,
    'hard': 1.0
}

@app.post("/detect-struggling", response_model=StrugglingDetectionResponse)
async def detect_struggling(data: StrugglingDetectionInput):
    user_id = data.user_id
    exercise_id = data.exercise_id

    session_key = f"{user_id}_{exercise_id}"

    diff_str = data.difficulty.lower() if data.difficulty else "medium"
    diff_val = DIFFICULTY_MAPPING.get(diff_str, 0.5)

    feature_vector = [
        data.attempt_num / MAX_ATTEMPTS,
        (data.time_delta - TIME_MEAN) / TIME_STD,
        data.test_progress,
        diff_val
    ]

    if data.attempt_num == 1:
        user_sessions[session_key] = []
    elif session_key not in user_sessions:
        user_sessions[session_key] = []

    user_sessions[session_key].append(feature_vector)

    if (len(user_sessions[session_key]) > MAX_ATTEMPTS):
        user_sessions[session_key] = user_sessions[session_key][-MAX_ATTEMPTS:]

    current_sequence = user_sessions[session_key]
    seq_length = len(current_sequence)

    if seq_length < MAX_ATTEMPTS:
        padding = [[0.0] * 4 for _ in range(MAX_ATTEMPTS - seq_length)]
        padded_sequence = padding + current_sequence
    else:
        padded_sequence = current_sequence

    input_tensor = torch.tensor(padded_sequence, dtype=torch.float32).unsqueeze(0)

    device = next(struggling_detector_model.parameters()).device
    input_tensor = input_tensor.to(device)

    with torch.no_grad():
        logits = struggling_detector_model(input_tensor)
        probability = torch.sigmoid(logits).item()

    is_struggling = probability >= 0.5

    return StrugglingDetectionResponse(user_id=user_id, struggling=is_struggling)