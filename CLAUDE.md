# CLAUDE.md — Ansar Toonsi

Projet :
Ansar Toonsi est une plateforme de suivi et d’analyse de joueurs tunisiens.

Priorités :
1. préserver la stabilité du frontend existant
2. privilégier les scripts Python pour la couche data
3. minimiser la consommation de tokens
4. traiter par delta et non par recalcul global

Règles impératives :
- Ne pas modifier le frontend sans demande explicite.
- Ne pas toucher à Nginx, au déploiement ou au dossier public sans demande explicite.
- Toujours privilégier une solution déterministe (Python, regex, CSV, SQL plus tard) avant un appel LLM.
- Ne jamais analyser toute la base si un sous-ensemble suffit.
- Ne jamais inventer de statistiques ou de sources.
- Si une information manque, retourner `needs_review`.
- Garder les réponses courtes et structurées.
- Pour les cas ambigus, préférer un format JSON bref.

Structure actuelle à respecter :
- `scripts/ingest.py` : ingestion, normalisation, ratios
- `scripts/dedupe.py` : détection simple de doublons
- `scripts/run_pipeline.py` : point d’entrée du pipeline
- `tests/` : tests minimaux à maintenir

Usage du LLM autorisé seulement pour :
- arbitrer des cas ambigus de doublons
- proposer des améliorations ciblées de code
- générer des résumés courts à partir de données déjà préparées

Avant toute modification :
- lire les fichiers concernés
- proposer le changement minimal
- éviter les refactorings larges
