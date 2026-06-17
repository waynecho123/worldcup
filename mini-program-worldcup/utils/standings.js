// Group Standings Calculator
const data = require('./data');

/**
 * Calculate group standings based on actual match results
 */
function calculateStandings() {
  const app = getApp();
  const results = app ? app.globalData.actualResults : {};

  // Initialize standings
  const groups = {};
  data.GROUPS.forEach(function(g) {
    groups[g] = {};
    data.TEAMS.filter(function(t) { return t.grp === g; }).forEach(function(t) {
      groups[g][t.id] = {
        id: t.id, flag: t.flag, cn: t.cn, name: t.name,
        rank: t.rk, seed: t.seed,
        played: 0, won: 0, drawn: 0, lost: 0,
        gf: 0, ga: 0, gd: 0, pts: 0
      };
    });
  });

  // Process match results
  data.MATCH_SCHEDULE.filter(function(m) {
    return m.stage === 'group' && results[m.id];
  }).forEach(function(m) {
    const g = m.grp;
    if (!g || !groups[g]) return;
    const r = results[m.id];
    const homeTeam = groups[g][m.home];
    const awayTeam = groups[g][m.away];
    if (!homeTeam || !awayTeam) return;

    homeTeam.played++;
    awayTeam.played++;
    homeTeam.gf += r.homeScore;
    homeTeam.ga += r.awayScore;
    awayTeam.gf += r.awayScore;
    awayTeam.ga += r.homeScore;

    if (r.homeScore > r.awayScore) {
      homeTeam.won++;
      homeTeam.pts += 3;
      awayTeam.lost++;
    } else if (r.homeScore < r.awayScore) {
      awayTeam.won++;
      awayTeam.pts += 3;
      homeTeam.lost++;
    } else {
      homeTeam.drawn++;
      awayTeam.drawn++;
      homeTeam.pts += 1;
      awayTeam.pts += 1;
    }
  });

  // Sort each group
  const standings = {};
  data.GROUPS.forEach(function(g) {
    const teams = Object.values(groups[g]);
    teams.sort(function(a, b) {
      if (a.pts !== b.pts) return b.pts - a.pts;
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdA !== gdB) return gdB - gdA;
      if (a.gf !== b.gf) return b.gf - a.gf;
      return a.rank - b.rank;
    });
    // Update GD
    teams.forEach(function(t) { t.gd = t.gf - t.ga; });
    standings[g] = teams;
  });

  return standings;
}

/**
 * Get qualification status for each team
 */
function getQualificationStatus(groupStandings, groupName) {
  // Top 2 auto-qualify, plus best 8 3rd-place teams (out of 12 groups)
  const teams = groupStandings[groupName] || [];
  return teams.map(function(t, i) {
    if (i < 2) return { ...t, status: 'auto', statusLabel: '晋级' };
    if (i === 2) return { ...t, status: 'third', statusLabel: '待定(第3)' };
    return { ...t, status: 'out', statusLabel: '淘汰' };
  });
}

/**
 * Calculate all 3rd-place rankings across groups
 */
function calculateThirdPlaceRanking(standings) {
  const thirds = [];
  data.GROUPS.forEach(function(g) {
    const teams = standings[g] || [];
    if (teams.length >= 3) {
      thirds.push({ group: g, ...teams[2] });
    }
  });
  thirds.sort(function(a, b) {
    if (a.pts !== b.pts) return b.pts - a.pts;
    if (a.gd !== b.gd) return b.gd - a.gd;
    if (a.gf !== b.gf) return b.gf - a.gf;
    return 0;
  });
  return thirds; // Top 8 qualify for KO
}

module.exports = { calculateStandings, getQualificationStatus, calculateThirdPlaceRanking };
