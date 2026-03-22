from scripts.dedupe import compute_match_score


def test_perfect_match():
    a = {
        "normalized_name": "HANNIBAL MEJBRI",
        "date_of_birth": "2003-01-21",
        "nationality": "Tunisia"
    }

    b = {
        "normalized_name": "HANNIBAL MEJBRI",
        "date_of_birth": "2003-01-21",
        "nationality": "Tunisia"
    }

    assert compute_match_score(a, b) == 1.0


def test_different_dob_reduces_score():
    a = {
        "normalized_name": "HANNIBAL MEJBRI",
        "date_of_birth": "2003-01-21",
        "nationality": "Tunisia"
    }

    b = {
        "normalized_name": "HANNIBAL MEJBRI",
        "date_of_birth": "2000-01-01",
        "nationality": "Tunisia"
    }

    score = compute_match_score(a, b)
    assert score < 1.0
    assert score > 0.6
