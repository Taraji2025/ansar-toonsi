import csv
import json
from pathlib import Path
from difflib import SequenceMatcher

INPUT_CSV = Path("data/normalized/players_normalized.csv")
OUTPUT_CSV = Path("data/normalized/duplicate_candidates.csv")
REVIEW_JSON = Path("data/review/needs_review.json")


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


def classify(score):
    if score >= 0.95:
        return "strong_match"
    elif score >= 0.85:
        return "review"
    else:
        return "no_match"


def find_candidates(players):
    results = []

    for i in range(len(players)):
        for j in range(i + 1, len(players)):
            a = players[i]
            b = players[j]

            score = compute_match_score(a, b)
            label = classify(score)

            if label == "no_match":
                continue

            results.append({
                "player_id_a": a["player_id"],
                "player_id_b": b["player_id"],
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

    if results:
        with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)

    with REVIEW_JSON.open("w", encoding="utf-8") as f:
        json.dump({"count": len(review), "items": review}, f, indent=2)


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
