// Core Prediction Engine - CHO的世界杯小站
// Poisson distribution model + tactical adjustment

const data = require('./data');
// Destructure globals needed by extracted functions
const TEAMS = data.TEAMS;
const TACTICAL = data.TACTICAL;
const STYLE_MATCHUP = data.STYLE_MATCHUP;
const MATCH_SCHEDULE = data.MATCH_SCHEDULE;
const STARTING_XI = data.STARTING_XI;
const PLAYER_CN = data.PLAYER_CN;
const JERSEY_NUM = data.JERSEY_NUM;
const NEWS_MODIFIERS = data.NEWS_MODIFIERS || {};
var predChangeLog = {};
var PRED_LOG_KEY = 'pred_log';

const { getTournamentNow, getTournamentDateStr } = require('./time');

function getStrength(t) {
  // Base from FIFA rank (lower rank = higher score)
  const rankScore = Math.max(5, 95 - (t.rk - 1) * 1.5);
  // Attack/defense average
  const perf = t.att * 0.5 + t.def * 0.5;
  // Injury penalty: 🔴=4pts, ⚠️=2pts + news keywords
  let injPenalty = 0;
  const inj = t.inj || '';
  const redCount = (inj.match(/🔴/g) || []).length;
  const warnCount = (inj.match(/⚠️/g) || []).length;
  injPenalty = redCount * 4 + warnCount * 2;

  // News sentiment: positive news boosts, negative penalizes
  const news = t.news || '';
  const negKW = /visa|passport|absent|out|missing|suspended|ban|injury|injured|ruled out|withdraw/i;
  const posKW = /hat-trick|hero|brilliant|stunning|in form|confident|fit|ready|return/i;
  if (negKW.test(news + inj)) injPenalty += 3;
  if (negKW.test(news) && /captain|key|star/i.test(news)) injPenalty += 1; // extra for key player
  if (posKW.test(news)) injPenalty -= 2; // positive news reduces penalty

  return Math.max(10, rankScore * 0.40 + perf * 0.45 + 15 - injPenalty);
}

// Compute upset probability via Monte Carlo
function computeUpsetProb(homeStr, awayStr) {
  let upsets = 0;
  const N = 200;
  for (let i = 0; i < N; i++) {
    // Add noise to simulate match-day variance
    const hNoise = 1 + (Math.random() - 0.5) * 0.3;
    const aNoise = 1 + (Math.random() - 0.5) * 0.3;
    const hLambda = Math.max(0.3, homeStr / 28 * hNoise);
    const aLambda = Math.max(0.3, awayStr / 28 * aNoise);
    // Simulate one match
    const hg = poissonSample(hLambda);
    const ag = poissonSample(aLambda);
    if ((awayStr < homeStr && ag > hg) || (homeStr < awayStr && hg > ag)) upsets++;
  }
  return upsets / N;
}

function poissonSample(lambda) {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

function poissonPMF(lambda, k) {
  if (lambda <= 0) lambda = 0.05;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 2; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function predictMatch(homeTeam, awayTeam, matchOdds) {
  const hStr = getStrength(homeTeam);
  const aStr = getStrength(awayTeam);
  // Home advantage for host nations and neutral venue adjustment
  const homeBoost = (homeTeam.seed === 'host') ? 1.12 : 1.04;

  // Tactical matchup adjustment
  const tacticalAdj = getTacticalAdjustment(homeTeam, awayTeam);
  const tacAnalysis = getTacticalAnalysis(homeTeam, awayTeam);

  // Apply tactical modifier to expected goals (max ±8%)
  const lambdaH = Math.max(0.3, Math.min(hStr / 28 * homeBoost * (1 + tacticalAdj) * (hStr / (aStr * 0.55 + hStr * 0.45)), 5.5));
  const lambdaA = Math.max(0.3, Math.min(aStr / 28 * (1 - tacticalAdj * 0.5) * (aStr / (hStr * 0.55 + aStr * 0.45)), 5.5));

  let hwp = 0, dp = 0, awp = 0;
  const allScores = [];
  for (let h = 0; h <= 9; h++) {
    for (let a = 0; a <= 9; a++) {
      const prob = poissonPMF(lambdaH, h) * poissonPMF(lambdaA, a);
      if (h > a) hwp += prob; else if (h === a) dp += prob; else awp += prob;
      allScores.push({ h, a, prob });
    }
  }
  allScores.sort((x, y) => y.prob - x.prob);
  const bestS = [allScores[0].h, allScores[0].a];
  const topScores = allScores.slice(0, 3).map(s => ({ home: s.h, away: s.a, prob: s.prob }));
  const t = hwp + dp + awp;
  const aiProbs = { home: hwp/t, draw: dp/t, away: awp/t };

  // Market consensus: compare AI prediction with live odds (if available)
  let marketConsensus = null;
  if (liveOdds && liveOdds.had) {
    const had = liveOdds.had;
    // Convert odds to implied probability (removing margin)
    const impH = 1 / had.homeWinOdds, impD = 1 / had.drawOdds, impA = 1 / had.awayWinOdds;
    const impTotal = impH + impD + impA;
    const mktProbs = { home: impH / impTotal, draw: impD / impTotal, away: impA / impTotal };

    // Compare AI vs market direction
    const aiFav = aiProbs.home > aiProbs.away ? 'home' : aiProbs.away > aiProbs.home ? 'away' : 'draw';
    const mktFav = mktProbs.home > mktProbs.away ? 'home' : mktProbs.away > mktProbs.home ? 'away' : 'draw';
    const agree = aiFav === mktFav;

    // Confidence: how much AI agrees with market
    const aiConf = Math.max(aiProbs.home, aiProbs.draw, aiProbs.away);
    const mktConf = Math.max(mktProbs.home, mktProbs.draw, mktProbs.away);
    const consensusLevel = agree ? (aiConf > 0.55 ? 'high' : 'medium') : 'diverged';

    marketConsensus = {
      agree: agree,
      level: consensusLevel,
      aiFav: aiFav,
      mktFav: mktFav,
      mktHome: (mktProbs.home * 100).toFixed(0),
      mktDraw: (mktProbs.draw * 100).toFixed(0),
      mktAway: (mktProbs.away * 100).toFixed(0),
      label: agree
        ? (consensusLevel === 'high' ? 'AI与机构高度一致 ✅' : 'AI与机构基本一致 👍')
        : 'AI与机构存在分歧 ⚠️'
    };
  }

  // Blend AI predictions with market odds if available (Bayesian-style weighting)
  let finalHome = aiProbs.home, finalDraw = aiProbs.draw, finalAway = aiProbs.away;
  let oddsBlended = false;
  if (matchOdds && matchOdds.h && matchOdds.d && matchOdds.a) {
    const impH = 1/matchOdds.h, impD = 1/matchOdds.d, impA = 1/matchOdds.a;
    const impTotal = impH + impD + impA;
    const mktProbs = { home: impH/impTotal, draw: impD/impTotal, away: impA/impTotal };
    // Blend: 55% AI model + 45% market (market captures insider info)
    finalHome = aiProbs.home * 0.55 + mktProbs.home * 0.45;
    finalDraw = aiProbs.draw * 0.55 + mktProbs.draw * 0.45;
    finalAway = aiProbs.away * 0.55 + mktProbs.away * 0.45;
    oddsBlended = true;
  }

  // Compute upset probability via Monte Carlo
  const upsetProb = computeUpsetProb(hStr, aStr);
  const underdog = hStr > aStr ? awayTeam : homeTeam;
  const isUpsetAlert = upsetProb > 0.25;

  return {
    homeWinProb: finalHome, drawProb: finalDraw, awayWinProb: finalAway,
    expH: lambdaH, expA: lambdaA,
    predScore: bestS || [Math.round(lambdaH), Math.round(lambdaA)],
    topScores: topScores,
    hStr, aStr, tacticalAdj, tacAnalysis, marketConsensus,
    // New fields for enhanced predictions
    aiProbs, oddsBlended,
    upsetProb, upsetAlert: isUpsetAlert,
    upsetTeam: isUpsetAlert ? underdog.cn : null,
    upsetTeamFlag: isUpsetAlert ? underdog.flag : null
  };
}

/** Check if actual score matches any of the top 3 predictions */
function isExactMatch(pred, actual) {
  if (!pred || !actual) return false;
  return (pred.topScores || []).some(function(s) {
    return s.home === actual.homeScore && s.away === actual.awayScore;
  });
}


function sampleMatch(homeTeam, awayTeam) {
  const p = predictMatch(homeTeam, awayTeam);
  const r = Math.random();
  if (r < p.homeWinProb) {
    const hg = Math.max(1, Math.round(p.expH + (Math.random() - 0.5) * 2.5));
    const ag = Math.max(0, hg - 1 - Math.floor(Math.random() * 3));
    return [Math.max(ag + 1, hg), ag];
  } else if (r < p.homeWinProb + p.drawProb) {
    const g = Math.max(0, Math.round((p.expH + p.expA) / 2 * (0.6 + Math.random() * 0.8)));
    return [Math.min(g, Math.round(p.expH)), Math.min(g, Math.round(p.expA))];
  } else {
    const ag = Math.max(1, Math.round(p.expA + (Math.random() - 0.5) * 2.5));
    const hg = Math.max(0, ag - 1 - Math.floor(Math.random() * 3));
    return [hg, Math.max(hg + 1, ag)];
  }
}

function getTacticalAdjustment(homeTeam, awayTeam) {
  const ht = TACTICAL[homeTeam.id];
  const at = TACTICAL[awayTeam.id];
  if (!ht || !at) return 0;

  // 1. Style matchup
  const styleAdj = (STYLE_MATCHUP[ht.style] && STYLE_MATCHUP[ht.style][at.style]) || 0;

  // 2. Key attribute comparisons
  let attrAdj = 0;
  // Pressing vs Technique: high pressing disrupts technical teams
  attrAdj += (ht.pressing - at.technique) * 0.003;
  // Technique vs Physical: technical teams bypass physical ones
  attrAdj += (ht.technique - at.physical) * 0.002;
  // Transition speed advantage
  attrAdj += (ht.transition - at.transition) * 0.002;
  // Set piece advantage
  attrAdj += (ht.setPiece - at.setPiece) * 0.003;

  // 3. Specific tactical weaknesses
  let weaknessAdj = 0;
  if (at.weakness.includes('高位') && ht.style === 'counter') weaknessAdj = 0.04; // counter vs high line
  if (at.weakness.includes('高压') && ht.style === 'possession') weaknessAdj = -0.03; // possession struggles vs press
  if (at.weakness.includes('反击') && ht.style === 'defensive_block') weaknessAdj = -0.04; // defensive block vs counter
  if (at.weakness.includes('身体') && ht.style === 'direct') weaknessAdj = 0.03; // physical advantage
  if (at.weakness.includes('防守反击') && ht.style === 'possession') weaknessAdj = -0.03; // possession vs counter

  const total = styleAdj + attrAdj + weaknessAdj;
  return Math.max(-0.08, Math.min(0.08, total));
}

function getTacticalAnalysis(homeTeam, awayTeam) {
  const ht = TACTICAL[homeTeam.id];
  const at = TACTICAL[awayTeam.id];
  if (!ht || !at) return '';

  const adj = getTacticalAdjustment(homeTeam, awayTeam);
  const styleNames = {possession:'传控',counter:'防守反击',high_press:'高位逼抢',direct:'直接冲击',defensive_block:'低位防守',balanced:'攻守均衡'};
  const htStyle = styleNames[ht.style] || ht.style;
  const atStyle = styleNames[at.style] || at.style;

  // Determine key matchup narrative
  let narrative = '';
  if (adj > 0.03) narrative = `✅ ${homeTeam.cn}的${htStyle}战术克制${awayTeam.cn}的${atStyle}`;
  else if (adj > 0.01) narrative = `🟢 ${homeTeam.cn}战术上略有优势`;
  else if (adj > -0.01) narrative = `⚖️ 双方战术互有制衡，无明显克制`;
  else if (adj > -0.03) narrative = `🟡 ${awayTeam.cn}战术上略占上风`;
  else narrative = `⚠️ ${awayTeam.cn}的${atStyle}战术克制${homeTeam.cn}的${htStyle}`;

  const adjPct = (adj * 100).toFixed(1);
  return {
    narrative,
    adj,
    adjPct: (adj > 0 ? '+' : '') + adjPct + '%',
    homeStyle: `${homeTeam.flag} ${htStyle} · ${ht.formation}`,
    awayStyle: `${awayTeam.flag} ${atStyle} · ${at.formation}`,
    homeStrength: ht.strength,
    homeWeakness: ht.weakness,
    awayStrength: at.strength,
    awayWeakness: at.weakness,
    keyPoints: [
      `${homeTeam.cn}${ht.strength}，${ht.weakness}`,
      `${awayTeam.cn}${at.strength}，${at.weakness}`,
      narrative
    ]
  };
}

function getPredictionStatus(dateStr) {
  var todayStr = getTournamentDateStr();
  if (dateStr < todayStr) return 'past';
  // 所有未发生比赛均可见预测
  return 'visible';
}

function isMatchLocked(matchId) {
  var m = MATCH_SCHEDULE.find(function(x){return x.id === matchId});
  if (!m) return false;
  var now = getTournamentNow();
  // Lock at 21:00 the day BEFORE the match
  var matchDate = new Date(m.date + 'T00:00:00+08:00');
  var lockTime = new Date(matchDate.getTime() - 3 * 3600000); // 21:00 = 24:00 - 3h
  return now >= lockTime;
}

function isMatchBettable(matchId) {
  var m = MATCH_SCHEDULE.find(function(x){return x.id === matchId});
  if (!m) return false;
  if (getPredictionStatus(m.date) === 'past') return false;
  return !isMatchLocked(matchId);
}

function logPredictionSnapshot(matchId, pred) {
  var now = new Date().toISOString();
  var entry = predChangeLog[matchId] || { history: [], lastUpdate: null, reason: '初始预测' };
  var scoreStr = pred.predScore[0] + ':' + pred.predScore[1];
  var probStr = (pred.homeWinProb*100).toFixed(0) + '/' + (pred.drawProb*100).toFixed(0) + '/' + (pred.awayWinProb*100).toFixed(0);

  // Detect change reason
  var reason = '定期更新';
  if (entry.history.length > 0) {
    var prev = entry.history[entry.history.length - 1];
    if (prev.score !== scoreStr) {
      reason = '预期比分调整: ' + prev.score + '→' + scoreStr;
    } else {
      var prevProbs = prev.probs.split('/').map(Number);
      var curProbs = probStr.split('/').map(Number);
      var maxShift = 0, maxIdx = 0;
      var labels = ['胜', '平', '负'];
      for (var i = 0; i < 3; i++) {
        var shift = Math.abs(curProbs[i] - prevProbs[i]);
        if (shift > maxShift) { maxShift = shift; maxIdx = i; }
      }
      if (maxShift >= 2) {
        reason = '概率微调: ' + labels[maxIdx] + (curProbs[maxIdx] > prevProbs[maxIdx] ? '升' : '降') + maxShift + '%';
      }
    }
  }

  entry.history.push({ ts: now, score: scoreStr, probs: probStr, reason: reason });
  if (entry.history.length > 10) entry.history.shift(); // Keep last 10
  entry.lastUpdate = now;
  entry.reason = reason;
  predChangeLog[matchId] = entry;
  try { wx.setStorageSync(PRED_LOG_KEY, JSON.stringify(predChangeLog)); } catch(e) {}
}

function getPredUpdateInfo(matchId) {
  var entry = predChangeLog[matchId];
  if (!entry || !entry.lastUpdate) return '';
  var lastUpd = new Date(entry.lastUpdate);
  var now = new Date();
  var diffMin = Math.floor((now - lastUpd) / 60000);
  var timeAgo;
  if (diffMin < 3) timeAgo = '刚刚';
  else if (diffMin < 60) timeAgo = diffMin + '分钟前';
  else if (diffMin < 120) timeAgo = '1小时前';
  else timeAgo = Math.floor(diffMin / 60) + '小时前';
  return '<span style="font-size:.6rem;color:var(--text3)" title="' + entry.reason + '">🕐 ' + timeAgo + '更新' + (entry.reason !== '定期更新' ? ' · ' + entry.reason : '') + '</span>';
}

function refreshAllPredictions() {
  var allUpcoming = MATCH_SCHEDULE.filter(function(m) {
    return m.stage === 'group' && getPredictionStatus(m.date) !== 'past' && !isMatchLocked(m.id);
  });
  var changedCount = 0;
  allUpcoming.forEach(function(m) {
    var ht = TEAMS.find(function(t) { return t.id === m.home; });
    var at = TEAMS.find(function(t) { return t.id === m.away; });
    if (!ht || !at) return;
    var pred = predictMatch(ht, at);
    logPredictionSnapshot(m.id, pred);
    changedCount++;
  });
  // Re-render if on the schedule tab
  var todayStr = getTournamentDateStr();
  renderTodayMatches(todayStr);
  return changedCount;
}


module.exports = {
  getStrength, poissonPMF, predictMatch, sampleMatch,
  getTacticalAdjustment, getTacticalAnalysis,
  getPredictionStatus, isMatchLocked, isMatchBettable,
  logPredictionSnapshot, getPredUpdateInfo, refreshAllPredictions,
  isExactMatch
};
