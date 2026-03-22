from scripts.build_claude_review_prompt import build_prompt


def test_build_prompt_no_items():
    prompt = build_prompt([])

    assert "Aucun cas ambigu à arbitrer." in prompt
    assert '"decision": "merge|keep_separate|needs_review"' in prompt


def test_build_prompt_with_one_item():
    items = [
        {
            "player_id_a": "tn001",
            "full_name_a": "Hannibal Mejbri",
            "normalized_name_a": "HANNIBAL MEJBRI",
            "date_of_birth_a": "2003-01-21",
            "nationality_a": "Tunisia",
            "current_club_a": "Sevilla",
            "primary_position_a": "Midfielder",
            "player_id_b": "tn004",
            "full_name_b": "Hannibal Mejbri",
            "normalized_name_b": "HANNIBAL MEJBRI",
            "date_of_birth_b": "2003-01-21",
            "nationality_b": "Tunisia",
            "current_club_b": "Sevilla",
            "primary_position_b": "Midfielder",
            "score": 0.91,
        }
    ]

    prompt = build_prompt(items)

    assert "## Cas 1" in prompt
    assert "- player_id_a: tn001" in prompt
    assert "- player_id_b: tn004" in prompt
    assert "- score: 0.91" in prompt
