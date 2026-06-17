// News Ticker - Scrolling news bar
const app = getApp();

Component({
  properties: {
    items: { type: Array, value: [] },
    autoplay: { type: Boolean, value: true },
    speed: { type: Number, value: 3000 }  // ms per item
  },

  data: {
    currentIndex: 0,
    currentText: '',
    timerId: null
  },

  lifetimes: {
    attached() {
      this.updateDisplay();
      if (this.properties.autoplay && this.properties.items.length > 1) {
        this.startTicker();
      }
    },
    detached() {
      this.stopTicker();
    }
  },

  observers: {
    'items'(newItems) {
      this.stopTicker();
      this.setData({ currentIndex: 0 });
      this.updateDisplay();
      if (this.properties.autoplay && newItems && newItems.length > 1) {
        this.startTicker();
      }
    }
  },

  methods: {
    updateDisplay() {
      const items = this.properties.items || [];
      if (items.length === 0) {
        // Fall back to global news
        const globalItems = app.globalData.newsItems || [];
        if (globalItems.length > 0) {
          const idx = this.data.currentIndex % globalItems.length;
          this.setData({ currentText: globalItems[idx] });
          return;
        }
        this.setData({ currentText: '' });
        return;
      }
      const idx = this.data.currentIndex % items.length;
      this.setData({ currentText: typeof items[idx] === 'string' ? items[idx] : (items[idx].text || '') });
    },

    startTicker() {
      const that = this;
      const timerId = setInterval(() => {
        const items = that.properties.items.length > 0
          ? that.properties.items
          : (app.globalData.newsItems || []);
        if (items.length === 0) return;
        const nextIdx = (that.data.currentIndex + 1) % items.length;
        that.setData({ currentIndex: nextIdx });
        that.updateDisplay();
      }, this.properties.speed);
      this.setData({ timerId });
    },

    stopTicker() {
      if (this.data.timerId) {
        clearInterval(this.data.timerId);
        this.setData({ timerId: null });
      }
    },

    onTap() {
      this.triggerEvent('tapnews', {
        index: this.data.currentIndex,
        text: this.data.currentText
      });
    }
  }
});
