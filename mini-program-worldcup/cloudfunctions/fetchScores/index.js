// 云函数：调用 football-data.org API 拉取比分 → 写入云数据库
// 免费 10次/分钟，TLA码直接匹配，无需翻译
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// ========== CONFIG ==========
const FD_TOKEN = process.env.FD_TOKEN || '';

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

// ========== football-data.org API ==========
function fetchFD(path) {
  return new Promise((resolve, reject) => {
    https.get('https://api.football-data.org/v4' + path, {
      headers: { 'X-Auth-Token': FD_TOKEN },
      timeout: 15000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function loadMatchLookup() {
  const sched = getMatchSchedule();
  const lookup = {};
  sched.forEach(m => { if (m.home !== '?' && m.away !== '?') lookup[m.home + '-' + m.away] = m.id; });
  return lookup;
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
  console.log(`[${ts}] Fetching scores from football-data.org...`);

  const lookup = loadMatchLookup();

  // Load existing scores from cloud DB
  let existing = {};
  try {
    const cached = await db.collection('match_results').doc('latest').get();
    if (cached.data && cached.data.results) {
      existing = cached.data.results;
    }
  } catch(e) {}

  // Fetch today + yesterday (BJT)
  let allMatches = [];
  for (let off = 0; off <= 1; off++) {
    const d = new Date(now.getTime() - off * 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
    try {
      const data = await fetchFD(`/competitions/2000/matches?dateFrom=${d}&dateTo=${d}`);
      if (data.matches) allMatches = allMatches.concat(data.matches);
    } catch(e) {
      console.log(`Fetch ${d} failed:`, e.message);
    }
  }

  let n = 0, u = 0;
  allMatches.forEach(m => {
    if (m.status !== 'FINISHED') return;
    const homeScore = m.score?.fullTime?.home, awayScore = m.score?.fullTime?.away;
    if (homeScore == null || awayScore == null) return;
    // Use TLA codes — match our team IDs directly
    const htla = m.homeTeam?.tla, atla = m.awayTeam?.tla;
    if (!htla || !atla) return;
    const mid = lookup[htla + '-' + atla] || lookup[atla + '-' + htla];
    if (!mid) return;

    const score = {
      homeScore, awayScore,
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

  // Seed data: ensure all completed matches are present
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
    m019:{homeScore:3,awayScore:0},m020:{homeScore:3,awayScore:1}
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

  return { ok: true, source: 'football-data', new: n, updated: u, total: Object.keys(existing).length };
};
