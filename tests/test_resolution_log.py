from scripts.build_resolution_log import build_entry


def test_build_entry():
    raw = {
        "player_id_a": "tn001",
        "player_id_b": "tn004",
        "decision": "keep_separate",
        "confidence": 0.95,
        "reason": "Different careers"
    }

    entry = build_entry(raw)

    assert entry["player_id_a"] == "tn001"
    assert entry["decision"] == "keep_separate"
    assert entry["source"] == "claude"
    assert "timestamp" in entry
