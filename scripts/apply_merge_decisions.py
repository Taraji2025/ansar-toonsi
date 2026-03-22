import json
import csv
from pathlib import Path

RESOLUTION_LOG = Path("data/review/resolution_log.json")
PLAYERS_CSV = Path("data/normalized/players_normalized.csv")


def load_log():
    if not RESOLUTION_LOG.exists():
        raise FileNotFoundError("resolution_log.json introuvable")

    with RESOLUTION_LOG.open("r", encoding="utf-8") as f:
        return json.load(f)


def load_players():
    if not PLAYERS_CSV.exists():
        raise FileNotFoundError("players_normalized.csv introuvable")

    with PLAYERS_CSV.open("r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    return {p["player_id"]: p for p in rows}


def get_merge_pairs(log):
    return [
        item for item in log.get("items", [])
        if item.get("decision") == "merge"
    ]


def print_merge_preview(pairs, players):
    if not pairs:
        print("Aucune fusion à appliquer.")
        return

    print(f"Nombre de fusions potentielles : {len(pairs)}\n")

    for i, pair in enumerate(pairs, start=1):
        a_id = pair["player_id_a"]
        b_id = pair["player_id_b"]

        a = players.get(a_id, {})
        b = players.get(b_id, {})

        print(f"--- Fusion {i} ---")
        print(f"{a_id} ↔ {b_id}")
        print(f"A: {a.get('full_name')} | {a.get('current_club')} | {a.get('primary_position')}")
        print(f"B: {b.get('full_name')} | {b.get('current_club')} | {b.get('primary_position')}")
        print(f"Reason: {pair.get('reason')}")
        print()


def main():
    log = load_log()
    players = load_players()
    merge_pairs = get_merge_pairs(log)

    print_merge_preview(merge_pairs, players)


if __name__ == "__main__":
    main()
