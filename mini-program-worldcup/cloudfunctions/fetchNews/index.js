// Cloud function: fetch World Cup news from RSS → cloud DB + GitHub
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const RSS_SOURCES = [
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.espn.com/espn/rss/soccer/news',
  'https://www.skysports.com/rss/12040',
];

const WC_KEYWORDS = [
  'World Cup', 'world cup', 'FIFA', 'fifa', 'World Cup 2026',
  // All 48 teams
  'Mexico', 'South Africa', 'South Korea', 'Korea', 'Czech', 'Czechia',
  'Canada', 'Bosnia', 'Qatar', 'Switzerland',
  'Brazil', 'Morocco', 'Haiti', 'Scotland',
  'United States', 'USA', 'Paraguay', 'Australia', 'Turkey', 'Türkiye',
  'Germany', 'Curacao', 'Curaçao', 'Ivory Coast', "Côte d'Ivoire", 'Ecuador',
  'Netherlands', 'Japan', 'Sweden', 'Tunisia',
  'Belgium', 'Egypt', 'Iran', 'New Zealand',
  'Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay',
  'France', 'Senegal', 'Iraq', 'Norway',
  'Argentina', 'Algeria', 'Austria', 'Jordan',
  'Portugal', 'DR Congo', 'Congo', 'Uzbekistan', 'Colombia',
  'England', 'Croatia', 'Ghana', 'Panama',
  // Top stars
  'Mbappe', 'Mbappé', 'Messi', 'Ronaldo', 'Haaland', 'Neymar', 'Salah',
  'Bellingham', 'Vinicius', 'Yamal', 'Kane', 'De Bruyne', 'Son',
  'Musiala', 'Wirtz', 'Rodri', 'Pedri', 'Valverde', 'Saka', 'Foden',
  'Modric', 'Modrić', 'Gvardiol', 'Kovacic', 'Kovačić',
  'Partey', 'Kudus', 'Williams', 'Mané', 'Mane', 'Koulibaly',
  'Odegaard', 'Ødegaard', 'Gyokeres', 'Gyökeres', 'Isak', 'Kulusevski',
  'Davies', 'David', 'Pulisic', 'McKennie', 'Reyna', 'Balogun',
  'Diaz', 'Díaz', 'James', 'Duran', 'Durán', 'Alvarez', 'Álvarez',
  'Enzo', 'Mac Allister', 'Martinez', 'Martínez', 'Romero', 'Otamendi',
  'Fernandes', 'B.Fernandes', 'Leao', 'Leão', 'Cancelo', 'Bernardo',
  'Dembele', 'Dembélé', 'Tchouameni', 'Tchouaméni', 'Camavinga', 'Kante', 'Kanté',
  'Gakpo', 'van Dijk', 'de Jong', 'Dumfries', 'Gravenberch',
  'Kimmich', 'Gundogan', 'Gündoğan', 'Neuer', 'ter Stegen', 'Havertz',
  'Lukaku', 'Doku', 'Trossard', 'Courtois', 'Openda',
  'Gimenez', 'Giménez', 'Lozano', 'Ochoa', 'Al-Dawsari',
  'Schick', 'Soucek', 'Souček', 'Hlozek', 'Hložek',
  'Taremi', 'Azmoun', 'Jahanbakhsh',
  'Sarr', 'Jackson', 'Marmoush', 'Mahrez', 'Amoura', 'Gouiri',
  'Irankunda', 'Goodwin', 'Souttar', 'Ryan',
  'group stage', 'knockout', 'semifinal', 'final', 'tournament',
  'injury', 'injured', 'squad', 'lineup', 'miss', 'doubt', 'ruled out',
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 20000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function fetchFromRSS() {
  const allItems = [];
  for (const url of RSS_SOURCES) {
    try {
      const xml = await fetchText(url);
      const re = /<item>([\s\S]*?)<\/item>/gi; let m;
      while ((m = re.exec(xml)) !== null) {
        const t = (m[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
        const title = t.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
        // Filter out non-football (cricket, rugby, etc.)
        const isNonFootball = /cricket|rugby|bowl|wicket|innings|scrum|try\b|NFL|NBA|NHL|tennis|F1\b/i.test(title);
        if (title && !isNonFootball && WC_KEYWORDS.some(k => title.includes(k))) {
          allItems.push({ title });
        }
      }
    } catch(e) { /* skip */ }
  }
  return allItems;
}

const FALLBACK_NEWS = [
  '🔥 德国7-1狂胜库拉索，哈弗茨梅开二度',
  '🔥 日本2-2逼平荷兰，89分钟镰田大地绝平',
  '🔥 美国4-1大胜巴拉圭，巴洛贡梅开二度',
  '🔥 瑞典5-1突尼斯，伊萨克+哲凯赖什双锋发威',
  '🔥 巴西1-1平摩洛哥，维尼修斯破门难救主',
  '🔥 法国3-1塞内加尔，姆巴佩梅开二度',
  '🔥 阿根廷3-0阿尔及利亚，梅西传射建功',
  '🔥 挪威4-1伊拉克，哈兰德帽子戏法',
  '🔴 西班牙亚马尔+尼科·威廉斯首战不会首发',
  '🔴 荷兰西蒙斯+廷贝尔+德利赫特三主力缺阵',
  '🔴 日本三笘薰+远藤航伤缺',
  '🔴 巴西罗德里戈ACL报销，内马尔小腿伤疑',
  '⭐ C罗41岁第6届世界杯',
  '📊 夺冠指数：西班牙5.50居首，法国6.00紧随其后',
  '🔥 挪威26年来首次晋级，哈兰德预选赛轰入16球',
];

function pushToGitHub(token, repo, data) {
  const [owner, repoName] = repo.split('/');
  const content = JSON.stringify(data, null, 2);

  return new Promise((resolve, reject) => {
    https.get({
      host: 'api.github.com',
      path: `/repos/${owner}/${repoName}/contents/news.json`,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'worldcup-bot',
        'Accept': 'application/vnd.github.v3+json'
      },
      timeout: 10000
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        let sha = null;
        try { const r = JSON.parse(body); sha = r.sha; } catch(e) {}

        const payload = JSON.stringify({
          message: '📰 news ' + new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit' }),
          content: Buffer.from(content).toString('base64'),
          sha: sha || undefined,
          branch: 'main'
        });

        const req = https.request({
          host: 'api.github.com',
          path: `/repos/${owner}/${repoName}/contents/news.json`,
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'worldcup-bot',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          timeout: 15000
        }, res2 => {
          let rb = '';
          res2.on('data', c => rb += c);
          res2.on('end', () => {
            if (res2.statusCode >= 200 && res2.statusCode < 300) resolve();
            else reject(new Error('GitHub ' + res2.statusCode));
          });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
      });
    }).on('error', reject);
  });
}

exports.main = async (event) => {
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
  console.log(`[${ts}] Fetching news from RSS...`);

  try { await db.createCollection('worldcup_news'); } catch(e) {}

  const rssItems = await fetchFromRSS();
  console.log(`[${ts}] RSS: ${rssItems.length} items`);

  const seen = new Set();
  const unique = rssItems.filter(i => {
    const k = i.title.slice(0, 50).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  let newsTexts;
  if (unique.length >= 5) {
    newsTexts = unique.slice(0, 25).map(i => {
      const t = i.title.toLowerCase();
      const icon = t.includes('injury') ? '🔴' : t.includes('win') || t.includes('goal') ? '🔥' : '📰';
      return icon + ' ' + i.title;
    });
  } else {
    newsTexts = FALLBACK_NEWS;
  }

  const data = {
    _id: 'latest',
    items: newsTexts,
    total: newsTexts.length,
    source: unique.length >= 5 ? 'rss' : 'fallback',
    rssCount: unique.length,
    updatedAt: now.toISOString()
  };

  try { await db.collection('worldcup_news').doc('latest').remove(); } catch(e) {}
  await db.collection('worldcup_news').add({ data });
  console.log(`[${ts}] Cloud DB written: ${newsTexts.length} items`);

  // Push to GitHub for web version
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
  const GITHUB_REPO = process.env.GITHUB_REPO || '';
  console.log(`[${ts}] GitHub: TOKEN=${GITHUB_TOKEN ? 'SET' : 'MISSING'}, REPO=${GITHUB_REPO || 'MISSING'}`);
  if (GITHUB_TOKEN && GITHUB_REPO) {
    try {
      await pushToGitHub(GITHUB_TOKEN, GITHUB_REPO, data);
      console.log(`[${ts}] GitHub push: OK`);
    } catch(e) {
      console.log(`[${ts}] GitHub push FAILED: ${e.message}`);
    }
  }

  return {
    ok: true, source: data.source,
    total: newsTexts.length, rssCount: unique.length,
    updatedAt: data.updatedAt
  };
};
