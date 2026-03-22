from scripts.build_resolution_log import build_entry, pair_key


def test_pair_key_is_order_independent():
    assert pair_key("raw_8", "raw_80") == pair_key("raw_80", "raw_8")


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
    assert entry["pair_key"] == "tn001::tn004"
    assert "timestamp" in entry
