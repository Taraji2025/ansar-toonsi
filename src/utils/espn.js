const BASE      = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const CACHE_KEY = 'at_espn_v5';
const CACHE_TTL = 20 * 60 * 1000; // 20 min

// Clubs couverts par ESPN — IDs vérifiés mars 2026
export const ESPN_CLUBS = {
  // ── ANGLETERRE ─────────────────────────────────────────
  'Burnley FC':           { league: 'eng.1', id: '379'   },  // Premier League
  'Norwich City':         { league: 'eng.2', id: '381'   },  // Championship
  'Oxford United':        { league: 'eng.2', id: '311'   },

  // ── FRANCE LIGUE 1 ─────────────────────────────────────
  'OGC Nice':             { league: 'fra.1', id: '2502'  },
  'AS Monaco':            { league: 'fra.1', id: '174'   },
  'Olympique Lyonnais':   { league: 'fra.1', id: '167'   },
  'Paris SG':             { league: 'fra.1', id: '160'   },
  'Le Havre AC':          { league: 'fra.1', id: '3236'  },
  'Toulouse FC':          { league: 'fra.1', id: '179'   },
  'FC Lorient':           { league: 'fra.1', id: '273'   },
  'Stade Rennais':        { league: 'fra.1', id: '169'   },
  'Stade Brestois':       { league: 'fra.1', id: '6997'  },
  'RC Strasbourg':        { league: 'fra.1', id: '180'   },
  'Angers SCO':           { league: 'fra.1', id: '7868'  },

  // ── FRANCE LIGUE 2 ─────────────────────────────────────
  'AS Saint-Étienne':     { league: 'fra.2', id: '178'   },
  'Montpellier HSC':      { league: 'fra.2', id: '274'   },
  'Red Star FC':          { league: 'fra.2', id: '11884' },
  'Dunkerque':            { league: 'fra.2', id: '7732'  },
  'Troyes AC':            { league: 'fra.2', id: '170'   },
  'Stade Lavallois':      { league: 'fra.2', id: '3266'  },
  'FC Annecy':            { league: 'fra.2', id: '18066' },

  // ── ALLEMAGNE BUNDESLIGA 1 ─────────────────────────────
  'Eintracht Francfort':  { league: 'ger.1', id: '125'   },
  'FC Augsbourg':         { league: 'ger.1', id: '3841'  },
  'Union Berlin':         { league: 'ger.1', id: '598'   },
  'VfB Stuttgart':        { league: 'ger.1', id: '134'   },
  'Bayern Munich':        { league: 'ger.1', id: '132'   },
  'Hambourg SV':          { league: 'ger.1', id: '127'   },

  // ── ALLEMAGNE BUNDESLIGA 2 ─────────────────────────────
  'Greuther Fürth':       { league: 'ger.2', id: '3070'  },
  'Karlsruher SC':        { league: 'ger.2', id: '4471'  },
  'SC Paderborn':         { league: 'ger.2', id: '3307'  },
  'E. Braunschweig':      { league: 'ger.2', id: '3067'  },

  // ── ITALIE SERIE A ─────────────────────────────────────
  'Lecce':                { league: 'ita.1', id: '113'   },
  'Bologne FC':           { league: 'ita.1', id: '107'   },
  'Parme Calcio':         { league: 'ita.1', id: '115'   },
  'Hellas Vérone':        { league: 'ita.1', id: '119'   },
  'Udinese':              { league: 'ita.1', id: '118'   },
  'AC Milan':             { league: 'ita.1', id: '103'   },

  // ── ITALIE SERIE B ─────────────────────────────────────
  'Sassuolo':             { league: 'ita.2', id: '3997'  },

  // ── ÉCOSSE ─────────────────────────────────────────────
  'Celtic FC':            { league: 'sco.1', id: '256'   },

  // ── TURQUIE ────────────────────────────────────────────
  'Kasimpasa':            { league: 'tur.1', id: '6870'  },

  // ── RUSSIE ─────────────────────────────────────────────
  'D. Makhachkala':       { league: 'rus.1', id: '22300' },
  'Akhmat Grozny':        { league: 'rus.1', id: '2991'  },

  // ── SUISSE ─────────────────────────────────────────────
  'Young Boys Berne':     { league: 'sui.1', id: '2722'  },
  'FC Lugano':            { league: 'sui.1', id: '7672'  },
  'Servette FC':          { league: 'sui.1', id: '20032' },
  'FC Bâle':              { league: 'sui.1', id: '989'   },

  // ── AUTRICHE ───────────────────────────────────────────
  'Rapid Vienne':         { league: 'aut.1', id: '519'   },
  'LASK Linz':            { league: 'aut.1', id: '4411'  },
  'RB Salzbourg':         { league: 'aut.1', id: '4012'  },

  // ── PAYS-BAS ───────────────────────────────────────────
  'FC Twente':            { league: 'ned.1', id: '152'   },

  // ── DANEMARK ───────────────────────────────────────────
  'FC Copenhague':        { league: 'den.1', id: '909'   },

  // ── SUÈDE ──────────────────────────────────────────────
  'BK Häcken':            { league: 'swe.1', id: '7834'  },
  'Djurgårdens IF':       { league: 'swe.1', id: '2339'  },

  // ── GRÈCE ──────────────────────────────────────────────
  'Atromitos':            { league: 'gre.1', id: '6790'  },

  // ── BELGIQUE ───────────────────────────────────────────
  'Cercle Bruges':        { league: 'bel.1', id: '3610'  },

  // ── PORTUGAL ───────────────────────────────────────────
  'Sporting CP':          { league: 'por.1', id: '2250'  },

  // ── USA / MLS ──────────────────────────────────────────
  'Vancouver Whitecaps':  { league: 'usa.1', id: '9727'  },
  'San Diego FC':         { league: 'usa.1', id: '22529' },
  'Inter Miami':          { league: 'usa.1', id: '20232' },

  // ── ARABIE SAOUDITE ────────────────────────────────────
  'Al-Wehda':             { league: 'ksa.1', id: '21835' },
};

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}
function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

function getScore(competitor) {
  const s = competitor?.score;
  if (typeof s === 'string') return s;
  if (typeof s === 'object' && s !== null) return s.displayValue ?? String(s.value ?? '?');
  return String(s ?? '?');
}

function normalize(event, teamId, league) {
  const comp = event.competitions[0];
  const home = comp.competitors.find(c => c.homeAway === 'home') || comp.competitors[0];
  const away = comp.competitors.find(c => c.homeAway === 'away') || comp.competitors[1];
  // Détermine domicile/extérieur de façon fiable via l'ID ESPN
  const isHome = String(home?.team?.id) === String(teamId);
  return {
    _source:      'espn',
    _eventId:     event.id,
    _league:      league,
    _teamId:      String(teamId),
    _isHome:      isHome,
    strHomeTeam:  home?.team?.shortDisplayName || home?.team?.displayName || '',
    strAwayTeam:  away?.team?.shortDisplayName || away?.team?.displayName || '',
    intHomeScore: getScore(home),
    intAwayScore: getScore(away),
    strLeague:    comp.tournament?.displayName || event.name || '',
    strSeason:    '',
    dateEvent:    event.date?.slice(0, 10) || '',
  };
}

export async function getESPNLastMatch(league, teamId) {
  const cKey = `sched_${league}_${teamId}`;
  const cache = getCache();
  if (cache[cKey] && Date.now() - cache[cKey].ts < CACHE_TTL) {
    return cache[cKey].data;
  }
  try {
    const url = `${BASE}/${league}/teams/${teamId}/schedule`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();
    const events = json.events || [];
    const completed = events.filter(e => e.competitions?.[0]?.status?.type?.completed);
    if (completed.length === 0) return null;
    const last = completed.sort((a, b) => b.date.localeCompare(a.date))[0];
    const data = normalize(last, teamId, league);
    const c = getCache();
    c[cKey] = { ts: Date.now(), data };
    saveCache(c);
    return data;
  } catch (e) {
    console.error(`[ESPN] schedule ${league}/${teamId} failed:`, e.message);
    return null;
  }
}

export async function getESPNMatchPlayerStats(league, eventId, teamId) {
  const cKey = `pstats_${eventId}_${teamId}`;
  const cache = getCache();
  if (cache[cKey] && Date.now() - cache[cKey].ts < CACHE_TTL) {
    return cache[cKey].data;
  }
  try {
    const url = `${BASE}/${league}/summary?event=${eventId}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();
    const playerStats = {};

    const teamSection = (json.boxscore?.players || []).find(
      p => String(p.team?.id) === String(teamId)
    );
    if (teamSection) {
      for (const group of teamSection.statistics || []) {
        const labels = group.labels || [];
        const idx = l => labels.indexOf(l);
        for (const ath of group.athletes || []) {
          const name = ath.athlete?.displayName;
          if (!name) continue;
          const s = ath.stats || [];
          playerStats[name] = {
            played:     true,
            titulaire:  null,
            minutes:    parseInt(s[idx('MIN')]) || 0,
            goals:      Math.max(0, parseInt(s[idx('G')]) || 0),
            assists:    Math.max(0, parseInt(s[idx('A')]) || 0),
            yellowCard: (parseInt(s[idx('YC')]) || 0) > 0,
            redCard:    (parseInt(s[idx('RC')]) || 0) > 0,
          };
        }
      }
    }

    const rosters = json.rosters || [];
    for (const roster of rosters) {
      if (String(roster.team?.id) !== String(teamId)) continue;
      for (const entry of roster.roster || []) {
        const name = entry.athlete?.displayName;
        if (!name) continue;
        if (playerStats[name]) {
          playerStats[name].titulaire = !!entry.starter;
        } else {
          playerStats[name] = {
            played: false, titulaire: false,
            minutes: 0, goals: 0, assists: 0,
            yellowCard: false, redCard: false,
          };
        }
      }
    }

    const c = getCache();
    c[cKey] = { ts: Date.now(), data: playerStats };
    saveCache(c);
    return playerStats;
  } catch {
    return null;
  }
}

export async function getESPNTeamSeasonStats(league, teamId) {
  const cKey = `roster_${league}_${teamId}`;
  const cache = getCache();
  if (cache[cKey] && Date.now() - cache[cKey].ts < 60 * 60 * 1000) {
    return cache[cKey].data;
  }
  try {
    const url = `${BASE}/${league}/teams/${teamId}/roster?enable=stats`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();
    const result = {};
    for (const ath of json.athletes || []) {
      const name = ath.displayName;
      if (!name) continue;
      const statsMap = {};
      for (const s of ath.statistics || []) {
        statsMap[s.name] = parseInt(s.displayValue) || 0;
      }
      if (Object.keys(statsMap).length === 0) continue;
      result[name] = {
        matchs:         statsMap.appearances   || statsMap.gamesStarted || 0,
        buts:           statsMap.goals         || 0,
        passes:         statsMap.assists       || 0,
        cartons_jaunes: statsMap.yellowCards   || 0,
        cartons_rouges: statsMap.redCards      || 0,
      };
    }
    const c = getCache();
    c[cKey] = { ts: Date.now(), data: result };
    saveCache(c);
    return result;
  } catch {
    return null;
  }
}

export async function fetchAllESPNMatches(clubEntries) {
  const pairs = await Promise.all(
    clubEntries.map(({ clubName, league, id }) =>
      getESPNLastMatch(league, id).then(d => [clubName, d])
    )
  );
  return Object.fromEntries(pairs);
}

export async function fetchAllESPNPlayerStats(mergedMatchData) {
  const seen = new Set();
  const pairs = await Promise.all(
    Object.entries(mergedMatchData)
      .filter(([, m]) => m?._source === 'espn' && m?._eventId && !seen.has(m._eventId) && seen.add(m._eventId))
      .map(([clubName, m]) =>
        getESPNMatchPlayerStats(m._league, m._eventId, m._teamId)
          .then(stats => [clubName, stats || {}])
      )
  );
  return Object.fromEntries(pairs);
}

export async function fetchAllESPNSeasonStats(joueurs) {
  const seen = new Set();
  const entries = joueurs
    .map(j => ({ clubName: j.club, info: ESPN_CLUBS[j.club] }))
    .filter(({ info, clubName }) => info && !seen.has(clubName) && seen.add(clubName));
  const pairs = await Promise.all(
    entries.map(({ clubName, info }) =>
      getESPNTeamSeasonStats(info.league, info.id)
        .then(stats => [clubName, stats || {}])
    )
  );
  return Object.fromEntries(pairs);
}
