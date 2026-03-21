export const POSTES  = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];
export const NIVEAUX = ['Senior', 'U23', 'U20', 'U19', 'U17', 'Réserve'];

const S = (matchs=0, buts=0, passes=0, cj=0, cr=0, cs=0) =>
  ({ matchs, buts, passes, cartons_jaunes: cj, cartons_rouges: cr, clean_sheets: cs });

export const JOUEURS = [
  // ── SENIORS PROS ──────────────────────────────────────────────────────────
  { id:1,  nom:"Ali Abdi",                  poste:"Milieu",    club:"OGC Nice",               pays_club:"France",     age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:2,  nom:"Yan Valery",                poste:"Défenseur", club:"BSC Young Boys",          pays_club:"Suisse",     age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:3,  nom:"Moutaz Neffati",            poste:"Milieu",    club:"IFK Norrköping",          pays_club:"Suède",      age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:4,  nom:"Alaa Ghram",               poste:"Défenseur", club:"Shakhtar Donetsk",        pays_club:"Ukraine",    age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:5,  nom:"Adem Arous",               poste:"Milieu",    club:"Kasimpasa",               pays_club:"Turquie",    age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:6,  nom:"Omar Rekik",               poste:"Défenseur", club:"NK Maribor",              pays_club:"Slovénie",   age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:7,  nom:"Ellyes Skhiri",            poste:"Milieu",    club:"Eintracht Francfort",     pays_club:"Allemagne",  age:31,   selection:true,  matchs_selection:60, photo:"", stats:S(26,3,5,6,0,0), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:8,  nom:"Mohamed Belhadj Mahmoud",  poste:"Milieu",    club:"FC Lugano",               pays_club:"Suisse",     age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:9,  nom:"Rani Khedira",             poste:"Milieu",    club:"Union Berlin",            pays_club:"Allemagne",  age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:10, nom:"Anis Ben Slimane",         poste:"Milieu",    club:"Norwich City",            pays_club:"Angleterre", age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:11, nom:"Sayfallah Ltaief",         poste:"Milieu",    club:"Greuther Fürth",          pays_club:"Allemagne",  age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:12, nom:"Hannibal Mejbri",          poste:"Milieu",    club:"Burnley FC",              pays_club:"Angleterre", age:24,   selection:true,  matchs_selection:20, photo:"", stats:S(30,4,7,5,1,0), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:13, nom:"Ismaël Gharbi",            poste:"Milieu",    club:"FC Augsburg",             pays_club:"Allemagne",  age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:14, nom:"Sebastian Tounekti",       poste:"Milieu",    club:"Celtic FC",               pays_club:"Écosse",     age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:15, nom:"Elias Saad",               poste:"Attaquant", club:"Hannover 96",             pays_club:"Allemagne",  age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:16, nom:"Mortadha Ben Ouanes",      poste:"Milieu",    club:"Kasimpasa",               pays_club:"Turquie",    age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:17, nom:"Hazem Mastouri",           poste:"Attaquant", club:"Dinamo Makhachkala",      pays_club:"Russie",     age:null, selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:77, nom:"Elias Achouri",            poste:"Attaquant", club:"FC Copenhagen",           pays_club:"Danemark",   age:27,   selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:78, nom:"Jeremy Dudziak",           poste:"Milieu",    club:"Hertha BSC",              pays_club:"Allemagne",  age:31,   selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:79, nom:"Mouez Hassen",             poste:"Gardien",   club:"Red Star FC",             pays_club:"France",     age:31,   selection:true,  matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },
  { id:70, nom:"Ali Youssef",              poste:"Milieu",    club:"BK Häcken",               pays_club:"Suède",      age:26,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"reported_eligible" },
  { id:56, nom:"Samy Chouchane",           poste:"Milieu",    club:"Dijon FCO",               pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"a_confirmer" },
  { id:66, nom:"Aymen Bouzidi",            poste:"Milieu",    club:"Cuiavia Inowroclaw",      pays_club:"Pologne",    age:23,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Senior", statut:"confirmed" },

  // ── U23 ───────────────────────────────────────────────────────────────────
  { id:18, nom:"Khalil Ayari",             poste:"Milieu",    club:"PSG Espoirs",             pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:19, nom:"Louey Ben Farhat",         poste:"Milieu",    club:"Karlsruher SC",           pays_club:"Allemagne",  age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"confirmed" },
  { id:20, nom:"Amin-Elias Gröller",       poste:"Milieu",    club:"Rapid Vienne",            pays_club:"Autriche",   age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:21, nom:"Kelyan Yahia",             poste:"Milieu",    club:"Olympique Lyon B",        pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:22, nom:"Rayan Boukadida",          poste:"Milieu",    club:"Le Mans FC B",            pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:24, nom:"Anis Doubal",              poste:"Milieu",    club:"Olympique Marseille B",   pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:25, nom:"Dhirar Brik",              poste:"Milieu",    club:"Südtirol Primavera",      pays_club:"Italie",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:26, nom:"Zayon Chtaï-Telamio",     poste:"Milieu",    club:"PSG Espoirs",             pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:27, nom:"Nacim Dendani",            poste:"Milieu",    club:"AS Monaco U21",           pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:28, nom:"Farès Bousnina",           poste:"Milieu",    club:"Bologna Primavera",       pays_club:"Italie",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:47, nom:"Rami Polfliet",            poste:"Milieu",    club:"Beerschot VA U21",        pays_club:"Belgique",   age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:48, nom:"Josef Taieb",              poste:"Milieu",    club:"Floridsdorfer AC",        pays_club:"Autriche",   age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:49, nom:"Yassin Jemai",             poste:"Milieu",    club:"Hannover 96 II",          pays_club:"Allemagne",  age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:50, nom:"Issa Medini",              poste:"Milieu",    club:"SC Bastia U19",           pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:52, nom:"Walid Dhouib",             poste:"Milieu",    club:"FK Suduva Marijampole",   pays_club:"Lituanie",   age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"reported_eligible" },
  { id:60, nom:"Jassin Manai",             poste:"Milieu",    club:"Karlsruher SC II",        pays_club:"Allemagne",  age:21,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"confirmed" },
  { id:61, nom:"Melvyn Sprenger",          poste:"Milieu",    club:"Servette FC U21",         pays_club:"Suisse",     age:19,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"confirmed" },
  { id:64, nom:"Corean Drost",             poste:"Milieu",    club:"PEC Zwolle U21",          pays_club:"Pays-Bas",   age:19,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"confirmed" },
  { id:83, nom:"Anas Haj Mohamed",         poste:"Attaquant", club:"Beerschot VA",            pays_club:"Belgique",   age:19,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U23", statut:"confirmed" },

  // ── U20 ───────────────────────────────────────────────────────────────────
  { id:51, nom:"Wael Debbiche",            poste:"Milieu",    club:"FC Annecy",               pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U20", statut:"reported_eligible" },
  { id:53, nom:"Anis Fiche",               poste:"Milieu",    club:"Racing Strasbourg U19",   pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U20", statut:"reported_eligible" },
  { id:54, nom:"Saïd Remadnia",            poste:"Milieu",    club:"Olympique Marseille U19", pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U20", statut:"reported_eligible" },
  { id:68, nom:"Farès Ben Rahem",          poste:"Milieu",    club:"ASD Heraclea Calcio",     pays_club:"Italie",     age:20,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U20", statut:"confirmed" },
  { id:80, nom:"Karim El Abed",            poste:"Défenseur", club:"Bahlinger SC",            pays_club:"Allemagne",  age:21,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U20", statut:"confirmed" },

  // ── U19 ───────────────────────────────────────────────────────────────────
  { id:23, nom:"Yasin Chebil",             poste:"Milieu",    club:"VfL Wolfsburg U19",       pays_club:"Allemagne",  age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:29, nom:"Salem Bouajila",           poste:"Milieu",    club:"Göztepe U19",             pays_club:"Turquie",    age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:30, nom:"Thomas Zouaghi",           poste:"Milieu",    club:"Caldiero Terme",          pays_club:"Italie",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:31, nom:"Rayan Jerbi",              poste:"Milieu",    club:"OGC Nice Espoir",         pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:41, nom:"Wassim El Abrougui",       poste:"Milieu",    club:"Olympique Lyon U19",      pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:42, nom:"Khays Guimba-Babot",       poste:"Milieu",    club:"ESTAC Troyes U19",        pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:44, nom:"Noam Strotz",              poste:"Milieu",    club:"Clermont Foot 63 U19",    pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:59, nom:"Ishaq Zantour",            poste:"Milieu",    club:"OGC Nice U19",            pays_club:"France",     age:19,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:62, nom:"Naïm Telmoudi",            poste:"Milieu",    club:"FC Nantes U19",           pays_club:"France",     age:19,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:63, nom:"Alexandre Bouzamita",      poste:"Milieu",    club:"AC Le Havre U19",         pays_club:"France",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:65, nom:"Wassim Tissa",             poste:"Milieu",    club:"FC Sochaux U19",          pays_club:"France",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:67, nom:"Houssam Zaier",            poste:"Milieu",    club:"FC Zürich U19",           pays_club:"Suisse",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:73, nom:"Younes Kalla",             poste:"Milieu",    club:"ASS Sarcelles U19",       pays_club:"France",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:75, nom:"Mohamed Chebbi",           poste:"Milieu",    club:"Stade Rennais",           pays_club:"France",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:76, nom:"Bedis Matoussi",           poste:"Milieu",    club:"Le Mans FC",              pays_club:"France",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:82, nom:"Béchir Yacoub",            poste:"Attaquant", club:"Chassieu Décines FC",     pays_club:"France",     age:21,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"confirmed" },
  { id:85, nom:"Abdessalem Khelifi",       poste:"Défenseur", club:"US Quevilly-Rouen U19",   pays_club:"France",     age:21,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },
  { id:88, nom:"Jibril Rejeb",             poste:"Défenseur", club:"AS Saint-Priest U19",     pays_club:"France",     age:19,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"reported_eligible" },

  // ── U17 ───────────────────────────────────────────────────────────────────
  { id:32, nom:"Slim Bouaskar",            poste:"Défenseur", club:"Roma U18",                pays_club:"Italie",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:33, nom:"Ali Jaber",                poste:"Milieu",    club:"Bologna Primavera",       pays_club:"Italie",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:34, nom:"Mehdi Tlili",              poste:"Milieu",    club:"AS Monaco U19",           pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:35, nom:"Wassim Slama",             poste:"Milieu",    club:"PSG U19",                 pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:36, nom:"Zinedine Hasni",           poste:"Milieu",    club:"OGC Nice U19",            pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:37, nom:"Yessine Ben Mahmoud",      poste:"Milieu",    club:"Angers SCO U19",          pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:38, nom:"Kabil Krai",               poste:"Milieu",    club:"Nîmes Olympique U17",     pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:39, nom:"Saïfedin Haj Abdallah",   poste:"Milieu",    club:"KFC Houtvenne",           pays_club:"Belgique",   age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:69, nom:"Obada Bouzid",             poste:"Milieu",    club:"RB Leipzig U17",          pays_club:"Allemagne",  age:17,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"confirmed" },
  { id:71, nom:"Mohamed Daghrour",         poste:"Gardien",   club:"FC Sochaux",              pays_club:"France",     age:17,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:72, nom:"Youssef Ben Mahmoud",      poste:"Attaquant", club:"USC Concarneau U17",      pays_club:"France",     age:17,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:74, nom:"Mohamed Thabet",           poste:"Attaquant", club:"AFC Compiègne U17",       pays_club:"France",     age:17,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:86, nom:"Sofien Zorgui",            poste:"Attaquant", club:"Amiens SC",               pays_club:"France",     age:17,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:87, nom:"Emin Ben Said",            poste:"Attaquant", club:"JFG Saarschleife U17",    pays_club:"Allemagne",  age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },
  { id:90, nom:"Yosri Limam",              poste:"Gardien",   club:"US Quevilly-Rouen U17",   pays_club:"France",     age:18,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"reported_eligible" },

  // ── RÉSERVE ───────────────────────────────────────────────────────────────
  { id:81, nom:"Dhia Eddine Chihi",        poste:"Défenseur", club:"SV Werder Bremen III",    pays_club:"Allemagne",  age:21,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Réserve", statut:"confirmed" },
  { id:84, nom:"Jibril Othman",            poste:"Attaquant", club:"AS Saint-Étienne B",      pays_club:"France",     age:20,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Réserve", statut:"confirmed" },
  { id:89, nom:"Kais Chedli",              poste:"Milieu",    club:"Dinamo Tbilisi II",       pays_club:"Géorgie",    age:21,   selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"Réserve", statut:"reported_eligible" },

  // ── WATCHLIST / ACADÉMIE ──────────────────────────────────────────────────
  { id:40, nom:"Najd Ajroud",              poste:"Milieu",    club:"AS Monaco",               pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"a_confirmer" },
  { id:43, nom:"Skander Bouzamita",        poste:"Milieu",    club:"Le Havre AC",             pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"a_confirmer" },
  { id:45, nom:"Edem Ghalleb",             poste:"Milieu",    club:"Paris Saint-Germain U19", pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"a_confirmer" },
  { id:46, nom:"Yahya Jlidi",              poste:"Milieu",    club:"Non précisé",             pays_club:"—",          age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"a_confirmer" },
  { id:55, nom:"Adam Ayari",               poste:"Milieu",    club:"Paris Saint-Germain U19", pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"a_confirmer" },
  { id:57, nom:"Chain Ghrissi",            poste:"Milieu",    club:"SC Aubagne Air Bel U19",  pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U19", statut:"a_confirmer" },
  { id:58, nom:"Kalil Bouali",             poste:"Milieu",    club:"SC Aubagne Air Bel U19",  pays_club:"France",     age:null, selection:false, matchs_selection:0, photo:"", stats:S(), saison:"2025-26", niveau:"U17", statut:"a_confirmer" },
];

export const STATS_LABELS = {
  matchs:          { label: 'Matchs',    icon: '⚽' },
  buts:            { label: 'Buts',      icon: '🥅' },
  passes:          { label: 'Passes D.', icon: '🎯' },
  cartons_jaunes:  { label: 'Jaunes',    icon: '🟨' },
  cartons_rouges:  { label: 'Rouges',    icon: '🟥' },
  clean_sheets:    { label: 'CS',        icon: '🧤' },
};
