import json
from pathlib import Path

INPUT_JSON = Path("data/review/needs_review.json")
OUTPUT_MD = Path("data/review/claude_review_prompt.md")


def load_review_items():
    if not INPUT_JSON.exists():
        raise FileNotFoundError(f"Fichier introuvable: {INPUT_JSON}")

    with INPUT_JSON.open("r", encoding="utf-8") as f:
        payload = json.load(f)

    return payload.get("items", [])


def build_prompt(items):
    lines = []
    lines.append("# Revue des cas ambigus — Ansar Toonsi")
    lines.append("")
    lines.append("Tu dois arbitrer uniquement les cas ci-dessous.")
    lines.append("Ne traite aucun autre joueur.")
    lines.append("")
    lines.append("Réponds uniquement en JSON.")
    lines.append("")
    lines.append("Format attendu :")
    lines.append("```json")
    lines.append("{")
    lines.append('  "reviews": [')
    lines.append("    {")
    lines.append('      "player_id_a": "",')
    lines.append('      "player_id_b": "",')
    lines.append('      "decision": "merge|keep_separate|needs_review",')
    lines.append('      "confidence": 0.0,')
    lines.append('      "reason": ""')
    lines.append("    }")
    lines.append("  ]")
    lines.append("}")
    lines.append("```")
    lines.append("")

    if not items:
        lines.append("Aucun cas ambigu à arbitrer.")
        return "\n".join(lines)

    lines.append("Cas à arbitrer :")
    lines.append("")

    for idx, item in enumerate(items, start=1):
        lines.append(f"## Cas {idx}")
        lines.append(f"- player_id_a: {item.get('player_id_a', '')}")
        lines.append(f"- full_name_a: {item.get('full_name_a', '')}")
        lines.append(f"- normalized_name_a: {item.get('normalized_name_a', '')}")
        lines.append(f"- date_of_birth_a: {item.get('date_of_birth_a', '')}")
        lines.append(f"- nationality_a: {item.get('nationality_a', '')}")
        lines.append(f"- current_club_a: {item.get('current_club_a', '')}")
        lines.append(f"- primary_position_a: {item.get('primary_position_a', '')}")
        lines.append(f"- player_id_b: {item.get('player_id_b', '')}")
        lines.append(f"- full_name_b: {item.get('full_name_b', '')}")
        lines.append(f"- normalized_name_b: {item.get('normalized_name_b', '')}")
        lines.append(f"- date_of_birth_b: {item.get('date_of_birth_b', '')}")
        lines.append(f"- nationality_b: {item.get('nationality_b', '')}")
        lines.append(f"- current_club_b: {item.get('current_club_b', '')}")
        lines.append(f"- primary_position_b: {item.get('primary_position_b', '')}")
        lines.append(f"- score: {item.get('score', '')}")
        lines.append("")

    return "\n".join(lines)


def main():
    items = load_review_items()
    prompt = build_prompt(items)

    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.write_text(prompt, encoding="utf-8")

    print(f"Cas ambigus chargés : {len(items)}")
    print(f"Prompt généré : {OUTPUT_MD}")


if __name__ == "__main__":
    main()
