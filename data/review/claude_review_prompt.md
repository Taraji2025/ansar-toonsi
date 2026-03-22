# Revue des cas ambigus — Ansar Toonsi

Tu dois arbitrer uniquement les cas ci-dessous.
Ne traite aucun autre joueur.

Réponds uniquement en JSON.

Format attendu :
```json
{
  "reviews": [
    {
      "player_id_a": "",
      "player_id_b": "",
      "decision": "merge|keep_separate|needs_review",
      "confidence": 0.0,
      "reason": ""
    }
  ]
}
```

Cas à arbitrer :

## Cas 1
- player_id_a: raw_8
- full_name_a: Aïssa Laïdouni
- normalized_name_a: AÏSSA LAÏDOUNI
- date_of_birth_a: 
- nationality_a: QAT
- current_club_a: Al-Wakrah SC
- primary_position_a: MC
- player_id_b: raw_80
- full_name_b: Naïm Laïdouni
- normalized_name_b: NAÏM LAÏDOUNI
- date_of_birth_b: 
- nationality_b: QAT
- current_club_b: Umm Salal
- primary_position_b: DC
- score: 0.889

## Cas 2
- player_id_a: raw_32
- full_name_a: Mayssam Benama
- normalized_name_a: MAYSSAM BENAMA
- date_of_birth_a: 
- nationality_a: FRA
- current_club_a: AS Monaco
- primary_position_a: MC
- player_id_b: raw_146
- full_name_b: Samir Benama
- normalized_name_b: SAMIR BENAMA
- date_of_birth_b: 
- nationality_b: FRA
- current_club_b: (France)
- primary_position_b: MDC
- score: 0.861

## Cas 3
- player_id_a: raw_66
- full_name_a: Amine Belkhir
- normalized_name_a: AMINE BELKHIR
- date_of_birth_a: 
- nationality_a: FRA
- current_club_a: Angers SCO
- primary_position_a: BU
- player_id_b: raw_122
- full_name_b: Yassine Belkhdim
- normalized_name_b: YASSINE BELKHDIM
- date_of_birth_b: 
- nationality_b: FRA
- current_club_b: Angers SCO
- primary_position_b: MC
- score: 0.855

## Cas 4
- player_id_a: raw_69
- full_name_a: Samy Benchama
- normalized_name_a: SAMY BENCHAMA
- date_of_birth_a: 
- nationality_a: FRA
- current_club_a: Sochaux
- primary_position_a: MC
- player_id_b: raw_146
- full_name_b: Samir Benama
- normalized_name_b: SAMIR BENAMA
- date_of_birth_b: 
- nationality_b: FRA
- current_club_b: (France)
- primary_position_b: MDC
- score: 0.88

## Cas 5
- player_id_a: raw_70
- full_name_a: Yanis Merdji
- normalized_name_a: YANIS MERDJI
- date_of_birth_a: 
- nationality_a: FRA
- current_club_a: Concarneau
- primary_position_a: BU
- player_id_b: raw_92
- full_name_b: Ilyes Merdji
- normalized_name_b: ILYES MERDJI
- date_of_birth_b: 
- nationality_b: FRA
- current_club_b: Ol. Lyonnais
- primary_position_b: MC
- score: 0.85

## Cas 6
- player_id_a: raw_100
- full_name_a: Yanis El Khayari
- normalized_name_a: YANIS EL KHAYARI
- date_of_birth_a: 
- nationality_a: FRA
- current_club_a: (France)
- primary_position_a: MC
- player_id_b: raw_134
- full_name_b: Rayan El Khayari
- normalized_name_b: RAYAN EL KHAYARI
- date_of_birth_b: 
- nationality_b: FRA
- current_club_b: (France)
- primary_position_b: MC
- score: 0.925
