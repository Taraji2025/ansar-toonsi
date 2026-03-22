from scripts.dedupe import similarity, find_duplicate_candidates


def test_similarity_exact_match():
    assert similarity("HANNIBAL MEJBRI", "HANNIBAL MEJBRI") == 1.0


def test_find_duplicate_candidates_exact_match():
    players = [
        {
            "player_id": "tn001",
            "full_name": "Hannibal Mejbri",
            "normalized_name": "HANNIBAL MEJBRI",
        },
        {
            "player_id": "tn004",
            "full_name": "Hannibal Mejbri",
            "normalized_name": "HANNIBAL MEJBRI",
        },
    ]

    candidates = find_duplicate_candidates(players, threshold=0.88)

    assert len(candidates) == 1
    assert candidates[0]["reason"] == "exact_match"
    assert candidates[0]["similarity_score"] == 1.0
