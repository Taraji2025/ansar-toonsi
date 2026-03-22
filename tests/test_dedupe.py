from scripts.dedupe import similarity, find_candidates


def test_similarity_high():
    assert similarity("BEN ROMDHANE", "BEN ROMDHANE") == 1.0


def test_find_candidates_exact_match():
    players = [
        {
            "player_id": "tn001",
            "normalized_name": "HANNIBAL MEJBRI",
            "date_of_birth": "2003-01-21",
            "nationality": "Tunisia",
        },
        {
            "player_id": "tn004",
            "normalized_name": "HANNIBAL MEJBRI",
            "date_of_birth": "2003-01-21",
            "nationality": "Tunisia",
        },
    ]

    results = find_candidates(players)

    assert len(results) == 1
    assert results[0]["label"] == "strong_match"
    assert results[0]["score"] == 1.0
