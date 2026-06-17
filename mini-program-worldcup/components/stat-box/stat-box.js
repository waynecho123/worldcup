// Stat Box - Reusable statistic display
Component({
  properties: {
    label: { type: String, value: '' },
    value: { type: String, value: '' },
    icon: { type: String, value: '' },
    color: { type: String, value: 'accent' },  // accent | gold | green | red | purple | orange
    size: { type: String, value: 'md' },  // sm | md | lg
    sublabel: { type: String, value: '' },
    trend: { type: String, value: '' },  // up | down | ''
    clickable: { type: Boolean, value: false }
  },

  data: {
    colorMap: {
      accent: '#4da6ff',
      gold: '#f0b90b',
      green: '#00c853',
      red: '#ff3d57',
      purple: '#8b5cf6',
      orange: '#ff9100'
    },
    sizeClass: ''
  },

  lifetimes: {
    attached() {
      this.setData({
        sizeClass: 'stat-' + this.properties.size
      });
    }
  },

  methods: {
    onTap() {
      if (this.properties.clickable) {
        this.triggerEvent('tapstat');
      }
    }
  }
});
