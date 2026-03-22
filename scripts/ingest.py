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
    normalized = normalize_name(name)
    return normalized.replace(" ", "_")


def load_players():
    if not INPUT_CSV.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_CSV}")

    with INPUT_CSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    return rows


def enrich_players(players: list[dict]) -> list[dict]:
    enriched = []

    for player in players:
        item = player.copy()
        item["normalized_name"] = normalize_name(player["full_name"])
        item["slug"] = slugify_name(player["full_name"])
        enriched.append(item)

    return enriched


def save_players(players: list[dict]):
    if not players:
        print("Aucun joueur à sauvegarder.")
        return

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = list(players[0].keys())

    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(players)


def main():
    players = load_players()
    enriched_players = enrich_players(players)
    save_players(enriched_players)

    print(f"Nombre de joueurs chargés : {len(players)}")
    print(f"Fichier généré : {OUTPUT_CSV}")
    print("Premier joueur enrichi :")
    print(enriched_players[0] if enriched_players else "Aucun joueur")


if __name__ == "__main__":
    main()
