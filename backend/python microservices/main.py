from fastapi import FastAPI, HTTPException
from network import build_network, infer_style, serialize_model, load_model, update_prior
from models import ColdStartInput, BehaviorUpdate, StylePrediction
from motor.motor_asyncio import AsyncIOMotorClient
from serializable import dict_to_cpd
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "Adaptive_CT_Education"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

collection = "user_networks"

@app.on_event("startup")
async def startup_db_client():
    await client.admin.command('ping')
    print("Connected to MongoDB!")

async def _get_user_doc(user_id: str) -> dict:
    doc = await db[collection].find_one({"userId": user_id})
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
def cold_start(data: ColdStartInput):
    print(f"Received data: {data}")
    model = build_network()
    evidence = {
        "VisualScore": data.visual_score,
        "VerbalScore": data.verbal_score
    }
    print(f"Evidence for inference: {evidence}")
    try:
        posterior = infer_style(model, evidence)
        print(f"Inference result: {posterior}")

        model = update_prior(model, posterior)
        _save_model(data.user_id, model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return StylePrediction(**posterior, predicted_style=predicted)

@app.post("/update", response_model=StylePrediction)
async def update_from_behavior(data: BehaviorUpdate):
    doc = await _get_user_doc(data.user_id)
    model = load_model(doc)
    evidence = {"BehaviorSignal": data.behavior_signal}
    if data.visual_score:
        evidence["VisualScore"] = data.visual_score
    else:
        evidence["VerbalScore"] = data.verbal_score

    try:
        posterior = infer_style(model, evidence)

        model = update_prior(model, posterior)
        await _save_model(data.user_id, model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    predicted = max(posterior, key=posterior.get)
    return StylePrediction(**posterior, predicted_style=predicted)

@app.get("/style/{user_id}", response_model=StylePrediction)
async def get_current_style(user_id: str):
    doc = await _get_user_doc(user_id)

    prior_cpd = next(c for c in doc["cpds"] if c["variable"] == "LearningStyle")
    cpd = dict_to_cpd(prior_cpd)
    values = cpd.get_values().flatten().tolist()
    states = cpd.state_names["LearningStyle"]
    posterior = dict(zip(states, values))

    predicted = max(posterior, key=posterior.get)
    return StylePrediction(user_id=user_id, **posterior, predicted_style=predicted)

@app.get("/prior", response_model=StylePrediction)
def get_prior():
    return StylePrediction(Visual=0.5, Vebral=0.5, predicted_style="Unknown")

# @app.get("/")
# async def root():
#     logger.info("Hello World")
#     return {"message": "Hello World"}

# @app.get("/hello")
# async def say_hello():
#     logger.info("Hello World from /hello endpoint")
#     return {"message": "Hello from hello endpoint!"}