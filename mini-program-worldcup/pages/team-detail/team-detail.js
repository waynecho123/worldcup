const app = getApp();
const data = require('../../utils/data');
const predict = require('../../utils/predict');

Page({
  data: { team: null, groupTable: null, matches: [], lineup: null, players: [] },

  onLoad(options) {
    const id = options.id;
    const t = data.TEAMS.find(x => x.id === id);
    if (!t) { wx.showToast({ title: '球队不存在', icon: 'none' }); return; }

    const str = predict.getStrength(t);
    const todds = data.getTeamOdds(id);
    const lu = data.STARTING_XI[id];

    // Build formatted lineup with Chinese names and jersey numbers
    let lineup = null;
    let players = [];
    if (lu) {
      const toPlayer = (name, pos) => {
        const clean = name.replace('(C)', '').trim();
        return {
          name: clean,
          cn: data.cnName(clean),
          num: data.JERSEY_NUM[clean] || data.JERSEY_NUM[name] || '?',
          isCaptain: name.includes('(C)'),
          pos: pos
        };
      };

      const gk = lu.g ? [toPlayer(lu.g, 'GK')] : [];
      const defs = (lu.d || []).map(n => toPlayer(n, 'DF'));
      const mids = (lu.m || []).map(n => toPlayer(n, 'MF'));
      const fwds = (lu.fwd || []).map(n => toPlayer(n, 'FW'));
      const subs = lu.subs ? lu.subs.split(',').map(n => toPlayer(n.trim(), '替补')) : [];

      lineup = {
        formation: lu.f,
        gk, defs, mids, fwds,
        subs: subs.slice(0, 8),
        note: lu.note || ''
      };
      players = [...gk, ...defs, ...mids, ...fwds, ...subs];
    }

    // Group table
    const groupTeams = data.TEAMS
      .filter(x => x.grp === t.grp)
      .map(x => ({
        id: x.id, flag: x.flag, cn: x.cn, rk: x.rk,
        strength: predict.getStrength(x).toFixed(1),
        isCurrent: x.id === id
      }))
      .sort((a, b) => parseFloat(b.strength) - parseFloat(a.strength));

    // Team's group matches
    const matches = data.MATCH_SCHEDULE
      .filter(m => (m.home === id || m.away === id) && m.stage === 'group')
      .map(m => {
        const opp = m.home === id ? data.TEAMS.find(x => x.id === m.away) : data.TEAMS.find(x => x.id === m.home);
        const isHome = m.home === id;
        const result = app.globalData.actualResults[m.id];
        let scoreDisplay = '';
        let resultColor = '';
        if (result) {
          const myScore = isHome ? result.homeScore : result.awayScore;
          const oppScore = isHome ? result.awayScore : result.homeScore;
          scoreDisplay = myScore + ':' + oppScore;
          if (myScore > oppScore) resultColor = '#00c853';
          else if (myScore === oppScore) resultColor = '#f0b90b';
          else resultColor = '#ff3d57';
        }
        return {
          id: m.id, date: m.date, time: m.time,
          oppFlag: opp ? opp.flag : '?', oppName: opp ? opp.cn : '待定',
          isHome, scoreDisplay, resultColor
        };
      });

    this.setData({
      team: {
        id: t.id, flag: t.flag, cn: t.cn, name: t.name,
        group: t.grp, seed: t.seed, rank: t.rk,
        att: t.att, def: t.def, strength: str.toFixed(1),
        best: t.best, apps: t.apps, conf: t.conf,
        recent: t.recent, stars: t.stars,
        news: t.news || '', inj: t.inj || '',
        odds: todds.odds.toFixed(1), opta: todds.opta.toFixed(1),
        oddsProb: (1 / todds.odds * 100).toFixed(1)
      },
      groupTable: groupTeams,
      matches,
      lineup,
      players
    });
  }
});
