const app = getApp();
const predict = require('../../utils/predict');
const data = require('../../utils/data');
const odds = require('../../utils/odds');

Page({
  data: {
    dates: [],
    activeDate: '',
    activeIdx: 0,
    dateLabel: '',
    matchCount: 0,
    matchday: 0,
    matches: [],
    correctLabel: '',
    loading: true
  },

  onLoad() {
    try {
      this.buildDateList();
    } catch(e) {
      this.setData({ testInfo: 'buildDateList ERROR: ' + e.message });
    }
  },

  onPullDownRefresh() {
    this.loadDate(this.data.activeDate);
    wx.stopPullDownRefresh();
  },

  onShow() {
    if (!this.data.activeDate) this.buildDateList();
    else this.loadDate(this.data.activeDate);
  },

  refresh() {
    if (this.data.activeDate) this.loadDate(this.data.activeDate);
    else this.buildDateList();
  },

  /** Build list of all tournament dates with group matches */
  buildDateList() {
    const allDates = new Set();
    data.MATCH_SCHEDULE.forEach(m => {
      allDates.add(m.date);
    });
    const sorted = [...allDates].sort();
    const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];

    const dates = sorted.map(d => {
      const dObj = new Date(d + 'T00:00:00');
      return { date: d, label: d.slice(5) + ' ' + dayNames[dObj.getDay()] };
    });

    // Find default: first date with >=1 unplayed match (next upcoming, any stage)
    const actual = app.globalData.actualResults || {};
    let defaultIdx = dates.findIndex(d => {
      const dayMatches = data.MATCH_SCHEDULE.filter(m => m.date === d.date);
      return dayMatches.some(m => !actual[m.id]);
    });
    if (defaultIdx < 0) defaultIdx = 0;

    this.setData({ dates, activeIdx: defaultIdx, activeDate: dates[defaultIdx].date });
    this.loadDate(dates[defaultIdx].date);
  },

  onDateTap(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    const date = this.data.dates[idx].date;
    this.setData({ activeIdx: idx, activeDate: date });
    this.loadDate(date);
  },

  onPrevDay() {
    if (this.data.activeIdx <= 0) return;
    const idx = this.data.activeIdx - 1;
    const date = this.data.dates[idx].date;
    this.setData({ activeIdx: idx, activeDate: date });
    this.loadDate(date);
  },

  onNextDay() {
    if (this.data.activeIdx >= this.data.dates.length - 1) return;
    const idx = this.data.activeIdx + 1;
    const date = this.data.dates[idx].date;
    this.setData({ activeIdx: idx, activeDate: date });
    this.loadDate(date);
  },

  loadDate(dateStr) {
    const matches = data.MATCH_SCHEDULE.filter(
      m => m.date === dateStr
    );

    if (matches.length === 0) {
      this.setData({ loading: false, matchCount: 0, matches: [] });
      return;
    }

    const stageLabels = {group:'小组赛',r32:'1/16决赛',r16:'1/8决赛',qf:'1/4决赛',sf:'半决赛',tpp:'季军赛',final:'🏆决赛'};

    const matchData = matches.map(m => {
      const ht = data.TEAMS.find(t => t.id === m.home);
      const at = data.TEAMS.find(t => t.id === m.away);

      // For KO matches with TBD teams, show placeholders
      if (!ht || !at) {
        return {
          id: m.id, time: m.time, group: m.grp, stage: m.stage,
          stageLabel: stageLabels[m.stage] || m.stage,
          featured: m.featured || false,
          homeFlag: ht ? ht.flag : '❓',
          homeName: ht ? ht.cn : (m.home === '?' ? '待定' : m.home),
          awayFlag: at ? at.flag : '❓',
          awayName: at ? at.cn : (m.away === '?' ? '待定' : m.away),
          predScore: '?:?',
          winByNText: '待定',
          homeProb: '', drawProb: '', awayProb: '',
          isTBD: true
        };
      }

      const mol = data.MATCH_ODDS[m.id];
      const pred = predict.predictMatch(ht, at, mol);
      const actual = app.globalData.actualResults[m.id];
      let actualDisplay = null;
      if (actual) {
        const correctOutcome =
          (pred.predScore[0] > pred.predScore[1] && actual.homeScore > actual.awayScore) ||
          (pred.predScore[0] === pred.predScore[1] && actual.homeScore === actual.awayScore) ||
          (pred.predScore[0] < pred.predScore[1] && actual.homeScore < actual.awayScore);
        const correctExact = predict.isExactMatch(pred, actual);
        actualDisplay = {
          homeScore: actual.homeScore, awayScore: actual.awayScore,
          icon: correctExact ? '🎯' : correctOutcome ? '✅' : '❌',
          color: correctOutcome ? '#00c853' : '#ff3d57'
        };
      }

      return {
        id: m.id, time: m.time, group: m.grp, stage: m.stage,
        stageLabel: stageLabels[m.stage] || m.stage,
        featured: m.featured || false,
        homeFlag: ht.flag, homeName: ht.cn,
        awayFlag: at.flag, awayName: at.cn,
        // Priority 3: AI win/loss prediction in natural language
        winByNText: predict.getWinByNText(ht, at, pred),
        // Priority 4: AI predicted score
        predScore: pred.topScores.map(function(s) { return s.home + ':' + s.away; }).join(' · '),
        predScores: pred.topScores,
        // Priority 5: Team news (1-2 lines per team)
        homeNews: ht.news || '',
        awayNews: at.news || '',
        homeInjShort: (ht.inj || '').replace(/[🔴⚠️]/g, '').trim(),
        awayInjShort: (at.inj || '').replace(/[🔴⚠️]/g, '').trim(),
        // Priority 6: Win probability
        homeProb: (pred.homeWinProb*100).toFixed(0), drawProb: (pred.drawProb*100).toFixed(0), awayProb: (pred.awayWinProb*100).toFixed(0),
        upsetAlert: pred.upsetAlert, upsetProb: (pred.upsetProb*100).toFixed(0), upsetTeam: pred.upsetTeam,
        isLocked: predict.isMatchLocked(m.id),
        actual: actualDisplay,
        isTBD: false
      };
    }).filter(Boolean);

    const withResults = matchData.filter(m => m.actual);
    let correctLabel = '';
    if (withResults.length > 0) {
      const correctCount = withResults.filter(m => m.actual.icon === '✅' || m.actual.icon === '🎯').length;
      correctLabel = '✅ AI正确 '+correctCount+'/'+withResults.length;
    }

    const dObj = new Date(dateStr + 'T00:00:00');
    const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];
    const dateLabel = dateStr + ' ' + dayNames[dObj.getDay()];

    // Determine stage info for header
    const stages = [...new Set(matches.map(m => m.stage))];
    const stageLabel = stages.length === 1
      ? (stageLabels[stages[0]] || stages[0])
      : stages.map(s => stageLabels[s] || s).join('/');
    const md = matches[0] ? matches[0].matchday : 0;

    this.setData({
      dateLabel, matchCount: matches.length,
      matchday: md,
      stageInfo: stageLabel,
      matches: matchData, correctLabel, loading: false,
      testInfo: dateLabel + ' ' + matchData.length + '场'
    });
  },

  onMatchTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/match-detail/match-detail?id=' + id });
  }
});
