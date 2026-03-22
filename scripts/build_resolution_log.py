import json
from pathlib import Path
from datetime import datetime

INPUT_RESPONSE = Path("data/review/claude_review_response.json")
OUTPUT_LOG = Path("data/review/resolution_log.json")


def load_response():
    if not INPUT_RESPONSE.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_RESPONSE}")

    with INPUT_RESPONSE.open("r", encoding="utf-8") as f:
        return json.load(f)


def load_existing_log():
    if not OUTPUT_LOG.exists():
        return {"count": 0, "items": []}

    with OUTPUT_LOG.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_entry(item: dict) -> dict:
    return {
        "player_id_a": item.get("player_id_a"),
        "player_id_b": item.get("player_id_b"),
        "decision": item.get("decision"),
        "confidence": item.get("confidence", None),
        "reason": item.get("reason", ""),
        "source": "claude",
        "timestamp": datetime.utcnow().isoformat()
    }


def main():
    response = load_response()
    existing = load_existing_log()

    decisions = response.get("decisions", [])

    new_entries = [build_entry(d) for d in decisions]

    existing["items"].extend(new_entries)
    existing["count"] = len(existing["items"])

    OUTPUT_LOG.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_LOG.open("w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"Nouvelles décisions ajoutées : {len(new_entries)}")
    print(f"Total log : {existing['count']}")
    print(f"Fichier : {OUTPUT_LOG}")


if __name__ == "__main__":
    main()
