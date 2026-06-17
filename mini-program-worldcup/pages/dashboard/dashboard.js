const app = getApp();
const simulate = require('../../utils/simulate');
const data = require('../../utils/data');

Page({
  data: {
    running: false,
    progress: 0,
    runs: 1000,
    result: null,
    top5: []
  },

  onShow() {
    if (app.globalData.lastResult) {
      this.showResult(app.globalData.lastResult);
    }
  },

  onRunsChange(e) {
    this.setData({ runs: parseInt(e.detail.value) || 1000 });
  },

  startSim() {
    this.setData({ running: true, progress: 0 });
    const that = this;
    const runs = this.data.runs;

    setTimeout(() => {
      const result = simulate.runMonteCarlo(runs, (pct) => {
        that.setData({ progress: pct });
      });
      app.globalData.lastResult = result;
      that.showResult(result);
      that.setData({ running: false });
    }, 100);
  },

  showResult(result) {
    const top5 = result.champProb.slice(0, 5).map(x => {
      const t = data.TEAMS.find(tt => tt.id === x.id);
      return {
        flag: t ? t.flag : '?',
        name: t ? t.cn : x.id,
        prob: (x.prob * 100).toFixed(1)
      };
    });

    this.setData({
      result,
      top5,
      runsDone: result.runs
    });
  },

  openHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  }
});
