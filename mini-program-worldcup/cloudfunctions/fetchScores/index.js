// 云函数：直接调用 FiroAPI 拉取比分 → 写入云数据库
// 不依赖 GitHub Actions，定时触发器准时执行
const cloud = require('wx-server-sdk');
const https = require('https');
const crypto = require('crypto');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// ========== CONFIG ==========
const API_KEY = process.env.FIRO_API_KEY || '8YBEztjVsPeG7cTNV5m3bPfUU1GHVqLr';
const PRIVATE_KEY_B64 = process.env.FIRO_PRIVATE_KEY || 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClBYzHcspDIKxOE56o1S4+cYgkkS2oenFZUPIPzNuVKpZpRoyvFNlMOO1Jgnzl63TiNyeIoyay+TNs1HOpau5jkO6el8QLBMF7c7/sLjcVM75tblf9lzwvBxrubGm+Q7chNhfFKiPQfcldVEqjRSNwbZa8bQiTVNgCV+qUJqxyWhA2WjlRN1+XVT2yDq6VkYJfkiBkIMuuSUaPVJ9LK97j926gdE//9KyOrR7cqWfT1MRMBH43tZHJ5czlP5RVl/DDcGUg6aoWTlYOIGDYREIi92/zFeAZl836iSYjKJrdDTYS7zAZ+NJipcGzX4TInfXg64EhElDbW0p0rhYqAIn5AgMBAAECggEAHuvDTTv9GkbtAlQ6znfjil/Lms55N7B5vLqmIL/KBVFNjbxicAwAC4A/Nh71OD++TwT2q2umvLJlKGdGpOAcexuVGrJlUYs6ld9CfwbJ23cun2KlqibEaCt0qGg4CCa4EckI+zDCNTbcnFhHBADYeyCNthDYIoMrVoUSt1/nwCVCx65hHHu4Le0G8Rg4Xek/rfOf7fMZxTm6fERWizRioiR6cs2Sr5ESUSYpu1w+024ikx8IsSmZRuX5Qxu0hIHHi/olfj/9poLfONS93cA4iWqDEBUmFaEh504fojLWGHtxeg0jjbKKjD+AdbTWCkJ6g3xIIuV6oN6Orj5Bf8cq4QKBgQDfmlr6dv9l8DeLTaOsh9ui+IqQJEAKzCbOpy3/mO4jIT6VlBG+F6+bnpo8zxaZSE2UhPN0LtYaN07rv0IfQKBPoaEy9vhuyl/qCLNIf99qd8FOdVoVUiFk+Cy7GGJ6f1mxSvnF+eoE+1w200ec7yP4TjBtDx8aTRUc31ajU5g1EwKBgQC87lwfcGHnxgcUqXr87Cep4l/U7Zg2SUuq+1rEEBMVhDMqSGx2SEEGN8bwso5s0k3bh6iO80+n7VSqlyB86nmhLcgpJlNhhPUj5af+cXM4h/VUIwDgEYbuQOayakjfQSaNgXELgSkl0dBdkhlUGwIleZKkrm9YchB8XjPuSs2CQwKBgQCsMyxTbWc88yVjg5REH5CXTn8viKtFZXmRdpBnIjhrF4QiH5kWYxlbaGZx5C4MN/F/KnBvDk7We7esuGtMtDGBggEpxacHc5UwICkp8Uh2rulQ6fFJMCoFn1abc6kLm53QeuQmglOmKIoYsteY1VZHOLf0lUunrqtOw/Tt7UfvvwKBgBx+Zm5naJyoBRFcrivPAfxhI8rdOoOVclALMJk5Q2ePVJgf7Bu6sfPaHarXgxtubEebohRNJcpRxN8lg8TTKBzi5rkuCo0+nCoZzMhXG+V+u8VAsjUY75ynNSPbW7ov/TyCNSZjCG2nwyEZk7BXkm9Mco1bsXdJXKslGffqWCw5AoGAA/Lfb6mQ3B3RBbj7jWV5JDZSGWjTvw5z0MtQJg5MHRCu7AFpeQCHfncRTb/oMOaSn5EqGqjwNvZNJAJqif3KzFtwb0BdmQeBNtt9QaVgVUnjrWQU4erBOMaEOQpH7xVeFHeBt0tpTpAeVUh9ZCqUfxQSbhFrJ3XNvR/Q0XHIsKo=';

// ========== MATCH SCHEDULE ==========
function getMatchSchedule() { return [
  {id:"m001",date:"2026-06-12",time:"03:00",home:"MEX",away:"RSA"},{id:"m002",date:"2026-06-12",time:"10:00",home:"KOR",away:"CZE"},
  {id:"m003",date:"2026-06-13",time:"03:00",home:"CAN",away:"BIH"},{id:"m004",date:"2026-06-13",time:"09:00",home:"USA",away:"PAR"},
  {id:"m005",date:"2026-06-14",time:"03:00",home:"QAT",away:"SUI"},{id:"m006",date:"2026-06-14",time:"06:00",home:"BRA",away:"MAR"},
  {id:"m007",date:"2026-06-14",time:"09:00",home:"HAI",away:"SCO"},{id:"m008",date:"2026-06-14",time:"12:00",home:"AUS",away:"TUR"},
  {id:"m009",date:"2026-06-15",time:"01:00",home:"GER",away:"CUW"},{id:"m010",date:"2026-06-15",time:"04:00",home:"NED",away:"JPN"},
  {id:"m011",date:"2026-06-15",time:"07:00",home:"CIV",away:"ECU"},{id:"m012",date:"2026-06-15",time:"10:00",home:"SWE",away:"TUN"},
  {id:"m013",date:"2026-06-16",time:"00:00",home:"ESP",away:"CPV"},{id:"m014",date:"2026-06-16",time:"03:00",home:"BEL",away:"EGY"},
  {id:"m015",date:"2026-06-16",time:"06:00",home:"KSA",away:"URU"},{id:"m016",date:"2026-06-16",time:"09:00",home:"IRN",away:"NZL"},
  {id:"m017",date:"2026-06-17",time:"03:00",home:"FRA",away:"SEN"},{id:"m018",date:"2026-06-17",time:"06:00",home:"IRQ",away:"NOR"},
  {id:"m019",date:"2026-06-17",time:"09:00",home:"ARG",away:"ALG"},{id:"m020",date:"2026-06-17",time:"12:00",home:"AUT",away:"JOR"},
  {id:"m021",date:"2026-06-18",time:"01:00",home:"POR",away:"COD"},{id:"m022",date:"2026-06-18",time:"04:00",home:"ENG",away:"CRO"},
  {id:"m023",date:"2026-06-18",time:"07:00",home:"GHA",away:"PAN"},{id:"m024",date:"2026-06-18",time:"10:00",home:"UZB",away:"COL"},
  {id:"m025",date:"2026-06-19",time:"03:00",home:"RSA",away:"KOR"},{id:"m026",date:"2026-06-19",time:"09:00",home:"MEX",away:"CZE"},
  {id:"m027",date:"2026-06-19",time:"06:00",home:"SUI",away:"BIH"},{id:"m028",date:"2026-06-19",time:"12:00",home:"CAN",away:"QAT"},
  {id:"m029",date:"2026-06-20",time:"03:00",home:"TUR",away:"PAR"},{id:"m030",date:"2026-06-20",time:"09:00",home:"USA",away:"AUS"},
  {id:"m031",date:"2026-06-20",time:"06:00",home:"BRA",away:"HAI"},{id:"m032",date:"2026-06-20",time:"12:00",home:"MAR",away:"SCO"},
  {id:"m033",date:"2026-06-21",time:"01:00",home:"GER",away:"CIV"},{id:"m034",date:"2026-06-21",time:"07:00",home:"ECU",away:"CUW"},
  {id:"m035",date:"2026-06-21",time:"04:00",home:"NED",away:"SWE"},{id:"m036",date:"2026-06-21",time:"10:00",home:"JPN",away:"TUN"},
  {id:"m037",date:"2026-06-22",time:"03:00",home:"BEL",away:"IRN"},{id:"m038",date:"2026-06-22",time:"09:00",home:"EGY",away:"NZL"},
  {id:"m039",date:"2026-06-22",time:"00:00",home:"ESP",away:"KSA"},{id:"m040",date:"2026-06-22",time:"06:00",home:"URU",away:"CPV"},
  {id:"m041",date:"2026-06-23",time:"03:00",home:"FRA",away:"IRQ"},{id:"m042",date:"2026-06-23",time:"09:00",home:"SEN",away:"NOR"},
  {id:"m043",date:"2026-06-23",time:"06:00",home:"ARG",away:"AUT"},{id:"m044",date:"2026-06-23",time:"12:00",home:"ALG",away:"JOR"},
  {id:"m045",date:"2026-06-24",time:"01:00",home:"POR",away:"UZB"},{id:"m046",date:"2026-06-24",time:"07:00",home:"COL",away:"COD"},
  {id:"m047",date:"2026-06-24",time:"04:00",home:"ENG",away:"GHA"},{id:"m048",date:"2026-06-24",time:"10:00",home:"CRO",away:"PAN"},
  {id:"m049",date:"2026-06-25",time:"03:00",home:"MEX",away:"KOR"},{id:"m050",date:"2026-06-25",time:"03:00",home:"CZE",away:"RSA"},
  {id:"m051",date:"2026-06-25",time:"09:00",home:"CAN",away:"SUI"},{id:"m052",date:"2026-06-25",time:"09:00",home:"BIH",away:"QAT"},
  {id:"m053",date:"2026-06-26",time:"06:00",home:"BRA",away:"SCO"},{id:"m054",date:"2026-06-26",time:"06:00",home:"MAR",away:"HAI"},
  {id:"m055",date:"2026-06-26",time:"01:00",home:"GER",away:"ECU"},{id:"m056",date:"2026-06-26",time:"01:00",home:"CIV",away:"CUW"},
  {id:"m057",date:"2026-06-26",time:"04:00",home:"NED",away:"TUN"},{id:"m058",date:"2026-06-26",time:"04:00",home:"JPN",away:"SWE"},
  {id:"m059",date:"2026-06-26",time:"09:00",home:"USA",away:"TUR"},{id:"m060",date:"2026-06-26",time:"09:00",home:"PAR",away:"AUS"},
  {id:"m061",date:"2026-06-27",time:"03:00",home:"BEL",away:"NZL"},{id:"m062",date:"2026-06-27",time:"03:00",home:"EGY",away:"IRN"},
  {id:"m063",date:"2026-06-27",time:"06:00",home:"ESP",away:"URU"},{id:"m064",date:"2026-06-27",time:"06:00",home:"CPV",away:"KSA"},
  {id:"m065",date:"2026-06-27",time:"09:00",home:"FRA",away:"NOR"},{id:"m066",date:"2026-06-27",time:"09:00",home:"SEN",away:"IRQ"},
  {id:"m067",date:"2026-06-28",time:"03:00",home:"ARG",away:"JOR"},{id:"m068",date:"2026-06-28",time:"03:00",home:"ALG",away:"AUT"},
  {id:"m069",date:"2026-06-28",time:"06:00",home:"POR",away:"COL"},{id:"m070",date:"2026-06-28",time:"06:00",home:"COD",away:"UZB"},
  {id:"m071",date:"2026-06-28",time:"09:00",home:"ENG",away:"PAN"},{id:"m072",date:"2026-06-28",time:"09:00",home:"CRO",away:"GHA"},
];}

// ========== RSA SIGN ==========
function sign(apiKey, params) {
  const ts = Date.now();
  const sorted = Object.keys(params).sort();
  const parts = [`apiKey=${apiKey}`, `timestamp=${ts}`];
  sorted.forEach(k => { if (params[k] != null) parts.push(`${k}=${params[k]}`); });
  const sig = crypto.sign('sha256', Buffer.from(parts.join('&'), 'utf-8'), {
    key: Buffer.from(PRIVATE_KEY_B64, 'base64'), format: 'der', type: 'pkcs8',
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });
  return { ts, sig: sig.toString('base64') };
}

function apiGet(path, params = {}) {
  return new Promise((resolve, reject) => {
    const { ts, sig } = sign(API_KEY, params);
    const qs = Object.keys(params).filter(k => params[k] != null).sort()
      .map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
    const fullPath = qs ? `${path}?${qs}` : path;

    https.get(`https://www.firoapi.com${fullPath}`, {
      headers: { 'X-API-Key': API_KEY, 'X-Signature': sig, 'X-Timestamp': String(ts) },
      rejectUnauthorized: false, timeout: 15000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

// ========== TEAM MAP ==========
const TEAM_MAP = {
  '墨西哥':'MEX','南非':'RSA','韩国':'KOR','捷克':'CZE','加拿大':'CAN',
  '波黑':'BIH','美国':'USA','巴拉圭':'PAR','卡塔尔':'QAT','瑞士':'SUI',
  '巴西':'BRA','摩洛哥':'MAR','海地':'HAI','苏格兰':'SCO','澳大利亚':'AUS',
  '土耳其':'TUR','德国':'GER','库拉索':'CUW','荷兰':'NED','日本':'JPN',
  '科特迪瓦':'CIV','厄瓜多尔':'ECU','瑞典':'SWE','突尼斯':'TUN',
  '西班牙':'ESP','佛得角':'CPV','比利时':'BEL','埃及':'EGY',
  '沙特':'KSA','乌拉圭':'URU','伊朗':'IRN','新西兰':'NZL',
  '法国':'FRA','塞内加尔':'SEN','伊拉克':'IRQ','挪威':'NOR',
  '阿根廷':'ARG','阿尔及利亚':'ALG','奥地利':'AUT','约旦':'JOR',
  '葡萄牙':'POR','刚果(金)':'COD','英格兰':'ENG','克罗地亚':'CRO',
  '加纳':'GHA','巴拿马':'PAN','乌兹别克斯坦':'UZB','哥伦比亚':'COL',
  'Mexico':'MEX','South Africa':'RSA','Korea Republic':'KOR','Czech Republic':'CZE',
  'Canada':'CAN','Bosnia':'BIH','USA':'USA','Paraguay':'PAR',
  'Qatar':'QAT','Switzerland':'SUI','Brazil':'BRA','Morocco':'MAR',
  'Haiti':'HAI','Scotland':'SCO','Australia':'AUS','Turkey':'TUR',
  'Germany':'GER','Curacao':'CUW','Netherlands':'NED','Japan':'JPN',
  'Cote d\'Ivoire':'CIV','Ecuador':'ECU','Sweden':'SWE','Tunisia':'TUN',
  'Spain':'ESP','Cape Verde':'CPV','Belgium':'BEL','Egypt':'EGY',
  'Saudi Arabia':'KSA','Uruguay':'URU','Iran':'IRN','New Zealand':'NZL',
  'France':'FRA','Senegal':'SEN','Iraq':'IRQ','Norway':'NOR',
  'Argentina':'ARG','Algeria':'ALG','Austria':'AUT','Jordan':'JOR',
  'Portugal':'POR','Congo DR':'COD','England':'ENG','Croatia':'CRO',
  'Ghana':'GHA','Panama':'PAN','Uzbekistan':'UZB','Colombia':'COL',
};

function mapTeam(apiName) {
  return TEAM_MAP[apiName] || TEAM_MAP[apiName?.replace('(南韩)','').trim()] || null;
}

function loadMatchLookup() {
  const sched = getMatchSchedule();
  const lookup = {};
  sched.forEach(m => { if (m.home !== '?' && m.away !== '?') lookup[m.home + '-' + m.away] = m.id; });
  return lookup;
}

function findOurMatchId(homeName, awayName, lookup) {
  const hid = mapTeam(homeName), aid = mapTeam(awayName);
  if (!hid || !aid) return null;
  return lookup[hid + '-' + aid] || lookup[aid + '-' + hid] || null;
}

// ========== MAIN ==========
exports.main = async (event) => {
  // HTTP trigger: return scores directly for web access
  if (event.httpMethod === 'GET') {
    try {
      const cached = await db.collection('match_results').doc('latest').get();
      return { statusCode: 200, headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body: JSON.stringify(cached.data?.results || {}) };
    } catch(e) {
      return { statusCode: 200, headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body: '{}' };
    }
  }

  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  console.log(`[${ts}] Fetching scores from FiroAPI...`);

  const lookup = loadMatchLookup();

  // Load existing scores from cloud DB
  let existing = {};
  try {
    const cached = await db.collection('match_results').doc('latest').get();
    if (cached.data && cached.data.results) {
      existing = cached.data.results;
    }
  } catch(e) {}

  // Wider window if DB is empty (first run or after cache clear)
  const fetchDays = Object.keys(existing).length < 10 ? 7 : 2;
  let allMatches = [];
  for (let off = 0; off < fetchDays; off++) {
    const d = new Date(now.getTime() - off * 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
    try {
      const resp = await apiGet('/firo/tsd/soccer-events', { date: d, isJc: 1 });
      if (resp.code === 200 && resp.data?.matches) {
        allMatches = allMatches.concat(resp.data.matches);
      }
    } catch(e) {
      console.log(`Fetch date ${d} failed:`, e.message);
    }
    if (off > 0) await new Promise(r => setTimeout(r, 300));
  }

  let n = 0, u = 0;
  const seen = new Set();
  allMatches.forEach(m => {
    if (!['FT','AET','PEN'].includes(m.strStatus)) return;
    if (m.intHomeScore == null || m.intAwayScore == null) return;
    const mid = findOurMatchId(m.strHomeTeam, m.strAwayTeam, lookup);
    if (!mid || seen.has(mid)) return;
    seen.add(mid);

    const score = {
      homeScore: m.intHomeScore,
      awayScore: m.intAwayScore,
      homeTeam: m.strHomeTeam,
      awayTeam: m.strAwayTeam,
      status: m.strStatus,
      recordedAt: now.toISOString()
    };

    if (existing[mid]) {
      if (existing[mid].homeScore === score.homeScore && existing[mid].awayScore === score.awayScore) return;
      u++;
    } else {
      n++;
    }
    existing[mid] = score;
  });

  console.log(`[${ts}] Scores: ${n} new, ${u} updated (total: ${Object.keys(existing).length})`);

  // Seed data: ensure all completed matches are present (API may miss some)
  const SEED = {
    m001:{homeScore:2,awayScore:0},m002:{homeScore:2,awayScore:1},
    m003:{homeScore:1,awayScore:1},m004:{homeScore:4,awayScore:1},
    m005:{homeScore:1,awayScore:1},m006:{homeScore:1,awayScore:1},
    m007:{homeScore:0,awayScore:1},m008:{homeScore:2,awayScore:0},
    m009:{homeScore:7,awayScore:1},m010:{homeScore:2,awayScore:2},
    m011:{homeScore:1,awayScore:0},m012:{homeScore:5,awayScore:1},
    m013:{homeScore:0,awayScore:0},m014:{homeScore:1,awayScore:1},
    m015:{homeScore:1,awayScore:1},m016:{homeScore:2,awayScore:2},
    m017:{homeScore:3,awayScore:1},m018:{homeScore:1,awayScore:4},
    m019:{homeScore:3,awayScore:0}
  };
  Object.keys(SEED).forEach(mid => { if (!existing[mid]) existing[mid] = SEED[mid]; });

  // Clean phantom data: remove future matches (API may return bad data)
  const sched = getMatchSchedule();
  const todayStr = now.toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
  Object.keys(existing).forEach(mid => {
    const m = sched.find(x => x.id === mid);
    if (m && m.date > todayStr) {
      console.log(`[${ts}] Removed phantom: ${mid} ${m.home}vs${m.away} (${m.date} > ${todayStr})`);
      delete existing[mid];
    }
  });

  // Write to cloud DB
  try {
    try { await db.collection('match_results').doc('latest').remove(); } catch(e) {}
    await db.collection('match_results').add({
      data: { _id: 'latest', results: existing, updatedAt: now.toISOString() }
    });
  } catch(e) {
    return { ok: false, error: 'db write: ' + e.message };
  }

  // Upload to cloud storage asynchronously (don't block response)
  cloud.uploadFile({
    cloudPath: 'scores.json',
    fileContent: JSON.stringify(existing)
  }).then(() => {
    console.log(`[${ts}] Uploaded scores.json to cloud storage`);
  }).catch(e => {
    console.log(`[${ts}] Cloud storage upload:`, e.message);
  });

  return { ok: true, source: 'firo-api', new: n, updated: u, total: Object.keys(existing).length };
};
