from scripts.apply_claude_review_decisions import summarize_actions


def test_summarize_actions_outputs_counts(capsys):
    reviews = [
        {
            "player_id_a": "raw_1",
            "player_id_b": "raw_2",
            "decision": "merge",
            "confidence": 0.95,
            "reason": "ok",
        },
        {
            "player_id_a": "raw_3",
            "player_id_b": "raw_4",
            "decision": "keep_separate",
            "confidence": 0.88,
            "reason": "ok",
        },
        {
            "player_id_a": "raw_5",
            "player_id_b": "raw_6",
            "decision": "needs_review",
            "confidence": 0.51,
            "reason": "ok",
        },
    ]

    summarize_actions(reviews)

    out = capsys.readouterr().out
    assert "Total reviews : 3" in out
    assert "Merges potentiels : 1" in out
    assert "Keep separate : 1" in out
    assert "Needs review : 1" in out
