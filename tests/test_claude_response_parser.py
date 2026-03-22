from scripts.parse_claude_review_response import validate_review_item


def test_valid_review_item():
    item = {
        "player_id_a": "tn001",
        "player_id_b": "tn004",
        "decision": "merge",
        "confidence": 0.9,
        "reason": "ok"
    }

    validate_review_item(item, 1)


def test_invalid_decision():
    item = {
        "player_id_a": "tn001",
        "player_id_b": "tn004",
        "decision": "wrong",
        "confidence": 0.9,
        "reason": "ok"
    }

    try:
        validate_review_item(item, 1)
        assert False
    except ValueError:
        assert True
