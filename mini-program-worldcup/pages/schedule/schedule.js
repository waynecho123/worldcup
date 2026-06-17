const app = getApp();
const data = require('../../utils/data');
const predict = require('../../utils/predict');

Page({
  data: {
    filter: 'all',
    filterLabel: '全部阶段',
    groupedSchedule: [],
    showLegend: true
  },

  onLoad() {
    this.render();
  },

  onShow() {
    this.render();
  },

  onFilterChange(e) {
    const f = e.currentTarget.dataset.filter;
    const labels = {all:'全部阶段',group:'小组赛',r32:'1/16决赛',r16:'1/8决赛',qf:'1/4决赛',sf:'半决赛',f:'决赛/季军赛'};
    this.setData({ filter: f, filterLabel: labels[f] || f });
    this.render();
  },

  render() {
    const f = this.data.filter;
    let ms = [...data.MATCH_SCHEDULE];
    if (f !== 'all') {
      if (f === 'f') ms = ms.filter(m => m.stage === 'final' || m.stage === 'tpp');
      else ms = ms.filter(m => m.stage === f);
    }

    // Group by date
    const byDate = {};
    ms.forEach(m => {
      if (!byDate[m.date]) byDate[m.date] = [];
      byDate[m.date].push(m);
    });

    const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];
    const stageLabels = {group:'小组赛',r32:'1/16决赛',r16:'1/8决赛',qf:'1/4决赛',sf:'半决赛',tpp:'季军赛',final:'🏆决赛'};
    const predLog = app.globalData.predLog || {};

    const grouped = Object.entries(byDate).sort((a,b) => a[0].localeCompare(b[0])).map(([date, matches]) => {
      const dObj = new Date(date + 'T00:00:00');
      const stages = [...new Set(matches.map(m => stageLabels[m.stage] || m.stage))].join(' / ');

      const matchItems = matches.map(m => {
        const ht = data.TEAMS.find(t => t.id === m.home);
        const at = data.TEAMS.find(t => t.id === m.away);
        const pred = (ht && at) ? predict.predictMatch(ht, at) : null;
        const result = app.globalData.actualResults[m.id];
        const logEntry = predLog[m.id];

        let scoreHtml = { type: 'normal', predText: '-:-', actualText: '', pending: true };
        if (pred) {
          scoreHtml.predText = pred.topScores.map(function(s) { return s.home + ':' + s.away; }).join(' · ');
        }
        if (result) {
          scoreHtml.actualText = result.homeScore + ':' + result.awayScore;
          scoreHtml.pending = false;
        }

        let updateInfo = '';
        if (logEntry && logEntry.lastUpdate) {
          const lu = new Date(logEntry.lastUpdate);
          const now = new Date();
          const diffMin = Math.floor((now - lu) / 60000);
          const ago = diffMin < 3 ? '刚刚' : diffMin < 60 ? diffMin+'分钟前' : Math.floor(diffMin/60)+'小时前';
          updateInfo = '🕐 ' + ago;
          if (logEntry.reason && logEntry.reason !== '定期更新') updateInfo += ' · ' + logEntry.reason;
        }

        return {
          id: m.id,
          time: m.time,
          homeFlag: ht ? ht.flag : '❓',
          homeName: ht ? ht.cn : m.home,
          awayName: at ? at.cn : m.away,
          awayFlag: at ? at.flag : '❓',
          badge: m.grp ? m.grp + '组' : (stageLabels[m.stage] || m.stage),
          score: scoreHtml,
          updateInfo
        };
      });

      return { date, dayName: dayNames[dObj.getDay()], stages, matches: matchItems };
    });

    this.setData({ groupedSchedule: grouped });
  },

  onMatchTap(e) {
    wx.navigateTo({ url: '/pages/match-detail/match-detail?id=' + e.currentTarget.dataset.id });
  }
});
