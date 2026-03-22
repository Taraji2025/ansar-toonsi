import json
from pathlib import Path

INPUT_JSON = Path("data/review/claude_review_response.json")


def load_reviews():
    if not INPUT_JSON.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_JSON}")

    with INPUT_JSON.open("r", encoding="utf-8") as f:
        payload = json.load(f)

    return payload.get("reviews", [])


def summarize_actions(reviews):
    merges = [r for r in reviews if r["decision"] == "merge"]
    separates = [r for r in reviews if r["decision"] == "keep_separate"]
    unresolved = [r for r in reviews if r["decision"] == "needs_review"]

    print("=== DRY RUN — décisions Claude ===")
    print(f"Total reviews : {len(reviews)}")
    print(f"Merges potentiels : {len(merges)}")
    print(f"Keep separate : {len(separates)}")
    print(f"Needs review : {len(unresolved)}")
    print()

    if merges:
        print("Merges potentiels :")
        for r in merges:
            print(f"- {r['player_id_a']} + {r['player_id_b']} (confidence={r['confidence']})")
        print()

    if separates:
        print("Séparations confirmées :")
        for r in separates:
            print(f"- {r['player_id_a']} vs {r['player_id_b']} (confidence={r['confidence']})")
        print()

    if unresolved:
        print("Cas restant à revoir :")
        for r in unresolved:
            print(f"- {r['player_id_a']} vs {r['player_id_b']} (confidence={r['confidence']})")


def main():
    reviews = load_reviews()
    summarize_actions(reviews)


if __name__ == "__main__":
    main()
