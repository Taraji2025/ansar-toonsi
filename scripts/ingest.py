import csv
import re
from pathlib import Path

INPUT_CSV = Path("data/raw/players_150.tsv")
OUTPUT_CSV = Path("data/normalized/players_normalized.csv")


def normalize_name(name: str) -> str:
    clean = (name or "").strip()
    clean = re.sub(r"\s+", " ", clean)
    clean = clean.replace("-", " ")
    clean = clean.upper()
    return clean


def slugify_name(name: str) -> str:
    return normalize_name(name).replace(" ", "_")


def per_90(stat_value: int, minutes_played: int) -> float:
    if minutes_played <= 0:
        return 0.0
    return round((stat_value * 90) / minutes_played, 3)


def extract_country_code(country_raw: str) -> str:
    if not country_raw:
        return ""
    match = re.search(r"\b([A-Z]{3})\b", country_raw)
    return match.group(1) if match else ""


def load_players():
    if not INPUT_CSV.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_CSV}")

    with INPUT_CSV.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f, delimiter="\t"))


def enrich_players(players):
    enriched = []

    for player in players:
        full_name = player.get("full_name", "")
        current_club = player.get("current_club", "")
        country_raw = player.get("country_raw", "")
        primary_position = player.get("primary_position", "")
        category = player.get("category", "")
        source_rank = player.get("source_rank", "")

        item = {
            "player_id": f"raw_{source_rank}",
            "source_rank": source_rank,
            "full_name": full_name,
            "normalized_name": normalize_name(full_name),
            "slug": slugify_name(full_name),
            "current_club": current_club,
            "country_raw": country_raw,
            "country_code_guess": extract_country_code(country_raw),
            "nationality": extract_country_code(country_raw),
            "primary_position": primary_position,
            "category": category,
            "date_of_birth": "",
            "appearances": 0,
            "minutes_played": 0,
            "goals": 0,
            "assists": 0,
            "goals_per_90": per_90(0, 0),
            "assists_per_90": per_90(0, 0),
        }

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
    print(f"Fichier généré : {OUTPUT_CSV}")
    print("Premier joueur enrichi :")
    print(enriched[0] if enriched else "Aucun joueur")


if __name__ == "__main__":
    main()
