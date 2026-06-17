// Reusable Match Card Component
const app = getApp();
const predict = require('../../utils/predict');
const data = require('../../utils/data');
const odds = require('../../utils/odds');

Component({
  properties: {
    matchId: { type: String, value: '' },
    showOdds: { type: Boolean, value: false },
    showPrediction: { type: Boolean, value: true },
    compact: { type: Boolean, value: false },
    featured: { type: Boolean, value: false }
  },

  data: {
    matchInfo: null,
    loading: true
  },

  lifetimes: {
    attached() {
      if (this.properties.matchId) {
        this.buildMatch(this.properties.matchId);
      }
    }
  },

  observers: {
    'matchId'(newId) {
      if (newId) {
        this.buildMatch(newId);
      }
    }
  },

  methods: {
    buildMatch(matchId) {
      const m = data.MATCH_SCHEDULE.find(x => x.id === matchId);
      if (!m) {
        this.setData({ loading: false });
        return;
      }

      const ht = data.TEAMS.find(t => t.id === m.home);
      const at = data.TEAMS.find(t => t.id === m.away);
      if (!ht || !at) {
        this.setData({ loading: false });
        return;
      }

      const pred = predict.predictMatch(ht, at);
      const mol = data.MATCH_ODDS[matchId];
      const jc = data.JC_ODDS[matchId];
      const actual = app.globalData.actualResults[matchId];

      // Actual result display
      let actualDisplay = null;
      if (actual) {
        const outcomeOk = (pred.predScore[0] > pred.predScore[1] && actual.homeScore > actual.awayScore) ||
                          (pred.predScore[0] === pred.predScore[1] && actual.homeScore === actual.awayScore) ||
                          (pred.predScore[0] < pred.predScore[1] && actual.homeScore < actual.awayScore);
        const exactOk = pred.predScore[0] === actual.homeScore && pred.predScore[1] === actual.awayScore;
        actualDisplay = {
          home: actual.homeScore,
          away: actual.awayScore,
          icon: exactOk ? '🎯' : outcomeOk ? '✅' : '❌',
          correct: outcomeOk
        };
      }

      // Stage label
      const stageLabels = {
        group: '小组赛', r32: '1/16决赛', r16: '1/8决赛',
        qf: '1/4决赛', sf: '半决赛', tpp: '季军赛', final: '🏆决赛'
      };

      this.setData({
        matchInfo: {
          id: m.id,
          date: m.date,
          time: m.time,
          venue: m.venue || '',
          group: m.grp || '',
          stage: m.stage,
          stageLabel: stageLabels[m.stage] || m.stage,
          matchday: m.matchday || 0,
          homeFlag: ht.flag,
          homeName: ht.cn,
          homeShort: ht.name,
          homeRank: ht.rk,
          homeStrength: predict.getStrength(ht).toFixed(0),
          awayFlag: at.flag,
          awayName: at.cn,
          awayShort: at.name,
          awayRank: at.rk,
          awayStrength: predict.getStrength(at).toFixed(0),
          predScore: pred.predScore[0] + ':' + pred.predScore[1],
          homeProb: (pred.homeWinProb * 100).toFixed(0),
          drawProb: (pred.drawProb * 100).toFixed(0),
          awayProb: (pred.awayWinProb * 100).toFixed(0),
          oddsH: mol ? mol.h.toFixed(2) : '',
          oddsD: mol ? mol.d.toFixed(2) : '',
          oddsA: mol ? mol.a.toFixed(2) : '',
          jcSPF: jc ? jc.spf.map(x => x.toFixed(2)) : null,
          actual: actualDisplay,
          hasNews: !!(ht.inj || at.inj),
          newsText: (ht.inj ? ht.cn + ': ' + ht.inj.replace(/[🔴⚠️]/g, '').trim() + ' ' : '') +
                    (at.inj ? at.cn + ': ' + at.inj.replace(/[🔴⚠️]/g, '').trim() : '')
        },
        loading: false
      });
    },

    onTap() {
      if (this.data.matchInfo) {
        this.triggerEvent('tapmatch', { id: this.data.matchInfo.id });
        wx.navigateTo({
          url: '/pages/match-detail/match-detail?id=' + this.data.matchInfo.id
        });
      }
    }
  }
});
