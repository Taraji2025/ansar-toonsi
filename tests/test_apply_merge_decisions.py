from scripts.apply_merge_decisions import get_merge_pairs


def test_get_merge_pairs():
    log = {
        "items": [
            {"decision": "merge"},
            {"decision": "keep_separate"},
            {"decision": "merge"}
        ]
    }

    merges = get_merge_pairs(log)

    assert len(merges) == 2
