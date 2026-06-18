#!/usr/bin/env node
/**
 * Auto-update WC data from free APIs
 *
 * APIs used:
 *   football-data.org — scores, standings, H2H (free tier, 10 req/min)
 *   the-odds-api.com  — odds (free tier, 500 req/month)
 *
 * Outputs:
 *   scores.json     — match results
 *   odds.json       — latest odds (optional, needs ODDS_API_KEY)
 *   match-info.json — standings, H2H history
 *
 * Usage:
 *   node update-scores.js              # update all
 *   node update-scores.js --scores     # scores only
 *   node update-scores.js --odds       # odds only
 *   node update-scores.js --info       # match-info only (standings+H2H)
 *   node update-scores.js --watch      # auto every 3h
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ========== CONFIG ==========
const FD_TOKEN = process.env.FD_TOKEN;
const ODDS_API_KEY = process.env.ODDS_API_KEY || '';
const APISPORTS_KEY = process.env.APISPORTS_KEY || '';
const FD_BASE = 'https://api.football-data.org/v4';
const ODDS_BASE = 'https://api.the-odds-api.com/v4';
const APISPORTS_BASE = 'https://v3.football.api-sports.io';

const BASE_DIR = __dirname;

// Team data (shared by news + details functions)
const TEAMS = {
  MEX:{cn:'墨西哥',name:'Mexico'},RSA:{cn:'南非',name:'South Africa'},KOR:{cn:'韩国',name:'South Korea'},CZE:{cn:'捷克',name:'Czech Republic'},
  CAN:{cn:'加拿大',name:'Canada'},BIH:{cn:'波黑',name:'Bosnia & Herzegovina'},QAT:{cn:'卡塔尔',name:'Qatar'},SUI:{cn:'瑞士',name:'Switzerland'},
  BRA:{cn:'巴西',name:'Brazil'},MAR:{cn:'摩洛哥',name:'Morocco'},HAI:{cn:'海地',name:'Haiti'},SCO:{cn:'苏格兰',name:'Scotland'},
  USA:{cn:'美国',name:'United States'},PAR:{cn:'巴拉圭',name:'Paraguay'},AUS:{cn:'澳大利亚',name:'Australia'},TUR:{cn:'土耳其',name:'Turkey'},
  GER:{cn:'德国',name:'Germany'},CUW:{cn:'库拉索',name:'Curacao'},CIV:{cn:'科特迪瓦',name:'Ivory Coast'},ECU:{cn:'厄瓜多尔',name:'Ecuador'},
  NED:{cn:'荷兰',name:'Netherlands'},JPN:{cn:'日本',name:'Japan'},SWE:{cn:'瑞典',name:'Sweden'},TUN:{cn:'突尼斯',name:'Tunisia'},
  BEL:{cn:'比利时',name:'Belgium'},EGY:{cn:'埃及',name:'Egypt'},IRN:{cn:'伊朗',name:'Iran'},NZL:{cn:'新西兰',name:'New Zealand'},
  ESP:{cn:'西班牙',name:'Spain'},CPV:{cn:'佛得角',name:'Cape Verde'},KSA:{cn:'沙特',name:'Saudi Arabia'},URU:{cn:'乌拉圭',name:'Uruguay'},
  FRA:{cn:'法国',name:'France'},SEN:{cn:'塞内加尔',name:'Senegal'},IRQ:{cn:'伊拉克',name:'Iraq'},NOR:{cn:'挪威',name:'Norway'},
  ARG:{cn:'阿根廷',name:'Argentina'},ALG:{cn:'阿尔及利亚',name:'Algeria'},AUT:{cn:'奥地利',name:'Austria'},JOR:{cn:'约旦',name:'Jordan'},
  POR:{cn:'葡萄牙',name:'Portugal'},COD:{cn:'民主刚果',name:'Congo DR'},UZB:{cn:'乌兹别克',name:'Uzbekistan'},COL:{cn:'哥伦比亚',name:'Colombia'},
  ENG:{cn:'英格兰',name:'England'},CRO:{cn:'克罗地亚',name:'Croatia'},GHA:{cn:'加纳',name:'Ghana'},PAN:{cn:'巴拿马',name:'Panama'},
};
const SCORES_FILE = path.join(BASE_DIR, 'scores.json');
const ODDS_FILE = path.join(BASE_DIR, 'odds.json');
const INFO_FILE = path.join(BASE_DIR, 'match-info.json');

// ========== football-data.org helpers ==========
function fetchFD(path) {
  return new Promise((resolve, reject) => {
    https.get(`${FD_BASE}${path}`, {
      headers: { 'X-Auth-Token': FD_TOKEN },
      timeout: 15000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

// ========== Odds API helpers ==========
function fetchOdds(path) {
  return new Promise((resolve, reject) => {
    https.get(`${ODDS_BASE}${path}&apiKey=${ODDS_API_KEY}`, { timeout: 15000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

// ========== Match Schedule ==========
function getMatchSchedule() { return [
  {id:"m001",home:"MEX",away:"RSA"},
  {id:"m002",home:"KOR",away:"CZE"},
  {id:"m003",home:"CAN",away:"BIH"},
  {id:"m004",home:"USA",away:"PAR"},
  {id:"m005",home:"QAT",away:"SUI"},
  {id:"m006",home:"BRA",away:"MAR"},
  {id:"m007",home:"HAI",away:"SCO"},
  {id:"m008",home:"AUS",away:"TUR"},
  {id:"m009",home:"GER",away:"CUW"},
  {id:"m010",home:"NED",away:"JPN"},
  {id:"m011",home:"CIV",away:"ECU"},
  {id:"m012",home:"SWE",away:"TUN"},
  {id:"m013",home:"ESP",away:"CPV"},
  {id:"m014",home:"BEL",away:"EGY"},
  {id:"m015",home:"KSA",away:"URU"},
  {id:"m016",home:"IRN",away:"NZL"},
  {id:"m017",home:"FRA",away:"SEN"},
  {id:"m018",home:"IRQ",away:"NOR"},
  {id:"m019",home:"ARG",away:"ALG"},
  {id:"m020",home:"AUT",away:"JOR"},
  {id:"m021",home:"POR",away:"COD"},
  {id:"m022",home:"ENG",away:"CRO"},
  {id:"m023",home:"GHA",away:"PAN"},
  {id:"m024",home:"UZB",away:"COL"},
  {id:"m025",home:"CZE",away:"RSA"},
  {id:"m026",home:"SUI",away:"BIH"},
  {id:"m027",home:"CAN",away:"QAT"},
  {id:"m028",home:"MEX",away:"KOR"},
  {id:"m029",home:"USA",away:"AUS"},
  {id:"m030",home:"SCO",away:"MAR"},
  {id:"m031",home:"BRA",away:"HAI"},
  {id:"m032",home:"TUR",away:"PAR"},
  {id:"m033",home:"NED",away:"SWE"},
  {id:"m034",home:"GER",away:"CIV"},
  {id:"m035",home:"ECU",away:"CUW"},
  {id:"m036",home:"TUN",away:"JPN"},
  {id:"m037",home:"ESP",away:"KSA"},
  {id:"m038",home:"BEL",away:"IRN"},
  {id:"m039",home:"URU",away:"CPV"},
  {id:"m040",home:"NZL",away:"EGY"},
  {id:"m041",home:"ARG",away:"AUT"},
  {id:"m042",home:"FRA",away:"IRQ"},
  {id:"m043",home:"NOR",away:"SEN"},
  {id:"m044",home:"JOR",away:"ALG"},
  {id:"m045",home:"POR",away:"UZB"},
  {id:"m046",home:"ENG",away:"GHA"},
  {id:"m047",home:"PAN",away:"CRO"},
  {id:"m048",home:"COL",away:"COD"},
  {id:"m049",home:"SUI",away:"CAN"},
  {id:"m050",home:"BIH",away:"QAT"},
  {id:"m051",home:"MAR",away:"HAI"},
  {id:"m052",home:"SCO",away:"BRA"},
  {id:"m053",home:"CZE",away:"MEX"},
  {id:"m054",home:"RSA",away:"KOR"},
  {id:"m055",home:"ECU",away:"GER"},
  {id:"m056",home:"CUW",away:"CIV"},
  {id:"m057",home:"JPN",away:"SWE"},
  {id:"m058",home:"TUN",away:"NED"},
  {id:"m059",home:"TUR",away:"USA"},
  {id:"m060",home:"PAR",away:"AUS"},
  {id:"m061",home:"SEN",away:"IRQ"},
  {id:"m062",home:"NOR",away:"FRA"},
  {id:"m063",home:"URU",away:"ESP"},
  {id:"m064",home:"CPV",away:"KSA"},
  {id:"m065",home:"EGY",away:"IRN"},
  {id:"m066",home:"NZL",away:"BEL"},
  {id:"m067",home:"CRO",away:"GHA"},
  {id:"m068",home:"PAN",away:"ENG"},
  {id:"m069",home:"COL",away:"POR"},
  {id:"m070",home:"COD",away:"UZB"},
  {id:"m071",home:"ALG",away:"AUT"},
  {id:"m072",home:"JOR",away:"ARG"}
];}

function loadMatchLookup() {
  const sched = getMatchSchedule();
  const lookup = {};
  sched.forEach(m => { if (m.home !== '?' && m.away !== '?') lookup[m.home + '-' + m.away] = m.id; });
  return lookup;
}

// ========== File I/O ==========
function loadJSON(file, fallback = {}) {
  try { if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch(e) {}
  return fallback;
}

function saveJSON(file, data) {
  const sorted = {};
  Object.keys(data).sort().forEach(k => { sorted[k] = data[k]; });
  fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
}

// ========== UPDATE: Scores (football-data.org) ==========
async function updateScores() {
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const todayStr = now.toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
  const yesterdayStr = new Date(now.getTime() - 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);

  const lookup = loadMatchLookup();
  const existing = loadJSON(SCORES_FILE);

  let allMatches = [];
  for (const d of [yesterdayStr, todayStr]) {
    try {
      const data = await fetchFD(`/competitions/2000/matches?dateFrom=${d}&dateTo=${d}`);
      if (data.matches) allMatches = allMatches.concat(data.matches);
    } catch(e) {
      console.error(`[${ts}] Scores fetch failed for ${d}:`, e.message);
    }
  }

  let n = 0, u = 0;
  allMatches.forEach(m => {
    if (m.status !== 'FINISHED') return;
    const homeScore = m.score?.fullTime?.home, awayScore = m.score?.fullTime?.away;
    if (homeScore == null || awayScore == null) return;
    const htla = m.homeTeam?.tla, atla = m.awayTeam?.tla;
    if (!htla || !atla) return;
    const mid = lookup[htla + '-' + atla] || lookup[atla + '-' + htla];
    if (!mid) return;
    const s = { homeScore, awayScore, recordedAt: now.toISOString() };
    if (!existing[mid]) { existing[mid] = s; n++; }
    else if (existing[mid].homeScore !== s.homeScore || existing[mid].awayScore !== s.awayScore) { existing[mid] = s; u++; }
  });

  saveJSON(SCORES_FILE, existing);
  console.log(`[${ts}] Scores: ${n} new, ${u} updated (total: ${Object.keys(existing).length})`);
}

// ========== UPDATE: Odds (the-odds-api.com, free 500 req/month) ==========
async function updateOdds() {
  if (!ODDS_API_KEY) {
    const ts = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    console.log(`[${ts}] Odds: skipped (set ODDS_API_KEY env var to enable)`);
    return false;
  }

  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // the-odds-api.com: get soccer/World Cup winner odds + upcoming match odds
  // Free tier: 500 req/month, use sparingly
  const sport = 'soccer_fifa_world_cup_winner';
  const regions = 'eu';  // European bookmakers
  const markets = 'h2h'; // 1X2

  let oddsData;
  try {
    oddsData = await fetchOdds(`/sports/${sport}/odds/?regions=${regions}&markets=${markets}`);
  } catch(e) {
    console.error(`[${ts}] Odds fetch failed:`, e.message);
    return false;
  }

  if (!oddsData || !Array.isArray(oddsData)) {
    console.log(`[${ts}] Odds: no data returned`);
    return false;
  }

  const existing = loadJSON(ODDS_FILE);
  let n = 0;

  for (const event of oddsData) {
    const home = event.home_team, away = event.away_team;
    // Try to find a bookmarker with 1X2 odds
    const bookmaker = event.bookmakers?.find(b => b.markets?.some(m => m.key === 'h2h'));
    if (!bookmaker) continue;
    const h2h = bookmaker.markets.find(m => m.key === 'h2h');
    if (!h2h) continue;

    const outcomes = {};
    h2h.outcomes.forEach(o => { outcomes[o.name] = o.price; });

    const key = `${home} vs ${away}`;
    existing[key] = {
      home, away,
      commence_time: event.commence_time,
      bookmaker: bookmaker.title,
      homeOdds: outcomes[home] || null,
      drawOdds: outcomes['Draw'] || null,
      awayOdds: outcomes[away] || null,
      updatedAt: now.toISOString()
    };
    n++;
  }

  saveJSON(ODDS_FILE, existing);
  console.log(`[${ts}] Odds: ${n} events updated (total: ${Object.keys(existing).length})`);
  return true;
}

// ========== UPDATE: Match Info (football-data.org standings + H2H) ==========
async function updateInfo() {
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  const existing = loadJSON(INFO_FILE);
  let updated = 0;

  // 1. Fetch group standings
  try {
    const standingsData = await fetchFD('/competitions/2000/standings');
    if (standingsData.standings) {
      for (const group of standingsData.standings) {
        const groupName = group.group?.replace('GROUP_', '') || group.group;
        const key = `standings_${groupName}`;
        existing[key] = {
          type: 'standings',
          group: groupName,
          table: group.table?.map(row => ({
            position: row.position,
            team: row.team?.tla || row.team?.name,
            played: row.playedGames,
            won: row.won,
            draw: row.draw,
            lost: row.lost,
            goalsFor: row.goalsFor,
            goalsAgainst: row.goalsAgainst,
            goalDiff: row.goalDifference,
            points: row.points
          })),
          updatedAt: now.toISOString()
        };
        updated++;
      }
    }
    console.log(`[${ts}] Info: standings updated (${updated} groups)`);
  } catch(e) {
    console.error(`[${ts}] Standings fetch failed:`, e.message);
  }

  // 2. Fetch H2H for upcoming matches (today + tomorrow)
  const todayStr = now.toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
  const tomorrowStr = new Date(now.getTime() + 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);

  try {
    const matchesData = await fetchFD(`/competitions/2000/matches?dateFrom=${todayStr}&dateTo=${tomorrowStr}`);
    if (matchesData.matches) {
      const upcoming = matchesData.matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
      for (const m of upcoming) {
        const htla = m.homeTeam?.tla, atla = m.awayTeam?.tla;
        if (!htla || !atla) continue;
        const key = `h2h_${htla}_${atla}`;

        // Check if we already have recent H2H data
        if (existing[key] && Date.now() - new Date(existing[key].updatedAt).getTime() < 86400000) continue;

        try {
          const h2hData = await fetchFD(`/teams/${m.homeTeam.id}/matches?limit=10&competitions=2000`);
          existing[key] = {
            type: 'h2h',
            home: htla,
            away: atla,
            recentMatches: (h2hData.matches || []).map(h => ({
              date: h.utcDate,
              home: h.homeTeam?.tla,
              away: h.awayTeam?.tla,
              score: `${h.score?.fullTime?.home}-${h.score?.fullTime?.away}`,
              winner: h.score?.winner
            })),
            updatedAt: now.toISOString()
          };
          updated++;
        } catch(e) {
          // H2H not available for this team pair, skip
        }
      }
    }
    console.log(`[${ts}] Info: H2H data updated (total info entries: ${Object.keys(existing).length})`);
  } catch(e) {
    console.error(`[${ts}] H2H fetch failed:`, e.message);
  }

  // Save to file
  saveJSON(INFO_FILE, existing);

  // Generate JS modules for mini-program (if the directory exists)
  const mpUtilsDir = path.join(BASE_DIR, 'mini-program-worldcup', 'utils');
  if (fs.existsSync(mpUtilsDir)) {
    const jsHeader = '// Auto-generated by update-scores.js — DO NOT EDIT\n// Last updated: ' + now.toISOString() + '\nmodule.exports = ';
    const scoresData = loadJSON(SCORES_FILE);
    try {
      fs.writeFileSync(path.join(mpUtilsDir, 'scores-data.js'), jsHeader + JSON.stringify(scoresData, null, 2) + ';\n');
      fs.writeFileSync(path.join(mpUtilsDir, 'info-data.js'), jsHeader + JSON.stringify(existing, null, 2) + ';\n');
      console.log(`[${ts}] Generated JS modules for mini-program`);
    } catch(e) {
      console.error(`[${ts}] JS module generation failed:`, e.message);
    }
  }
}

// ========== UPDATE: News (match results → news.json) ==========
// Generates match-specific news from actual scores + team data
async function updateNews() {
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const NEWS_FILE = path.join(BASE_DIR, 'news.json');
  const existing = loadJSON(SCORES_FILE);

  const sched = getMatchSchedule();

  // Generate match news from results
  const matchNews = [];
  Object.keys(existing).forEach(mid => {
    const score = existing[mid];
    const m = sched.find(x => x.id === mid);
    if (!m) return;
    const ht = TEAMS[m.home], at = TEAMS[m.away];
    if (!ht || !at) return;
    const hs = score.homeScore, as = score.awayScore;
    const diff = Math.abs(hs - as);
    let icon = '⚽', desc = '';

    if (diff === 0) {
      icon = '🤝';
      desc = hs === 0 ? `${ht.cn}${as?'':'与'+at.cn}互交白卷` : `${ht.cn} ${hs}-${hs} ${at.cn}，双方激战成和`;
    } else if (diff >= 5) {
      icon = '💥';
      const winner = hs > as ? ht.cn : at.cn;
      const loser = hs > as ? at.cn : ht.cn;
      desc = `${winner} ${hs}-${as} 狂胜${loser}，一边倒的碾压局`;
    } else if (diff >= 3) {
      icon = '🔥';
      const winner = hs > as ? ht.cn : at.cn;
      desc = `${winner} ${Math.max(hs,as)}-${Math.min(hs,as)} 大胜，强势表现`;
    } else {
      icon = '⚽';
      const winner = hs > as ? ht.cn : at.cn;
      desc = `${winner} ${Math.max(hs,as)}-${Math.min(hs,as)} 取胜，关键3分`;
    }

    matchNews.push({
      mid, icon,
      title: `${icon} ${ht.cn} ${hs}-${as} ${at.cn} — ${desc}`,
      homeTeam: m.home, awayTeam: m.away,
      homeScore: hs, awayScore: as,
      matchDate: m.date,
      sentiment: diff >= 3 ? (hs > as ? 'home_strong' : 'away_strong') : 'neutral',
      updatedAt: score.recordedAt || score.updatedAt || now.toISOString()
    });
  });

  // Sort by date desc
  matchNews.sort((a, b) => (b.matchDate || '').localeCompare(a.matchDate || ''));

  // Source 1: GNews.io — rotate 3 teams per run, full 48-team coverage every 32h
  let rssItems = [];
  const GNEWS_KEY = process.env.GNEWS_KEY || '';
  if (GNEWS_KEY) {
    // All 48 teams grouped by region (16 groups of 3)
    const ALL_TEAMS = [
      'Argentina Brazil France','England Germany Spain','Portugal Netherlands Croatia',
      'Belgium Switzerland Austria','Sweden Norway Turkey','Scotland Czech Bosnia',
      'Mexico USA Canada','Korea Japan Australia','New Zealand Qatar',
      'Morocco Senegal Ghana','Ivory Coast Egypt Algeria','Tunisia South Africa',
      'Uruguay Colombia Paraguay','Ecuador Saudi Arabia Iran','Iraq Jordan Haiti',
      'Curacao Cape Verde Panama','Uzbekistan Congo DR',
    ];
    var idx = Math.floor(Date.now() / 7200000) % ALL_TEAMS.length;
    var batch = ALL_TEAMS[idx];
    try {
      var q = encodeURIComponent(batch + ' World Cup 2026');
      var newsResp = await new Promise((resolve, reject) => {
        https.get(`https://gnews.io/api/v4/search?q=${q}&lang=en&max=10&token=${GNEWS_KEY}`, { timeout: 15000 }, res => {
          let b = ''; res.on('data', c => b += c);
          res.on('end', () => { try { resolve(JSON.parse(b)); } catch(e) { reject(e); } });
        }).on('error', reject);
      });
      if (newsResp.articles) {
        newsResp.articles.forEach(a => {
          if (a.title) rssItems.push(a.title);
        });
      }
      console.log(`[${ts}]   GNews[${idx}]: ${batch} → ${newsResp.articles ? newsResp.articles.length : 0} articles`);
    } catch(e) { console.log(`[${ts}]   GNews failed: ${e.message}`); }
  }

  // Source 2: RSS feeds (English + Chinese + Google News)
  const RSS_SOURCES = [
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://www.espn.com/espn/rss/soccer/news',
  ];
  const WC_KW = [
    // English
    'World Cup','world cup','FIFA','fifa',
    // Teams + stars
    'Argentina','Brazil','France','England','Germany','Spain','Portugal','Netherlands',
    'Mbappe','Messi','Ronaldo','Haaland',
    // Chinese
    '世界杯','世足','足球',
    '阿根廷','巴西','法国','英格兰','德国','西班牙','葡萄牙','荷兰',
    '梅西','姆巴佩','C罗','哈兰德','内马尔','贝林厄姆','莫德里奇',
    '墨西哥','韩国','日本','加拿大','美国','卡塔尔','瑞士','摩洛哥',
    '苏格兰','澳大利亚','土耳其','科特迪瓦','瑞典','比利时','伊朗',
    '沙特','克罗地亚','加纳','挪威','塞尔维亚','乌拉圭','丹麦','波兰',
    '塞内加尔','厄瓜多尔','威尔士','突尼斯','喀麦隆','哥斯达黎加',
  ];
  for (const url of RSS_SOURCES) {
    try {
      const resp = await new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WC2026Bot/1.0)' }, timeout: 10000 }, res => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, res2 => {
              let b2 = ''; res2.on('data', c => b2 += c);
              res2.on('end', () => resolve(b2));
            }).on('error', reject);
            return;
          }
          let b = ''; res.on('data', c => b += c);
          res.on('end', () => resolve(b));
        }).on('error', reject);
      });
      const re = /<item>([\s\S]*?)<\/item>/gi; let m;
      while ((m = re.exec(resp)) !== null) {
        const t = (m[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
        if (t && WC_KW.some(k => t.includes(k))) {
          rssItems.push(t.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
        }
      }
    } catch(e) { /* skip */ }
  }

  // Relevance filter: keep only prediction-useful news
  const RELEVANT_KW = [
    'World Cup','world cup','FIFA','fifa','2026',
    'injury','injured','squad','lineup','formation','tactics',
    'player','star','stars','coach','manager','train',
    'win','won','lose','lost','drew','draw','beat','defeat','victory',
    'goal','goals','score','hat-trick','brace','penalty',
    'performance','form','struggle','sparkle','brilliant','impressive',
    'fitness','return','back','recover','fit','ready',
    'miss','out','doubt','absent','suspended','ban',
    'red card','yellow card','sent off',
    'upset','shock','surprise','giant','underdog',
    'record','history','historic','first','first-ever',
    'angry','furious','blast','slams',
    'reacts','reaction','reveals','says','speaks','opens up',
  ];
  const JUNK_KW = [
    'how to watch','watch on tv','tv schedule','broadcast','free-to-air','live stream',
    'betting','odds','favourites','favorites','predictions game','tipping',
    'quiz','guess who','vote','poll','pick your','fans choose','fantasy',
    'sponsor','advertisement','promoted','partner content',
    'tickets','travel guide','where to stay','fan zone',
  ];

  const seen = new Set();
  const generalNews = rssItems.filter(t => { const k = t.slice(0,50); if (seen.has(k)) return false; seen.add(k); return true; })
    .filter(t => {
      const tl = t.toLowerCase();
      // Must contain at least one relevant keyword
      const isRelevant = RELEVANT_KW.some(k => tl.includes(k));
      // Must NOT contain junk keyword
      const isJunk = JUNK_KW.some(k => tl.includes(k));
      return isRelevant && !isJunk;
    })
    .slice(0, 40).map(t => {
      const tl = t.toLowerCase();
      return (tl.includes('injury') || tl.includes('injured') ? '🔴 ' : '📰 ') + t;
    });

  // Generate match result news for ALL teams with scores (guarantees 100% coverage)
  const resultTeamNews = {};
  Object.keys(existing).forEach(function(mid) {
    var score = existing[mid];
    var m = sched.find(function(x) { return x.id === mid; });
    if (!m) return;
    var ht = TEAMS[m.home], at = TEAMS[m.away];
    if (!ht || !at) return;
    var gf = score.homeScore, ga = score.awayScore;
    var hResult = gf > ga ? '胜' : gf === ga ? '平' : '负';
    var aResult = ga > gf ? '胜' : ga === gf ? '平' : '负';
    var hNews = '📰 上轮' + hResult + ' ' + at.cn + ' ' + gf + '-' + ga;
    var aNews = '📰 上轮' + aResult + ' ' + ht.cn + ' ' + ga + '-' + gf;
    if (!teamNews[m.home]) teamNews[m.home] = [];
    if (!teamNews[m.away]) teamNews[m.away] = [];
    if (teamNews[m.home].length < 2) teamNews[m.home].push(hNews);
    if (teamNews[m.away].length < 2) teamNews[m.away].push(aNews);
  });

  // Match general news to teams via keywords
  const TEAM_KEYWORDS = {
    MEX: ['Mexico','Mexican','El Tri'],
    RSA: ['South Africa','Bafana'],
    KOR: ['Korea','Korean','Son Heung-min','Son ', 'Taegeuk'],
    CZE: ['Czech','Czechia'],
    CAN: ['Canada','Canadian','Davies','Jonathan David'],
    BIH: ['Bosnia','Herzegovina'],
    QAT: ['Qatar','Qatari'],
    SUI: ['Swiss','Switzerland'],
    BRA: ['Brazil','Brazilian','Neymar','Vinicius','Vini Jr','Rodrygo','Seleção'],
    MAR: ['Morocco','Moroccan','Hakimi','Atlas Lions'],
    HAI: ['Haiti','Haitian'],
    SCO: ['Scotland','Scottish','Robertson','McTominay'],
    USA: ['USA','US ','United States','American','Pulisic','McKennie','USMNT'],
    PAR: ['Paraguay','Paraguayan'],
    AUS: ['Australia','Australian','Socceroos'],
    TUR: ['Turkey','Turkish','Calhanoglu','Guler'],
    GER: ['Germany','German','Musiala','Wirtz','Nagelsmann'],
    CUW: ['Curacao','Curaçao'],
    CIV: ['Ivory Coast','Ivorian','Côte d\'Ivoire','Cote d\'Ivoire','Haller'],
    ECU: ['Ecuador','Ecuadorian','Caicedo'],
    NED: ['Netherlands','Dutch','Van Dijk','De Jong','Gakpo','Oranje','Koeman'],
    JPN: ['Japan','Japanese','Mitoma','Kubo','Samurai Blue'],
    SWE: ['Sweden','Swedish','Gyokeres','Isak','Kulusevski'],
    TUN: ['Tunisia','Tunisian'],
    BEL: ['Belgium','Belgian','De Bruyne','Lukaku','Doku','Red Devils'],
    EGY: ['Egypt','Egyptian','Salah'],
    IRN: ['Iran','Iranian','Taremi','Team Melli'],
    NZL: ['New Zealand','All Whites','Chris Wood'],
    ESP: ['Spain','Spanish','Yamal','Pedri','Rodri','La Roja','Gavi','Olmo'],
    CPV: ['Cape Verde','Cabo Verde','Cape Verdean'],
    KSA: ['Saudi Arabia','Saudi'],
    URU: ['Uruguay','Uruguayan','Valverde','Nunez','Nuñez','Bielsa'],
    FRA: ['France','French','Mbappe','Mbappé','Griezmann','Les Bleus','Deschamps'],
    SEN: ['Senegal','Senegalese','Mane','Mané'],
    IRQ: ['Iraq','Iraqi'],
    NOR: ['Norway','Norwegian','Haaland','Odegaard','Ødegaard'],
    ARG: ['Argentina','Argentine','Messi','Alvarez','Álvarez','La Albiceleste','Scaloni'],
    ALG: ['Algeria','Algerian','Mahrez'],
    AUT: ['Austria','Austrian','Alaba'],
    JOR: ['Jordan','Jordanian'],
    POR: ['Portugal','Portuguese','Ronaldo','Fernandes','Leao','Leão','Martinez'],
    COD: ['DR Congo','Congo','Congolese'],
    UZB: ['Uzbekistan','Uzbek'],
    COL: ['Colombia','Colombian','Diaz','Díaz','James Rodriguez'],
    ENG: ['England','English','Bellingham','Kane','Foden','Saka','Three Lions','Tuchel','Southgate'],
    CRO: ['Croatia','Croatian','Modric','Modrić','Gvardiol','Kovacic'],
    GHA: ['Ghana','Ghanaian','Partey','Kudus'],
    PAN: ['Panama','Panamanian'],
  };

  const teamNews = {};
  generalNews.forEach(item => {
    const text = item.toLowerCase();
    Object.keys(TEAM_KEYWORDS).forEach(tid => {
      const matched = TEAM_KEYWORDS[tid].some(kw => text.includes(kw.toLowerCase()));
      if (matched) {
        if (!teamNews[tid]) teamNews[tid] = [];
        if (teamNews[tid].length < 3) teamNews[tid].push(item); // max 3 per team
      }
    });
  });

  // Generate match result news for ALL teams (100% coverage)
  Object.keys(existing).forEach(function(mid) {
    var score = existing[mid];
    var m = sched.find(function(x) { return x.id === mid; });
    if (!m) return;
    var ht = TEAMS[m.home], at = TEAMS[m.away];
    if (!ht || !at) return;
    var gf = score.homeScore, ga = score.awayScore;
    var hResult = gf > ga ? '胜' : gf === ga ? '平' : '负';
    var aResult = ga > gf ? '胜' : ga === gf ? '平' : '负';
    if (!teamNews[m.home]) teamNews[m.home] = [];
    if (!teamNews[m.away]) teamNews[m.away] = [];
    if (teamNews[m.home].length < 2) teamNews[m.home].push('📰 上轮' + hResult + ' ' + at.cn + ' ' + gf + '-' + ga);
    if (teamNews[m.away].length < 2) teamNews[m.away].push('📰 上轮' + aResult + ' ' + ht.cn + ' ' + ga + '-' + gf);
  });

  const items = [...generalNews, ...matchNews.map(m => m.title)];
  const data = {
    items,
    matchNews, generalNews, teamNews,
    total: items.length,
    updatedAt: now.toISOString()
  };

  fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(`[${ts}] News: ${matchNews.length} match + ${generalNews.length} general written to news.json`);
}

// ========== UPDATE: Match Details (lineups + events via API-Sports) ==========
async function updateMatchDetails() {
  if (!APISPORTS_KEY) { console.log('APISPORTS_KEY not set, skipping match details'); return; }
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const DETAILS_FILE = path.join(BASE_DIR, 'match-details.json');
  const existing = loadJSON(DETAILS_FILE);
  const scores = loadJSON(SCORES_FILE);

  // Fetch fixtures with full details (paid plan: league+season supported)
  async function fetchFixtures(dateStr) {
    return new Promise((resolve, reject) => {
      https.get(`${APISPORTS_BASE}/fixtures?date=${dateStr}&league=1&season=2026`, {
        headers: { 'x-apisports-key': APISPORTS_KEY }, timeout: 15000
      }, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
      }).on('error', reject);
    });
  }

  let n = 0;
  // Get all match dates from scores
  const matchIds = Object.keys(scores).filter(k => k.match(/^m\d+$/));
  const dates = [...new Set(matchIds.map(mid => {
    const m = getMatchSchedule().find(x => x.id === mid);
    return m ? m.date : null;
  }).filter(Boolean))];

  for (const date of dates) {
    try {
      const data = await fetchFixturesByDate(date);
      if (!data.response) continue;
      const wcFixtures = data.response.filter(f => f.league?.name === 'World Cup');
      if (wcFixtures.length === 0) continue;

      // Collect fixture IDs and map to our match IDs
      const idMap = {};
      for (const fixture of wcFixtures) {
        const homeName = fixture.teams?.home?.name, awayName = fixture.teams?.away?.name;
        const m = getMatchSchedule().find(x => {
          const ht = TEAMS[x.home], at = TEAMS[x.away];
          return ht && at && (
            (ht.cn === homeName || ht.name === homeName || ht.name.toLowerCase() === homeName?.toLowerCase()) &&
            (at.cn === awayName || at.name === awayName || at.name.toLowerCase() === awayName?.toLowerCase())
          );
        });
        if (m) idMap[fixture.fixture.id] = m.id;
      }

      if (Object.keys(idMap).length === 0) continue;

      // Step 2: fetch details one by one (free plan limits batch)
      for (const [fid, mid] of Object.entries(idMap)) {
        try {
          const detailResp = await fetchFixtureById(fid);
          if (!detailResp.response || detailResp.response.length === 0) continue;
          const fixture = detailResp.response[0];
        if (!mid) continue;
        const homeName = fixture.teams?.home?.name, awayName = fixture.teams?.away?.name;
        const status = fixture.fixture?.status?.long;
        // Only save if match is finished (lineups + events are final)
        if (status !== 'Match Finished' && status !== 'Match Finished AET' && status !== 'Match Finished AP') continue;

        // Extract key team statistics
        var teamStats = {};
        (fixture.statistics || []).forEach(function(s) {
          var teamName = s.team?.name;
          if (!teamName) return;
          var st = {};
          (s.statistics || []).forEach(function(stat) {
            st[stat.type] = stat.value;
          });
          teamStats[teamName] = st;
        });

        const detail = {
          fixtureId: fixture.fixture?.id,
          date: fixture.fixture?.date,
          venue: fixture.fixture?.venue?.name,
          status: status,
          homeTeam: homeName, awayTeam: awayName,
          score: { home: fixture.goals?.home, away: fixture.goals?.away },
          // Team-level statistics
          statistics: teamStats,
          // Lineups
          lineups: {
            home: (fixture.lineups || []).find(l => l.team?.name === homeName) || null,
            away: (fixture.lineups || []).find(l => l.team?.name === awayName) || null
          },
          // Events (goals, cards, subs)
          events: (fixture.events || []).map(e => ({
            time: e.time?.elapsed + (e.time?.extra ? '+' + e.time.extra : ''),
            team: e.team?.name,
            player: e.player?.name,
            assist: e.assist?.name || null,
            type: e.type,
            detail: e.detail,
            comments: e.comments || ''
          })),
          // Player statistics
          players: (fixture.players || []).map(p => ({
            team: p.team?.name,
            players: (p.players || []).map(pl => ({
              name: pl.player?.name,
              number: pl.player?.number,
              position: pl.player?.pos,
              rating: pl.statistics?.[0]?.games?.rating || null,
              goals: pl.statistics?.[0]?.goals?.total || 0,
              assists: pl.statistics?.[0]?.goals?.assists || 0
            }))
          }))
        };

        existing[mid] = detail;
        n++;
        } catch(e) { console.error(`[${ts}] Details fetch failed for fixture ${fid}:`, e.message); }
      }
    } catch(e) { console.error(`[${ts}] Details fetch failed for ${date}:`, e.message); }
  }

  fs.writeFileSync(DETAILS_FILE, JSON.stringify(existing, null, 2) + '\n');
  console.log(`[${ts}] Match details: ${n} updated (total: ${Object.keys(existing).length})`);
}

// ========== UPDATE: Injuries (via API-Sports) ==========
async function updateInjuries() {
  if (!APISPORTS_KEY) { console.log('APISPORTS_KEY not set, skipping injuries'); return; }
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const INJURIES_FILE = path.join(BASE_DIR, 'injuries.json');

  const data = await new Promise((resolve, reject) => {
    https.get(`${APISPORTS_BASE}/injuries?league=1&season=2026`, {
      headers: { 'x-apisports-key': APISPORTS_KEY }, timeout: 15000
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });

  if (!data.response) return;
  const injuries = {};
  data.response.forEach(function(item) {
    var teamName = item.team?.name;
    var tid = Object.keys(TEAMS).find(function(k) {
      return TEAMS[k].cn === teamName || TEAMS[k].name === teamName;
    });
    if (!tid) return;
    if (!injuries[tid]) injuries[tid] = [];
    injuries[tid].push({
      player: item.player?.name,
      type: item.player?.type || '',
      reason: item.player?.reason || '',
      fixture: item.fixture?.date || ''
    });
  });

  fs.writeFileSync(INJURIES_FILE, JSON.stringify(injuries, null, 2) + '\n');
  console.log(`[${ts}] Injuries: ${Object.keys(injuries).length} teams updated`);
}

// ========== UPDATE: Standings (via API-Sports) ==========
async function updateStandings() {
  if (!APISPORTS_KEY) { console.log('APISPORTS_KEY not set'); return; }
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const STANDINGS_FILE = path.join(BASE_DIR, 'standings.json');

  const data = await new Promise((resolve, reject) => {
    https.get(`${APISPORTS_BASE}/standings?league=1&season=2026`, {
      headers: { 'x-apisports-key': APISPORTS_KEY }, timeout: 15000
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });

  if (!data.response || data.response.length === 0) return;

  const standings = {};
  data.response.forEach(function(leagueData) {
    var league = leagueData.league;
    (league.standings || []).forEach(function(groupRows) {
      groupRows.forEach(function(row) {
        var teamName = row.team?.name;
        var tid = Object.keys(TEAMS).find(function(k) {
          return TEAMS[k].cn === teamName || TEAMS[k].name === teamName;
        });
        if (!tid) return;
        standings[tid] = {
          group: row.group || '',
          rank: row.rank,
          played: row.all?.played || 0,
          won: row.all?.win || 0,
          drawn: row.all?.draw || 0,
          lost: row.all?.lose || 0,
          goalsFor: row.all?.goals?.for || 0,
          goalsAgainst: row.all?.goals?.against || 0,
          goalDiff: row.goalsDiff || 0,
          points: row.points || 0,
          form: row.form || '',
          status: row.status || ''
        };
      });
    });
  });

  fs.writeFileSync(STANDINGS_FILE, JSON.stringify(standings, null, 2) + '\n');
  console.log(`[${ts}] Standings: ${Object.keys(standings).length} teams updated`);
}

// ========== UPDATE: Player Stats (via API-Sports) ==========
async function updatePlayerStats() {
  if (!APISPORTS_KEY) { console.log('APISPORTS_KEY not set'); return; }
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const PLAYERS_FILE = path.join(BASE_DIR, 'players.json');

  async function fetchAPI(endpoint) {
    return new Promise((resolve, reject) => {
      https.get(`${APISPORTS_BASE}${endpoint}&league=1&season=2026`, {
        headers: { 'x-apisports-key': APISPORTS_KEY }, timeout: 15000
      }, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
      }).on('error', reject);
    });
  }

  var scorers = [], assists = [], cards = [];
  try {
    var sData = await fetchAPI('/players/topscorers?');
    scorers = (sData.response || []).slice(0, 20).map(function(r) {
      return { name: r.player?.name, photo: r.player?.photo, team: r.statistics?.[0]?.team?.name, goals: r.statistics?.[0]?.goals?.total || 0, matches: r.statistics?.[0]?.games?.appearences || 0 };
    });
  } catch(e) {}
  try {
    var aData = await fetchAPI('/players/topassists?');
    assists = (aData.response || []).slice(0, 20).map(function(r) {
      return { name: r.player?.name, photo: r.player?.photo, team: r.statistics?.[0]?.team?.name, assists: r.statistics?.[0]?.goals?.assists || 0, matches: r.statistics?.[0]?.games?.appearences || 0 };
    });
  } catch(e) {}
  try {
    var cData = await fetchAPI('/players/topyellowcards?');
    cards = (cData.response || []).slice(0, 20).map(function(r) {
      return { name: r.player?.name, photo: r.player?.photo, team: r.statistics?.[0]?.team?.name, yellow: r.statistics?.[0]?.cards?.yellow || 0, red: r.statistics?.[0]?.cards?.red || 0 };
    });
  } catch(e) {}

  var data = { scorers, assists, cards, updatedAt: now.toISOString() };
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(`[${ts}] Players: ${scorers.length} scorers + ${assists.length} assists + ${cards.length} cards`);
}

// ========== Update All ==========
async function updateAll() {
  await updateScores();
  await updateInfo();
  await updateOdds(); // will skip silently if no ODDS_API_KEY
}

// ========== CLI ==========
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

async function main() {
  let ran = false;
  if (args.includes('--scores')) { await updateScores(); ran = true; }
  if (args.includes('--news')) { await updateNews(); ran = true; }
  if (args.includes('--odds')) { await updateOdds(); ran = true; }
  if (args.includes('--info')) { await updateInfo(); ran = true; }
  if (args.includes('--details')) { await updateMatchDetails(); ran = true; }
  if (args.includes('--injuries')) { await updateInjuries(); ran = true; }
  if (args.includes('--standings')) { await updateStandings(); ran = true; }
  if (args.includes('--players')) { await updatePlayerStats(); ran = true; }
  if (!ran) await updateAll();
}

if (watchMode) {
  console.log('Auto-update every 3h');
  main().then(() => setInterval(main, 3 * 3600000));
} else {
  main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
