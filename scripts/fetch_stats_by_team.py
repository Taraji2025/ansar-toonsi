"""
Récupère les stats des joueurs tunisiens via plusieurs APIs.

Stratégie (1 seul jour de quota) :
  Phase 1 : API-Football /teams?league=X&season=2024
            → 1 req par ligue (~25 req) pour obtenir tous les team_ids
            → TheSportsDB en fallback pour les clubs introuvables
  Phase 2 : API-Football /players?team=X&season=2024
            → 1 req par équipe unique (~70 req)
            → matching fuzzy par nom

  Total AF : ~95 req → tient dans le quota free 100/jour.

  Clubs introuvables → marqués needs_review.

Usage :
  python scripts/fetch_stats_by_team.py --phase 1   # build team_ids cache
  python scripts/fetch_stats_by_team.py --phase 2   # fetch stats
  python scripts/fetch_stats_by_team.py             # résumé état
  python scripts/fetch_stats_by_team.py --dry-run --phase 1
"""

import argparse
import csv
import json
import time
import unicodedata
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

AF_BASE  = "https://v3.football.api-sports.io"
AF_KEY   = "be9ad433f91602eeffb691385ab37c44"
TSDB_BASE = "https://www.thesportsdb.com/api/v1/json/3"
SEASON   = 2024

PLAYERS_CSV  = Path("data/normalized/players_normalized.csv")
AF_TEAMS_CACHE = Path("data/cache/af_teams_by_league.json")  # league_id → [teams]
TEAM_IDS_CACHE = Path("data/cache/af_team_ids.json")          # club_csv → af_team_id | None
STATS_OUTPUT   = Path("data/cache/stats_joueurs.json")

FUZZY_THRESHOLD = 0.78
SLEEP_AF   = 1.2   # entre requêtes API-Football

# Substitutions FR → nom AF (avant le matching fuzzy)
CLUB_NAME_SUBS: dict[str, str] = {
    "Paris SG":          "Paris Saint-Germain",
    "Ol. Lyonnais":      "Lyon",
    "OGC Nice":          "Nice",
    "Stade Rennais":     "Rennes",
    "LOSC Lille":        "Lille",
    "Lille OSC":         "Lille",
    "AS St-Étienne":     "Saint Etienne",
    "AS Saint-Étienne":  "Saint Etienne",
    "Montpellier HSC":   "Montpellier",
    "FC Metz":           "Metz",
    "Angers SCO":        "Angers",
    "E. Francfort":      "Eintracht Frankfurt",
    "Eintracht Francfort": "Eintracht Frankfurt",
    "FC Augsbourg":      "FC Augsburg",
    "Hambourg SV":       "Hamburger SV",
    "Bologne FC":        "Bologna",
    "Hellas Vérone":     "Hellas Verona",
    "FC Bâle":           "FC Basel 1893",
    "RB Salzbourg":      "RB Salzburg",
    "FC Copenhague":     "FC Copenhagen",
    "Norwich City":      "Norwich",
    "Quevilly-Rouen":    "Quevilly",
    "Stade Lavallois":   "Laval",
    "Niort":             "Niort",
    "R. Kragujevac":     "Radnicki Kragujevac",
    "Troyes AC":         "Estac Troyes",
    "E. Braunschweig":   "Eintracht Braunschweig",
    "Young Boys Berne":  "BSC Young Boys",
    "Rapid Vienne":      "Rapid Wien",
    "LASK Linz":         "LASK",
    "BK Häcken":         "BK Häcken",
    "Djurgårdens IF":    "Djurgardens",
    "IFK Norrköping":    "IFK Norrkoping",
    "Shakhtar Donetsk":  "Shakhtar",
    "Vancouver Whitecaps": "Vancouver Whitecaps",
    "Inter Miami":       "Inter Miami",
    "San Diego FC":      "San Diego",
    "Al Ahly":           "Al Ahly",
    "Zamalek SC":        "Zamalek",
    "Kuwait SC":         "Al Kuwait",
    "Kasimpasa":         "Kasimpasa",
    "KAS Eupen":         "Eupen",
    "Cercle Bruges":     "Cercle Brugge",
    "Le Havre AC":       "Le Havre",
    "Parme Calcio":      "Parma",
    "FC Lorient":        "Lorient",
}
SLEEP_TSDB = 0.5   # TheSportsDB est plus permissif

# ---------------------------------------------------------------------------
# Ligues API-Football à interroger (league_id → label)
# Chaque ligue = 1 requête pour récupérer toutes ses équipes.
# ---------------------------------------------------------------------------
AF_LEAGUES = {
    # France
    61:  "Ligue 1 (FRA)",
    62:  "Ligue 2 (FRA)",
    63:  "National (FRA D3)",
    # Allemagne
    78:  "Bundesliga (ALL)",
    79:  "2. Bundesliga (ALL)",
    80:  "3. Liga (ALL)",
    # Italie
    135: "Serie A (ITA)",
    136: "Serie B (ITA)",
    137: "Serie C (ITA)",
    # Angleterre
    39:  "Premier League (ANG)",
    40:  "Championship (ANG)",
    41:  "League One (ANG)",
    # Pays-Bas
    88:  "Eredivisie (PBA)",
    # Portugal
    94:  "Primeira Liga (POR)",
    # Écosse
    179: "Scottish Premiership (ECO)",
    # Belgique
    144: "Belgian Pro League (BEL)",
    # Suisse
    207: "Swiss Super League (SUI)",
    208: "Swiss Challenge League (SUI)",
    # Autriche
    218: "Austrian Bundesliga (AUT)",
    # Suède
    113: "Allsvenskan (SUE)",
    # Danemark
    119: "Danish Superliga (DAN)",
    # Turquie
    203: "Süper Lig (TUR)",
    # Grèce
    197: "Super League (GRE)",
    # Serbie
    283: "SuperLiga (SER)",
    # Russie
    235: "Russian Premier League (RUS)",
    # Ukraine
    333: "Premier League (UKR)",
    # Qatar
    97:  "Qatar Stars League (QAT)",
    # Égypte
    233: "Egyptian Premier League (EGY)",
    # Arabie Saoudite
    307: "Saudi Pro League (ARA)",
    # Émirats Arabes
    435: "UAE Pro League (EAU)",
    # Koweït
    322: "Kuwait Premier League (KOW)",
    # USA + Canada
    253: "MLS (USA/CAN)",
    254: "USL Championship (USA)",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def af_get(path: str) -> dict:
    url = f"{AF_BASE}{path}"
    req = urllib.request.Request(url, headers={"x-apisports-key": AF_KEY})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read())


def tsdb_get(path: str) -> dict:
    url = f"{TSDB_BASE}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def strip_accents(s: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    )


def norm(name: str) -> str:
    return strip_accents(name.upper().strip().replace("-", " "))


def fuzzy(a: str, b: str) -> float:
    return SequenceMatcher(None, norm(a), norm(b)).ratio()


def load_real_clubs() -> dict[str, list[str]]:
    """Retourne {club_csv: [full_name, ...]} pour les joueurs avec un vrai club."""
    clubs: dict[str, list[str]] = {}
    with PLAYERS_CSV.open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            club = row["current_club"].strip()
            name = row["full_name"].strip()
            if club and not club.startswith("("):
                clubs.setdefault(club, []).append(name)
    return clubs


def load_team_ids_cache() -> dict[str, int | None]:
    if TEAM_IDS_CACHE.exists():
        return json.loads(TEAM_IDS_CACHE.read_text(encoding="utf-8"))
    return {}


def save_team_ids_cache(data: dict) -> None:
    TEAM_IDS_CACHE.parent.mkdir(parents=True, exist_ok=True)
    TEAM_IDS_CACHE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def load_af_teams_by_league() -> dict[str, list[dict]]:
    if AF_TEAMS_CACHE.exists():
        return json.loads(AF_TEAMS_CACHE.read_text(encoding="utf-8"))
    return {}


def save_af_teams_by_league(data: dict) -> None:
    AF_TEAMS_CACHE.parent.mkdir(parents=True, exist_ok=True)
    AF_TEAMS_CACHE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )


# ---------------------------------------------------------------------------
# Phase 1 — Build team_ids via ligues
# ---------------------------------------------------------------------------

def normalize_club(name: str) -> str:
    """Applique les substitutions FR→AF avant le matching."""
    return CLUB_NAME_SUBS.get(name, name)


def is_womens_team(team_name: str) -> bool:
    """Exclut les équipes féminines (suffixe W, Women, Féminin...)."""
    n = team_name.strip()
    return (
        n.endswith(" W")
        or " Women" in n
        or "Féminin" in n
        or n.endswith(" F")
    )


def best_match_in_league_teams(club_csv: str, league_teams: list[dict]) -> int | None:
    """Trouve le meilleur team_id pour un club parmi les équipes d'une ligue."""
    query = normalize_club(club_csv)
    best_id, best_score = None, 0.0
    for t in league_teams:
        if is_womens_team(t.get("name", "")):
            continue
        for candidate in [t.get("name", ""), t.get("shortName", "")]:
            if not candidate:
                continue
            s = fuzzy(query, candidate)
            if s > best_score:
                best_score = s
                best_id = t["id"]
    if best_score >= FUZZY_THRESHOLD:
        return best_id
    return None


def tsdb_search_team(club_name: str) -> int | None:
    """Fallback TheSportsDB : cherche un team_id AF via le nom."""
    # TheSportsDB donne son propre ID, pas l'ID AF.
    # On l'utilise juste pour confirmer l'existence du club.
    # On retourne None ici — le caller marquera needs_review.
    try:
        q = urllib.parse.quote(club_name)
        data = tsdb_get(f"/searchteams.php?t={q}")
        teams = data.get("teams") or []
        if teams:
            return -1  # Existe sur TheSportsDB mais pas d'ID AF
    except Exception:
        pass
    return None


def phase1_build_team_ids(dry_run: bool = False) -> None:
    """
    Phase 1 : construire {club_csv → af_team_id} en 2 étapes :
    a) Fetch toutes les équipes par ligue AF (1 req/ligue)
    b) Matcher nos clubs par fuzzy
    c) Fallback TheSportsDB pour les introuvables
    """
    clubs = load_real_clubs()
    team_ids = load_team_ids_cache()
    af_teams = load_af_teams_by_league()

    todo_leagues = [lid for lid in AF_LEAGUES if str(lid) not in af_teams]
    todo_clubs   = [c for c in clubs if c not in team_ids]

    print(f"Clubs réels : {len(clubs)} | déjà en cache : {len(team_ids)} | à résoudre : {len(todo_clubs)}")
    print(f"Ligues AF   : {len(AF_LEAGUES)} | déjà fetchées : {len(af_teams)} | à fetcher : {len(todo_leagues)}")

    if dry_run:
        print("\n(dry-run) Ligues à fetcher :")
        for lid in todo_leagues:
            print(f"  league_id={lid} — {AF_LEAGUES[lid]}")
        print(f"\nClubs à résoudre ({len(todo_clubs)}) :")
        for c in todo_clubs:
            print(f"  {c!r} ({len(clubs[c])} joueurs)")
        return

    # -----------------------------------------------------------------------
    # a) Fetcher les équipes de chaque ligue non encore en cache
    # -----------------------------------------------------------------------
    if todo_leagues:
        print(f"\n--- Fetch équipes par ligue ({len(todo_leagues)} ligues) ---")
    for i, league_id in enumerate(todo_leagues, 1):
        label = AF_LEAGUES[league_id]
        print(f"  [{i}/{len(todo_leagues)}] {label} ...", end=" ", flush=True)
        try:
            data = af_get(f"/teams?league={league_id}&season={SEASON}")
            teams = [
                {
                    "id":        t["team"]["id"],
                    "name":      t["team"]["name"],
                    "shortName": t["team"].get("code", ""),
                }
                for t in data.get("response", [])
            ]
            af_teams[str(league_id)] = teams
            save_af_teams_by_league(af_teams)
            print(f"→ {len(teams)} équipes")
        except Exception as e:
            af_teams[str(league_id)] = []
            save_af_teams_by_league(af_teams)
            print(f"→ erreur: {e}")
        time.sleep(SLEEP_AF)

    # -----------------------------------------------------------------------
    # b) Construire une liste plate de toutes les équipes connues
    # -----------------------------------------------------------------------
    all_teams: list[dict] = []
    for teams in af_teams.values():
        all_teams.extend(teams)

    # Dédupliquer par id
    seen_ids: set[int] = set()
    unique_teams: list[dict] = []
    for t in all_teams:
        if t["id"] not in seen_ids:
            seen_ids.add(t["id"])
            unique_teams.append(t)

    print(f"\n{len(unique_teams)} équipes uniques dans le cache ligues.\n")

    # -----------------------------------------------------------------------
    # c) Matcher chaque club non encore résolu
    # -----------------------------------------------------------------------
    todo_clubs = [c for c in clubs if c not in team_ids]
    if not todo_clubs:
        print("Tous les clubs déjà résolus.")
        return

    print(f"--- Matching des {len(todo_clubs)} clubs restants ---")
    found_league, found_tsdb, not_found = 0, 0, 0

    for club in sorted(todo_clubs):
        team_id = best_match_in_league_teams(club, unique_teams)
        if team_id:
            team_ids[club] = team_id
            matched_name = next((t["name"] for t in unique_teams if t["id"] == team_id), "?")
            print(f"  ✓ {club!r:40s} → id={team_id} ({matched_name})")
            found_league += 1
        else:
            # Fallback TheSportsDB
            time.sleep(SLEEP_TSDB)
            tsdb_result = tsdb_search_team(club)
            if tsdb_result == -1:
                team_ids[club] = None  # existe mais pas d'ID AF → needs_review
                print(f"  ~ {club!r:40s} → sur TheSportsDB, pas d'ID AF → needs_review")
                found_tsdb += 1
            else:
                team_ids[club] = None
                print(f"  ✗ {club!r:40s} → introuvable → needs_review")
                not_found += 1
        save_team_ids_cache(team_ids)

    print(f"\nPhase 1 terminée :")
    print(f"  ✓ via ligues AF : {found_league}")
    print(f"  ~ via TheSportsDB (needs_review) : {found_tsdb}")
    print(f"  ✗ introuvables : {not_found}")
    print(f"  Cache → {TEAM_IDS_CACHE}")


# ---------------------------------------------------------------------------
# Phase 2 — Fetch stats par équipe
# ---------------------------------------------------------------------------

def fetch_team_players(team_id: int) -> list[dict]:
    data = af_get(f"/players?team={team_id}&season={SEASON}")
    return data.get("response", [])


def extract_stats(item: dict) -> dict:
    s = item.get("statistics", [{}])[0]
    games  = s.get("games", {})
    goals  = s.get("goals", {})
    cards  = s.get("cards", {})
    return {
        "appearances":    games.get("appearences") or 0,
        "minutes":        games.get("minutes")     or 0,
        "goals":          goals.get("total")        or 0,
        "assists":        goals.get("assists")      or 0,
        "cartons_jaunes": cards.get("yellow")       or 0,
        "cartons_rouges": cards.get("red")          or 0,
        "clean_sheets":   goals.get("saves")        or 0,
        "league":         s.get("league", {}).get("name", ""),
        "club":           s.get("team", {}).get("name", ""),
        "season":         SEASON,
    }


def phase2_fetch_stats(dry_run: bool = False) -> None:
    clubs    = load_real_clubs()
    team_ids = load_team_ids_cache()

    # Charger stats existantes
    existing: dict = {}
    if STATS_OUTPUT.exists():
        existing = json.loads(STATS_OUTPUT.read_text(encoding="utf-8")).get("stats", {})

    # Grouper par team_id → liste de joueurs à matcher
    team_to_players: dict[int, list[tuple[str, str]]] = {}
    needs_review: list[tuple[str, str]] = []

    for club, players in clubs.items():
        tid = team_ids.get(club)
        if tid:
            for name in players:
                team_to_players.setdefault(tid, []).append((name, club))
        else:
            for name in players:
                needs_review.append((name, club))

    print(f"Phase 2 — {len(team_to_players)} équipes à fetcher | {len(needs_review)} joueurs needs_review")

    if dry_run:
        for tid, players in sorted(team_to_players.items()):
            print(f"  team_id={tid}: {[n for n,_ in players]}")
        print("needs_review:", [n for n,_ in needs_review])
        return

    new_stats: dict = dict(existing)
    total_matched, total_missed = 0, 0

    for i, (team_id, our_players) in enumerate(sorted(team_to_players.items()), 1):
        print(f"  [{i}/{len(team_to_players)}] team_id={team_id} ({len(our_players)} joueurs attendus) ...", flush=True)
        try:
            api_players = fetch_team_players(team_id)
        except Exception as e:
            print(f"    Erreur: {e}")
            time.sleep(SLEEP_AF)
            continue

        for our_name, club_csv in our_players:
            best_item, best_score = None, 0.0
            for item in api_players:
                api_name = item.get("player", {}).get("name", "")
                s = fuzzy(our_name, api_name)
                if s > best_score:
                    best_score = s
                    best_item = item

            key = norm(our_name)
            if best_item and best_score >= FUZZY_THRESHOLD:
                matched_name = best_item["player"]["name"]
                stats = extract_stats(best_item)
                new_stats[key] = stats
                total_matched += 1
                print(f"    ✓ {our_name!r} → {matched_name!r} ({best_score:.2f})"
                      f" — {stats['appearances']}app {stats['goals']}G {stats['assists']}A")
            else:
                best_name = best_item["player"]["name"] if best_item else "?"
                new_stats[key] = "needs_review"
                total_missed += 1
                print(f"    ✗ {our_name!r} — meilleur: {best_name!r} ({best_score:.2f}) → needs_review")

        time.sleep(SLEEP_AF)

    # Marquer les needs_review
    for name, club in needs_review:
        key = norm(name)
        if key not in new_stats:
            new_stats[key] = "needs_review"

    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "stats": new_stats,
    }
    STATS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    STATS_OUTPUT.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print(f"\nPhase 2 terminée :")
    print(f"  ✓ matchés : {total_matched}")
    print(f"  ✗ needs_review (nom non trouvé) : {total_missed}")
    print(f"  ~ needs_review (club sans ID) : {len(needs_review)}")
    print(f"  Stats → {STATS_OUTPUT}")


# ---------------------------------------------------------------------------
# Résumé
# ---------------------------------------------------------------------------

def print_summary() -> None:
    clubs    = load_real_clubs()
    team_ids = load_team_ids_cache()
    af_teams = load_af_teams_by_league()

    leagues_done  = sum(1 for teams in af_teams.values() if teams)
    clubs_resolved = sum(1 for v in team_ids.values() if v)
    clubs_nr       = sum(1 for v in team_ids.values() if v is None)
    clubs_pending  = len([c for c in clubs if c not in team_ids])

    print(f"Ligues AF fetchées     : {leagues_done}/{len(AF_LEAGUES)}")
    print(f"Clubs avec team_id AF  : {clubs_resolved}")
    print(f"Clubs needs_review     : {clubs_nr}")
    print(f"Clubs non encore traités : {clubs_pending}")
    print()
    print("Lancer : python scripts/fetch_stats_by_team.py --phase 1")
    print("Puis   : python scripts/fetch_stats_by_team.py --phase 2")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", type=int, choices=[1, 2])
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.phase == 1:
        phase1_build_team_ids(dry_run=args.dry_run)
    elif args.phase == 2:
        phase2_fetch_stats(dry_run=args.dry_run)
    else:
        print_summary()


if __name__ == "__main__":
    main()
