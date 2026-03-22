import csv
import re
from pathlib import Path

INPUT_CSV = Path("data/raw/players.csv")
OUTPUT_CSV = Path("data/normalized/players_normalized.csv")


def normalize_name(name: str) -> str:
    clean = name.strip()
    clean = re.sub(r"\s+", " ", clean)
    clean = clean.replace("-", " ")
    clean = clean.upper()
    return clean


def slugify_name(name: str) -> str:
    return normalize_name(name).replace(" ", "_")


def to_int(value: str) -> int:
    try:
        return int(value)
    except:
        return 0


def per_90(stat_value: int, minutes_played: int) -> float:
    if minutes_played <= 0:
        return 0.0
    return round((stat_value * 90) / minutes_played, 3)


def load_players():
    if not INPUT_CSV.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_CSV}")

    with INPUT_CSV.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def enrich_players(players):
    enriched = []

    for player in players:
        item = player.copy()

        item["normalized_name"] = normalize_name(player["full_name"])
        item["slug"] = slugify_name(player["full_name"])

        item["appearances"] = to_int(player.get("appearances"))
        item["minutes_played"] = to_int(player.get("minutes_played"))
        item["goals"] = to_int(player.get("goals"))
        item["assists"] = to_int(player.get("assists"))

        item["goals_per_90"] = per_90(item["goals"], item["minutes_played"])
        item["assists_per_90"] = per_90(item["assists"], item["minutes_played"])

        enriched.append(item)

    return enriched


def save_players(players):
    if not players:
        return

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=players[0].keys())
        writer.writeheader()
        writer.writerows(players)


def main():
    players = load_players()
    enriched = enrich_players(players)
    save_players(enriched)

    print(f"Nombre de joueurs chargés : {len(players)}")


if __name__ == "__main__":
    main()
