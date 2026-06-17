// Cloud function: fetch latest World Cup news from RSS feeds
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// ========== CONFIG ==========
const RSS_SOURCES = [
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.espn.com/espn/rss/soccer/news',
  'https://www.skysports.com/rss/12040',
];

const WC_KEYWORDS = [
  'world cup', 'World Cup', 'World Cup 2026', '2026 World Cup',
  '世界杯', 'FIFA', 'fifa',
  'Mexico', 'Canada', 'United States', 'USA',
  'Argentina', 'Brazil', 'France', 'England', 'Germany', 'Spain',
  'Portugal', 'Netherlands', 'Japan', 'Korea', 'Croatia', 'Belgium',
  'Uruguay', 'Colombia', 'Senegal', 'Morocco', 'Sweden', 'Norway',
  'Mbappe', 'Messi', 'Ronaldo', 'Haaland', 'Neymar', 'Salah',
  'Bellingham', 'Vinicius', 'Yamal', 'Kane', 'De Bruyne',
  'group stage', 'knockout', 'semifinal', 'final',
  'tournament', 'stadium', 'host', 'qualify',
  'injury', 'squad', 'lineup', 'manager'
];

const MIN_WC_KEYWORD_MATCH = 1;

// ========== RSS FETCH ==========
function fetchRSS(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, res => {
      // Follow redirects (301/302)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchRSS(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function parseRSSItems(xml) {
  const items = [];
  // Extract <item>...</item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const desc = extractTag(block, 'description') || '';
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || '';
    if (title) {
      items.push({ title: decodeXML(title), link, desc: decodeXML(desc).replace(/<[^>]*>/g, '').slice(0, 200), pubDate });
    }
  }
  return items;
}

function extractTag(block, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = block.match(regex);
  return m ? m[1].trim() : '';
}

function decodeXML(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function isWorldCup(item) {
  const text = (item.title + ' ' + item.desc).toLowerCase();
  let hits = 0;
  for (const kw of WC_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) hits++;
    if (hits >= MIN_WC_KEYWORD_MATCH) return true;
  }
  return false;
}

// ========== FALLBACK SEED ==========
const FALLBACK_NEWS = [
  '🔴 西班牙亚马尔+尼科·威廉斯首战不会首发，费尔明缺席整届赛事',
  '🔴 阿根廷梅西腿筋管理出场时间，帕雷德斯伤缺，塔利亚菲科疑缺',
  '🔴 伊朗阿兹蒙因签证落选大名单，贾汉巴赫什等多人伤疑',
  '🔴 乌拉圭阿劳霍+希门尼斯双双缺阵首战，贝尔萨防线告急',
  '🔴 塞内加尔库利巴利大腿血肿出战成疑，盖耶也存疑',
  '🔴 阿尔及利亚本塞拜尼足部伤缺，齐达内戴护面出战',
  '🔴 奥地利鲍姆加特纳整届赛事报销，阿拉巴疑缺',
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
  '🔥 挪威26年来首次晋级，哈兰德预选赛轰入16球'
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
  console.log(`[${ts}] Fetching World Cup news...`);

  let allItems = [];

  // Fetch from all RSS sources
  for (const url of RSS_SOURCES) {
    try {
      console.log(`[${ts}] Fetching: ${url}`);
      const xml = await fetchRSS(url);
      const items = parseRSSItems(xml);
      const wcItems = items.filter(isWorldCup);
      console.log(`[${ts}]   -> ${items.length} total, ${wcItems.length} WC-related`);
      allItems = allItems.concat(wcItems);
    } catch (e) {
      console.log(`[${ts}]   -> Failed: ${e.message}`);
    }
  }

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = [];
  for (const item of allItems) {
    const key = item.title.slice(0, 60).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  console.log(`[${ts}] Total unique WC news: ${unique.length}`);

  // Build news texts: use RSS items if available, otherwise fallback
  let newsTexts;
  if (unique.length >= 5) {
    newsTexts = unique.slice(0, 30).map(item => {
      const icon = item.title.toLowerCase().includes('injury') || item.title.includes('伤') ? '🔴' :
                   item.title.toLowerCase().includes('win') || item.title.includes('胜') ? '🔥' : '📰';
      return `${icon} ${item.title}`;
    });
  } else {
    console.log(`[${ts}] Insufficient RSS news (${unique.length}), using fallback seed`);
    newsTexts = FALLBACK_NEWS;
  }

  // Write to cloud DB
  const data = {
    _id: 'latest',
    items: newsTexts,
    total: newsTexts.length,
    source: unique.length >= 5 ? 'rss' : 'fallback',
    rssCount: unique.length,
    updatedAt: now.toISOString()
  };

  try {
    await db.collection('worldcup_news').doc('latest').remove();
  } catch (e) { /* first time */ }
  await db.collection('worldcup_news').add({ data });

  return {
    ok: true,
    source: data.source,
    total: newsTexts.length,
    rssCount: unique.length,
    updatedAt: data.updatedAt
  };
};
