from scripts.dedupe import is_strict_mismatch


def test_different_birthdate_not_duplicate():
    a = {"date_of_birth": "2000-01-01"}
    b = {"date_of_birth": "2001-01-01"}

    assert is_strict_mismatch(a, b) is True
