import csv
import json
from pathlib import Path
from difflib import SequenceMatcher

INPUT_CSV = Path("data/normalized/players_normalized.csv")
OUTPUT_CSV = Path("data/normalized/duplicate_candidates.csv")
REVIEW_JSON = Path("data/review/needs_review.json")
RESOLUTION_LOG = Path("data/review/resolution_log.json")


def similarity(a, b):
    return round(SequenceMatcher(None, a, b).ratio(), 3)


def dob_match(a, b):
    return 1.0 if a.get("date_of_birth") == b.get("date_of_birth") else 0.0


def nationality_match(a, b):
    return 1.0 if a.get("nationality") == b.get("nationality") else 0.0


def compute_match_score(a, b):
    name_score = similarity(a["normalized_name"], b["normalized_name"])
    dob_score = dob_match(a, b)
    nat_score = nationality_match(a, b)

    total = (
        0.6 * name_score +
        0.3 * dob_score +
        0.1 * nat_score
    )

    return round(total, 3)


def load_players():
    with INPUT_CSV.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def pair_key(player_id_a: str, player_id_b: str) -> str:
    ordered = sorted([player_id_a, player_id_b])
    return f"{ordered[0]}::{ordered[1]}"


def load_resolution_keys():
    if not RESOLUTION_LOG.exists():
        return set()

    with RESOLUTION_LOG.open("r", encoding="utf-8") as f:
        payload = json.load(f)

    return {item.get("pair_key") for item in payload.get("items", []) if item.get("pair_key")}


def classify(score):
    if score >= 0.95:
        return "strong_match"
    elif score >= 0.85:
        return "review"
    else:
        return "no_match"


def find_candidates(players):
    results = []
    resolved_keys = load_resolution_keys()

    for i in range(len(players)):
        for j in range(i + 1, len(players)):
            a = players[i]
            b = players[j]

            current_pair_key = pair_key(a["player_id"], b["player_id"])
            if current_pair_key in resolved_keys:
                continue

            score = compute_match_score(a, b)
            label = classify(score)

            if label == "no_match":
                continue

            results.append({
                "pair_key": current_pair_key,
                "player_id_a": a["player_id"],
                "full_name_a": a.get("full_name", ""),
                "normalized_name_a": a.get("normalized_name", ""),
                "date_of_birth_a": a.get("date_of_birth", ""),
                "nationality_a": a.get("nationality", ""),
                "current_club_a": a.get("current_club", ""),
                "primary_position_a": a.get("primary_position", ""),
                "player_id_b": b["player_id"],
                "full_name_b": b.get("full_name", ""),
                "normalized_name_b": b.get("normalized_name", ""),
                "date_of_birth_b": b.get("date_of_birth", ""),
                "nationality_b": b.get("nationality", ""),
                "current_club_b": b.get("current_club", ""),
                "primary_position_b": b.get("primary_position", ""),
                "score": score,
                "label": label
            })

    return results


def split(results):
    strong = []
    review = []

    for r in results:
        if r["label"] == "strong_match":
            strong.append(r)
        elif r["label"] == "review":
            review.append(r)

    return strong, review


def save(results, review):
    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    REVIEW_JSON.parent.mkdir(parents=True, exist_ok=True)

    if results:
        with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)
    else:
        with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as f:
            f.write("")

    with REVIEW_JSON.open("w", encoding="utf-8") as f:
        json.dump({"count": len(review), "items": review}, f, indent=2, ensure_ascii=False)


def main():
    players = load_players()
    results = find_candidates(players)
    strong, review = split(results)
    save(results, review)

    print(f"Total candidats : {len(results)}")
    print(f"Strong match : {len(strong)}")
    print(f"Review : {len(review)}")


if __name__ == "__main__":
    main()
