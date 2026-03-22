const CACHE_KEY = 'at_sportsdb_v2';
const CACHE_TTL = 60 * 60 * 1000; // 1h

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}

function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

export async function getLastMatch(teamId) {
  const cache = getCache();
  const key = `last_${teamId}`;
  if (cache[key] && Date.now() - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }
  try {
    const r = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`
    );
    const json = await r.json();
    const data = json.results?.[0] ?? null;
    const c = getCache();
    c[key] = { ts: Date.now(), data };
    saveCache(c);
    return data;
  } catch {
    return null;
  }
}

export async function fetchAllMatches(clubIds) {
  const unique = [...new Set(clubIds.filter(Boolean))];
  const pairs = await Promise.all(
    unique.map(id => getLastMatch(id).then(d => [id, d]))
  );
  return Object.fromEntries(pairs);
}
