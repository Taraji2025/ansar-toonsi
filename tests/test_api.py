from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Ansar Toonsi API is running"


def test_get_players():
    response = client.get("/players?limit=3")
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert payload["count"] == 3


def test_search_players():
    response = client.get("/players/search?q=Wajdi")
    assert response.status_code == 200
    payload = response.json()
    assert payload["count"] >= 1


def test_get_player():
    response = client.get("/players/raw_1")
    assert response.status_code == 200
    payload = response.json()
    assert payload["player_id"] == "raw_1"
