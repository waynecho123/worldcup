const app = getApp();
const duel = require('../../utils/duel');
const data = require('../../utils/data');
const predict = require('../../utils/predict');
const { getTournamentDateStr } = require('../../utils/time');

/** Pre-compute display strings for WXML (WXML doesn't support complex JS expressions) */
function formatStrategy(s) {
  return {
    ...s,
    oddsDisplay: typeof s.odds === 'number' ? s.odds.toFixed(2) : String(s.odds || '?'),
    evDisplay: s.ev != null ? (s.ev >= 0 ? '+' : '') + s.ev.toFixed(1) + '%' : '',
    evClass: s.ev != null ? (s.ev >= 3 ? 'text-green' : 'text-muted') : '',
    settleDisplay: s.settled ? (s.won
      ? '✅ +¥' + Math.round((s.payout || 0) - s.stake)
      : '❌ -¥' + s.stake) : '',
    settleClass: s.settled ? (s.won ? 'text-green' : 'text-red') : ''
  };
}

Page({
  data: {
    user: '',
    aiBalance: 1000,
    humanBalance: 1000,
    aiStrategies: [],
    humanStrategies: [],
    allMatches: [],
    history: [],
    loginOpen: false,
    // Betting modal
    showBetModal: false,
    betMatch: null,
    betPick: '',
    betOdds: 0,
    betStake: 50,
    betError: '',
    // Settlement
    todaySettled: null,
    todayDate: ''
  },

  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },

  refresh() {
    const state = app.globalData.duelState || duel.createInitialState();
    const user = app.globalData.currentUser || '';
    const todayStr = getTournamentDateStr();

    // Get strategies for today - pre-compute display strings for WXML
    const todayStrats = state.strategies && state.strategies[todayStr]
      ? state.strategies[todayStr] : [];
    const aiStrats = todayStrats.filter(function(s) { return s.player === 'ai'; }).map(formatStrategy);
    const humanStrats = todayStrats.filter(function(s) { return s.player === 'human'; }).map(formatStrategy);

    // Available matches (today + tomorrow)
    const matches = data.MATCH_SCHEDULE.filter(function(m) {
      return m.stage === 'group' && m.date >= todayStr;
    }).slice(0, 12).map(function(m) {
      const ht = data.TEAMS.find(function(t) { return t.id === m.home; });
      const at = data.TEAMS.find(function(t) { return t.id === m.away; });
      const pred = (ht && at) ? predict.predictMatch(ht, at) : null;
      const jc = data.JC_ODDS[m.id];
      const actual = app.globalData.actualResults[m.id];

      return {
        id: m.id,
        date: m.date,
        time: m.time,
        group: m.grp || '',
        homeFlag: ht ? ht.flag : '?',
        homeName: ht ? ht.cn : m.home,
        awayFlag: at ? at.flag : '?',
        awayName: at ? at.cn : m.away,
        spf: jc ? jc.spf.map(function(x) { return x.toFixed(2); }) : null,
        rq: jc ? jc.rq : null,
        rqO: jc && jc.rqO ? jc.rqO.map(function(x) { return x.toFixed(2); }) : null,
        predScore: pred ? pred.predScore[0] + ':' + pred.predScore[1] : '?:?',
        homeProb: pred ? (pred.homeWinProb * 100).toFixed(0) : '',
        drawProb: pred ? (pred.drawProb * 100).toFixed(0) : '',
        awayProb: pred ? (pred.awayWinProb * 100).toFixed(0) : '',
        played: !!actual
      };
    });

    // History
    const history = state.settled ? Object.entries(state.settled).map(function(entry) {
      return { date: entry[0], result: entry[1] };
    }).sort(function(a, b) { return b.date.localeCompare(a.date); }) : [];

    // Today's settlement
    const todaySettled = state.settled ? state.settled[todayStr] : null;

    this.setData({
      user: user,
      aiBalance: (state.aiBalance || 1000).toFixed(0),
      humanBalance: (state.humanBalance || 1000).toFixed(0),
      aiStrategies: aiStrats,
      humanStrategies: humanStrats,
      allMatches: matches,
      history: history,
      todaySettled: todaySettled,
      todayDate: todayStr
    });
  },

  // ===== Auth =====
  onLogin() {
    const that = this;
    wx.showModal({
      title: '设置用户名',
      editable: true,
      placeholderText: '输入你的昵称',
      success: function(res) {
        if (res.confirm && res.content) {
          const user = res.content.trim();
          if (!user) return;
          app.globalData.currentUser = user;
          app.saveDuelState();
          that.refresh();
          wx.showToast({ title: '欢迎，' + user + '！', icon: 'success' });
        }
      }
    });
  },

  onLogout() {
    const that = this;
    wx.showModal({
      title: '退出登录',
      content: '确定要退出吗？你的竞猜记录会保留',
      success: function(res) {
        if (res.confirm) {
          app.globalData.currentUser = '';
          app.saveDuelState();
          that.refresh();
        }
      }
    });
  },

  // ===== Betting =====
  onMatchBetTap(e) {
    if (!this.data.user) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const matchId = e.currentTarget.dataset.id;
    const match = this.data.allMatches.find(function(m) { return m.id === matchId; });
    if (!match || !match.spf || match.played) return;

    this.setData({
      showBetModal: true,
      betMatch: match,
      betPick: '',
      betOdds: 0,
      betStake: 50,
      betReturn: '35',
      betError: ''
    });
  },

  closeBetModal() {
    this.setData({ showBetModal: false, betMatch: null, betPick: '', betError: '' });
  },

  onPickTap(e) {
    const pick = e.currentTarget.dataset.pick;
    const oddsIdx = pick === '胜' ? 0 : pick === '平' ? 1 : 2;
    const odds = parseFloat(this.data.betMatch.spf[oddsIdx]);
    this.setData({ betPick: pick, betOdds: odds });
    this.updateBetReturn();
  },

  onStakeInput(e) {
    const v = parseInt(e.detail.value) || 10;
    this.setData({ betStake: Math.max(10, Math.min(500, v)) });
    this.updateBetReturn();
  },

  onStakeQuick(e) {
    const v = parseInt(e.currentTarget.dataset.val);
    this.setData({ betStake: v });
    this.updateBetReturn();
  },

  /** Pre-compute expected return for WXML display */
  updateBetReturn() {
    const stake = this.data.betStake || 0;
    const odds = this.data.betOdds || 0;
    const ret = Math.round(stake * odds * 0.71);
    this.setData({ betReturn: String(ret) });
  },

  submitBet() {
    if (!this.data.betPick) {
      this.setData({ betError: '请选择竞猜选项' });
      return;
    }
    if (this.data.betStake < 10) {
      this.setData({ betError: '最低参与 ¥10' });
      return;
    }
    if (this.data.betStake > parseFloat(this.data.humanBalance)) {
      this.setData({ betError: '余额不足' });
      return;
    }

    const that = this;
    wx.showModal({
      title: '确认竞猜',
      content: this.data.betMatch.homeName + ' vs ' + this.data.betMatch.awayName +
        '\n竞猜: ' + this.data.betPick + ' (' + this.data.betOdds.toFixed(2) + ')' +
        '\n金额: ¥' + this.data.betStake,
      success: function(res) {
        if (res.confirm) {
          const result = duel.placeHumanBet(
            that.data.betMatch.id,
            that.data.betPick,
            that.data.betOdds,
            that.data.betStake,
            that.data.betMatch.homeName + ' vs ' + that.data.betMatch.awayName + ' ' + that.data.betPick
          );
          if (result.success) {
            app.saveDuelState();
            that.closeBetModal();
            that.refresh();
            wx.showToast({ title: '竞猜成功！', icon: 'success' });
          } else {
            that.setData({ betError: result.error });
          }
        }
      }
    });
  },

  // ===== AI Lock =====
  onLockAI() {
    const todayStr = getTournamentDateStr();
    const todayMatches = data.MATCH_SCHEDULE.filter(function(m) {
      return m.stage === 'group' && m.date >= todayStr;
    }).slice(0, 8);

    if (todayMatches.length === 0) {
      wx.showToast({ title: '暂无可用比赛', icon: 'none' });
      return;
    }

    duel.lockAIStrategies(todayStr, todayMatches);
    app.saveDuelState();
    this.refresh();
    wx.showToast({ title: 'AI策略已锁定', icon: 'success' });
  },

  // ===== Settlement =====
  onSettle() {
    const todayStr = getTournamentDateStr();
    const result = duel.settleDate(todayStr);
    if (result) {
      app.saveDuelState();
      this.refresh();
      const winner = result.aiProfit > result.humanProfit ? 'AI获胜！🤖' :
                     result.humanProfit > result.aiProfit ? '你赢了！🎉' : '平局 🤝';
      wx.showModal({
        title: '结算完成',
        content: winner +
          '\nAI: ' + (result.aiProfit >= 0 ? '+' : '') + '¥' + result.aiProfit.toFixed(0) +
          ' (' + result.aiHits + '/' + result.aiTotal + ')' +
          '\n你: ' + (result.humanProfit >= 0 ? '+' : '') + '¥' + result.humanProfit.toFixed(0) +
          ' (' + result.humanHits + '/' + result.humanTotal + ')',
        showCancel: false
      });
    } else {
      wx.showToast({ title: '赛果尚未公布，无法结算', icon: 'none' });
    }
  }
});
