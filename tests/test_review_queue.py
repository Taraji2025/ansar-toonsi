from scripts.dedupe import split_candidates


def test_split_candidates_separates_exact_matches_and_review_items():
    candidates = [
        {
            "player_id_a": "tn001",
            "player_id_b": "tn004",
            "similarity_score": 1.0,
            "reason": "exact_match",
        },
        {
            "player_id_a": "tn010",
            "player_id_b": "tn011",
            "similarity_score": 0.91,
            "reason": "high_similarity",
        },
    ]

    confirmed, needs_review = split_candidates(candidates)

    assert len(confirmed) == 1
    assert len(needs_review) == 1
    assert confirmed[0]["reason"] == "exact_match"
    assert needs_review[0]["reason"] == "high_similarity"
