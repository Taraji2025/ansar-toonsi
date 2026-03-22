import json
from pathlib import Path

REVIEW_JSON = Path("data/review/needs_review.json")


def load_review_data() -> dict:
    if not REVIEW_JSON.exists():
        raise FileNotFoundError(f"Fichier introuvable: {REVIEW_JSON}")

    with REVIEW_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)


def print_review_summary(data: dict):
    count = data.get("count", 0)
    items = data.get("items", [])

    print(f"Nombre de cas à revoir : {count}")

    if not items:
        print("Aucun cas ambigu.")
        return

    print()
    for idx, item in enumerate(items, start=1):
        player_a = item.get("player_id_a", "?")
        player_b = item.get("player_id_b", "?")
        score = item.get("similarity_score", "?")
        reason = item.get("reason", "?")
        print(f"{idx}. {player_a} vs {player_b} — score {score} — {reason}")


def main():
    data = load_review_data()
    print_review_summary(data)


if __name__ == "__main__":
    main()
