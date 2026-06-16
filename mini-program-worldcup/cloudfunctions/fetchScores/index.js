// 云函数：从 GitHub 读取 scores.json → 写入云数据库
// 不消耗 FiroAPI 额度，完全依赖 GitHub Actions 的定时更新
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// GitHub raw URL（GitHub Actions 每赛后自动更新）
const SCORES_URL = 'https://raw.githubusercontent.com/waynecho123/worldcup/main/scores.json';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

exports.main = async (event) => {
  console.log('Fetching scores from GitHub...');
  let results;
  try {
    results = await fetchJSON(SCORES_URL);
  } catch(e) {
    // 网络失败时返回缓存数据
    try {
      const cached = await db.collection('match_results').doc('latest').get();
      if (cached.data && cached.data.results) {
        return { ok: true, source: 'cache', count: Object.keys(cached.data.results).length };
      }
    } catch(e2) {}
    return { ok: false, error: 'fetch failed: ' + e.message };
  }

  if (!results || Object.keys(results).length === 0) {
    return { ok: true, source: 'empty', count: 0 };
  }

  // 写入云数据库
  try {
    try { await db.collection('match_results').doc('latest').remove(); } catch(e) {}
    await db.collection('match_results').add({
      data: { _id: 'latest', results, updatedAt: new Date().toISOString() }
    });
  } catch(e) {
    return { ok: false, error: 'db write: ' + e.message };
  }

  return { ok: true, source: 'github', count: Object.keys(results).length };
};
