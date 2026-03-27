from fastapi import FastAPI, HTTPException
from network import build_model, infer_style, serialize_model, load_model, update_prior
from models import ColdStartInput, BehaviorUpdate, StylePrediction, TestResult, ExecuteCodeResponse
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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

docker_client = docker.DockerClient(base_url="unix://var/run/docker.sock")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "Adaptive_CT_Education"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

collection = "user_networks"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.on_event("startup")
async def startup_db_client():
    await client.admin.command('ping')
    print("Connected to MongoDB!")

async def _get_user_doc(user_id: str) -> dict:
    doc = await db[collection].find_one({"user_id": user_id})
    if not doc:
        raise HTTPException(
            status_code=404,
            detail=f"No network found for user '{user_id}'. Call /init first."
        )
    return doc

async def _save_model(user_id: str, model) -> None:
    doc = serialize_model(user_id, model)
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
        await _save_model(data.user_id, model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return StylePrediction(user_id=data.user_id, **posterior, predicted_style=predicted)

@app.post("/update-learning-style", response_model=StylePrediction)
async def update_from_behavior(data: BehaviorUpdate):
    doc = await _get_user_doc(data.user_id)
    model = load_model(doc)
    evidence = {"BehaviorSignal": data.behavior_signal}

    try:
        posterior = infer_style(model, evidence)

        model = update_prior(model, posterior)
        await _save_model(data.user_id, model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return StylePrediction(user_id=data.user_id, **posterior, predicted_style=predicted)

@app.get("/infer-learning-style/{user_id}", response_model=StylePrediction)
async def get_current_style(user_id: str):
    doc = await _get_user_doc(user_id)

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

    execution_id = str(uuid.uuid4())
    temp_file_path = os.path.join(TEMP_DIR, f"{execution_id}.py")
    container = None

    try:
        test_runner_code = create_test_runner(code, title, test_case)

        with open(temp_file_path, "w") as f:
            f.write(test_runner_code)

        print(f"Starting Docker container or execution {execution_id}")
        test_start_time = time.time()

        container = docker_client.containers.run(
            image="python-sandbox",
            command=f"python /code/{os.path.basename(temp_file_path)}",
            volumes={
                os.path.dirname(temp_file_path): {"bind": "/code", "mode": "ro"}
            },
            mem_limit="256m",
            memswap_limit="256m",
            cpu_period=100000,
            cpu_quota=50000,
            network_disabled=True,
            read_only=True,
            security_opt=["no-new-privileges:true"],
            cap_drop=["ALL"],
            detach=True,
            remove=False
        )

        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: container.wait(timeout=timeout)
        )

        logs = container.logs(stdout=True, stderr=True).decode('utf-8')
        execution_time = time.time() - test_start_time

        print(f"Container {execution_id} completed in {execution_time:.2f}s")

        if result["StatusCode"] == 0:
            for line in logs.strip().split("\n"):
                if line.startswith('{'):
                    try:
                        output_data = json.loads(line)
                        return TestResult(
                            test_case=test_case_num,
                            passed=output_data.get("passed", False),
                            output=output_data.get("output"),
                            error=output_data.get("error"),
                            execution_time=execution_time
                        )
                    
                    except json.JSONDecodeError:
                        pass
            return TestResult(
                test_case=test_case_num,
                passed=True,
                output=logs.strip(),
                execution_time=execution_time
            )
        else:
            return TestResult(
                test_case=test_case_num,
                passed=False,
                error=f"Execution failed with status code {result['StatusCode']}:\n{logs}",
                execution_time=execution_time
            )
    except Exception as e:
        execution_time = time.time() - test_start_time if "test_start_time" in locals() else 0

        error_msg = str(e)
        if "timeout" in error_msg.lower():
            error_msg = f"Timeout after {timeout} seconds."
        return TestResult(
            test_case=test_case_num,
            passed=False,
            error=f"Docker execution error: {str(e)}",
            execution_time=0
        )
    finally:
        if container:
            try:
                container.remove(force=True)
                print(f"Removed container {execution_id}")
            except:
                pass
        if os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except: pass