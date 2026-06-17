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
const FD_BASE = 'https://api.football-data.org/v4';
const ODDS_BASE = 'https://api.the-odds-api.com/v4';

const BASE_DIR = __dirname;
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
  {id:"m001",date:"2026-06-11",time:"03:00",home:"MEX",away:"RSA"},{id:"m002",date:"2026-06-12",time:"10:00",home:"KOR",away:"CZE"},
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

  // Team data for generating news
  const TEAMS = {
    MEX:{cn:'墨西哥',flag:'🇲🇽'},RSA:{cn:'南非',flag:'🇿🇦'},KOR:{cn:'韩国',flag:'🇰🇷'},CZE:{cn:'捷克',flag:'🇨🇿'},
    CAN:{cn:'加拿大',flag:'🇨🇦'},BIH:{cn:'波黑',flag:'🇧🇦'},QAT:{cn:'卡塔尔',flag:'🇶🇦'},SUI:{cn:'瑞士',flag:'🇨🇭'},
    BRA:{cn:'巴西',flag:'🇧🇷'},MAR:{cn:'摩洛哥',flag:'🇲🇦'},HAI:{cn:'海地',flag:'🇭🇹'},SCO:{cn:'苏格兰',flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
    USA:{cn:'美国',flag:'🇺🇸'},PAR:{cn:'巴拉圭',flag:'🇵🇾'},AUS:{cn:'澳大利亚',flag:'🇦🇺'},TUR:{cn:'土耳其',flag:'🇹🇷'},
    GER:{cn:'德国',flag:'🇩🇪'},CUW:{cn:'库拉索',flag:'🇨🇼'},CIV:{cn:'科特迪瓦',flag:'🇨🇮'},ECU:{cn:'厄瓜多尔',flag:'🇪🇨'},
    NED:{cn:'荷兰',flag:'🇳🇱'},JPN:{cn:'日本',flag:'🇯🇵'},SWE:{cn:'瑞典',flag:'🇸🇪'},TUN:{cn:'突尼斯',flag:'🇹🇳'},
    BEL:{cn:'比利时',flag:'🇧🇪'},EGY:{cn:'埃及',flag:'🇪🇬'},IRN:{cn:'伊朗',flag:'🇮🇷'},NZL:{cn:'新西兰',flag:'🇳🇿'},
    ESP:{cn:'西班牙',flag:'🇪🇸'},CPV:{cn:'佛得角',flag:'🇨🇻'},KSA:{cn:'沙特',flag:'🇸🇦'},URU:{cn:'乌拉圭',flag:'🇺🇾'},
    FRA:{cn:'法国',flag:'🇫🇷'},SEN:{cn:'塞内加尔',flag:'🇸🇳'},IRQ:{cn:'伊拉克',flag:'🇮🇶'},NOR:{cn:'挪威',flag:'🇳🇴'},
    ARG:{cn:'阿根廷',flag:'🇦🇷'},ALG:{cn:'阿尔及利亚',flag:'🇩🇿'},AUT:{cn:'奥地利',flag:'🇦🇹'},JOR:{cn:'约旦',flag:'🇯🇴'},
    POR:{cn:'葡萄牙',flag:'🇵🇹'},COD:{cn:'民主刚果',flag:'🇨🇩'},UZB:{cn:'乌兹别克',flag:'🇺🇿'},COL:{cn:'哥伦比亚',flag:'🇨🇴'},
    ENG:{cn:'英格兰',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},CRO:{cn:'克罗地亚',flag:'🇭🇷'},GHA:{cn:'加纳',flag:'🇬🇭'},PAN:{cn:'巴拿马',flag:'🇵🇦'},
  };

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
  matchNews.sort((a, b) => b.matchDate.localeCompare(a.matchDate));

  // Source 1: NewsAPI (free 100 req/day, works from GitHub Actions)
  let rssItems = [];
  const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
  if (NEWS_API_KEY) {
    try {
      console.log(`[${ts}] Trying NewsAPI...`);
      const newsResp = await new Promise((resolve, reject) => {
        https.get(`https://newsapi.org/v2/everything?q=World+Cup+2026+football&language=en&pageSize=20&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`, { timeout: 15000 }, res => {
          let b = ''; res.on('data', c => b += c);
          res.on('end', () => { try { resolve(JSON.parse(b)); } catch(e) { reject(e); } });
        }).on('error', reject);
      });
      if (newsResp.articles) {
        newsResp.articles.forEach(a => {
          if (a.title) rssItems.push(a.title);
        });
        console.log(`[${ts}]   NewsAPI: ${newsResp.articles.length} articles`);
      }
    } catch(e) { console.log(`[${ts}]   NewsAPI failed: ${e.message}`); }
  }

  // Source 2: RSS for general news (fallback)
  const RSS_SOURCES = [
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://www.espn.com/espn/rss/soccer/news',
  ];
  const WC_KW = ['World Cup','world cup','FIFA','fifa','Argentina','Brazil','France','England','Germany','Spain','Portugal','Netherlands','Mbappe','Messi','Ronaldo','Haaland'];
  for (const url of RSS_SOURCES) {
    try {
      const resp = await new Promise((resolve, reject) => {
        https.get(url, { timeout: 10000 }, res => {
          let b = ''; res.on('data', c => b += c);
          res.on('end', () => resolve(b));
        }).on('error', reject);
      });
      const re = /<item>([\s\S]*?)<\/item>/gi; let m;
      while ((m = re.exec(resp)) !== null) {
        const t = (m[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
        if (t && WC_KW.some(k => t.includes(k))) {
          rssItems.push(t.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
        }
      }
    } catch(e) { /* skip */ }
  }

  // Dedup
  const seen = new Set();
  const generalNews = rssItems.filter(t => { const k = t.slice(0,50); if (seen.has(k)) return false; seen.add(k); return true; })
    .slice(0, 15).map(t => {
      const tl = t.toLowerCase();
      return (tl.includes('injury') || tl.includes('injured') ? '🔴 ' : '📰 ') + t;
    });

  const data = {
    matchNews, generalNews: generalNews.length > 0 ? generalNews : [],
    total: matchNews.length + generalNews.length,
    updatedAt: now.toISOString()
  };

  fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(`[${ts}] News: ${matchNews.length} match + ${generalNews.length} general written to news.json`);
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
  if (!ran) await updateAll();
}

if (watchMode) {
  console.log('Auto-update every 3h');
  main().then(() => setInterval(main, 3 * 3600000));
} else {
  main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
