import csv
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query

APP_TITLE = "Ansar Toonsi API"
PLAYERS_CSV = Path("data/normalized/players_normalized.csv")

app = FastAPI(title=APP_TITLE)


def to_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def serialize_player(player: dict) -> dict:
    return {
        "player_id": player.get("player_id", ""),
        "source_rank": to_int(player.get("source_rank")),
        "full_name": player.get("full_name", ""),
        "normalized_name": player.get("normalized_name", ""),
        "slug": player.get("slug", ""),
        "current_club": player.get("current_club", ""),
        "country_raw": player.get("country_raw", ""),
        "country_code_guess": player.get("country_code_guess", ""),
        "nationality": player.get("nationality", ""),
        "primary_position": player.get("primary_position", ""),
        "category": player.get("category", ""),
        "date_of_birth": player.get("date_of_birth", ""),
        "appearances": to_int(player.get("appearances")),
        "minutes_played": to_int(player.get("minutes_played")),
        "goals": to_int(player.get("goals")),
        "assists": to_int(player.get("assists")),
        "goals_per_90": to_float(player.get("goals_per_90")),
        "assists_per_90": to_float(player.get("assists_per_90")),
    }


def load_players():
    if not PLAYERS_CSV.exists():
        raise FileNotFoundError(f"Fichier introuvable: {PLAYERS_CSV}")

    with PLAYERS_CSV.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


@app.get("/")
def root():
    return {"message": "Ansar Toonsi API is running"}


@app.get("/players")
def get_players(limit: int = Query(default=50, ge=1, le=500)):
    players = load_players()
    items = [serialize_player(p) for p in players[:limit]]
    return {
        "count": min(len(players), limit),
        "items": items
    }


@app.get("/players/search")
def search_players(q: str = Query(..., min_length=1), limit: int = Query(default=20, ge=1, le=100)):
    q_normalized = q.strip().upper()
    players = load_players()

    matches = []
    for player in players:
        full_name = (player.get("full_name") or "").upper()
        normalized_name = (player.get("normalized_name") or "").upper()
        current_club = (player.get("current_club") or "").upper()

        if q_normalized in full_name or q_normalized in normalized_name or q_normalized in current_club:
            matches.append(serialize_player(player))

    return {
        "query": q,
        "count": min(len(matches), limit),
        "items": matches[:limit]
    }


@app.get("/players/{player_id}")
def get_player(player_id: str):
    players = load_players()

    for player in players:
        if player.get("player_id") == player_id:
            return serialize_player(player)

    raise HTTPException(status_code=404, detail="Player not found")
