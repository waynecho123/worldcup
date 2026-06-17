// Shared constants for CHO的世界杯小站

const NEWS_REFRESH_MS = 7200000; // 2 hours
const NEWS_CACHE_KEY = 'news_cache';
const PREDICTION_LOCK_KEY = 'locked_preds';
const PRED_LOG_KEY = 'pred_log';
const JC_RETURN_RATE = 0.71;

const STAGE_LABELS = {
  group: '小组赛', r32: '1/16决赛', r16: '1/8决赛',
  qf: '1/4决赛', sf: '半决赛', tpp: '季军赛', final: '🏆决赛'
};

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const STYLE_NAMES = {
  possession: '传控', counter: '防守反击', high_press: '高压逼抢',
  direct: '长传冲吊', defensive_block: '低位防守', balanced: '均衡'
};

module.exports = {
  NEWS_REFRESH_MS, NEWS_CACHE_KEY, PREDICTION_LOCK_KEY, PRED_LOG_KEY,
  JC_RETURN_RATE, STAGE_LABELS, DAY_NAMES, STYLE_NAMES
};
