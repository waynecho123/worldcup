const app = getApp();
const review = require('../../utils/review');
const data = require('../../utils/data');
const predict = require('../../utils/predict');
const time = require('../../utils/time');

Page({
  data: {
    total: 0,
    correct: 0,
    exact: 0,
    comparisons: [],
    bias: null
  },

  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },

  refresh() {
    const actual = app.globalData.actualResults || {};
    // Fallback: seed demo if empty
    if (Object.keys(actual).length === 0) {
      const demo = {
        m001: {homeScore:2,awayScore:0}, m002: {homeScore:2,awayScore:1},
        m003: {homeScore:1,awayScore:1}, m004: {homeScore:4,awayScore:1},
        m005: {homeScore:1,awayScore:1}, m006: {homeScore:1,awayScore:1},
        m007: {homeScore:0,awayScore:1}, m008: {homeScore:2,awayScore:0},
        m009: {homeScore:7,awayScore:1}, m010: {homeScore:2,awayScore:2},
        m011: {homeScore:1,awayScore:0}, m012: {homeScore:5,awayScore:1},
        m013: {homeScore:0,awayScore:0}, m014: {homeScore:1,awayScore:1},
        m015: {homeScore:1,awayScore:1}, m016: {homeScore:2,awayScore:2},
        m017: {homeScore:3,awayScore:1}, m018: {homeScore:1,awayScore:4},
        m019: {homeScore:3,awayScore:0}
      };
      app.globalData.actualResults = demo;
      this.refresh();
      return;
    }
    const comps = [];
    let correct = 0, exact = 0;

    const today = time.getTournamentDateStr();
    Object.keys(actual).forEach(matchId => {
      const m = data.MATCH_SCHEDULE.find(x => x.id === matchId);
      if (!m) return; // skip phantom matches not in our schedule
      if (m.date > today) return; // skip future matches (API may return bad data)
      const ht = data.TEAMS.find(t => t.id === m.home);
      const at = data.TEAMS.find(t => t.id === m.away);
      if (!ht || !at) return;
      const pred = predict.predictMatch(ht, at);
      const act = actual[matchId];
      const outcomeOk = (pred.predScore[0] > pred.predScore[1] && act.homeScore > act.awayScore) ||
                        (pred.predScore[0] === pred.predScore[1] && act.homeScore === act.awayScore) ||
                        (pred.predScore[0] < pred.predScore[1] && act.homeScore < act.awayScore);
      const exactOk = predict.isExactMatch(pred, act);
      if (outcomeOk) correct++;
      if (exactOk) exact++;

      var hStr = predict.getStrength(ht), aStr = predict.getStrength(at);
      var strGap = Math.abs(hStr - aStr);
      var upsetHappened = strGap > 15 && ((hStr > aStr && act.homeScore <= act.awayScore) || (hStr < aStr && act.homeScore >= act.awayScore));
      comps.push({
        id: matchId,
        date: m.date,
        time: m.time,
        group: m.grp,
        homeFlag: ht.flag, homeName: ht.cn,
        awayFlag: at.flag, awayName: at.cn,
        predScore: pred.topScores.map(function(s) { return s.home + ':' + s.away; }).join(' · '),
        predScores: pred.topScores,
        actScore: [act.homeScore, act.awayScore],
        ok: outcomeOk,
        exact: exactOk,
        predHomeProb: pred.homeWinProb,
        predDrawProb: pred.drawProb,
        predAwayProb: pred.awayWinProb,
        strGap: strGap,
        upsetAlert: pred.upsetAlert,
        upsetProb: pred.upsetProb,
        upsetTeam: pred.upsetTeam,
        upsetHappened: upsetHappened,
        upsetColor: (pred.upsetAlert && upsetHappened) || (!pred.upsetAlert && !upsetHappened) ? '#16a34a' : '#dc2626',
        upsetLabel: pred.upsetAlert ? ('预警' + (pred.upsetProb*100).toFixed(0) + '% → ') : '未预警 → ' + (upsetHappened ? '爆冷' : '正常')
      });
    });

    // Upset accuracy
    var upsetComps = comps.filter(function(c) { return c.strGap > 15 && c.date >= '2026-06-20'; });
    var upsetTotal = upsetComps.length;
    var upsetCorrect = upsetComps.filter(function(c) {
      return (c.upsetAlert && c.upsetHappened) || (!c.upsetAlert && !c.upsetHappened);
    }).length;
    var upsetFalsePos = upsetComps.filter(function(c) { return c.upsetAlert && !c.upsetHappened; }).length;
    var upsetFalseNeg = upsetComps.filter(function(c) { return !c.upsetAlert && c.upsetHappened; }).length;

    const bias = comps.length >= 3 ? review.analyzeBias(comps) : null;

    this.setData({
      total: comps.length,
      correct,
      exact,
      hasResults: comps.length > 0,
      winRate: comps.length > 0 ? (correct / comps.length * 100).toFixed(0) : '0',
      exactRate: comps.length > 0 ? (exact / comps.length * 100).toFixed(0) : '0',
      comparisons: comps.reverse(),
      bias,
      upsetTotal, upsetCorrect, upsetFalsePos, upsetFalseNeg,
      upsetRate: upsetTotal > 0 ? (upsetCorrect / upsetTotal * 100).toFixed(0) : '0'
    });
  }
});
