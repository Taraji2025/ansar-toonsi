import json
from pathlib import Path

INPUT_JSON = Path("data/review/claude_review_response.json")


VALID_DECISIONS = {"merge", "keep_separate", "needs_review"}


def load_response():
    if not INPUT_JSON.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_JSON}")

    with INPUT_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)


def validate_structure(payload):
    if "reviews" not in payload:
        raise ValueError("Clé 'reviews' manquante")

    if not isinstance(payload["reviews"], list):
        raise ValueError("'reviews' doit être une liste")

    return payload["reviews"]


def validate_review_item(item, idx):
    required_fields = [
        "player_id_a",
        "player_id_b",
        "decision",
        "confidence",
        "reason",
    ]

    for field in required_fields:
        if field not in item:
            raise ValueError(f"Champ manquant ({field}) dans item #{idx}")

    if item["decision"] not in VALID_DECISIONS:
        raise ValueError(f"Décision invalide dans item #{idx}: {item['decision']}")

    if not isinstance(item["confidence"], (int, float)):
        raise ValueError(f"Confidence invalide dans item #{idx}")

    if not (0 <= item["confidence"] <= 1):
        raise ValueError(f"Confidence hors bornes dans item #{idx}")


def summarize(reviews):
    total = len(reviews)
    merge = sum(1 for r in reviews if r["decision"] == "merge")
    separate = sum(1 for r in reviews if r["decision"] == "keep_separate")
    review = sum(1 for r in reviews if r["decision"] == "needs_review")

    print(f"Total décisions : {total}")
    print(f"Merge : {merge}")
    print(f"Keep separate : {separate}")
    print(f"Needs review : {review}")


def main():
    payload = load_response()
    reviews = validate_structure(payload)

    for idx, item in enumerate(reviews, start=1):
        validate_review_item(item, idx)

    summarize(reviews)

    print("\nRéponse Claude valide.")


if __name__ == "__main__":
    main()
