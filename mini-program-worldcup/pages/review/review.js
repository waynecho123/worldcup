const app = getApp();
const review = require('../../utils/review');
const data = require('../../utils/data');
const predict = require('../../utils/predict');

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
        m015: {homeScore:1,awayScore:1}, m016: {homeScore:2,awayScore:2}
      };
      app.globalData.actualResults = demo;
      this.refresh();
      return;
    }
    const comps = [];
    let correct = 0, exact = 0;

    Object.keys(actual).forEach(matchId => {
      const m = data.MATCH_SCHEDULE.find(x => x.id === matchId);
      if (!m) return;
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

      comps.push({
        id: matchId,
        date: m.date,
        time: m.time,
        group: m.grp,
        homeFlag: ht.flag, homeName: ht.cn,
        awayFlag: at.flag, awayName: at.cn,
        predScore: pred.predScore[0] + ':' + pred.predScore[1],
        actScore: [act.homeScore, act.awayScore],
        ok: outcomeOk,
        exact: exactOk,
        predHomeProb: pred.homeWinProb,
        predDrawProb: pred.drawProb,
        predAwayProb: pred.awayWinProb
      });
    });

    const bias = comps.length >= 3 ? review.analyzeBias(comps) : null;

    this.setData({
      total: comps.length,
      correct,
      exact,
      hasResults: comps.length > 0,
      winRate: comps.length > 0 ? (correct / comps.length * 100).toFixed(0) : '0',
      exactRate: comps.length > 0 ? (exact / comps.length * 100).toFixed(0) : '0',
      comparisons: comps.reverse(),
      bias
    });
  }
});
