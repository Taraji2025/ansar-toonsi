from scripts.dedupe import split


def test_split_separates_strong_and_review():
    results = [
        {
            "player_id_a": "tn001",
            "player_id_b": "tn004",
            "score": 1.0,
            "label": "strong_match",
        },
        {
            "player_id_a": "tn010",
            "player_id_b": "tn011",
            "score": 0.91,
            "label": "review",
        },
    ]

    strong, review = split(results)

    assert len(strong) == 1
    assert len(review) == 1
    assert strong[0]["label"] == "strong_match"
    assert review[0]["label"] == "review"
