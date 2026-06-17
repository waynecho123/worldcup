export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/teams/teams',
    'pages/team-detail/team-detail',
    'pages/squad/squad',
    'pages/group-stage/group-stage',
    'pages/knockout/knockout',
    'pages/match/match',
    'pages/share/share'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#1a1a2e',
    navigationBarTitleText: '2026 Road to WorldCup',
    navigationBarTextStyle: 'white',
    backgroundColor: '#0f0f23'
  },
  tabBar: {
    color: '#8e8e93',
    selectedColor: '#ffd700',
    backgroundColor: '#1a1a2e',
    borderStyle: 'black',
    list: [
      { pagePath: 'pages/index/index', text: '赛事', iconPath: 'assets/tab-tournament.png', selectedIconPath: 'assets/tab-tournament-active.png' },
      { pagePath: 'pages/teams/teams', text: '球队', iconPath: 'assets/tab-teams.png', selectedIconPath: 'assets/tab-teams-active.png' },
      { pagePath: 'pages/knockout/knockout', text: '淘汰赛', iconPath: 'assets/tab-knockout.png', selectedIconPath: 'assets/tab-knockout-active.png' }
    ]
  }
})
