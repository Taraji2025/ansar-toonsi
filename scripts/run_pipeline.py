from scripts.ingest import main as run_ingest
from scripts.dedupe import main as run_dedupe


def main():
    print("=== Étape 1 : ingestion / normalisation / ratios ===")
    run_ingest()

    print("\n=== Étape 2 : détection de doublons ===")
    run_dedupe()

    print("\nPipeline terminé avec succès.")


if __name__ == "__main__":
    main()
