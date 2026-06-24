// Group Standings Page
const app = getApp();
const data = require('../../utils/data');
const standings = require('../../utils/standings');

Page({
  data: {
    groups: data.GROUPS,
    activeGroup: 'A',
    standings: null,
    thirdPlace: [],
    totalMatches: 0,
    tabScrollLeft: 0,
    viewMode: 'groups'  // 'groups' or 'bracket'
  },

  onLoad() {
    this.calculate();
  },

  onShow() {
    this.calculate();
  },

  calculate() {
    const allStandings = standings.calculateStandings();
    const groupData = allStandings[this.data.activeGroup] || [];
    const thirdPlace = standings.calculateThirdPlaceRanking(allStandings);

    // Count total played matches
    let totalPlayed = 0;
    data.GROUPS.forEach(function(g) {
      (allStandings[g] || []).forEach(function(t) {
        totalPlayed += t.played;
      });
    });
    totalPlayed = Math.floor(totalPlayed / 2); // Each match counted twice

    // Get group matches with results
    const groupMatches = this.buildGroupMatches(this.data.activeGroup);

    this.setData({
      standings: allStandings,
      groupData: groupData,
      thirdPlace: thirdPlace,
      totalMatches: totalPlayed,
      totalGroupMatches: 72,  // 12 groups × 6 matches each
      groupMatches: groupMatches
    });
  },

  onGroupTap(e) {
    const g = e.currentTarget.dataset.group;
    this.setData({ activeGroup: g });
    const allStandings = this.data.standings;
    const groupMatches = this.buildGroupMatches(g);
    this.setData({
      groupData: allStandings[g] || [],
      groupMatches: groupMatches
    });
  },

  onPrevGroup() {
    const idx = data.GROUPS.indexOf(this.data.activeGroup);
    if (idx > 0) {
      const g = data.GROUPS[idx - 1];
      const groupMatches = this.buildGroupMatches(g);
      this.setData({ activeGroup: g, groupData: this.data.standings[g] || [], groupMatches: groupMatches });
    }
  },

  onNextGroup() {
    const idx = data.GROUPS.indexOf(this.data.activeGroup);
    if (idx < data.GROUPS.length - 1) {
      const g = data.GROUPS[idx + 1];
      const groupMatches = this.buildGroupMatches(g);
      this.setData({ activeGroup: g, groupData: this.data.standings[g] || [], groupMatches: groupMatches });
    }
  },

  /** Build match list for a group */
  buildGroupMatches(group) {
    return data.MATCH_SCHEDULE.filter(function(m) {
      return m.grp === group && m.stage === 'group';
    }).map(function(m) {
      const ht = data.TEAMS.find(function(t) { return t.id === m.home; });
      const at = data.TEAMS.find(function(t) { return t.id === m.away; });
      const result = app.globalData.actualResults[m.id];
      return {
        id: m.id,
        date: m.date,
        time: m.time,
        homeFlag: ht ? ht.flag : '?',
        homeName: ht ? ht.cn : m.home,
        awayFlag: at ? at.flag : '?',
        awayName: at ? at.cn : m.away,
        homeScore: result ? result.homeScore : null,
        awayScore: result ? result.awayScore : null,
        played: !!result
      };
    });
  },

  onTeamTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/team-detail/team-detail?id=' + id });
  },

  switchView(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({ viewMode: mode });
    if (mode === 'bracket') this.buildBracket();
  },

  buildBracket() {
    var that = this;
    var allStandings = this.data.standings;

    function resolveTeam(placeholder) {
      if (!placeholder) return { flag: '❓', cn: '?', placeholder: true };
      if (placeholder.indexOf('W') === 0 || placeholder.indexOf('L') === 0) {
        return { flag: '❓', cn: placeholder, placeholder: true };
      }
      var m = placeholder.match(/^([123])([A-L])/);
      if (m) {
        var pos = parseInt(m[1]), grp = m[2];
        var table = allStandings[grp] || [];
        if (table.length >= pos) {
          var t = table[pos - 1];
          // Check standings module for team data
          var team = data.TEAMS.find(function(x) { return x.id === t.id; });
          if (team) return { flag: team.flag, cn: team.cn, id: t.id, pts: t.pts, placeholder: false };
        }
        return { flag: '❓', cn: grp+'组第'+pos, placeholder: true };
      }
      return { flag: '❓', cn: placeholder, placeholder: true };
    }

    var rounds = [
      { round: '32强', matches: [
        ['1A','3C/D/F/G/H/I'],['1B','3A/E/F/G/H/I'],['1C','3A/B/F/G/H/I'],['1D','3B/C/E/F/H/I'],
        ['1E','3A/B/C/D/G/I'],['1F','3A/C/D/E/H/I'],['1G','3A/B/D/E/F/H'],['1H','3A/B/C/D/E/G'],
        ['1I','3A/B/D/E/G/H'],['1J','3A/C/D/E/F/I'],['1K','3A/B/C/E/F/G'],['1L','3A/B/C/D/G/H'],
        ['2A','2B'],['2C','2D'],['2E','2F'],['2G','2H']
      ]},
      { round: '16强', matches: [
        ['W74','W73'],['W79','W80'],['W76','W75'],['W78','W77'],
        ['W82','W84'],['W85','W86'],['W88','W87'],['W83','W81']
      ]},
      { round: '8强', matches: [['W89','W90'],['W92','W91'],['W94','W93'],['W96','W95']]},
      { round: '半决赛', matches: [['W97','W98'],['W99','W100']]},
      { round: '决赛', matches: [['W101','W102']]}
    ];

    var bracketRounds = rounds.map(function(r) {
      return {
        round: r.round,
        matches: r.matches.map(function(m) {
          return [resolveTeam(m[0]), resolveTeam(m[1])];
        })
      };
    });

    this.setData({ bracketRounds: bracketRounds });
  },

  // Get group matches
  getGroupMatches(group) {
    return data.MATCH_SCHEDULE.filter(function(m) {
      return m.grp === group && m.stage === 'group';
    });
  }
});
