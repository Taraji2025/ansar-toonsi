from scripts.ingest import normalize_name, slugify_name, per_90


def test_normalize_name():
    assert normalize_name("Ben Romdhane") == "BEN ROMDHANE"


def test_slugify_name():
    assert slugify_name("Ben-Romdhane") == "BEN_ROMDHANE"


def test_per_90_normal_case():
    assert per_90(2, 1040) == 0.173


def test_per_90_zero_minutes():
    assert per_90(3, 0) == 0.0
