// Proxy nginx — évite le blocage CORS de football-data.org
const BASE = '/api/fd';
const CACHE_KEY = 'at_fd_v3';
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}

function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

// Normalize football-data.org match to same shape as TheSportsDB
function normalize(match, teamId) {
  const ht = match.homeTeam;
  const at = match.awayTeam;
  const sc = match.score?.fullTime;
  return {
    _source:       'fd',
    strHomeTeam:   ht.shortName || ht.name,
    strAwayTeam:   at.shortName || at.name,
    intHomeScore:  sc?.home ?? null,
    intAwayScore:  sc?.away ?? null,
    strLeague:     match.competition?.name || '',
    strSeason:     match.season?.startDate?.slice(0, 4)
                    ? `${match.season.startDate.slice(0,4)}-${match.season.endDate?.slice(0,4)}`
                    : '',
    dateEvent:     match.utcDate?.slice(0, 10) || '',
    _fdTeamId:     teamId,
  };
}

export async function getFDLastMatch(teamId) {
  const cache = getCache();
  const key = `fd_${teamId}`;
  if (cache[key] && Date.now() - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }
  try {
    const r = await fetch(
      `${BASE}/teams/${teamId}/matches?status=FINISHED&limit=5`,
      {}
    );
    const json = await r.json();
    const matches = json.matches || [];
    // Take the most recent finished match
    const last = matches.sort((a, b) => b.utcDate.localeCompare(a.utcDate))[0] || null;
    const data = last ? normalize(last, teamId) : null;
    const c = getCache();
    c[key] = { ts: Date.now(), data };
    saveCache(c);
    return data;
  } catch {
    return null;
  }
}

export async function fetchAllFDMatches(teamIds) {
  const unique = [...new Set(teamIds.filter(Boolean))];
  const pairs  = await Promise.all(
    unique.map(id => getFDLastMatch(id).then(d => [id, d]))
  );
  return Object.fromEntries(pairs);
}
