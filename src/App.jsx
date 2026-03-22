import { useState, useMemo, useEffect } from 'react';
import { JOUEURS } from './data/joueurs';
import { CLUB_IDS, FD_IDS } from './data/clubIds';
import { fetchAllMatches } from './utils/sportsdb';
import { fetchAllFDMatches } from './utils/footballdata';
import { ESPN_CLUBS, fetchAllESPNMatches, fetchAllESPNPlayerStats, fetchAllESPNSeasonStats } from './utils/espn';
import JoueurCard from './components/JoueurCard';
import JoueurModal from './components/JoueurModal';
import AdminEdit from './components/AdminEdit';
import ResultsBanner from './components/ResultsBanner';
import './index.css';

const ADMIN_PASSWORD = 'Ansar2025';
const R = '#e70013';
const DATA_VERSION = '2025-03-v2';

const NIVEAU_META = {
  Pro:    { label: 'Pro',    color: '#e70013', bg: '#e7001318' },
  U23:    { label: 'U23',    color: '#f59e0b', bg: '#f59e0b18' },
  U19:    { label: 'U19',    color: '#22c55e', bg: '#22c55e18' },
  U17:    { label: 'U17',    color: '#3b82f6', bg: '#3b82f618' },
  Veille: { label: 'Veille', color: '#8b5cf6', bg: '#8b5cf618' },
};

export default function App() {
  const [joueurs, setJoueurs] = useState(() => {
    // Reset localStorage if data version changed
    if (localStorage.getItem('at_version') !== DATA_VERSION) {
      localStorage.removeItem('at_joueurs');
      localStorage.setItem('at_version', DATA_VERSION);
    }
    const stored = JSON.parse(localStorage.getItem('at_joueurs') || 'null');
    if (!stored) return JOUEURS;
    // Merge: keep stored edits, append new players from source not yet in stored
    const storedIds = new Set(stored.map(j => j.id));
    const newPlayers = JOUEURS.filter(j => !storedIds.has(j.id));
    return newPlayers.length > 0 ? [...stored, ...newPlayers] : stored;
  });
  const [matchData, setMatchData]   = useState({});
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [espnMatchStats, setEspnMatchStats] = useState({});   // { clubName: { espnPlayerName: stats } }
  const [espnSeasonStats, setEspnSeasonStats] = useState({}); // { clubName: { espnPlayerName: stats } }
  const [selected, setSelected]     = useState(null);
  const [search, setSearch]         = useState('');
  const [poste, setPoste]           = useState('');
  const [niveau, setNiveau]         = useState('');
  const [selOnly, setSelOnly]       = useState(false);
  const [adminMode, setAdminMode]   = useState(false);
  const [showLogin, setShowLogin]   = useState(false);
  const [loginPwd, setLoginPwd]     = useState('');
  const [loginErr, setLoginErr]     = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);

  // Fetch last match — 3 sources : football-data.org > ESPN > TheSportsDB
  useEffect(() => {
    async function load() {
      // 1. football-data.org (PL, BL1, FL1 — mise à jour rapide)
      const fdIds = [...new Set(joueurs.map(j => FD_IDS[j.club]).filter(Boolean))];

      // 2. ESPN (Turquie, Russie, Écosse, Suisse, Championship, BL2, Autriche...)
      const espnEntries = joueurs
        .filter(j => !FD_IDS[j.club] && ESPN_CLUBS[j.club])
        .map(j => ({ clubName: j.club, ...ESPN_CLUBS[j.club] }))
        .filter((e, i, arr) => arr.findIndex(x => x.clubName === e.clubName) === i);

      // 3. TheSportsDB (fallback pour le reste)
      const sdbIds = [...new Set(
        joueurs
          .filter(j => !FD_IDS[j.club] && !ESPN_CLUBS[j.club])
          .map(j => CLUB_IDS[j.club])
          .filter(Boolean)
      )];

      const [fdData, espnData, sdbData] = await Promise.all([
        fetchAllFDMatches(fdIds),
        fetchAllESPNMatches(espnEntries),
        fetchAllMatches(sdbIds),
      ]);

      // Merge keyed by club name
      const merged = {};
      joueurs.forEach(j => {
        if (FD_IDS[j.club])        merged[j.club] = fdData[FD_IDS[j.club]];
        else if (ESPN_CLUBS[j.club]) merged[j.club] = espnData[j.club];
        else if (CLUB_IDS[j.club])   merged[j.club] = sdbData[CLUB_IDS[j.club]];
      });
      setMatchData(merged);

      // Stats individuelles joueurs (ESPN summary) — en parallèle après merge
      const [matchStats, seasonStats] = await Promise.all([
        fetchAllESPNPlayerStats(merged),
        fetchAllESPNSeasonStats(joueurs),
      ]);
      setEspnMatchStats(matchStats);
      setEspnSeasonStats(seasonStats);
    }
    load().finally(() => setLoadingMatches(false));
  }, [joueurs]);

  // Correspondance nom ESPN ↔ nom dans nos données
  function namesMatch(espnName, ourName) {
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const a = norm(espnName), b = norm(ourName);
    if (a === b) return true;
    const aLast = a.split(' ').pop();
    const bLast = b.split(' ').pop();
    if (aLast.length > 3 && aLast === bLast) return true;
    return false;
  }

  // Données auto match ESPN par joueur.id (fallback si pas de data manuelle)
  const autoMatchData = useMemo(() => {
    const result = {};
    joueurs.forEach(j => {
      const clubStats = espnMatchStats[j.club];
      if (!clubStats) return;
      const espnKey = Object.keys(clubStats).find(k => namesMatch(k, j.nom));
      if (espnKey) result[j.id] = clubStats[espnKey];
    });
    return result;
  }, [joueurs, espnMatchStats]);

  // Stats saison ESPN par joueur.id (fallback si stats manuelles à 0)
  const autoSeasonStats = useMemo(() => {
    const result = {};
    joueurs.forEach(j => {
      const hasManual = j.stats && Object.values(j.stats).some(v => v > 0);
      if (hasManual) return;
      const clubStats = espnSeasonStats[j.club];
      if (!clubStats) return;
      const espnKey = Object.keys(clubStats).find(k => namesMatch(k, j.nom));
      if (espnKey) result[j.id] = clubStats[espnKey];
    });
    return result;
  }, [joueurs, espnSeasonStats]);

  function save(data) {
    setJoueurs(data);
    localStorage.setItem('at_joueurs', JSON.stringify(data));
  }

  function handleLogin(e) {
    e.preventDefault();
    if (loginPwd === ADMIN_PASSWORD) {
      setAdminMode(true); setShowLogin(false);
      setLoginPwd(''); setLoginErr(false);
    } else { setLoginErr(true); }
  }

  function handleSavePlayer(updated) {
    save(joueurs.map(j => j.id === updated.id ? updated : j));
    setEditPlayer(null);
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
    if (poste)  list = list.filter(j => j.poste === poste);
    if (niveau) list = list.filter(j => j.niveau === niveau);
    if (selOnly) list = list.filter(j => j.selection);
    return list;
  }, [joueurs, search, poste, niveau, selOnly]);

  const enSelection = joueurs.filter(j => j.selection).length;
  const withPhoto   = joueurs.filter(j => j.photo).length;
  const withResults = joueurs.filter(j => matchData[j.club]).length;

  return (
    <div style={{ minHeight: '100vh', background: '#07070f' }}>

      {/* ══ HEADER ══ */}
      <header style={{
        background: 'linear-gradient(160deg, #0d0d1e 0%, #120008 50%, #0d0d1e 100%)',
        borderBottom: '1px solid #1a0a14',
        padding: '28px 24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: '#e7001310', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 200, height: 200, borderRadius: '50%', background: '#e700130a', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>

          {/* Top row: logo + stats + admin */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #e70013, #7a000b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, boxShadow: '0 4px 24px #e7001448',
                flexShrink: 0,
              }}>🇹🇳</div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1 }}>
                  Ansar <span style={{ color: R }}>Toonsi</span>
                </div>
                <div style={{ fontSize: 10, color: '#3a3a55', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 5 }}>
                  Talents Tunisiens · Saison 2024-25
                </div>
              </div>
            </div>

            {/* Stats + admin */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { l: 'Joueurs',   v: joueurs.length,                icon: '👤', c: R },
                { l: 'Sélection', v: enSelection,                   icon: '🇹🇳', c: '#f59e0b' },
                { l: 'Photos',    v: `${withPhoto}/${joueurs.length}`, icon: '📷', c: '#8b5cf6' },
                { l: 'Résultats', v: loadingMatches ? '…' : withResults, icon: '📊', c: '#22c55e' },
              ].map(s => (
                <div key={s.l} style={{
                  background: '#ffffff05', border: '1px solid #ffffff0a',
                  borderRadius: 14, padding: '10px 14px', textAlign: 'center', minWidth: 64,
                }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.l}</div>
                </div>
              ))}

              <button
                onClick={() => adminMode ? setAdminMode(false) : setShowLogin(true)}
                title={adminMode ? 'Quitter le mode admin' : 'Mode admin'}
                style={{
                  background: adminMode ? '#e7001318' : 'transparent',
                  border: `1px solid ${adminMode ? R : '#2a2a3a'}`,
                  borderRadius: 14, padding: '10px 14px', cursor: 'pointer',
                  color: adminMode ? R : '#2a2a3a', fontSize: 20,
                  transition: 'all 0.15s',
                  boxShadow: adminMode ? `0 0 16px ${R}35` : 'none',
                }}
              >{adminMode ? '🔓' : '🔒'}</button>
            </div>
          </div>

          {/* Niveau tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setNiveau('')}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontWeight: 700,
                background: niveau === '' ? R : 'transparent',
                border: `1px solid ${niveau === '' ? R : '#1e1e30'}`,
                color: niveau === '' ? '#fff' : '#3a3a55',
                transition: 'all 0.15s',
              }}
            >Tous</button>
            {Object.entries(NIVEAU_META).map(([key, m]) => (
              <button key={key}
                onClick={() => setNiveau(key === niveau ? '' : key)}
                style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontWeight: 700,
                  background: niveau === key ? m.color : m.bg,
                  border: `1px solid ${m.color}`,
                  color: niveau === key ? '#fff' : m.color,
                  transition: 'all 0.15s',
                }}
              >
                {m.label}
                <span style={{ marginLeft: 5, opacity: 0.7 }}>
                  {joueurs.filter(j => j.niveau === key).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══ RESULTS TICKER ══ */}
      <ResultsBanner joueurs={joueurs} matchData={matchData} />

      {/* ══ FILTERS ══ */}
      <div style={{ background: '#0a0a16', borderBottom: '1px solid #12121e', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Joueur, club, pays..."
            style={{
              flex: 1, minWidth: 200,
              background: '#07070f', border: '1px solid #15152a',
              borderRadius: 12, color: '#e0e0f0', fontSize: 13,
              padding: '10px 14px', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <select
            value={poste}
            onChange={e => setPoste(e.target.value)}
            style={{
              background: '#07070f', border: '1px solid #15152a',
              borderRadius: 12, color: '#e0e0f0', fontSize: 12,
              padding: '10px 14px', outline: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <option value="">Tous les postes</option>
            {['Gardien', 'Défenseur', 'Milieu', 'Attaquant'].map(p =>
              <option key={p} value={p}>{p}</option>
            )}
          </select>
          <button
            onClick={() => setSelOnly(s => !s)}
            style={{
              padding: '10px 18px', borderRadius: 12, fontSize: 12, cursor: 'pointer', fontWeight: 700,
              background: selOnly ? `linear-gradient(135deg, #e70013, #a00010)` : '#07070f',
              border: `1px solid ${selOnly ? R : '#15152a'}`,
              color: selOnly ? '#fff' : '#3a3a55',
              transition: 'all 0.15s',
              boxShadow: selOnly ? '0 2px 14px #e7001440' : 'none',
              fontFamily: 'inherit',
            }}
          >🇹🇳 Sélection</button>
          <span style={{ fontSize: 11, color: '#25253a', marginLeft: 2 }}>
            {filtered.length} joueur{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 60px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#2a2a3a', fontSize: 13, padding: 100 }}>
            Aucun joueur trouvé
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
            gap: 16,
          }}>
            {filtered.map(j => (
              <JoueurCard
                key={j.id}
                joueur={j}
                onClick={setSelected}
                isAdmin={adminMode}
                onEditPhoto={() => setEditPlayer(j)}
                lastMatch={matchData[j.club] || null}
                autoMatchData={autoMatchData[j.id] || null}
                autoSeasonStats={autoSeasonStats[j.id] || null}
              />
            ))}
          </div>
        )}
      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: '1px solid #0d0d1a', padding: '20px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#1e1e2e' }}>
          Ansar Toonsi · Saison 2024-25 · Sources : TheSportsDB, ESPN, football-data.org
        </div>
        <div style={{ fontSize: 9, color: '#141420', marginTop: 4, fontFamily: 'monospace' }}>
          build {__BUILD__}
        </div>
      </footer>

      {/* ══ LOGIN MODAL ══ */}
      {showLogin && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => e.target === e.currentTarget && setShowLogin(false)}
        >
          <div style={{
            background: '#0f0f1e', border: '1px solid #200010',
            borderTop: `3px solid ${R}`, borderRadius: 18, padding: 32,
            width: '100%', maxWidth: 340, boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🔒 Mode admin</div>
            <div style={{ fontSize: 12, color: '#333', marginBottom: 24 }}>Modifiez les photos et statistiques</div>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={loginPwd}
                onChange={e => { setLoginPwd(e.target.value); setLoginErr(false); }}
                placeholder="Mot de passe"
                autoFocus
                style={{
                  width: '100%', background: '#07070f',
                  border: `1px solid ${loginErr ? R : '#1e1e30'}`,
                  borderRadius: 12, color: '#f0f0f0', fontSize: 14,
                  padding: '12px 14px', outline: 'none', boxSizing: 'border-box',
                  marginBottom: 8, fontFamily: 'inherit',
                }}
              />
              {loginErr && <div style={{ fontSize: 11, color: R, marginBottom: 10 }}>Mot de passe incorrect</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button type="button" onClick={() => setShowLogin(false)} style={{
                  flex: 1, padding: '11px 0', background: 'transparent',
                  border: '1px solid #1e1e30', borderRadius: 12,
                  color: '#444', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                }}>Annuler</button>
                <button type="submit" style={{
                  flex: 2, padding: '11px 0',
                  background: `linear-gradient(135deg, ${R}, #8a000c)`,
                  border: 'none', borderRadius: 12, color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 2px 16px #e7001450', fontFamily: 'inherit',
                }}>Accéder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ JOUEUR MODAL ══ */}
      {selected && (
        <JoueurModal
          joueur={selected}
          onClose={() => setSelected(null)}
          isAdmin={adminMode}
          onEditPhoto={() => { setEditPlayer(selected); setSelected(null); }}
          lastMatch={matchData[selected.club] || null}
          autoMatchData={autoMatchData[selected.id] || null}
          autoSeasonStats={autoSeasonStats[selected.id] || null}
        />
      )}

      {/* ══ ADMIN EDIT ══ */}
      {editPlayer && (
        <AdminEdit
          joueur={editPlayer}
          onClose={() => setEditPlayer(null)}
          onSave={handleSavePlayer}
        />
      )}
    </div>
  );
}
