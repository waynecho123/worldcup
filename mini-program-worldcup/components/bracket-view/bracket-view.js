// Bracket View - Knockout stage bracket visualization
const app = getApp();
const data = require('../../utils/data');

// Knockout bracket structure for 2026 World Cup (48 teams → 32 in KO)
const BRACKET_STRUCTURE = {
  r32: { label: '1/16决赛', rounds: 1, matches: 16, next: 'r16' },
  r16: { label: '1/8决赛', rounds: 1, matches: 8, next: 'qf' },
  qf:   { label: '1/4决赛', rounds: 1, matches: 4, next: 'sf' },
  sf:   { label: '半决赛', rounds: 1, matches: 2, next: 'final' },
  tpp:  { label: '季军赛', rounds: 1, matches: 1, next: null },
  final:{ label: '🏆决赛', rounds: 1, matches: 1, next: null }
};

Component({
  properties: {
    stage: { type: String, value: 'r32' },  // r32 | r16 | qf | sf | final | all
    matches: { type: Array, value: [] }      // preloaded KO matches
  },

  data: {
    rounds: [],
    activeStage: 'r32',
    stages: ['r32', 'r16', 'qf', 'sf', 'final', 'tpp']
  },

  lifetimes: {
    attached() {
      this.buildBracket();
    }
  },

  observers: {
    'stage'(s) {
      this.setData({ activeStage: s });
      this.buildBracket();
    },
    'matches'() {
      this.buildBracket();
    }
  },

  methods: {
    buildBracket() {
      const stage = this.data.activeStage;
      const koMatches = this.properties.matches.length > 0
        ? this.properties.matches
        : data.MATCH_SCHEDULE.filter(m => m.stage !== 'group');

      const stageMatches = stage === 'all'
        ? koMatches
        : koMatches.filter(m => m.stage === stage);

      // Build bracket slots
      const slots = stageMatches.map(m => {
        const ht = data.TEAMS.find(t => t.id === m.home);
        const at = data.TEAMS.find(t => t.id === m.away);
        const actual = app.globalData.actualResults[m.id];

        // Pre-compute display strings for WXML compatibility
        var dateShort = m.date ? m.date.slice(5) : '';
        var pkText = '';
        if (actual && actual.pkWinner) {
          // Penalty shootout info if available
          var pkName = actual.pkWinner === 'home' ? (ht ? ht.cn.slice(0,2) : '主') : (at ? at.cn.slice(0,2) : '客');
          pkText = '(点球 ' + pkName + '胜)';
        }

        return {
          id: m.id,
          date: m.date,
          dateShort: dateShort,
          time: m.time,
          venue: m.venue || '',
          stage: m.stage,
          stageLabel: BRACKET_STRUCTURE[m.stage] ? BRACKET_STRUCTURE[m.stage].label : m.stage,
          homeFlag: ht ? ht.flag : '❓',
          homeName: ht ? ht.cn : (m.home || '待定'),
          homeCode: m.home || 'TBD',
          awayFlag: at ? at.flag : '❓',
          awayName: at ? at.cn : (m.away || '待定'),
          awayCode: m.away || 'TBD',
          homeScore: actual ? actual.homeScore : null,
          awayScore: actual ? actual.awayScore : null,
          played: !!actual,
          winner: actual
            ? (actual.homeScore > actual.awayScore ? 'home' : actual.homeScore < actual.awayScore ? 'away' : null)
            : null,
          pkText: pkText
        };
      });

      // Group into rounds
      const rounds = [];
      const roundMap = {};

      slots.forEach(s => {
        const key = s.stage;
        if (!roundMap[key]) {
          roundMap[key] = {
            stage: key,
            stageLabel: s.stageLabel,
            matches: []
          };
        }
        roundMap[key].matches.push(s);
      });

      // Sort stages in tournament order
      const stageOrder = ['r32', 'r16', 'qf', 'sf', 'tpp', 'final'];
      stageOrder.forEach(s => {
        if (roundMap[s]) rounds.push(roundMap[s]);
      });

      this.setData({ rounds });
    },

    onMatchTap(e) {
      const matchId = e.currentTarget.dataset.id;
      if (!matchId || matchId === 'TBD') return;
      this.triggerEvent('tapmatch', { id: matchId });
      wx.navigateTo({ url: '/pages/match-detail/match-detail?id=' + matchId });
    },

    onStageChange(e) {
      const stage = e.currentTarget.dataset.stage;
      this.setData({ activeStage: stage });
      this.buildBracket();
    }
  }
});
