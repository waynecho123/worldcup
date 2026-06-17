// Monte Carlo Simulation Engine - CHO的世界杯小站

const data = require('./data');
const TEAMS = data.TEAMS;
const GROUPS = data.GROUPS;
const MATCH_SCHEDULE = data.MATCH_SCHEDULE;
const TACTICAL = data.TACTICAL;

const predict = require('./predict');

function simulateGroupStage() {
  const standings = {};
  GROUPS.forEach(g => {
    const teams = getGroupTeams(g);
    const table = teams.map(t => ({ id: t.id, cn: t.cn, flag: t.flag, pts: 0, gf: 0, ga: 0, gd: 0, mp: 0 }));
    const matches = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) matches.push([teams[i], teams[j]]);
    matches.forEach(([t1, t2]) => {
      const [hg, ag] = predict.sampleMatch(t1, t2);
      const r1 = table.find(r => r.id === t1.id), r2 = table.find(r => r.id === t2.id);
      r1.gf += hg; r1.ga += ag; r1.mp++; r2.gf += ag; r2.ga += hg; r2.mp++;
      if (hg > ag) r1.pts += 3; else if (hg < ag) r2.pts += 3; else { r1.pts++; r2.pts++; }
    });
    table.forEach(r => r.gd = r.gf - r.ga);
    table.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    standings[g] = table;
  });
  return standings;
}

function getBestThirds(standings) {
  const thirds = GROUPS.map(g => standings[g][2]);
  thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  return { all: thirds, adv: thirds.slice(0, 8) };
}

function simulateKnockout(standings) {
  const winners = GROUPS.map(g => standings[g][0]);
  const runners = GROUPS.map(g => standings[g][1]);
  const thirds = getBestThirds(standings).adv;

  const pool = [...winners, ...runners, ...thirds];
  // Simplified R32 pairing
  const r32M = [];
  for (let i = 0; i < 8; i++) r32M.push([pool[i], pool[24 + i]]);
  for (let i = 0; i < 8; i++) r32M.push([pool[8 + i], pool[16 + i]]);

  function playRound(matches) {
    return matches.map(([t1, t2]) => {
      const tm1 = TEAMS.find(x => x.id === t1.id), tm2 = TEAMS.find(x => x.id === t2.id);
      const [hg, ag] = predict.sampleMatch(tm1, tm2);
      const w = hg > ag ? t1 : (ag > hg ? t2 : (Math.random() > 0.5 ? t1 : t2));
      return { home: t1, away: t2, hg, ag, winner: w };
    });
  }

  const r32 = playRound(r32M);
  let cur = r32.map(r => r.winner);
  const r16M = []; for (let i = 0; i < cur.length; i += 2) r16M.push([cur[i], cur[i+1]]);
  const r16 = playRound(r16M); cur = r16.map(r => r.winner);
  const qfM = []; for (let i = 0; i < cur.length; i += 2) qfM.push([cur[i], cur[i+1]]);
  const qf = playRound(qfM); cur = qf.map(r => r.winner);
  const sfM = []; for (let i = 0; i < cur.length; i += 2) sfM.push([cur[i], cur[i+1]]);
  const sf = playRound(sfM); cur = sf.map(r => r.winner);
  const fin = playRound([[cur[0], cur[1]]])[0];
  return { r32, r16, qf, sf, final: fin, champion: fin.winner };
}

function runMonteCarlo(numRuns, progressCb) {
  const champCnt = {}, grpCnt = {}, roundCnt = {}, bracketPool = [];
  TEAMS.forEach(t => {
    champCnt[t.id] = 0;
    grpCnt[t.id] = { f:0, s:0, tA:0, tO:0, out:0 };
    roundCnt[t.id] = { r32:0, r16:0, qf:0, sf:0, final:0, champ:0 };
  });

  const batch = Math.max(5, Math.floor(numRuns / 200));
  for (let run = 0; run < numRuns; run++) {
    const st = simulateGroupStage();
    const { all, adv } = getBestThirds(st);
    const advIds = new Set(adv.map(t => t.id));

    GROUPS.forEach(g => {
      const t = st[g];
      grpCnt[t[0].id].f++; grpCnt[t[1].id].s++;
      advIds.has(t[2].id) ? grpCnt[t[2].id].tA++ : grpCnt[t[2].id].tO++;
      if (grpCnt[t[3].id]) grpCnt[t[3].id].out++;
    });

    const r32p = new Set();
    GROUPS.forEach(g => { r32p.add(st[g][0].id); r32p.add(st[g][1].id); });
    adv.forEach(t => r32p.add(t.id));

    const ko = simulateKnockout(st);
    r32p.forEach(id => { if (roundCnt[id]) roundCnt[id].r32++; });
    ko.r16.forEach(m => { if (roundCnt[m.winner.id]) roundCnt[m.winner.id].r16++; });
    ko.qf.forEach(m => { if (roundCnt[m.winner.id]) roundCnt[m.winner.id].qf++; });
    ko.sf.forEach(m => { if (roundCnt[m.winner.id]) roundCnt[m.winner.id].sf++; });
    if (roundCnt[ko.final.winner.id]) roundCnt[ko.final.winner.id].final++;
    champCnt[ko.champion.id]++;
    if (roundCnt[ko.champion.id]) roundCnt[ko.champion.id].champ++;

    if (run < 3) bracketPool.push(ko);
    if (progressCb && run % batch === 0) progressCb(run / numRuns);
  }

  const champProb = Object.entries(champCnt).map(([id, c]) => ({ id, prob: c/numRuns })).sort((a,b) => b.prob-a.prob);
  const roundProbs = Object.entries(roundCnt).map(([id, c]) => ({ id, r32:c.r32/numRuns, r16:c.r16/numRuns, qf:c.qf/numRuns, sf:c.sf/numRuns, final:c.final/numRuns, champ:c.champ/numRuns }));
  return { ts: new Date().toISOString(), runs: numRuns, champProb, grpCnt, roundProbs, bestBracket: bracketPool[0]||null };
}


module.exports = {
  simulateGroupStage, getBestThirds, simulateKnockout, runMonteCarlo
};
