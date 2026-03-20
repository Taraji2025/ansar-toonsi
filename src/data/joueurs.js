export const POSTES = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];

export const JOUEURS = [
  {
    id: 1,
    nom: "Aymen Dahmen",
    poste: "Gardien",
    club: "Stade Rennais",
    pays_club: "France",
    age: 28,
    selection: true,
    matchs_selection: 25,
    photo: "",
    stats: { matchs: 28, buts: 0, passes: 0, cartons_jaunes: 1, cartons_rouges: 0, clean_sheets: 10 },
    saison: "2024-25"
  },
  {
    id: 2,
    nom: "Montassar Talbi",
    poste: "Défenseur",
    club: "Lorient",
    pays_club: "France",
    age: 25,
    selection: true,
    matchs_selection: 30,
    photo: "",
    stats: { matchs: 22, buts: 1, passes: 2, cartons_jaunes: 4, cartons_rouges: 0, clean_sheets: 0 },
    saison: "2024-25"
  },
  {
    id: 3,
    nom: "Dylan Bronn",
    poste: "Défenseur",
    club: "PAOK",
    pays_club: "Grèce",
    age: 28,
    selection: true,
    matchs_selection: 45,
    photo: "",
    stats: { matchs: 20, buts: 2, passes: 1, cartons_jaunes: 3, cartons_rouges: 0, clean_sheets: 0 },
    saison: "2024-25"
  },
  {
    id: 4,
    nom: "Ellyes Skhiri",
    poste: "Milieu",
    club: "Eintracht Frankfurt",
    pays_club: "Allemagne",
    age: 29,
    selection: true,
    matchs_selection: 60,
    photo: "",
    stats: { matchs: 26, buts: 3, passes: 5, cartons_jaunes: 6, cartons_rouges: 0, clean_sheets: 0 },
    saison: "2024-25"
  },
  {
    id: 5,
    nom: "Hannibal Mejbri",
    poste: "Milieu",
    club: "Burnley",
    pays_club: "Angleterre",
    age: 21,
    selection: true,
    matchs_selection: 20,
    photo: "",
    stats: { matchs: 30, buts: 4, passes: 7, cartons_jaunes: 5, cartons_rouges: 1, clean_sheets: 0 },
    saison: "2024-25"
  },
  {
    id: 6,
    nom: "Youssef Msakni",
    poste: "Milieu",
    club: "Al-Arabi SC",
    pays_club: "Qatar",
    age: 33,
    selection: true,
    matchs_selection: 92,
    photo: "",
    stats: { matchs: 20, buts: 6, passes: 8, cartons_jaunes: 2, cartons_rouges: 0, clean_sheets: 0 },
    saison: "2024-25"
  },
  {
    id: 7,
    nom: "Wahbi Khazri",
    poste: "Attaquant",
    club: "Montpellier",
    pays_club: "France",
    age: 33,
    selection: true,
    matchs_selection: 75,
    photo: "",
    stats: { matchs: 18, buts: 5, passes: 4, cartons_jaunes: 2, cartons_rouges: 0, clean_sheets: 0 },
    saison: "2024-25"
  },
  {
    id: 8,
    nom: "Seifeddine Jaziri",
    poste: "Attaquant",
    club: "Zamalek SC",
    pays_club: "Égypte",
    age: 32,
    selection: true,
    matchs_selection: 55,
    photo: "",
    stats: { matchs: 22, buts: 9, passes: 3, cartons_jaunes: 3, cartons_rouges: 0, clean_sheets: 0 },
    saison: "2024-25"
  },
];

export const STATS_LABELS = {
  matchs:          { label: 'Matchs',    icon: '⚽' },
  buts:            { label: 'Buts',      icon: '🥅' },
  passes:          { label: 'Passes D.', icon: '🎯' },
  cartons_jaunes:  { label: 'Jaunes',    icon: '🟨' },
  cartons_rouges:  { label: 'Rouges',    icon: '🟥' },
  clean_sheets:    { label: 'CS',        icon: '🧤' },
};
