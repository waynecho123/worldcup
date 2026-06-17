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
    jcOdds: data.JC_ODDS,
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

  fetchLiveScores() {
    var that = this;
    wx.request({
      url: 'https://worldcup26.ir/get/games',
      timeout: 10000,
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.games) {
          var results = {};
          res.data.games.forEach(function(g) {
            if (g.finished !== 'TRUE') return;
            var matchId = that.apiMatchIdToOur(g.id);
            if (!matchId) return;
            results[matchId] = {
              homeScore: parseInt(g.home_score) || 0,
              awayScore: parseInt(g.away_score) || 0,
              updatedAt: new Date().toISOString()
            };
          });
          if (Object.keys(results).length > 0) {
            that.globalData.actualResults = results;
            wx.setStorageSync('actual', JSON.stringify(results));
          }
        }
      },
      fail: function() {}
    });
  },

  apiMatchIdToOur(apiId) {
    var map = {
      1:'m001',2:'m002',3:'m003',4:'m004',5:'m005',6:'m006',7:'m007',8:'m008',
      9:'m009',10:'m010',11:'m011',12:'m012',13:'m013',14:'m014',15:'m015',16:'m016',
      17:'m017',18:'m018',19:'m019',20:'m020',21:'m021',22:'m022',23:'m023',24:'m024',
      25:'m025',26:'m026',27:'m027',28:'m028',29:'m029',30:'m030',31:'m031',32:'m032',
      33:'m033',34:'m034',35:'m035',36:'m036',37:'m037',38:'m038',39:'m039',40:'m040',
      41:'m041',42:'m042',43:'m043',44:'m044',45:'m045',46:'m046',47:'m047',48:'m048',
      49:'m049',50:'m050',51:'m051',52:'m052',53:'m053',54:'m054',55:'m055',56:'m056',
      57:'m057',58:'m058',59:'m059',60:'m060',61:'m061',62:'m062',63:'m063',64:'m064'
    };
    return map[Number(apiId)] || null;
  },

  loadResults() {
    var that = this;

    // 1. Cloud DB（云函数自动更新，最可靠）
    wx.cloud.database().collection('match_results').doc('latest').get().then(res => {
      if (res.data && res.data.results && Object.keys(res.data.results).length > 0) {
        that.globalData.actualResults = res.data.results;
        wx.setStorageSync('actual', JSON.stringify(res.data.results));
        console.log('Loaded ' + Object.keys(res.data.results).length + ' scores from cloud DB');
        // Refresh UI if pages are already loaded
        var pages = getCurrentPages();
        if (pages.length > 0 && pages[0].refresh) pages[0].refresh();
      }
    }).catch(e => {
      console.log('Cloud DB failed:', e);
      // Fallback to local storage
      that.loadFromLocal();
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

    // Last resort: demo seed (m001-m019)
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
      m019: {homeScore:3,awayScore:0}
    };
  },

  saveDuelState() {
    try {
      var duelKey = this.globalData.currentUser ? 'duel_state_'+this.globalData.currentUser : 'duel_state';
      wx.setStorageSync(duelKey, JSON.stringify(this.globalData.duelState));
      wx.setStorageSync('duel_user', this.globalData.currentUser);
    } catch(e) {}
  }
});
