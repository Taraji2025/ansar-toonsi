import json
from pathlib import Path
from datetime import datetime, timezone

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


def pair_key(player_id_a: str, player_id_b: str) -> str:
    ordered = sorted([player_id_a, player_id_b])
    return f"{ordered[0]}::{ordered[1]}"


def build_entry(item: dict) -> dict:
    return {
        "pair_key": pair_key(item.get("player_id_a", ""), item.get("player_id_b", "")),
        "player_id_a": item.get("player_id_a"),
        "player_id_b": item.get("player_id_b"),
        "decision": item.get("decision"),
        "confidence": item.get("confidence", None),
        "reason": item.get("reason", ""),
        "source": "claude",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


def main():
    response = load_response()
    existing = load_existing_log()

    reviews = response.get("reviews", [])
    new_entries = [build_entry(r) for r in reviews]

    existing_keys = {item.get("pair_key") for item in existing.get("items", [])}
    deduped_new_entries = [e for e in new_entries if e["pair_key"] not in existing_keys]

    existing["items"].extend(deduped_new_entries)
    existing["count"] = len(existing["items"])

    OUTPUT_LOG.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_LOG.open("w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"Nouvelles décisions ajoutées : {len(deduped_new_entries)}")
    print(f"Total log : {existing['count']}")
    print(f"Fichier : {OUTPUT_LOG}")


if __name__ == "__main__":
    main()
