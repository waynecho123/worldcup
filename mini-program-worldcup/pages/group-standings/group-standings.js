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
    tabScrollLeft: 0
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

  // Get group matches
  getGroupMatches(group) {
    return data.MATCH_SCHEDULE.filter(function(m) {
      return m.grp === group && m.stage === 'group';
    });
  }
});
