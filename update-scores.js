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
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  if (!APISPORTS_KEY) {
    console.log(`[${ts}] Odds: skipped (set APISPORTS_KEY)`);
    return false;
  }

  // API-Sports odds endpoint (Pro plan includes 1X2 odds for all matches)
  const existing = loadJSON(ODDS_FILE) || {};

  // Fixture ID → match ID map (from match-details.json)
  const detailsForOdds = loadJSON(path.join(BASE_DIR, 'match-details.json')) || {};
  const fixToMid = {};
  Object.keys(detailsForOdds).forEach(function(k) {
    if (detailsForOdds[k] && detailsForOdds[k].fixtureId) fixToMid[detailsForOdds[k].fixtureId] = k;
  });

  try {
    // Fetch odds for next 7 days
    const sched = getMatchSchedule();
    let updated = 0;
    const today = new Date();
    const dates = [];
    for (let d = 0; d < 5; d++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() + d);
      dates.push(dt.toISOString().slice(0, 10));
    }

    for (const dateStr of dates) {
      const resp = await new Promise((resolve, reject) => {
        https.get(`${APISPORTS_BASE}/odds?date=${dateStr}&league=1&season=2026&bookmaker=8&bet=1`, {
          headers: { 'x-apisports-key': APISPORTS_KEY }, timeout: 15000
        }, res => {
          let b = ''; res.on('data', c => b += c);
          res.on('end', () => { try { resolve(JSON.parse(b)); } catch(e) { reject(e); } });
        }).on('error', reject);
      });

      console.log(`[${ts}] Odds[${dateStr}]: API returned ${resp.response ? resp.response.length : 0} fixtures (errors: ${JSON.stringify(resp.errors||'none')})`);
      if (resp && resp.response) {
        resp.response.forEach(function(fixture) {
          var fixId = fixture.fixture && fixture.fixture.id;
          if (!fixId) return;
          var bookmakers = fixture.bookmakers || [];
          var b365 = bookmakers.find(function(b){return b.name==='Bet365';}) || bookmakers[0];
          if (!b365 || !b365.bets || !b365.bets[0]) return;
          var vals = b365.bets[0].values || [];
          var h = vals.find(function(v){return v.value==='Home';});
          var d = vals.find(function(v){return v.value==='Draw';});
          var a = vals.find(function(v){return v.value==='Away';});
          if (h && d && a) {
            existing[fixId] = { h: parseFloat(h.odd), d: parseFloat(d.odd), a: parseFloat(a.odd), updatedAt: ts };
            updated++;
          }
        });
      }
      console.log(`[${ts}] Odds[${dateStr}]: ${updated} matches updated`);
    }

    if (updated > 0) {
      fs.writeFileSync(ODDS_FILE, JSON.stringify(existing, null, 2));
      console.log(`[${ts}] Odds: ${updated} matches written to odds.json`);
      return true;
    }
  } catch(e) { console.error(`[${ts}] Odds fetch failed:`, e.message); }
  return false;
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

  // Source 1: GNews.io — 2 batches × 3 teams per run, full 48-team coverage every 16h
  let rssItems = [];
  const GNEWS_KEY = process.env.GNEWS_KEY || '';
  if (GNEWS_KEY) {
    console.log(`[${ts}] GNews key loaded: ${GNEWS_KEY.slice(0,8)}...`);
    // Priority big-team batches (guaranteed news every run)
    const BIG_BATCHES = [
      'Argentina Brazil France','England Germany Spain','Portugal Netherlands Belgium',
      'Uruguay Colombia Mexico USA',
    ];
    // Full 16-group rotation for 48-team coverage
    const ALL_TEAMS = [
      'Argentina Brazil France','England Germany Spain','Portugal Netherlands Croatia',
      'Belgium Uruguay Colombia','Mexico USA Canada','Switzerland Austria Sweden',
      'Norway Turkey Scotland','Korea Japan Australia',
      'Morocco Senegal Ghana','Egypt Algeria Tunisia',
      'Ivory Coast South Africa Qatar','Iran Saudi Arabia Iraq',
      'Ecuador Paraguay Panama','New Zealand Jordan Haiti',
      'Czech Bosnia Cape Verde','Curacao Congo DR Uzbekistan',
    ];
    var bigIdx = Math.floor(Date.now() / 7200000) % BIG_BATCHES.length;
    var regularIdx = Math.floor(Date.now() / 7200000) % ALL_TEAMS.length;
    // 1 big-team batch + 1 rotating batch per run, ensures at least 1 hit every run
    var batches = [BIG_BATCHES[bigIdx], ALL_TEAMS[regularIdx]];
    var totalGnews = 0;
    for (var bi = 0; bi < batches.length; bi++) {
      try {
        if (bi > 0) await new Promise(r => setTimeout(r, 3000)); // avoid 429 rate limit
        var q = encodeURIComponent(batches[bi] + ' World Cup 2026');
        var gnewsUrl = `https://gnews.io/api/v4/search?q=${q}&lang=en&max=10&token=${GNEWS_KEY}`;
        console.log(`[${ts}] GNews fetching[${bi}]: ${batches[bi]}`);
        var newsResp = await new Promise((resolve, reject) => {
          var req = https.get(gnewsUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WC2026Bot/1.0)' }, timeout: 15000 }, res => {
            let b = ''; res.on('data', c => b += c);
            res.on('end', () => {
              console.log(`[${ts}] GNews HTTP ${res.statusCode}, body: ${b.slice(0,200)}`);
              try { resolve(JSON.parse(b)); } catch(e) { reject(new Error('Parse: ' + b.slice(0,100))); }
            });
          }).on('error', e => { console.log(`[${ts}] GNews socket error[${bi}]: ${e.message}`); reject(e); });
          req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        });
        if (newsResp.articles) {
          newsResp.articles.forEach(a => { if (a.title) rssItems.push(a.title); });
          totalGnews += newsResp.articles.length;
        } else if (newsResp.errors) {
          console.log(`[${ts}] GNews API errors: ${JSON.stringify(newsResp.errors)}`);
        }
        var gidx = bi === 0 ? bigIdx : regularIdx;
        console.log(`[${ts}]   GNews[${gidx}]: ${batches[bi]} → ${newsResp.articles ? newsResp.articles.length : 0} articles`);
      } catch(e) { console.log(`[${ts}]   GNews batch ${bi} FAILED: ${e.message}`); }
    }
    console.log(`[${ts}]   GNews total: ${totalGnews} articles from 2 batches`);
  } else {
    console.log(`[${ts}] GNews SKIPPED: no GNEWS_KEY in env`);
  }

  // Source 2: RSS feeds — multi-language, multi-region (free, no key, no quota)
  const RSS_SOURCES = [
    // English mainstream
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://www.espn.com/espn/rss/soccer/news',
    'https://www.skysports.com/rss/12040',
    'https://www.skysports.com/rss/11095',
    'https://www.theguardian.com/football/rss',
    // English football-specific
    'https://www.goal.com/en/feeds/news',
    'https://www.soccernews.com/feed/',
    'https://soccer.nbcsports.com/feed/',
    'https://www.mirror.co.uk/sport/football/?service=rss',
    'https://www.90min.com/feed',
    'https://www.football-italia.net/feed',
    'https://www.101greatgoals.com/feed',
    // US sports media
    'https://api.foxsports.com/v1/rss',
    // RSSHub routes (may work from GH Actions US IP)
    'https://rsshub.app/dongqiudi/news',
    'https://rsshub.app/theathletic/football',
    'https://rsshub.app/hupu/soccer/news',
    // European languages (covers smaller teams)
    'https://www.marca.com/en/football/rss.xml',
    'https://www.lequipe.fr/rss/football.xml',
    'https://www.kicker.de/fussball/rss.xml',
    // Google News (multi-region)
    'https://news.google.com/rss/search?q=World+Cup+2026&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=%E4%B8%96%E7%95%8C%E6%9D%AF+%E8%B6%B3%E7%90%83+2026&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    'https://news.google.com/rss/search?q=Copa+del+Mundo+2026&hl=es-ES&gl=ES&ceid=ES:es',
    'https://news.google.com/rss/search?q=Coupe+du+Monde+2026&hl=fr-FR&gl=FR&ceid=FR:fr',
    'https://news.google.com/rss/search?q=WM+2026+Fussball&hl=de-DE&gl=DE&ceid=DE:de',
  ];
  const WC_KW = [
    // Core terms (multi-language)
    'World Cup','world cup','FIFA','fifa','World Cup 2026',
    'Copa del Mundo','Coupe du Monde','WM 2026','Mundial',
    '世界杯','足球','世足',
    // === ALL 48 teams (English + Chinese) ===
    'Argentina','Brazil','France','England','Germany','Spain','Portugal','Netherlands',
    'Croatia','Belgium','Switzerland','Austria','Sweden','Norway','Turkey','Scotland',
    'Mexico','USA','Canada','South Korea','Japan','Australia','New Zealand',
    'Morocco','Senegal','Ghana','Ivory Coast','Egypt','Algeria','Tunisia',
    'Uruguay','Colombia','Paraguay','Ecuador','Saudi Arabia','Iran','Iraq',
    'Czech','Bosnia','Qatar','South Africa','Haiti','Jordan','Panama',
    'Curacao','Cape Verde','Congo','Uzbekistan',
    '阿根廷','巴西','法国','英格兰','德国','西班牙','葡萄牙','荷兰',
    '克罗地亚','比利时','瑞士','奥地利','瑞典','挪威','土耳其','苏格兰',
    '墨西哥','美国','加拿大','韩国','日本','澳大利亚','新西兰',
    '摩洛哥','塞内加尔','加纳','科特迪瓦','埃及','阿尔及利亚','突尼斯',
    '乌拉圭','哥伦比亚','巴拉圭','厄瓜多尔','沙特','伊朗','伊拉克',
    '捷克','波黑','卡塔尔','南非','海地','约旦','巴拿马',
    '库拉索','佛得角','民主刚果','乌兹别克','刚果',
    // Spanish (Marca, Google News ES)
    'Brasil','Francia','Inglaterra','Alemania','España','Países Bajos','Holanda',
    'Croacia','Bélgica','Suiza','Suecia','Noruega','Turquía','Escocia',
    'México','Estados Unidos','Canadá','Corea del Sur','Japón','Nueva Zelanda',
    'Marruecos','Costa de Marfil','Egipto','Argelia','Túnez',
    'Uruguay','Colombia','Paraguay','Ecuador','Arabia Saudí','Irán','Irak',
    'Checa','Bosnia','Catar','Sudáfrica','Haití','Jordania','Panamá',
    'Curazao','Cabo Verde','Uzbekistán',
    // French (L\'Equipe, Google News FR)
    'Brésil','Angleterre','Allemagne','Espagne','Pays-Bas',
    'Croatie','Belgique','Suisse','Autriche','Suède','Norvège','Turquie','Écosse',
    'Mexique','États-Unis','Canada','Corée du Sud','Japon','Australie','Nouvelle-Zélande',
    'Maroc','Sénégal','Ghana','Côte d\'Ivoire','Égypte','Algérie','Tunisie',
    'Colombie','Équateur','Arabie Saoudite','Iran','Irak',
    'Tchéquie','Bosnie','Qatar','Afrique du Sud','Haïti','Jordanie','Panama',
    'Curaçao','Cap-Vert','Ouzbékistan',
    // German (Kicker, Google News DE)
    'Brasilien','Frankreich','England','Deutschland','Spanien','Niederlande',
    'Kroatien','Belgien','Schweiz','Österreich','Schweden','Norwegen','Türkei','Schottland',
    'Mexiko','Kanada','Südkorea','Japan','Australien','Neuseeland',
    'Marokko','Senegal','Ghana','Elfenbeinküste','Ägypten','Algerien','Tunesien',
    'Uruguay','Kolumbien','Paraguay','Saudi-Arabien','Iran','Irak',
    'Tschechien','Bosnien','Katar','Südafrika','Haiti','Jordanien','Panama',
    'Usbekistan','Demokratische Republik Kongo',
    // Star players (universal names)
    'Mbappe','Messi','Ronaldo','Haaland','Neymar','Bellingham','Modric',
    'Son Heung-min','Davies','Salah','Vinicius','De Bruyne','Kane',
    '姆巴佩','梅西','C罗','哈兰德','内马尔','贝林厄姆','莫德里奇',
    '孙兴慜','戴维斯','萨拉赫','德布劳内','凯恩',
  ];
  // Parallel fetch all RSS sources
  const rssResults = await Promise.allSettled(RSS_SOURCES.map(url =>
    new Promise((resolve, reject) => {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WC2026Bot/1.0)' }, timeout: 8000 }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, res2 => {
            let b2 = ''; res2.on('data', c => b2 += c);
            res2.on('end', () => resolve(b2));
          }).on('error', reject);
          return;
        }
        let b = ''; res.on('data', c => b += c);
        res.on('end', () => resolve(b));
      }).on('error', reject);
    }).then(resp => {
      const re = /<item>([\s\S]*?)<\/item>/gi; let m;
      const items = [];
      while ((m = re.exec(resp)) !== null) {
        const t = (m[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
        if (t && WC_KW.some(k => t.includes(k))) {
          items.push(t.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
        }
      }
      return items;
    }).catch(() => [])
  ));
  rssResults.forEach(r => {
    if (r.status === 'fulfilled' && r.value) rssItems.push(...r.value);
  });
  console.log(`[${ts}]   RSS: ${RSS_SOURCES.length} feeds → ${rssItems.length} items`);

  // Source 2b: Sina sports JSON feed (Chinese news, free, no key)
  var SINA_FEED = 'https://feed.mix.sina.com.cn/api/roll/get?pageid=155&lid=1204&num=30';
  try {
    const sinaResp = await new Promise((resolve, reject) => {
      https.get(SINA_FEED, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WC2026Bot/1.0)' }, timeout: 8000 }, res => {
        let b = ''; res.on('data', c => b += c);
        res.on('end', () => { try { resolve(JSON.parse(b)); } catch(e) { reject(e); } });
      }).on('error', reject);
    });
    if (sinaResp && sinaResp.result && sinaResp.result.data) {
      let sinaCount = 0;
      sinaResp.result.data.forEach(item => {
        if (item.title && item.title.length > 5) {
          rssItems.push(item.title);
          sinaCount++;
        }
      });
      console.log(`[${ts}]   Sina: ${sinaCount} articles`);
    }
  } catch(e) { console.log(`[${ts}]   Sina failed: ${e.message}`); }

  // Relevance filter: keep only prediction-useful news
  // Match-impact keywords (both EN + CN) — these affect predictions
  const RELEVANT_KW = [
    // EN: core football
    'World Cup','world cup','FIFA','fifa','2026',
    'injury','injured','squad','lineup','formation','tactics',
    'player','star','coach','manager','train',
    'win','won','lose','lost','drew','beat','defeat','victory',
    'goal','goals','score','hat-trick','brace','penalty',
    'performance','form','struggle','brilliant','impressive',
    'fitness','return','recover','fit','ready',
    'miss','out','doubt','absent','suspended','ban',
    'red card','yellow card','sent off',
    'upset','shock','surprise','underdog',
    'record','history','historic','first','first-ever',
    // CN: match-impact only (no gossip)
    '伤病','受伤','缺阵','缺席','报销','退队','落选',
    '阵容','首发','替补','换人','战术','阵型','变阵',
    '进球','帽子','梅开','独造','破门','得分','大胜','惨败',
    '表现','状态','低迷','火热','闪耀','顶级',
    '复出','回归','恢复','痊愈','解禁',
    '红牌','黄牌','停赛','禁赛',
    '纪录','历史','首次','创造历史',
    '关键','决定性','致命',
  ];
  // Non-match-factors (fluff, betting, broadcast, gossip) — keep out of AI predictions
  const JUNK_KW = [
    // EN
    'how to watch','watch on tv','tv schedule','broadcast','free-to-air','live stream',
    'betting','odds','favourites','favorites','predictions game','tipping',
    'quiz','guess who','vote','poll','pick your','fans choose','fantasy',
    'sponsor','advertisement','promoted','partner content',
    'tickets','travel guide','where to stay','fan zone',
    'girlfriend','wife','wag','dating','married','divorce',
    'instagram','tweeted','viral','trending',
    'fashion','hairstyle','tattoo','car','watch','jewelry',
    // CN: fluff/gossip + expired qualifier news
    '如何观看','转播','直播平台','收视','彩票','赔率','竞猜','投票',
    '赞助','广告','推广','门票','旅游','球迷区',
    '女友','妻子','约会','离婚','婚礼','恋情',
    '穿搭','发型','纹身','豪车','名表','珠宝',
    '发了','推特','热搜','网红',
    '美食','旅游','度假','派对','旅行者','旅行须知','游客','文化','可乐','汉堡','披萨',
    '酒吧','夜生活','购物','纪念品','拍照','打卡','地标','景点',
    'VPN','网络','SIM卡','wifi','流量','漫游',
    '护照','入境','海关','货币','汇率','时差','语言','翻译',
    '附加赛','预选赛','资格赛','出线','热身赛','友谊赛',
  ];

  // Simple Google Translate (free, no key)
  function cleanText(t) {
    return (t || '').replace(/�/g, '').replace(/[​‌‍﻿]/g, '').replace(/^[^一-鿿A-Za-z0-9一-鿿]+/g, '').trim();
  }
  async function translateToChinese(text) {
    var cleaned = cleanText(text);
    if (!cleaned) return text;
    // Skip if already mostly Chinese
    const cjk = (cleaned.match(/[一-鿿]/g) || []).length;
    if (cjk > cleaned.length * 0.3) return cleaned;
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(cleaned)}`;
      const resp = await new Promise((resolve, reject) => {
        https.get(url, { timeout: 5000 }, res => {
          let b = ''; res.on('data', c => b += c);
          res.on('end', () => resolve(b));
        }).on('error', reject);
      });
      const parsed = JSON.parse(resp);
      if (parsed && parsed[0]) {
        var result = parsed[0].map(p => p[0]).join('');
        return cleanText(result) || text;
      }
    } catch(e) { /* keep original on error */ }
    return cleaned || text;
  }

  const seen = new Set();
  const generalNewsRaw = rssItems.filter(t => { const k = t.slice(0,50); if (seen.has(k)) return false; seen.add(k); return true; })
    .filter(t => {
      const tl = t.toLowerCase();
      const isRelevant = RELEVANT_KW.some(k => tl.includes(k));
      const isJunk = JUNK_KW.some(k => tl.includes(k));
      return isRelevant && !isJunk;
    })
    .slice(0, 80).map(t => {
      const tl = t.toLowerCase();
      return t;
    });

  // Translate all non-Chinese news to Chinese (with delay to avoid rate-limit)
  const generalNews = [];
  for (const item of generalNewsRaw) {
    const translated = await translateToChinese(item);
    generalNews.push(translated);
    await new Promise(r => setTimeout(r, 200)); // 200ms delay
  }

  // Generate match result news for ALL teams with scores (guarantees 100% coverage)
  const teamNews = {};
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
    var hNews = '上轮' + hResult + ' ' + at.cn + ' ' + gf + '-' + ga;
    var aNews = '上轮' + aResult + ' ' + ht.cn + ' ' + ga + '-' + gf;
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
  // Match teams using RAW (untranslated) titles — pick PRIMARY team only
  // Avoid cross-assignment: "Mexico police shoot drone at Korea camp" → only Korea
  generalNewsRaw.forEach((rawItem, i) => {
    const text = rawItem.toLowerCase();
    const translatedItem = generalNews[i]; // Chinese version for display
    // Also check Chinese version for outdated qualifier news
    const cnText = translatedItem.toLowerCase();

    // Skip outdated qualifier/pre-tournament news
    const EXPIRED_KW = ['附加赛','预选赛','资格赛','出线','晋级之路','热身赛','友谊赛',
      'qualifying','qualifier','playoff','warm-up','friendly','preview','preview:',
    ];
    if (EXPIRED_KW.some(k => cnText.includes(k.toLowerCase()))) return;

    // Non-football country context: if article is about military/police/government
    // NOT about the football team, exclude that country's team
    var NON_FOOTBALL_CTX = ['军方','警方','警察','军队','政府','外交部','总统','总理',
      'military','police','army','government','president','prime minister','authorities',
      'customs','visa','embassy','领事','大使馆','签证',
    ];
    // But if training camp/stadium/team context present, it IS football-related
    var FOOTBALL_CTX = ['训练','training','camp','stadium','球场','体育场','更衣室','locker','球队','team',
      'squad','阵容','fifa','world cup','世界杯','教练','coach','manager',
    ];
    var isFootCtx = FOOTBALL_CTX.some(function(k){ return text.includes(k.toLowerCase()) || cnText.includes(k.toLowerCase()); });
    var hasNonFootCtx = !isFootCtx && NON_FOOTBALL_CTX.some(function(k){ return text.includes(k.toLowerCase()) || cnText.includes(k.toLowerCase()); });

    // Country name + non-football modifier = country, not team. e.g. "墨西哥军方" ≠ "墨西哥队"
    var COUNTRY_NON_FOOT = ['军方','警方','警察','军队','政府','外交部','总统','总理',
      'military','police','army','government','authorities','president','minister',
    ];
    function isCountryContext(tid) {
      var team = TEAMS[tid];
      if (!team) return false;
      var countryNames = [team.cn, team.name, team.name.toLowerCase()];
      for (var ci = 0; ci < countryNames.length; ci++) {
        for (var ni = 0; ni < COUNTRY_NON_FOOT.length; ni++) {
          // Check raw English text and Chinese text for "country + non-football" adjacency
          var pattern1 = countryNames[ci] + COUNTRY_NON_FOOT[ni]; // "墨西哥军方"
          var pattern2 = COUNTRY_NON_FOOT[ni] + ' ' + countryNames[ci]; // "Mexican military"
          if (text.includes(pattern1.toLowerCase()) || text.includes(pattern2.toLowerCase()) ||
              cnText.includes(pattern1) || cnText.includes(pattern2)) {
            return true;
          }
        }
      }
      return false;
    }

    // Find all matching teams with hit counts
    var candidates = [];
    Object.keys(TEAM_KEYWORDS).forEach(tid => {
      var kws = TEAM_KEYWORDS[tid];
      var hits = kws.filter(kw => text.includes(kw.toLowerCase())).length;
      if (hits === 0) return;
      // Exclude team if country name is used in non-football governmental context
      // AND no football-specific keywords (player names, etc.) are present
      if (hasNonFootCtx || isCountryContext(tid)) {
        var footballKws = kws.filter(function(k){ return k.length > 10 || k.indexOf(' ') >= 0; });
        if (footballKws.length === 0 || !footballKws.some(function(k){ return text.includes(k.toLowerCase()); })) {
          return; // country name only, not the football team
        }
      }
      candidates.push({tid: tid, hits: hits});
    });
    if (candidates.length === 0) return;

    // Pick team with most keyword hits; tie-break: first mentioned in title
    candidates.sort((a,b) => b.hits - a.hits);
    if (candidates.length > 1 && candidates[0].hits === candidates[1].hits) {
      // Tie: sort by first appearance position in text
      candidates.sort((a,b) => {
        var posA = text.indexOf(TEAM_KEYWORDS[a.tid][0].toLowerCase());
        var posB = text.indexOf(TEAM_KEYWORDS[b.tid][0].toLowerCase());
        return (posA >= 0 ? posA : 999) - (posB >= 0 ? posB : 999);
      });
    }
    var bestTid = candidates[0].tid;
    if (!teamNews[bestTid]) teamNews[bestTid] = [];
    if (teamNews[bestTid].length < 3) teamNews[bestTid].push(translatedItem);
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
    if (teamNews[m.home].length < 2) teamNews[m.home].push('上轮' + hResult + ' ' + at.cn + ' ' + gf + '-' + ga);
    if (teamNews[m.away].length < 2) teamNews[m.away].push('上轮' + aResult + ' ' + ht.cn + ' ' + ga + '-' + gf);
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
  // Get match dates from scores + next 5 days for odds mapping
  const matchIds = Object.keys(scores).filter(k => k.match(/^m\d+$/));
  const dates = [...new Set(matchIds.map(mid => {
    const m = getMatchSchedule().find(x => x.id === mid);
    return m ? m.date : null;
  }).filter(Boolean))];
  // Also add next 5 days for upcoming fixture IDs (needed by updateOdds)
  for (let d = 0; d < 5; d++) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    dates.push(dt.toISOString().slice(0, 10));
  }

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
        if (!existing[mid]) existing[mid] = {};
        existing[mid].fixtureId = fid;
        n++;
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
