const data = require('../../utils/data');
const predict = require('../../utils/predict');

Page({
  data: {
    teams: [],
    filtered: [],
    activeGroup: 'all',
    sortBy: 'rank',
    groups: ['all','A','B','C','D','E','F','G','H','I','J','K','L']
  },

  onLoad() {
    this.prepareTeams();
  },

  onShow() {
    this.prepareTeams();
  },

  prepareTeams() {
    const teams = data.TEAMS.map(t => ({
      ...t,
      strength: predict.getStrength(t).toFixed(1),
      stars_count: t.stars.length,
      hasInjury: !!t.inj,
      hasNews: !!t.news
    }));
    this.setData({ teams });
    this.applyFilter();
  },

  onGroupTap(e) {
    this.setData({ activeGroup: e.currentTarget.dataset.group });
    this.applyFilter();
  },

  onSortTap(e) {
    this.setData({ sortBy: e.currentTarget.dataset.sort });
    this.applyFilter();
  },

  applyFilter() {
    let list = [...this.data.teams];
    if (this.data.activeGroup !== 'all') {
      list = list.filter(t => t.grp === this.data.activeGroup);
    }
    const sortBy = this.data.sortBy;
    if (sortBy === 'rank') list.sort((a,b) => a.rk - b.rk);
    else if (sortBy === 'strength') list.sort((a,b) => b.strength - a.strength);
    else if (sortBy === 'attack') list.sort((a,b) => b.att - a.att);
    this.setData({ filtered: list });
  },

  onTeamTap(e) {
    wx.navigateTo({ url: '/pages/team-detail/team-detail?id=' + e.currentTarget.dataset.id });
  }
});
