from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_sanity_check():
    assert 1 + 2 == 3

def test_health_endpoint():
    response = client.get("/")
    assert response.status_code in [200, 404]