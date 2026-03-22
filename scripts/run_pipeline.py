from scripts.ingest import main as run_ingest
from scripts.dedupe import main as run_dedupe
from scripts.review_summary import main as run_review_summary


def main():
    print("=== Étape 1 : ingestion / normalisation / ratios ===")
    run_ingest()

    print("\n=== Étape 2 : détection de doublons ===")
    run_dedupe()

    print("\n=== Étape 3 : résumé humain des cas à revoir ===")
    run_review_summary()

    print("\nPipeline terminé avec succès.")


if __name__ == "__main__":
    main()
