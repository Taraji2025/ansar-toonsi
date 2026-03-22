import csv
import json
from pathlib import Path
from difflib import SequenceMatcher

INPUT_CSV = Path("data/normalized/players_normalized.csv")
OUTPUT_CSV = Path("data/normalized/duplicate_candidates.csv")
REVIEW_JSON = Path("data/review/needs_review.json")


def similarity(a, b):
    return round(SequenceMatcher(None, a, b).ratio(), 3)


def load_players():
    with INPUT_CSV.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def is_strict_mismatch(a, b):
    # règle métier simple
    if a.get("date_of_birth") and b.get("date_of_birth"):
        return a["date_of_birth"] != b["date_of_birth"]
    return False


def find_duplicate_candidates(players, threshold=0.88):
    candidates = []

    for i in range(len(players)):
        for j in range(i + 1, len(players)):
            a = players[i]
            b = players[j]

            name_a = a["normalized_name"]
            name_b = b["normalized_name"]

            score = similarity(name_a, name_b)

            if is_strict_mismatch(a, b):
                continue

            if name_a == name_b or score >= threshold:
                candidates.append({
                    "player_id_a": a["player_id"],
                    "player_id_b": b["player_id"],
                    "similarity_score": score,
                    "reason": "exact_match" if name_a == name_b else "high_similarity"
                })

    return candidates


def split_candidates(candidates):
    confirmed = []
    needs_review = []

    for c in candidates:
        if c["reason"] == "exact_match":
            confirmed.append(c)
        else:
            needs_review.append(c)

    return confirmed, needs_review


def save(candidates, review):
    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=candidates[0].keys() if candidates else [])
        if candidates:
            writer.writeheader()
            writer.writerows(candidates)

    with REVIEW_JSON.open("w", encoding="utf-8") as f:
        json.dump({"count": len(review), "items": review}, f, indent=2)


def main():
    players = load_players()
    candidates = find_duplicate_candidates(players)
    confirmed, review = split_candidates(candidates)
    save(candidates, review)

    print(f"Doublons: {len(candidates)} | Review: {len(review)}")


if __name__ == "__main__":
    main()
