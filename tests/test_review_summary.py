from scripts.review_summary import print_review_summary


def test_print_review_summary_no_items(capsys):
    payload = {"count": 0, "items": []}

    print_review_summary(payload)

    captured = capsys.readouterr()
    assert "Nombre de cas à revoir : 0" in captured.out
    assert "Aucun cas ambigu." in captured.out


def test_print_review_summary_with_items(capsys):
    payload = {
        "count": 1,
        "items": [
            {
                "player_id_a": "tn001",
                "player_id_b": "tn004",
                "similarity_score": 0.91,
                "reason": "high_similarity",
            }
        ],
    }

    print_review_summary(payload)

    captured = capsys.readouterr()
    assert "Nombre de cas à revoir : 1" in captured.out
    assert "tn001 vs tn004" in captured.out
    assert "0.91" in captured.out
