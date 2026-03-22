import csv
from pathlib import Path
from difflib import SequenceMatcher

INPUT_CSV = Path("data/normalized/players_normalized.csv")
OUTPUT_CSV = Path("data/normalized/duplicate_candidates.csv")


def similarity(a: str, b: str) -> float:
    return round(SequenceMatcher(None, a, b).ratio(), 3)


def load_players() -> list[dict]:
    if not INPUT_CSV.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_CSV}")

    with INPUT_CSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def find_duplicate_candidates(players: list[dict], threshold: float = 0.88) -> list[dict]:
    candidates = []

    for i in range(len(players)):
        for j in range(i + 1, len(players)):
            a = players[i]
            b = players[j]

            name_a = a.get("normalized_name", "").strip()
            name_b = b.get("normalized_name", "").strip()

            if not name_a or not name_b:
                continue

            score = similarity(name_a, name_b)

            if name_a == name_b or score >= threshold:
                candidates.append({
                    "player_id_a": a.get("player_id", ""),
                    "full_name_a": a.get("full_name", ""),
                    "normalized_name_a": name_a,
                    "player_id_b": b.get("player_id", ""),
                    "full_name_b": b.get("full_name", ""),
                    "normalized_name_b": name_b,
                    "similarity_score": score,
                    "reason": "exact_match" if name_a == name_b else "high_similarity"
                })

    return candidates


def save_candidates(candidates: list[dict]):
    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "player_id_a",
        "full_name_a",
        "normalized_name_a",
        "player_id_b",
        "full_name_b",
        "normalized_name_b",
        "similarity_score",
        "reason",
    ]

    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(candidates)


def main():
    players = load_players()
    candidates = find_duplicate_candidates(players)

    save_candidates(candidates)

    print(f"Nombre de joueurs analysés : {len(players)}")
    print(f"Nombre de candidats doublons : {len(candidates)}")
    print(f"Fichier généré : {OUTPUT_CSV}")

    if candidates:
        print("Premier candidat :")
        print(candidates[0])


if __name__ == "__main__":
    main()
