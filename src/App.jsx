import { useState, useMemo } from 'react';
import { JOUEURS, POSTES, NIVEAUX } from './data/joueurs';
import JoueurCard from './components/JoueurCard';
import JoueurModal from './components/JoueurModal';
import './index.css';

const POSTES_LABELS = {
  '': 'Tous les postes',
  Gardien:   '🧤 Gardien',
  Défenseur: '🛡️ Défenseur',
  Milieu:    '⚙️ Milieu',
  Attaquant: '⚡ Attaquant',
};

const TRIS = [
  { val: '',       label: 'Par défaut' },
  { val: 'buts',   label: '⚽ Buts' },
  { val: 'matchs', label: '📊 Matchs' },
  { val: 'passes', label: '🎯 Passes' },
  { val: 'age',    label: '🎂 Âge' },
];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [poste,    setPoste]    = useState('');
  const [niveau,   setNiveau]   = useState('');
  const [selOnly,  setSelOnly]  = useState(false);
  const [tri,      setTri]      = useState('');

  const filtered = useMemo(() => {
    let list = JOUEURS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j =>
        j.nom.toLowerCase().includes(q) ||
        j.club.toLowerCase().includes(q) ||
        j.pays_club.toLowerCase().includes(q)
      );
    }
    if (poste)   list = list.filter(j => j.poste  === poste);
    if (niveau)  list = list.filter(j => j.niveau === niveau);
    if (selOnly) list = list.filter(j => j.selection);
    if (tri === 'age') {
      list = [...list].sort((a, b) => (a.age ?? 99) - (b.age ?? 99));
    } else if (tri) {
      list = [...list].sort((a, b) => b.stats[tri] - a.stats[tri]);
    }
    return list;
  }, [search, poste, niveau, selOnly, tri]);

  const totalButs   = JOUEURS.reduce((s, j) => s + j.stats.buts,   0);
  const totalMatchs = JOUEURS.reduce((s, j) => s + j.stats.matchs, 0);
  const enSelection = JOUEURS.filter(j => j.selection).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <header className="at-header">
        <div className="at-header-inner">
          <div className="at-logo">
            <div className="at-logo-flag">🇹🇳</div>
            <div>
              <div className="at-logo-text">Ansar <span>Toonsi</span></div>
              <div className="at-logo-sub">Diaspora · Saison 2025-26</div>
            </div>
          </div>

          <div className="at-stats-row">
            {[
              { l: 'Joueurs',       v: JOUEURS.length, icon: '👥' },
              { l: 'En sélection',  v: enSelection,     icon: '🏆' },
              { l: 'Buts',          v: totalButs,        icon: '⚽' },
              { l: 'Matchs',        v: totalMatchs,      icon: '📊' },
            ].map(s => (
              <div key={s.l} className="at-stat-chip">
                <div className="at-stat-chip-val">{s.v}</div>
                <div className="at-stat-chip-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── FILTRES ── */}
      <div className="at-filters">
        <div className="at-filters-inner">
          <input
            className="at-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Joueur, club, pays..."
          />
          <select className="at-select" value={poste} onChange={e => setPoste(e.target.value)}>
            {['', ...POSTES].map(p => (
              <option key={p} value={p}>{POSTES_LABELS[p] || p}</option>
            ))}
          </select>
          <select className="at-select" value={niveau} onChange={e => setNiveau(e.target.value)}>
            <option value="">Tous niveaux</option>
            {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select className="at-select" value={tri} onChange={e => setTri(e.target.value)}>
            {TRIS.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
          </select>
          <button
            className={`at-btn-filter${selOnly ? ' active' : ''}`}
            onClick={() => setSelOnly(s => !s)}
          >
            🇹🇳 Sélection
          </button>
          <span className="at-count">
            {filtered.length} joueur{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── GRILLE ── */}
      {filtered.length === 0 ? (
        <div className="at-empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div>Aucun joueur trouvé</div>
          <div style={{ fontSize: 12, marginTop: 6, color: '#444' }}>Essaie un autre filtre</div>
        </div>
      ) : (
        <div className="at-grid">
          {filtered.map(j => (
            <JoueurCard key={j.id} joueur={j} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="at-footer">
        Ansar Toonsi · {JOUEURS.length} joueurs · Données Transfermarkt / @tun.talents · v8
      </footer>

      {selected && (
        <JoueurModal
          joueur={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {}}
          isAdmin={false}
        />
      )}
    </div>
  );
}
