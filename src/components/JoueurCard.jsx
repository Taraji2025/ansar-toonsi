const POSTE_COLOR = {
  Gardien:   '#f59e0b',
  Défenseur: '#3b82f6',
  Milieu:    '#22c55e',
  Attaquant: '#e70013',
};
const NIVEAU_COLOR = {
  Pro:    '#e70013',
  U23:    '#f59e0b',
  U19:    '#22c55e',
  U17:    '#3b82f6',
  Veille: '#8b5cf6',
};
const RESULT_STYLE = {
  win:  { color: '#22c55e', bg: '#0a2a12', border: '#1a4a1a', label: 'V' },
  loss: { color: '#e70013', bg: '#1a0508', border: '#3a000f', label: 'D' },
  draw: { color: '#f59e0b', bg: '#1a1205', border: '#3a2800', label: 'N' },
};

function formatDate(d) {
  if (!d) return '';
  const [, m, day] = d.split('-');
  const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  return `${+day} ${months[+m - 1]}`;
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
  return { ts, os, opponent, type };
}

export default function JoueurCard({ joueur, onClick, isAdmin, onEditPhoto, lastMatch, autoMatchData, autoSeasonStats }) {
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
  const seasonStats = (joueur.stats && Object.values(joueur.stats).some(v => v > 0))
    ? joueur.stats
    : autoSeasonStats || null;

  return (
    <div
      onClick={() => onClick(joueur)}
      style={{
        background: 'linear-gradient(170deg, #131325 0%, #0d0d1c 100%)',
        border: '1px solid #1a1a30',
        borderRadius: 18,
        cursor: 'pointer',
        transition: 'transform 0.22s cubic-bezier(.2,.8,.3,1), box-shadow 0.22s, border-color 0.22s',
        overflow: 'hidden',
        position: 'relative',
        animation: 'fadeIn 0.3s ease both',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-7px) scale(1.015)';
        e.currentTarget.style.boxShadow = `0 20px 48px ${color}28, 0 4px 16px rgba(0,0,0,0.6)`;
        e.currentTarget.style.borderColor = color + '55';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '#1a1a30';
      }}
    >
      {/* ── Photo section ── */}
      <div style={{
        height: 160,
        background: `radial-gradient(ellipse at 70% 30%, ${color}22 0%, ${color}06 55%, #07070f 100%)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}44)` }} />

        {/* Decorative ring */}
        <div style={{
          position: 'absolute', bottom: -50, right: -50,
          width: 150, height: 150, borderRadius: '50%',
          border: `1px solid ${color}15`, pointerEvents: 'none',
        }} />

        {joueur.photo ? (
          <img
            src={joueur.photo}
            alt={joueur.nom}
            style={{ height: '100%', maxWidth: '100%', objectFit: 'contain', objectPosition: 'center bottom', position: 'relative', zIndex: 1 }}
          />
        ) : (
          <div style={{ fontSize: 56, fontWeight: 900, color: color + '28', letterSpacing: -3, userSelect: 'none' }}>
            {initiales}
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', gap: 4, zIndex: 2 }}>
          <span style={{
            fontSize: 9, color: nColor,
            background: 'rgba(7,7,15,0.85)', padding: '2px 8px',
            borderRadius: 10, fontWeight: 700,
            border: `1px solid ${nColor}45`,
            backdropFilter: 'blur(6px)',
          }}>
            {joueur.niveau}
          </span>
          {joueur.selection && (
            <span style={{
              fontSize: 10, background: 'rgba(7,7,15,0.85)', padding: '2px 6px',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
            }}>🇹🇳</span>
          )}
        </div>

        {/* Admin edit */}
        {isAdmin && (
          <button
            onClick={e => { e.stopPropagation(); onEditPhoto(); }}
            title="Modifier la photo"
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 10,
              background: 'rgba(0,0,0,0.75)', border: `1px solid ${color}50`,
              borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
              color: color, fontSize: 13, backdropFilter: 'blur(6px)',
            }}
          >📷</button>
        )}
      </div>

      {/* ── Info section ── */}
      <div style={{ padding: '13px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f0f0', lineHeight: 1.2, marginBottom: 7, letterSpacing: '-0.3px' }}>
          {joueur.nom}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9, color, background: color + '18', padding: '2px 8px',
            borderRadius: 8, fontWeight: 700, border: `1px solid ${color}25`,
          }}>
            {joueur.poste}
          </span>
          <span style={{ fontSize: 10, color: '#3a3a55' }}>·</span>
          <span style={{ fontSize: 10, color: '#4a4a65', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>
            {joueur.club}
          </span>
        </div>

        {/* Last match result */}
        {parsed ? (
          <div style={{
            background: '#07070f', borderRadius: 10, padding: '8px 10px',
            border: `1px solid ${rs.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 8, color: '#383850', textTransform: 'uppercase', letterSpacing: '0.07em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>
                {lastMatch.strLeague}
              </span>
              <span style={{ fontSize: 8, color: '#30303f', flexShrink: 0 }}>{formatDate(lastMatch.dateEvent)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: dm && dm.joue !== null ? 6 : 0 }}>
              <span style={{
                fontSize: 8, fontWeight: 800, color: rs.color,
                background: rs.bg, border: `1px solid ${rs.border}`,
                padding: '2px 5px', borderRadius: 4, flexShrink: 0,
              }}>{rs.label}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: rs.color, flexShrink: 0 }}>
                {parsed.ts}–{parsed.os}
              </span>
              <span style={{ fontSize: 9, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                vs {parsed.opponent}
              </span>
            </div>
            {/* Player status */}
            {dm && dm.joue === false && (
              <div style={{ fontSize: 9, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>—</span><span>N'a pas joué</span>
                {dm.blesse && <span>🏥</span>}
              </div>
            )}
            {dm && dm.joue === true && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, color: dm.titulaire ? '#3b82f6' : '#f59e0b', fontWeight: 700 }}>
                  {dm.titulaire ? '▶' : '⬆'} {dm.minutes ? `${dm.minutes}'` : ''}
                </span>
                {dm.buts > 0 && <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>⚽ {dm.buts}</span>}
                {dm.passes_decisives > 0 && <span style={{ fontSize: 9, color: '#a78bfa', fontWeight: 700 }}>🎯 {dm.passes_decisives}</span>}
                {dm.carton_jaune && <span style={{ fontSize: 10 }}>🟨</span>}
                {dm.carton_rouge && <span style={{ fontSize: 10 }}>🟥</span>}
                {dm.note && <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>⭐ {dm.note}</span>}
                {dm.blesse && <span style={{ fontSize: 10 }}>🏥</span>}
              </div>
            )}
          </div>
        ) : joueur.age > 0 ? (
          <div style={{ fontSize: 10, color: '#252535', padding: '4px 0' }}>
            {joueur.age} ans
            {joueur.dernier_match?.blesse && <span style={{ marginLeft: 6 }}>🏥</span>}
          </div>
        ) : null}

        {/* Stats saison (mini) */}
        {seasonStats && (seasonStats.matchs > 0 || seasonStats.buts > 0 || seasonStats.passes > 0) && (
          <div style={{
            display: 'flex', gap: 6, marginTop: parsed ? 8 : 4,
            paddingTop: parsed ? 8 : 0,
            borderTop: parsed ? '1px solid #0f0f1e' : 'none',
          }}>
            {seasonStats.matchs > 0 && (
              <span style={{ fontSize: 9, color: '#383855', fontWeight: 600 }}>
                ⚽ <span style={{ color: '#555' }}>{seasonStats.matchs}J</span>
              </span>
            )}
            {seasonStats.buts > 0 && (
              <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>
                🥅 {seasonStats.buts}
              </span>
            )}
            {seasonStats.passes > 0 && (
              <span style={{ fontSize: 9, color: '#a78bfa', fontWeight: 700 }}>
                🎯 {seasonStats.passes}
              </span>
            )}
            {seasonStats.cartons_jaunes > 0 && (
              <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>🟨{seasonStats.cartons_jaunes}</span>
            )}
            {seasonStats.cartons_rouges > 0 && (
              <span style={{ fontSize: 9, color: '#e70013', fontWeight: 700 }}>🟥{seasonStats.cartons_rouges}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
