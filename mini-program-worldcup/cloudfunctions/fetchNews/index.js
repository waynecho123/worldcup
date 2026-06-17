// Cloud function: fetch World Cup news from API-Football (primary) + RSS (fallback)
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// ========== CONFIG ==========
const APIFOOTBALL_KEY = process.env.APIFOOTBALL_KEY || '';
const APIFOOTBALL_HOST = 'v3.football.api-sports.io';

const RSS_SOURCES = [
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.espn.com/espn/rss/soccer/news',
  'https://www.skysports.com/rss/12040',
];

// ========== HTTP helpers ==========
function fetchJSON(host, path, headers) {
  return new Promise((resolve, reject) => {
    https.get({ host, path, headers, timeout: 15000 }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ========== Source 1: API-Football /v3/news ==========
async function fetchFromAPIFootball() {
  if (!APIFOOTBALL_KEY) {
    console.log('No APIFOOTBALL_KEY set, skipping API-Football');
    return [];
  }

  const newsItems = [];

  try {
    // Fetch WC news (competition=2000) + general football news
    const endpoints = [
      `/news?league=2000`,              // World Cup specific
      `/news?league=2000&season=2026`,  // 2026 WC season
      `/news?team=`,                     // will be skipped, placeholder
    ];

    for (const ep of endpoints.slice(0, 2)) {
      const data = await fetchJSON(APIFOOTBALL_HOST, '/v3' + ep, {
        'x-apisports-key': APIFOOTBALL_KEY,
        'x-apisports-host': APIFOOTBALL_HOST,
      });

      const articles = data.response || data.articles || [];
      for (const a of articles) {
        newsItems.push({
          title: a.title || '',
          summary: a.summary || a.description || '',
          source: a.source?.name || a.source || 'API-Football',
          url: a.url || '',
          pubDate: a.publishedAt || a.publishDate || a.date || '',
          image: a.image || a.thumbnail || '',
          matchName: a.match?.name || '',
        });
      }
    }
  } catch(e) {
    console.log('API-Football failed:', e.message);
  }

  return newsItems;
}

// ========== Source 2: RSS feeds (fallback) ==========
async function fetchFromRSS() {
  const WC_KEYWORDS = [
    'world cup', 'World Cup', 'World Cup 2026', '2026 World Cup',
    'FIFA', 'fifa', 'Mexico', 'Canada', 'United States',
    'Argentina', 'Brazil', 'France', 'England', 'Germany', 'Spain',
    'Portugal', 'Netherlands', 'Japan', 'Korea', 'Croatia', 'Belgium',
    'Uruguay', 'Colombia', 'Senegal', 'Morocco', 'Sweden', 'Norway',
    'Mbappe', 'Messi', 'Ronaldo', 'Haaland', 'Neymar', 'Salah',
    'Bellingham', 'Vinicius', 'Kane', 'De Bruyne',
    'group stage', 'knockout', 'semifinal', 'final', 'tournament',
  ];

  const allItems = [];
  for (const url of RSS_SOURCES) {
    try {
      const xml = await fetchText(url);
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let match;
      while ((match = itemRegex.exec(xml)) !== null) {
        const block = match[1];
        const title = (block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
        const desc = ((block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] || '').replace(/<[^>]*>/g, '').slice(0, 200);
        if (!title) continue;

        const text = (title + ' ' + desc).toLowerCase();
        const hits = WC_KEYWORDS.filter(kw => text.includes(kw.toLowerCase())).length;
        if (hits >= 1) {
          allItems.push({ title: decodeXML(title), summary: desc, source: 'RSS', pubDate: '' });
        }
      }
    } catch(e) { /* skip */ }
  }

  const seen = new Set();
  return allItems.filter(item => {
    const key = item.title.slice(0, 60).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 30);
}

function decodeXML(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// ========== FALLBACK SEED ==========
const FALLBACK_NEWS = [
  '🔴 西班牙亚马尔+尼科·威廉斯首战不会首发，费尔明缺席整届赛事',
  '🔴 阿根廷梅西腿筋管理出场时间，帕雷德斯伤缺，塔利亚菲科疑缺',
  '🔴 伊朗阿兹蒙因签证落选大名单，贾汉巴赫什等多人伤疑',
  '🔴 乌拉圭阿劳霍+希门尼斯双双缺阵首战，贝尔萨防线告急',
  '🔴 荷兰西蒙斯ACL+廷贝尔腹股沟+德利赫特背伤三主力缺阵',
  '🔴 日本三笘薰腘绳肌伤缺，远藤航足部伤退出国家队',
  '🔴 巴西罗德里戈ACL报销，内马尔小腿伤疑',
  '✅ 法国萨利巴背部伤愈恢复训练，预计首发',
  '🔥 德国7-1狂胜库拉索，哈弗茨梅开二度',
  '🔥 日本2-2逼平荷兰，89分钟镰田大地绝平',
  '🔥 卡塔尔补时94分钟绝平瑞士，队史首个世界杯积分',
  '🔥 美国4-1大胜巴拉圭，巴洛贡梅开二度',
  '🔥 瑞典5-1突尼斯，伊萨克+哲凯赖什双锋发威',
  '🔥 巴西1-1平摩洛哥，维尼修斯破门难救主',
  '⭐ C罗41岁第6届世界杯，葡萄牙身价排第6',
  '🔴 意大利连续两届无缘世界杯，被波黑附加赛淘汰',
  '📊 夺冠指数更新：西班牙5.50居首，法国6.00紧随其后',
  '🏟️ 2026世界杯48队首次扩军，12组×4队全新赛制',
  '⭐ 姆巴佩戴法国队长袖标，德尚确认最后一届执教',
  '🔥 挪威26年来首次晋级，哈兰德预选赛轰入16球',
];

// ========== MAIN ==========
exports.main = async (event) => {
  // HTTP trigger: return cached news for web access
  if (event.httpMethod === 'GET') {
    try {
      const cached = await db.collection('worldcup_news').doc('latest').get();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(cached.data?.items || FALLBACK_NEWS)
      };
    } catch(e) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(FALLBACK_NEWS)
      };
    }
  }

  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // Ensure collection exists
  try { await db.createCollection('worldcup_news'); } catch(e) {}

  console.log(`[${ts}] Fetching World Cup news...`);

  let allItems = [];

  // Source 1: API-Football (primary, has real news articles)
  console.log(`[${ts}] Trying API-Football...`);
  const apiItems = await fetchFromAPIFootball();
  console.log(`[${ts}] API-Football: ${apiItems.length} articles`);
  allItems = allItems.concat(apiItems);

  // Source 2: RSS (fallback)
  if (allItems.length < 5) {
    console.log(`[${ts}] Trying RSS fallback...`);
    const rssItems = await fetchFromRSS();
    console.log(`[${ts}] RSS: ${rssItems.length} items`);
    // Deduplicate vs API items
    const seen = new Set(allItems.map(i => i.title.slice(0, 40).toLowerCase()));
    rssItems.forEach(i => {
      if (!seen.has(i.title.slice(0, 40).toLowerCase())) {
        allItems.push(i);
        seen.add(i.title.slice(0, 40).toLowerCase());
      }
    });
  }

  // Build display texts
  let newsTexts;
  if (allItems.length >= 5) {
    newsTexts = allItems.slice(0, 30).map(item => {
      const t = item.title.toLowerCase();
      let icon = '📰';
      if (t.includes('injury') || t.includes('injured') || item.title.includes('伤')) icon = '🔴';
      else if (t.includes('win') || t.includes('beat') || t.includes('goal') || item.title.includes('胜')) icon = '🔥';
      else if (t.includes('transfer') || t.includes('sign')) icon = '🔄';
      else if (t.includes('final') || t.includes('champion') || item.title.includes('冠军')) icon = '🏆';
      return `${icon} ${item.title}${item.summary ? ' — ' + item.summary.slice(0, 80) : ''}`;
    });
  } else {
    console.log(`[${ts}] Insufficient news (${allItems.length}), using fallback seed`);
    newsTexts = FALLBACK_NEWS;
  }

  // Write to cloud DB
  const data = {
    _id: 'latest',
    items: newsTexts,
    total: newsTexts.length,
    source: allItems.length >= 5 ? 'api-football' : 'fallback',
    liveCount: allItems.length,
    updatedAt: now.toISOString()
  };

  try { await db.collection('worldcup_news').doc('latest').remove(); } catch(e) {}
  await db.collection('worldcup_news').add({ data });

  return {
    ok: true,
    source: data.source,
    total: newsTexts.length,
    liveCount: allItems.length,
    updatedAt: data.updatedAt
  };
};
