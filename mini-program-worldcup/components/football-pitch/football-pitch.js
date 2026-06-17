// Football Pitch - Visual formation display
const names = require('../../utils/names');

Component({
  properties: {
    homeTeam: { type: Object, value: null },    // { id, cn, flag, formation, players }
    awayTeam: { type: Object, value: null },
    showHome: { type: Boolean, value: true },
    showAway: { type: Boolean, value: false },
    mode: { type: String, value: 'formation' }  // formation | comparison
  },

  data: {
    homeRows: [],
    awayRows: [],
    activeTab: 'home'
  },

  lifetimes: {
    attached() {
      this.buildFormation();
    }
  },

  observers: {
    'homeTeam, awayTeam'(ht, at) {
      this.buildFormation();
    },
    'showHome, showAway'(h, a) {
      this.setData({ activeTab: h ? 'home' : 'away' });
    }
  },

  methods: {
    buildFormation() {
      const ht = this.properties.homeTeam;
      const at = this.properties.awayTeam;

      if (ht) {
        const homeRows = this.parseLineup(ht);
        this.setData({ homeRows });
      }
      if (at) {
        const awayRows = this.parseLineup(at);
        this.setData({ awayRows });
      }
    },

    parseLineup(team) {
      if (!team || !team.players) return [];

      const players = team.players;
      const formation = team.formation || '4-3-3';
      const parts = formation.split('-').map(Number);

      const rows = [];
      const gk = players.filter(p => p.pos === 'GK');
      const def = players.filter(p => p.pos === 'DEF');
      const mid = players.filter(p => p.pos === 'MID');
      const fwd = players.filter(p => p.pos === 'FWD');

      // Build rows based on formation
      if (gk.length > 0) {
        rows.push({ label: 'GK', players: gk, cols: 1 });
      }

      if (def.length > 0) {
        const defCols = parts[0] || def.length;
        rows.push({ label: 'DEF', players: def.slice(0, defCols), cols: defCols });
      }

      if (mid.length > 0) {
        const midCols = parts[1] || mid.length;
        rows.push({ label: 'MID', players: mid.slice(0, midCols), cols: midCols });
      }

      if (fwd.length > 0) {
        const fwdCols = parts[2] || fwd.length;
        rows.push({ label: 'FWD', players: fwd.slice(0, fwdCols), cols: fwdCols });
      }

      return rows;
    },

    getPlayerName(player) {
      if (!player) return '';
      const cnName = names.PLAYER_CN[player.name] || player.name;
      // Truncate long names
      return cnName.length > 6 ? cnName.slice(0, 5) + '..' : cnName;
    },

    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({ activeTab: tab });
      this.triggerEvent('switchtab', { tab });
    }
  }
});
