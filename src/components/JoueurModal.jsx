import { STATS_LABELS } from '../data/joueurs';

const POSTE_COLOR = {
  Gardien:   '#f59e0b',
  Défenseur: '#3b82f6',
  Milieu:    '#22c55e',
  Attaquant: '#e70013',
};
const NIVEAU_COLOR = {
  Pro: '#e70013', U23: '#f59e0b', U19: '#22c55e', U17: '#3b82f6', Veille: '#8b5cf6',
};
const RESULT_STYLE = {
  win:  { color: '#22c55e', bg: '#0a2a12', border: '#1a4a1a', label: 'Victoire' },
  loss: { color: '#e70013', bg: '#1a0508', border: '#3a000f', label: 'Défaite' },
  draw: { color: '#f59e0b', bg: '#1a1205', border: '#3a2800', label: 'Nul' },
};

function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  return `${+day} ${months[+m - 1]} ${y}`;
}

const PREFIXES = new Set(['fc', 'sc', 'ogc', 'ac', 'as', 'bsc', 'nk', 'vfl', 'vfb', 'ifk', 'rb', 'ss', 'us', 'cd', 'cf', 'rc', 'sk']);

function teamIsHome(dbTeamName, clubName) {
  const db = dbTeamName?.toLowerCase() || '';
  const words = clubName.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !PREFIXES.has(w));
  return words.some(w => db.includes(w));
}

function parseResult(match, clubName) {
  if (!match || match.intHomeScore === null || match.intAwayScore === null) return null;
  const isHome = teamIsHome(match.strHomeTeam, clubName);
  const ts = isHome ? +match.intHomeScore : +match.intAwayScore;
  const os = isHome ? +match.intAwayScore : +match.intHomeScore;
  const opponent = isHome ? match.strAwayTeam : match.strHomeTeam;
  const type = ts > os ? 'win' : ts < os ? 'loss' : 'draw';
  return { ts, os, opponent, isHome, type };
}

export default function JoueurModal({ joueur, onClose, isAdmin, onEditPhoto, lastMatch, autoMatchData, autoSeasonStats }) {
  const color  = POSTE_COLOR[joueur.poste]  || '#888';
  const nColor = NIVEAU_COLOR[joueur.niveau] || '#888';
  const initiales = joueur.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const parsed = parseResult(lastMatch, joueur.club);
  const rs = parsed ? RESULT_STYLE[parsed.type] : null;

  // Données match : manuelle en priorité, sinon auto ESPN
  const dm = joueur.dernier_match?.joue != null
    ? joueur.dernier_match
    : autoMatchData
    ? {
        joue:             autoMatchData.played,
        titulaire:        autoMatchData.titulaire,
        minutes:          autoMatchData.minutes,
        buts:             autoMatchData.goals || 0,
        passes_decisives: autoMatchData.assists || 0,
        carton_jaune:     autoMatchData.yellowCard || false,
        carton_rouge:     autoMatchData.redCard || false,
        blesse:           false,
        note:             null,
      }
    : joueur.dernier_match || null;

  // Stats saison : manuelles en priorité, sinon auto ESPN
  const statsDisplay = (joueur.stats && Object.values(joueur.stats).some(v => v > 0))
    ? joueur.stats
    : autoSeasonStats || null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'linear-gradient(170deg, #111122, #0d0d1c)',
        border: `1px solid #1a1a30`,
        borderTop: `4px solid ${color}`,
        borderRadius: 22, width: '100%', maxWidth: 500,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: `0 24px 64px rgba(0,0,0,0.85), 0 0 48px ${color}12`,
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '24px 24px 18px', borderBottom: '1px solid #14142a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              {/* Avatar */}
              <div style={{
                width: 88, height: 88, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle, ${color}25, ${color}06)`,
                border: `3px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700, color, overflow: 'hidden',
                boxShadow: `0 4px 24px ${color}40`,
              }}>
                {joueur.photo
                  ? <img src={joueur.photo} alt={joueur.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initiales
                }
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 10, letterSpacing: '-0.5px' }}>{joueur.nom}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color, background: color + '18', padding: '3px 10px', borderRadius: 12, fontWeight: 700, border: `1px solid ${color}30` }}>{joueur.poste}</span>
                  <span style={{ fontSize: 10, color: nColor, background: nColor + '18', padding: '3px 10px', borderRadius: 12, fontWeight: 700, border: `1px solid ${nColor}30` }}>{joueur.niveau}</span>
                  {joueur.selection && (
                    <span style={{ fontSize: 10, color: '#fff', background: '#e7001328', padding: '3px 10px', borderRadius: 12, fontWeight: 700, border: '1px solid #e7001340' }}>
                      🇹🇳 {joueur.matchs_selection > 0 ? `${joueur.matchs_selection} sél.` : 'Sélection'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 26, lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: '#3a3a55' }}>
              🏟️ <span style={{ color: '#8888aa', fontWeight: 600 }}>{joueur.club}</span>
              {joueur.pays_club !== '—' && <span style={{ color: '#3a3a55' }}> · {joueur.pays_club}</span>}
            </div>
            {joueur.age > 0 && (
              <div style={{ fontSize: 12, color: '#3a3a55' }}>
                🎂 <span style={{ color: '#8888aa' }}>{joueur.age} ans</span>
              </div>
            )}
            {joueur.valeur_marchande && (
              <div style={{ fontSize: 12, color: '#3a3a55' }}>
                💰 <span style={{ color: '#8888aa' }}>{joueur.valeur_marchande}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Dernier match ── */}
        {parsed && (
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #14142a' }}>
            <div style={{ fontSize: 9, color: '#30304a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Dernier match</div>
            <div style={{ background: '#07070f', borderRadius: 14, padding: '14px 16px', border: `1px solid ${rs.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {lastMatch.strLeague} · {lastMatch.strSeason}
                </span>
                <span style={{ fontSize: 9, color: '#2a2a40' }}>{formatDate(lastMatch.dateEvent)}</span>
              </div>
              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 600, flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lastMatch.strHomeTeam}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: rs.color, lineHeight: 1 }}>{lastMatch.intHomeScore}</span>
                  <span style={{ fontSize: 16, color: '#333', fontWeight: 700 }}>–</span>
                  <span style={{ fontSize: 32, fontWeight: 900, color: rs.color, lineHeight: 1 }}>{lastMatch.intAwayScore}</span>
                </div>
                <span style={{ fontSize: 11, color: '#888', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lastMatch.strAwayTeam}
                </span>
              </div>
              <div style={{ textAlign: 'center', marginBottom: joueur.dernier_match ? 12 : 0 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: rs.color, background: rs.bg, border: `1px solid ${rs.border}`, padding: '3px 12px', borderRadius: 20 }}>
                  {rs.label}
                </span>
              </div>

              {/* Player individual stats */}
              {dm?.joue === false && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0 2px', borderTop: '1px solid #12122a' }}>
                  <span style={{ fontSize: 12, color: '#444' }}>— N'a pas joué</span>
                  {dm?.blesse && <span style={{ fontSize: 14 }}>🏥</span>}
                </div>
              )}
              {dm?.joue === true && (
                <div style={{ borderTop: '1px solid #12122a', paddingTop: 12, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { show: true,                    icon: dm.titulaire === false ? '⬆' : '▶', val: dm.minutes ? `${dm.minutes}'` : '?\'', color: dm.titulaire === false ? '#f59e0b' : '#3b82f6', label: dm.titulaire === false ? 'Remplaçant' : 'Titulaire' },
                    { show: dm.buts > 0,             icon: '⚽', val: dm.buts,             color: '#22c55e', label: 'But(s)' },
                    { show: dm.passes_decisives > 0, icon: '🎯', val: dm.passes_decisives, color: '#a78bfa', label: 'Passe(s) D.' },
                    { show: dm.carton_jaune,         icon: '🟨', val: '',                  color: '#f59e0b', label: 'Carton jaune' },
                    { show: dm.carton_rouge,         icon: '🟥', val: '',                  color: '#e70013', label: 'Carton rouge' },
                    { show: dm.note,                 icon: '⭐', val: dm.note,             color: '#f59e0b', label: 'Note' },
                    { show: dm.blesse,               icon: '🏥', val: 'Blessé',            color: '#e70013', label: '' },
                  ].filter(s => s.show).map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14 }}>{s.icon}</div>
                      {s.val !== '' && <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.val}</div>}
                      <div style={{ fontSize: 8, color: '#333', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        {statsDisplay && (statsDisplay.matchs > 0 || statsDisplay.buts > 0 || statsDisplay.passes > 0) && (
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #14142a' }}>
            <div style={{ fontSize: 9, color: '#30304a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
              Statistiques {joueur.saison}
              {autoSeasonStats && !joueur.stats?.matchs && (
                <span style={{ marginLeft: 6, color: '#1a4a3a', fontSize: 8 }}>● ESPN</span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {Object.entries(STATS_LABELS).map(([key, meta]) => {
                const val = statsDisplay[key];
                if (val === undefined || val === null) return null;
                return (
                  <div key={key} style={{
                    background: '#07070f', borderRadius: 14, padding: '14px 10px',
                    textAlign: 'center', border: '1px solid #12122a',
                  }}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>{meta.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 8, color: '#282838', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{meta.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Admin ── */}
        {isAdmin && (
          <div style={{ padding: '16px 24px' }}>
            <button onClick={onEditPhoto} style={{
              width: '100%', padding: '12px 0',
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 20px ${color}50`, fontFamily: 'inherit',
            }}>📷 Modifier la photo</button>
          </div>
        )}
      </div>
    </div>
  );
}
