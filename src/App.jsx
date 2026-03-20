import { useState, useMemo } from 'react';
import { JOUEURS, POSTES } from './data/joueurs';
import JoueurCard from './components/JoueurCard';
import JoueurModal from './components/JoueurModal';
import './index.css';

const R = '#e70013';
const BG = '#0a0a0f';
const BG2 = '#12121a';
const BORDER = '#1e1e2e';

export default function App() {
  const [joueurs, setJoueurs] = useState(
    () => JSON.parse(localStorage.getItem('at_joueurs') || 'null') || JOUEURS
  );
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState('');
  const [poste, setPoste]       = useState('');
  const [selOnly, setSelOnly]   = useState(false);

  function save(data) {
    setJoueurs(data);
    localStorage.setItem('at_joueurs', JSON.stringify(data));
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
    if (poste) list = list.filter(j => j.poste === poste);
    if (selOnly) list = list.filter(j => j.selection);
    return list;
  }, [joueurs, search, poste, selOnly]);

  const totalButs   = joueurs.reduce((s, j) => s + j.stats.buts, 0);
  const totalMatchs = joueurs.reduce((s, j) => s + j.stats.matchs, 0);
  const enSelection = joueurs.filter(j => j.selection).length;

  return (
    <div style={{ minHeight: '100vh', background: BG }}>

      {/* ── HEADER ── */}
      <div style={{ background: BG2, borderBottom: `1px solid ${BORDER}`, padding: '14px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🇹🇳</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                Ansar <span style={{ color: R }}>Toonsi</span>
              </div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Stats des joueurs tunisiens
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { l: 'Joueurs',       v: joueurs.length },
              { l: 'En sélection', v: enSelection },
              { l: 'Buts',         v: totalButs },
              { l: 'Matchs',       v: totalMatchs },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: R }}>{s.v}</div>
                <div style={{ fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTRES ── */}
      <div style={{ background: BG2, borderBottom: `1px solid ${BORDER}`, padding: '10px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un joueur, un club..."
            style={{ flex: 1, minWidth: 200, background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f0f0', fontSize: 13, padding: '8px 12px', outline: 'none' }}
          />
          <select
            value={poste}
            onChange={e => setPoste(e.target.value)}
            style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f0f0', fontSize: 12, padding: '8px 12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Tous les postes</option>
            {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            onClick={() => setSelOnly(s => !s)}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              background: selOnly ? R : BG,
              border: `1px solid ${selOnly ? R : BORDER}`,
              color: selOnly ? '#fff' : '#888',
              fontWeight: selOnly ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >🇹🇳 Sélection</button>
          <div style={{ fontSize: 11, color: '#555' }}>
            {filtered.length} joueur{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── GRILLE ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', fontSize: 13, padding: 60 }}>
            Aucun joueur trouvé
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: 14,
          }}>
            {filtered.map(j => (
              <JoueurCard key={j.id} joueur={j} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#444' }}>
          Ansar Toonsi · Saison 2024-25 · Données mises à jour manuellement
        </div>
      </div>

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
