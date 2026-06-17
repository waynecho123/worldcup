// Duel / Betting Engine - CHO的世界杯小站
const data = require('./data');
const predict = require('./predict');
const { JC_RETURN_RATE } = require('./constants');

const TEAMS = data.TEAMS;
const MATCH_SCHEDULE = data.MATCH_SCHEDULE;
const JC_ODDS = data.JC_ODDS;

const DUEL_KEY = 'duel_state';

function getDuelState() {
  const app = getApp();
  if (app && app.globalData && app.globalData.duelState) {
    return app.globalData.duelState;
  }
  return createInitialState();
}

function createInitialState() {
  return {
    aiBalance: 1000,
    humanBalance: 1000,
    strategies: {},   // { dateStr: [ { player, matchId, pick, odds, stake, ... } ] }
    settled: {}       // { dateStr: { aiProfit, humanProfit, ... } }
  };
}

/**
 * AI picks best bets using Kelly criterion
 */
function aiBestPick(matches) {
  const duel = getDuelState();
  const bets = aiAllPositiveEV(matches);
  if (bets.length === 0) return { singles: [], parlays: [] };

  // Risk management filter
  bets = bets.filter(function(b) {
    return b.odds <= 5.0 && b.prob >= 0.15 && b.ev >= 1.0;
  });

  // Sort by risk-adjusted return (Sharpe-like)
  bets.sort(function(a, b) {
    var scoreA = a.ev / Math.sqrt(Math.max(0.1, a.odds - 1));
    var scoreB = b.ev / Math.sqrt(Math.max(0.1, b.odds - 1));
    return scoreB - scoreA;
  });

  var kel = [];
  var totalStake = 0;
  var maxDailyLoss = duel.aiBalance * 0.12;
  var perMatchExposure = {};

  bets.forEach(function(b) {
    if (totalStake >= duel.aiBalance * 0.60) return;
    var edge = Math.max(0, b.ev / 100);
    var kellyFrac = 1.0 / 16.0;
    var k = duel.aiBalance * edge / Math.max(0.01, b.odds - 1) * kellyFrac;
    k = Math.max(10, Math.min(k, duel.aiBalance * 0.05, 200));
    k = Math.round(k / 10) * 10;

    var matchKey = b.match;
    var currentExposure = (perMatchExposure[matchKey] || 0);
    if (currentExposure + k > duel.aiBalance * 0.10) {
      k = Math.max(10, duel.aiBalance * 0.10 - currentExposure);
      k = Math.round(k / 10) * 10;
    }
    if (totalStake + k > duel.aiBalance * 0.60) {
      k = Math.max(0, duel.aiBalance * 0.60 - totalStake);
      k = Math.round(k / 10) * 10;
    }
    var riskContribution = k / b.odds;
    var totalRisk = kel.reduce(function(s, x) { return s + x.stake / x.odds; }, 0);
    if (totalRisk + riskContribution > maxDailyLoss * 1.5) {
      k = Math.max(0, (maxDailyLoss * 1.5 - totalRisk) * b.odds);
      k = Math.round(k / 10) * 10;
    }

    if (k >= 10) {
      kel.push({
        type: b.type, pick: b.pick, odds: b.odds, stake: k,
        ev: b.ev, match: b.match, mid: b.mid, prob: b.prob
      });
      totalStake += k;
      perMatchExposure[matchKey] = (perMatchExposure[matchKey] || 0) + k;
    }
  });

  // Parlay: 2-leg only, strict risk control
  var parlays = [];
  if (kel.length >= 2) {
    var safePicks = kel.filter(function(b) { return b.prob >= 0.30 && b.odds <= 2.5; });
    if (safePicks.length >= 2) {
      var best2 = safePicks.slice(0, 2);
      var parOdds = best2.reduce(function(s, b) { return s * b.odds; }, 1);
      var parProb = best2.reduce(function(s, b) { return s * (b.prob || 0.5); }, 1);
      var parEV = parProb * (parOdds * JC_RETURN_RATE - 1) * 100;
      if (parProb >= 0.12 && parEV >= 5.0) {
        var parStake = Math.round(duel.aiBalance * 0.03 / 10) * 10;
        parStake = Math.max(10, Math.min(parStake, 150));
        if (totalStake + parStake <= duel.aiBalance * 0.65) {
          parlays.push({
            type: '2串1',
            legs: best2.map(function(b) {
              return { type: b.type, pick: b.pick, odds: b.odds, match: b.match, mid: b.mid };
            }),
            odds: parOdds, stake: parStake, ev: parEV, prob: parProb
          });
        }
      }
    }
  }
  return { singles: kel, parlays: parlays };
}

/**
 * Scan all matches for positive expected value bets
 */
function aiAllPositiveEV(matches) {
  var all = [];
  matches.forEach(function(m) {
    var jc = JC_ODDS[m.id];
    if (!jc || !jc.spf) return;

    var ht = TEAMS.find(function(t) { return t.id === m.home; });
    var at = TEAMS.find(function(t) { return t.id === m.away; });
    if (!ht || !at) return;

    var pred = predict.predictMatch(ht, at);
    var probs = [pred.homeWinProb, pred.drawProb, pred.awayWinProb];
    var labels = ['胜', '平', '负'];
    var teams = [ht.cn, '平局', at.cn];

    for (var i = 0; i < 3; i++) {
      var oddsVal = jc.spf[i];
      if (!oddsVal || oddsVal <= 1) continue;
      var prob = probs[i];
      var ev = prob * (oddsVal * JC_RETURN_RATE - 1) * 100;
      if (ev > 0) {
        all.push({
          match: m.id, mid: m.id,
          type: 'SPF', pick: labels[i],
          team: teams[i], odds: oddsVal,
          prob: prob, ev: ev,
          home: ht.cn, away: at.cn,
          homeFlag: ht.flag, awayFlag: at.flag
        });
      }
    }
  });
  return all;
}

/**
 * Human player places a bet
 */
function placeHumanBet(matchId, pick, odds, stake, pickLabel) {
  const duel = getDuelState();
  if (duel.humanBalance < stake) {
    return { success: false, error: '余额不足，当前余额 ¥' + duel.humanBalance };
  }
  const todayStr = getTodayDateStr();

  duel.humanBalance -= stake;
  if (!duel.strategies[todayStr]) duel.strategies[todayStr] = [];

  duel.strategies[todayStr].push({
    player: 'human',
    id: Date.now(),
    match: matchId,
    pick: pick,
    pickLabel: pickLabel || pick,
    odds: odds,
    stake: stake,
    lockedAt: new Date().toISOString(),
    settled: false
  });

  saveDuelState(duel);
  return { success: true, balance: duel.humanBalance };
}

/**
 * AI locks in strategies for a date
 */
function lockAIStrategies(dateStr, matches) {
  const duel = getDuelState();
  if (duel.strategies[dateStr] && duel.strategies[dateStr].some(function(s) { return s.player === 'ai'; })) {
    return; // Already locked
  }

  const picks = aiBestPick(matches);
  if (!duel.strategies[dateStr]) duel.strategies[dateStr] = [];

  // Add singles
  (picks.singles || []).forEach(function(s) {
    duel.aiBalance -= s.stake;
    duel.strategies[dateStr].push({
      player: 'ai',
      id: Date.now() + Math.random() * 1000,
      match: s.match,
      pick: s.pick,
      pickLabel: s.pick,
      odds: s.odds,
      stake: s.stake,
      ev: s.ev,
      prob: s.prob,
      lockedAt: new Date().toISOString(),
      settled: false
    });
  });

  // Add parlays
  (picks.parlays || []).forEach(function(p) {
    duel.aiBalance -= p.stake;
    duel.strategies[dateStr].push({
      player: 'ai',
      id: Date.now() + Math.random() * 2000,
      match: 'PARLAY',
      pick: '2串1',
      pickLabel: p.legs.map(function(l) { return l.match + ' ' + l.pick; }).join(' + '),
      odds: p.odds,
      stake: p.stake,
      ev: p.ev,
      prob: p.prob,
      legs: p.legs,
      lockedAt: new Date().toISOString(),
      settled: false
    });
  });

  saveDuelState(duel);
}

/**
 * Settle strategies for a given date
 */
function settleDate(dateStr) {
  const duel = getDuelState();
  if (duel.settled[dateStr]) return duel.settled[dateStr];

  const strats = duel.strategies[dateStr] || [];
  if (strats.length === 0) return null;

  const app = getApp();
  const actual = app ? app.globalData.actualResults : {};

  var aiProfit = 0, aiHits = 0, aiTotal = 0;
  var humanProfit = 0, humanHits = 0, humanTotal = 0;
  var allDone = true;

  strats.forEach(function(s) {
    if (s.settled) {
      if (s.player === 'ai') { aiProfit += (s.payout || 0) - s.stake; if (s.won) aiHits++; aiTotal++; }
      else { humanProfit += (s.payout || 0) - s.stake; if (s.won) humanHits++; humanTotal++; }
      return;
    }

    // Check if match result is available
    if (s.match === 'PARLAY') {
      // Settle parlay
      var allLegsDone = true;
      var parlayWon = true;
      (s.legs || []).forEach(function(leg) {
        var result = actual[leg.match];
        if (!result) { allLegsDone = false; parlayWon = false; return; }
        var legWon = checkPickResult(leg.pick, result);
        if (!legWon) parlayWon = false;
      });

      if (!allLegsDone) { allDone = false; return; }
      s.settled = true;
      s.won = parlayWon;
      s.payout = parlayWon ? s.stake * s.odds * JC_RETURN_RATE : 0;
    } else {
      var result = actual[s.match];
      if (!result) { allDone = false; return; }
      s.settled = true;
      s.won = checkPickResult(s.pick, result);
      s.payout = s.won ? s.stake * s.odds * JC_RETURN_RATE : 0;
    }

    var profit = (s.payout || 0) - s.stake;
    if (s.player === 'ai') { aiProfit += profit; if (s.won) aiHits++; aiTotal++; }
    else { humanProfit += profit; if (s.won) humanHits++; humanTotal++; }
  });

  if (!allDone) return null;

  // Apply profits
  duel.aiBalance += aiProfit;
  duel.humanBalance += humanProfit;

  duel.settled[dateStr] = {
    aiProfit: aiProfit, aiHits: aiHits, aiTotal: aiTotal,
    humanProfit: humanProfit, humanHits: humanHits, humanTotal: humanTotal
  };

  saveDuelState(duel);
  return duel.settled[dateStr];
}

function checkPickResult(pick, result) {
  if (pick === '胜') return result.homeScore > result.awayScore;
  if (pick === '平') return result.homeScore === result.awayScore;
  if (pick === '负') return result.homeScore < result.awayScore;
  return false;
}

function getTodayDateStr() {
  var now = new Date();
  var y = now.getFullYear();
  var m = String(now.getMonth() + 1).padStart(2, '0');
  var d = String(now.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function saveDuelState(duel) {
  const app = getApp();
  if (app && app.globalData) {
    app.globalData.duelState = duel;
    try {
      var duelKey = app.globalData.currentUser ? 'duel_state_' + app.globalData.currentUser : 'duel_state';
      wx.setStorageSync(duelKey, JSON.stringify(duel));
    } catch (e) {}
  }
}

module.exports = {
  aiBestPick,
  aiAllPositiveEV,
  placeHumanBet,
  lockAIStrategies,
  settleDate,
  getDuelState,
  createInitialState,
  getTodayDateStr
};
