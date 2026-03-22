// matchData est maintenant keyed par nom de club directement

const RESULT_COLOR = {
  win:  '#22c55e',
  loss: '#e70013',
  draw: '#f59e0b',
};
const RESULT_LABEL = { win: 'V', loss: 'D', draw: 'N' };
const POSTE_ICON = { Gardien: '🧤', Défenseur: '🛡️', Milieu: '⚙️', Attaquant: '⚡' };

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

function shortName(name) {
  const parts = name.split(' ');
  if (parts.length === 1) return name;
  return parts[parts.length - 1]; // last name only
}

function shortTeam(name) {
  // Keep max 2 words, max 14 chars
  return name.split(' ').slice(0, 2).join(' ').slice(0, 14);
}

export default function ResultsBanner({ joueurs, matchData }) {
  const items = joueurs
    .map(j => {
      const match = matchData[j.club] || null;
      const parsed = match ? parseResult(match, j.club) : null;
      return parsed ? { joueur: j, match, parsed } : null;
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  const renderItem = (item, key) => {
    const { joueur, match, parsed } = item;
    const c = RESULT_COLOR[parsed.type];
    return (
      <div
        key={key}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '0 18px', borderRight: '1px solid #12121f',
          flexShrink: 0, whiteSpace: 'nowrap', height: '100%',
        }}
      >
        <span style={{ fontSize: 10, color: '#555' }}>
          {POSTE_ICON[joueur.poste]}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#7070a0' }}>
          {shortName(joueur.nom)}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 800, color: c,
          background: c + '18', border: `1px solid ${c}30`,
          padding: '1px 5px', borderRadius: 4,
        }}>
          {RESULT_LABEL[parsed.type]}
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: c }}>
          {parsed.ts}–{parsed.os}
        </span>
        <span style={{ fontSize: 10, color: '#383855' }}>
          vs {shortTeam(parsed.opponent)}
        </span>
        <span style={{ fontSize: 9, color: '#252535' }}>
          {match.strLeague?.split(' ').pop()}
        </span>
      </div>
    );
  };

  return (
    <div style={{
      background: '#080812',
      borderBottom: '1px solid #10101e',
      height: 38,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Gradient masks */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, #080812 30%, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg, #080812 30%, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Label */}
      <div style={{
        position: 'absolute', left: 14, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center', zIndex: 3,
        fontSize: 8, color: '#e70013', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        gap: 5,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e70013', display: 'inline-block', boxShadow: '0 0 6px #e70013' }} />
        Live
      </div>

      {/* Ticker */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '100%',
        animation: `ticker ${Math.max(items.length * 5, 20)}s linear infinite`,
        paddingLeft: 80,
      }}>
        {items.map((item, i) => renderItem(item, i))}
        {items.map((item, i) => renderItem(item, `dup-${i}`))}
      </div>
    </div>
  );
}
