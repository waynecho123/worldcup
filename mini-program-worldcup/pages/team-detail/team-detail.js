const data = require('../../utils/data');
const predict = require('../../utils/predict');

Page({
  data: { team: null },

  onLoad(options) {
    const id = options.id;
    const t = data.TEAMS.find(x => x.id === id);
    if (!t) { wx.showToast({ title: '球队不存在', icon: 'none' }); return; }

    const str = predict.getStrength(t);
    const todds = data.getTeamOdds(id);
    const lu = data.STARTING_XI[id];

    this.setData({
      team: {
        id: t.id, flag: t.flag, cn: t.cn, name: t.name,
        group: t.grp, seed: t.seed, rank: t.rk,
        att: t.att, def: t.def, strength: str.toFixed(1),
        best: t.best, apps: t.apps, conf: t.conf,
        recent: t.recent, stars: t.stars,
        news: t.news || '', inj: t.inj || '',
        odds: todds.odds.toFixed(1), opta: todds.opta.toFixed(1),
        oddsProb: (1 / todds.odds * 100).toFixed(1),
        lineup: lu || null
      }
    });
  }
});
