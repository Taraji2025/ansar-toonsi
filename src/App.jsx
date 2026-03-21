import { useState, useMemo } from 'react';
import { JOUEURS, POSTES, NIVEAUX } from './data/joueurs';
import JoueurCard from './components/JoueurCard';
import JoueurModal from './components/JoueurModal';
import EditJoueurModal from './components/EditJoueurModal';
import AdminLoginModal from './components/AdminLoginModal';
import Classement from './components/Classement';
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

const STORAGE_KEY = 'at_joueurs_v8';

function loadJoueurs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : JOUEURS;
  } catch {
    return JOUEURS;
  }
}

export default function App() {
  const [joueurs,   setJoueurs]   = useState(loadJoueurs);
  const [selected,  setSelected]  = useState(null);
  const [editing,   setEditing]   = useState(null);
  const [search,    setSearch]    = useState('');
  const [poste,     setPoste]     = useState('');
  const [niveau,    setNiveau]    = useState('');
  const [selOnly,   setSelOnly]   = useState(false);
  const [tri,       setTri]       = useState('');
  const [isAdmin,   setIsAdmin]   = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [onglet,    setOnglet]    = useState('joueurs'); // 'joueurs' | 'classement'
  // secret : clic 5x sur le logo
  const [logoClicks, setLogoClicks] = useState(0);

  function handleLogoClick() {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setLogoClicks(0);
      if (isAdmin) {
        setIsAdmin(false);
      } else {
        setShowLogin(true);
      }
    }
  }

  function saveJoueurs(data) {
    setJoueurs(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function handleEdit(joueur) {
    setSelected(null);
    setEditing(joueur);
  }

  function handleSave(updated) {
    const data = joueurs.map(j => j.id === updated.id ? updated : j);
    saveJoueurs(data);
    setEditing(null);
  }

  function resetData() {
    if (confirm('Réinitialiser toutes les données ?')) {
      localStorage.removeItem(STORAGE_KEY);
      setJoueurs(JOUEURS);
    }
  }

  const filtered = useMemo(() => {
    let list = joueurs;
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
  }, [joueurs, search, poste, niveau, selOnly, tri]);

  const totalButs   = joueurs.reduce((s, j) => s + j.stats.buts,   0);
  const totalMatchs = joueurs.reduce((s, j) => s + j.stats.matchs, 0);
  const enSelection = joueurs.filter(j => j.selection).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <header className="at-header">
        <div className="at-header-inner">
          <div className="at-logo" onClick={handleLogoClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
            <div className="at-logo-flag">🇹🇳</div>
            <div>
              <div className="at-logo-text">Ansar <span>Toonsi</span></div>
              <div className="at-logo-sub">
                {isAdmin ? '🔐 Mode Admin · ' : ''}Diaspora · 2025-26
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isAdmin && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={resetData} style={{
                  padding: '5px 10px', fontSize: 10, fontWeight: 700,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer',
                }}>
                  🔄 Reset
                </button>
                <button onClick={() => setIsAdmin(false)} style={{
                  padding: '5px 10px', fontSize: 10, fontWeight: 700,
                  background: '#e7001320', border: '1px solid #e7001340',
                  borderRadius: 8, color: '#e70013', cursor: 'pointer',
                }}>
                  🔓 Admin ON
                </button>
              </div>
            )}
            <div className="at-stats-row">
              {[
                { l: 'Joueurs',      v: joueurs.length },
                { l: 'En sélection', v: enSelection    },
                { l: 'Buts',         v: totalButs      },
                { l: 'Matchs',       v: totalMatchs    },
              ].map(s => (
                <div key={s.l} className="at-stat-chip">
                  <div className="at-stat-chip-val">{s.v}</div>
                  <div className="at-stat-chip-lbl">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── ONGLETS ── */}
      <div className="at-tabs">
        <div className="at-tabs-inner">
          {[
            { id: 'joueurs',    label: '👥 Joueurs'     },
            { id: 'classement', label: '🏆 Classements' },
          ].map(t => (
            <button
              key={t.id}
              className={`at-tab${onglet === t.id ? ' active' : ''}`}
              onClick={() => setOnglet(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FILTRES ── */}
      {onglet === 'joueurs' && <div className="at-filters">
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
      </div>}

      {/* ── CLASSEMENT ── */}
      {onglet === 'classement' && <Classement joueurs={joueurs} />}

      {/* ── GRILLE ── */}
      {onglet === 'joueurs' && (filtered.length === 0 ? (
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
      ))}

      {/* ── FOOTER ── */}
      <footer className="at-footer">
        Ansar Toonsi · {joueurs.length} joueurs · Transfermarkt / @tun.talents · v8
      </footer>

      {/* ── MODALS ── */}
      {showLogin && (
        <AdminLoginModal
          onSuccess={() => { setIsAdmin(true); setShowLogin(false); }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {selected && !editing && (
        <JoueurModal
          joueur={selected}
          onClose={() => setSelected(null)}
          onEdit={handleEdit}
          isAdmin={isAdmin}
        />
      )}

      {editing && (
        <EditJoueurModal
          joueur={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
