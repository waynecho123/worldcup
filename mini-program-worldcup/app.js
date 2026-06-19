// CHO的世界杯小站 - 微信小程序
const data = require('./utils/data');

wx.cloud.init({ env: 'cloud1-d1ggmx6ur18b296fc' });

App({
  globalData: {
    teams: data.TEAMS,
    schedule: data.MATCH_SCHEDULE,
    tactical: data.TACTICAL,
    lineups: data.STARTING_XI,
    matchOdds: data.MATCH_ODDS,
    predictions: {},
    actualResults: {},
    duelState: null,
    currentUser: '',
    predLog: {},
    reflections: [],
    simHistory: [],
    lastResult: null,
    newsItems: data.DEFAULT_NEWS,
    initialized: false
  },

  onLaunch() {
    // Load from local cache immediately (fast), cloud DB will update later
    this.loadFromLocal();
    // Then try cloud DB for latest (async, will refresh UI when done)
    this.loadResults();
    // Load news from cloud DB
    this.loadNews();

    try {

      this.globalData.currentUser = wx.getStorageSync('duel_user') || '';
      var duelKey = this.globalData.currentUser ? 'duel_state_'+this.globalData.currentUser : 'duel_state';
      try {
        var ds = JSON.parse(wx.getStorageSync(duelKey) || 'null');
        this.globalData.duelState = ds || {aiBalance:1000,humanBalance:1000,strategies:{},settled:{}};
      } catch(e) {
        this.globalData.duelState = {aiBalance:1000,humanBalance:1000,strategies:{},settled:{}};
      }

      var newsRaw = wx.getStorageSync('news_cache');
      if (newsRaw) {
        try {
          var nc = JSON.parse(newsRaw);
          if (nc && nc.items && nc.items.length > 0) this.globalData.newsItems = nc.items;
        } catch(e) {}
      }
    } catch(e) {
      console.error('onLaunch error:', e);
    }
    this.globalData.initialized = true;
  },

  loadResults() {
    var that = this;

    // GitHub Pages scores.json (GitHub Action 每30分钟更新)
    wx.request({
      url: 'https://waynecho123.github.io/worldcup/scores.json',
      success: function(res) {
        if (res.data && Object.keys(res.data).length > 0) {
          that.globalData.actualResults = res.data;
          wx.setStorageSync('actual', JSON.stringify(res.data));
          console.log('Loaded ' + Object.keys(res.data).length + ' scores from GitHub');
          var pages = getCurrentPages();
          if (pages.length > 0 && pages[0].refresh) pages[0].refresh();
        }
      },
      fail: function(e) {
        console.log('GitHub scores fetch failed:', e);
        that.loadFromLocal();
      }
    });
  },

  loadFromLocal() {
    try {
      var raw = wx.getStorageSync('actual');
      if (raw) {
        var data = JSON.parse(raw);
        if (Object.keys(data).length > 0) {
          this.globalData.actualResults = data;
          return;
        }
      }
    } catch(e) {}

    // Last resort: demo seed (m001-m020)
    this.globalData.actualResults = {
      m001: {homeScore:2,awayScore:0}, m002: {homeScore:2,awayScore:1},
      m003: {homeScore:1,awayScore:1}, m004: {homeScore:4,awayScore:1},
      m005: {homeScore:1,awayScore:1}, m006: {homeScore:1,awayScore:1},
      m007: {homeScore:0,awayScore:1}, m008: {homeScore:2,awayScore:0},
      m009: {homeScore:7,awayScore:1}, m010: {homeScore:2,awayScore:2},
      m011: {homeScore:1,awayScore:0}, m012: {homeScore:5,awayScore:1},
      m013: {homeScore:0,awayScore:0}, m014: {homeScore:1,awayScore:1},
      m015: {homeScore:1,awayScore:1}, m016: {homeScore:2,awayScore:2},
      m017: {homeScore:3,awayScore:1}, m018: {homeScore:1,awayScore:4},
      m019: {homeScore:3,awayScore:0}, m020: {homeScore:3,awayScore:1},
      m021: {homeScore:1,awayScore:1}, m022: {homeScore:4,awayScore:2},
      m023: {homeScore:1,awayScore:0}, m024: {homeScore:1,awayScore:3}
    };
  },

  loadNews() {
    var that = this;
    wx.request({
      url: 'https://waynecho123.github.io/worldcup/news.json',
      timeout: 10000,
      success: function(res) {
        if (res.data && res.data.items && res.data.items.length > 0) {
          that.globalData.newsItems = res.data.items;
          wx.setStorageSync('news_cache', JSON.stringify({ items: res.data.items }));
          console.log('Loaded ' + res.data.items.length + ' news from GitHub');
        }
        // Apply team-specific news to TEAMS data
        if (res.data && res.data.teamNews) {
          var data = require('./utils/data');
          var updated = 0;
          Object.keys(res.data.teamNews).forEach(function(tid) {
            var team = data.TEAMS.find(function(t) { return t.id === tid; });
            if (!team) return;
            var items = res.data.teamNews[tid];
            if (items.length > 0) {
              var realItem = items.find(function(n){ return n.indexOf('上轮') < 0; });
              var news = (realItem || items[0]).replace(/^[🔴📰]\s*/, '').slice(0, 80);
              if (team.news !== news) { team.news = news; updated++; }
            }
          });
          if (updated > 0) console.log('Team news updated for ' + updated + ' teams');
        }
      },
      fail: function(e) {
        console.log('News fetch failed, using cache');
        var cached = wx.getStorageSync('news_cache');
        if (cached) {
          try {
            var data = JSON.parse(cached);
            that.globalData.newsItems = data.items || [];
          } catch(ex) {}
        }
      }
    });
  },

  saveDuelState() {
    try {
      var duelKey = this.globalData.currentUser ? 'duel_state_'+this.globalData.currentUser : 'duel_state';
      wx.setStorageSync(duelKey, JSON.stringify(this.globalData.duelState));
      wx.setStorageSync('duel_user', this.globalData.currentUser);
    } catch(e) {}
  }
});
