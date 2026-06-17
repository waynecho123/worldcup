const app = getApp();
const data = require('../../utils/data');

Page({
  data: { items: [] },

  onShow() {
    const items = (app.globalData.simHistory || []).slice().reverse().map(x => {
      const top3 = (x.champProb || []).slice(0, 3).map(y => {
        const t = data.TEAMS.find(tt => tt.id === y.id);
        return (t ? t.flag + t.cn : y.id) + ' ' + (y.prob * 100).toFixed(1) + '%';
      }).join(' · ');
      return {
        runs: (x.runs || 0).toLocaleString(),
        time: new Date(x.ts).toLocaleString('zh-CN'),
        top3
      };
    });
    this.setData({ items });
  }
});
