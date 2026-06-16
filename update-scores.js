#!/usr/bin/env node
/**
 * Auto-update WC data from FiroAPI (500 calls/day)
 *
 * Outputs:
 *   scores.json     — match results
 *   odds.json       — latest odds (HAD/HHAD/HAFU/TTG/CRS)
 *   match-info.json — history, injuries, features, standings
 *
 * Usage:
 *   node update-scores.js              # update all
 *   node update-scores.js --scores     # scores only
 *   node update-scores.js --odds       # odds only
 *   node update-scores.js --info       # match-info only
 *   node update-scores.js --watch      # auto every 3h
 *
 * Cron (recommended):
 *   # Scores: 4x/day after matches (00:00, 06:00, 12:00, 18:00 UTC+8)
 *   0 0,6,12,18 * * * node update-scores.js --scores
 *   # Odds: 1x/day at 10:00
 *   0 10 * * * node update-scores.js --odds
 *   # Info: 2x/day at 08:00, 20:00
 *   0 8,20 * * * node update-scores.js --info
 */
// 每天消耗:
//   scores 4 + odds ~16 + info ~8 + list 0.5 = ~29次/天，500额度安全

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

// ========== CONFIG ==========
const API_KEY = process.env.FIRO_API_KEY || '8YBEztjVsPeG7cTNV5m3bPfUU1GHVqLr';
const PRIVATE_KEY_B64 = process.env.FIRO_PRIVATE_KEY || 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClBYzHcspDIKxOE56o1S4+cYgkkS2oenFZUPIPzNuVKpZpRoyvFNlMOO1Jgnzl63TiNyeIoyay+TNs1HOpau5jkO6el8QLBMF7c7/sLjcVM75tblf9lzwvBxrubGm+Q7chNhfFKiPQfcldVEqjRSNwbZa8bQiTVNgCV+qUJqxyWhA2WjlRN1+XVT2yDq6VkYJfkiBkIMuuSUaPVJ9LK97j926gdE//9KyOrR7cqWfT1MRMBH43tZHJ5czlP5RVl/DDcGUg6aoWTlYOIGDYREIi92/zFeAZl836iSYjKJrdDTYS7zAZ+NJipcGzX4TInfXg64EhElDbW0p0rhYqAIn5AgMBAAECggEAHuvDTTv9GkbtAlQ6znfjil/Lms55N7B5vLqmIL/KBVFNjbxicAwAC4A/Nh71OD++TwT2q2umvLJlKGdGpOAcexuVGrJlUYs6ld9CfwbJ23cun2KlqibEaCt0qGg4CCa4EckI+zDCNTbcnFhHBADYeyCNthDYIoMrVoUSt1/nwCVCx65hHHu4Le0G8Rg4Xek/rfOf7fMZxTm6fERWizRioiR6cs2Sr5ESUSYpu1w+024ikx8IsSmZRuX5Qxu0hIHHi/olfj/9poLfONS93cA4iWqDEBUmFaEh504fojLWGHtxeg0jjbKKjD+AdbTWCkJ6g3xIIuV6oN6Orj5Bf8cq4QKBgQDfmlr6dv9l8DeLTaOsh9ui+IqQJEAKzCbOpy3/mO4jIT6VlBG+F6+bnpo8zxaZSE2UhPN0LtYaN07rv0IfQKBPoaEy9vhuyl/qCLNIf99qd8FOdVoVUiFk+Cy7GGJ6f1mxSvnF+eoE+1w200ec7yP4TjBtDx8aTRUc31ajU5g1EwKBgQC87lwfcGHnxgcUqXr87Cep4l/U7Zg2SUuq+1rEEBMVhDMqSGx2SEEGN8bwso5s0k3bh6iO80+n7VSqlyB86nmhLcgpJlNhhPUj5af+cXM4h/VUIwDgEYbuQOayakjfQSaNgXELgSkl0dBdkhlUGwIleZKkrm9YchB8XjPuSs2CQwKBgQCsMyxTbWc88yVjg5REH5CXTn8viKtFZXmRdpBnIjhrF4QiH5kWYxlbaGZx5C4MN/F/KnBvDk7We7esuGtMtDGBggEpxacHc5UwICkp8Uh2rulQ6fFJMCoFn1abc6kLm53QeuQmglOmKIoYsteY1VZHOLf0lUunrqtOw/Tt7UfvvwKBgBx+Zm5naJyoBRFcrivPAfxhI8rdOoOVclALMJk5Q2ePVJgf7Bu6sfPaHarXgxtubEebohRNJcpRxN8lg8TTKBzi5rkuCo0+nCoZzMhXG+V+u8VAsjUY75ynNSPbW7ov/TyCNSZjCG2nwyEZk7BXkm9Mco1bsXdJXKslGffqWCw5AoGAA/Lfb6mQ3B3RBbj7jWV5JDZSGWjTvw5z0MtQJg5MHRCu7AFpeQCHfncRTb/oMOaSn5EqGqjwNvZNJAJqif3KzFtwb0BdmQeBNtt9QaVgVUnjrWQU4erBOMaEOQpH7xVeFHeBt0tpTpAeVUh9ZCqUfxQSbhFrJ3XNvR/Q0XHIsKo=';

const BASE_DIR = __dirname;
const SCORES_FILE = path.join(BASE_DIR, 'scores.json');
const ODDS_FILE = path.join(BASE_DIR, 'odds.json');
const INFO_FILE = path.join(BASE_DIR, 'match-info.json');

// Team name → our ID
const TEAM_MAP = {
  // Chinese
  '墨西哥':'MEX','南非':'RSA','韩国':'KOR','捷克':'CZE',
  '加拿大':'CAN','波黑':'BIH','卡塔尔':'QAT','瑞士':'SUI',
  '巴西':'BRA','摩洛哥':'MAR','海地':'HAI','苏格兰':'SCO',
  '美国':'USA','巴拉圭':'PAR','澳大利亚':'AUS','土耳其':'TUR',
  '德国':'GER','库拉索':'CUW','科特迪瓦':'CIV','厄瓜多尔':'ECU',
  '荷兰':'NED','日本':'JPN','瑞典':'SWE','突尼斯':'TUN',
  '比利时':'BEL','埃及':'EGY','伊朗':'IRN','新西兰':'NZL',
  '西班牙':'ESP','佛得角':'CPV','沙特阿拉伯':'KSA','乌拉圭':'URU',
  '法国':'FRA','塞内加尔':'SEN','伊拉克':'IRQ','挪威':'NOR',
  '阿根廷':'ARG','阿尔及利亚':'ALG','奥地利':'AUT','约旦':'JOR',
  '葡萄牙':'POR','刚果(金)':'COD','乌兹别克斯坦':'UZB','哥伦比亚':'COL',
  '英格兰':'ENG','克罗地亚':'CRO','加纳':'GHA','巴拿马':'PAN',
  '捷克共和国':'CZE','刚果':'COD','沙特':'KSA','韩国(南韩)':'KOR',
  // English (API returns English names)
  'Mexico':'MEX','South Africa':'RSA','South Korea':'KOR','Czech Republic':'CZE','Czechia':'CZE',
  'Canada':'CAN','Bosnia and Herzegovina':'BIH','Qatar':'QAT','Switzerland':'SUI',
  'Brazil':'BRA','Morocco':'MAR','Haiti':'HAI','Scotland':'SCO',
  'United States':'USA','Paraguay':'PAR','Australia':'AUS','Turkey':'TUR','Türkiye':'TUR',
  'Germany':'GER','Curacao':'CUW','Curaçao':'CUW','Ivory Coast':'CIV',"Côte d'Ivoire":'CIV','Ecuador':'ECU',
  'Netherlands':'NED','Japan':'JPN','Sweden':'SWE','Tunisia':'TUN',
  'Belgium':'BEL','Egypt':'EGY','Iran':'IRN','New Zealand':'NZL',
  'Spain':'ESP','Cape Verde':'CPV','Saudi Arabia':'KSA','Uruguay':'URU',
  'France':'FRA','Senegal':'SEN','Iraq':'IRQ','Norway':'NOR',
  'Argentina':'ARG','Algeria':'ALG','Austria':'AUT','Jordan':'JOR',
  'Portugal':'POR','DR Congo':'COD','Uzbekistan':'UZB','Colombia':'COL',
  'England':'ENG','Croatia':'CRO','Ghana':'GHA','Panama':'PAN',
  'Korea Republic':'KOR','Congo DR':'COD','United States of America':'USA',
};

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

// Get WC match IDs from sports-lottery/list
async function getWCMatches() {
  const resp = await apiGet('/firo/sports-lottery/list');
  if (resp.code !== 200) throw new Error('list API failed');
  return (resp.data || []).filter(m => m.matchMain?.leagueName === '世界杯');
}

// Map API team name to our team ID
function mapTeam(apiName) {
  return TEAM_MAP[apiName] || TEAM_MAP[apiName?.replace('(南韩)','').trim()] || null;
}

// Find our matchId from home+away team names
function findOurMatchId(homeName, awayName, lookup) {
  const hid = mapTeam(homeName), aid = mapTeam(awayName);
  if (!hid || !aid) return null;
  return lookup[hid + '-' + aid] || null;
}

function loadMatchLookup() {
  const sched = getMatchSchedule();
  const lookup = {};
  sched.forEach(m => { if (m.home !== '?' && m.away !== '?') lookup[m.home + '-' + m.away] = m.id; });
  return lookup;
}

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

// ========== UPDATE FUNCTIONS ==========

async function updateScores() {
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  // 用北京时间，因为赛程日期是BJT
  const todayStr = now.toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);

  // Pre-check: skip if no matches today
  const sched = getMatchSchedule();
  const todayMatches = sched.filter(m => m.date === todayStr);
  if (todayMatches.length === 0) {
    const futureMatches = sched.filter(m => m.date > todayStr);
    const nextDate = futureMatches.length > 0 ? futureMatches[0].date : 'none';
    console.log(`[${ts}] Rest day — no matches. Next: ${nextDate}. Skipping.`);
    return false;
  }

  // Pre-check: skip if no matches have ended yet, or all ended matches already scored
  const existing = loadJSON(SCORES_FILE);
  let endedCount = 0, scoredCount = 0;
  todayMatches.forEach(m => {
    if (!m.time) return;
    const [h, min] = m.time.split(':').map(Number);
    const kickoff = new Date(m.date + 'T' + String(h).padStart(2,'0') + ':' + String(min||0).padStart(2,'0') + ':00+08:00');
    const endTime = new Date(kickoff.getTime() + 135 * 60000); // ~2h15m for match
    if (now > endTime) {
      endedCount++;
      if (existing[m.id]) scoredCount++;
    }
  });
  if (endedCount === 0) {
    console.log(`[${ts}] No matches ended yet (today: ${todayMatches.length}). Skipping.`);
    return false;
  }
  if (scoredCount === endedCount && endedCount > 0) {
    console.log(`[${ts}] All ${endedCount} ended matches already scored. Skipping.`);
    return false;
  }

  const lookup = loadMatchLookup();

  let allMatches = [];
  // Fetch today + yesterday (BJT)
  for (let off = 0; off <= 1; off++) {
    const d = new Date(now.getTime() - off * 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
    try {
      const resp = await apiGet('/firo/tsd/soccer-events', { date: d, isJc: 1 });
      if (resp.code === 200 && resp.data?.matches) {
        allMatches = allMatches.concat(resp.data.matches);
      }
    } catch(e) {}
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
    const s = { homeScore: parseInt(m.intHomeScore), awayScore: parseInt(m.intAwayScore), recordedAt: now.toISOString() };
    if (!existing[mid]) { existing[mid] = s; n++; }
    else if (existing[mid].homeScore !== s.homeScore || existing[mid].awayScore !== s.awayScore) { existing[mid] = s; u++; }
  });

  saveJSON(SCORES_FILE, existing);
  console.log(`[${ts}] Scores: ${n} new, ${u} updated (total: ${Object.keys(existing).length})`);
}

async function updateOdds() {
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const tomorrow = new Date(now.getTime() + 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);

  // Skip if no matches tomorrow
  const sched = getMatchSchedule();
  if (!sched.some(m => m.date === tomorrow)) {
    console.log(`[${ts}] No matches tomorrow. Skipping odds update.`);
    return false;
  }

  const existing = loadJSON(ODDS_FILE);
  const lookup = loadMatchLookup();

  let wcMatches;
  try { wcMatches = await getWCMatches(); } catch(e) { console.error('list API failed:', e.message); return; }

  // Only fetch odds for tomorrow's matches
  const targets = wcMatches.filter(m => m.matchMain?.matchDate === tomorrow);

  let n = 0;
  for (const m of targets) {
    const mm = m.matchMain;
    const mid = findOurMatchId(mm.homeTeamName, mm.awayTeamName, lookup);
    if (!mid) continue;

    try {
      const resp = await apiGet('/firo/sports-lottery/odds', { matchId: String(mm.matchId) });
      if (resp.code !== 200) continue;
      const data = resp.data;
      // Keep only the latest snapshot for each odds type
      existing[mid] = {
        homeTeam: mm.homeTeamName, awayTeam: mm.awayTeamName,
        matchDate: mm.matchDate, matchTime: mm.matchTime,
        apiMatchId: mm.matchId,
        updatedAt: now.toISOString(),
        had: data.hadOddsList?.[0] || null,
        hhad: data.hhadOddsList?.[0] || null,
        hafu: data.hafuOddsList?.[0] || null,
        ttg: data.ttgOddsList?.[0] || null,
        crs: data.crsOddsList?.[0] || null,
      };
      n++;
    } catch(e) {}
    await new Promise(r => setTimeout(r, 200)); // rate limit
  }

  saveJSON(ODDS_FILE, existing);
  // Also generate JS module for mini-program
  const jsContent = '// Auto-generated by update-scores.js — DO NOT EDIT\n// Last updated: ' + now.toISOString() + '\nmodule.exports = ' + JSON.stringify(existing, null, 2) + ';\n';
  fs.writeFileSync(path.join(BASE_DIR, 'mini-program-worldcup/utils/odds-data.js'), jsContent);
  console.log(`[${ts}] Odds: ${n} matches updated (total: ${Object.keys(existing).length})`);
}

async function updateInfo() {
  const now = new Date();
  const ts = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const today = now.toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);
  const tmr = new Date(now.getTime() + 86400000).toLocaleString('en-CA', { timeZone: 'Asia/Shanghai' }).slice(0, 10);

  // Skip if no matches today or tomorrow
  const sched = getMatchSchedule();
  if (!sched.some(m => m.date === today || m.date === tmr)) {
    console.log(`[${ts}] No matches today/tomorrow. Skipping info update.`);
    return false;
  }

  const existing = loadJSON(INFO_FILE);
  const lookup = loadMatchLookup();

  let wcMatches;
  try { wcMatches = await getWCMatches(); } catch(e) { console.error('list API failed:', e.message); return; }

  // Focus on today and tomorrow's matches for news/intel
  const targets = wcMatches.filter(m => {
    const d = m.matchMain?.matchDate;
    return d === today || d === tmr;
  });

  let n = 0;
  for (const m of targets) {
    const mm = m.matchMain;
    const mid = findOurMatchId(mm.homeTeamName, mm.awayTeamName, lookup);
    if (!mid) continue;

    try {
      const resp = await apiGet('/firo/sports-lottery/football-info', { matchId: String(mm.matchId) });
      if (resp.code !== 200) continue;
      const data = resp.data;

      // Extract key info
      const info = {
        homeTeam: mm.homeTeamName, awayTeam: mm.awayTeamName,
        matchDate: mm.matchDate, matchTime: mm.matchTime,
        apiMatchId: mm.matchId,
        updatedAt: now.toISOString(),
        history: data.history || null,
        feature: data.feature || null,
        injuries: data.injuries || [],
        recentForm: { home: data.result || null, away: null },
        standings: data.tables || null,
        futureDetails: (data.futureDetails || []).slice(0, 5),
      };

      // Merge with existing (keep older injury data if new is empty)
      if (existing[mid]) {
        if (!info.injuries.length) info.injuries = existing[mid].injuries || [];
        Object.assign(existing[mid], info);
      } else {
        existing[mid] = info;
      }
      n++;
    } catch(e) {}
    await new Promise(r => setTimeout(r, 200));
  }

  saveJSON(INFO_FILE, existing);
  // Also generate JS module for mini-program
  const infoJS = '// Auto-generated by update-scores.js — DO NOT EDIT\n// Last updated: ' + now.toISOString() + '\nmodule.exports = ' + JSON.stringify(existing, null, 2) + ';\n';
  fs.writeFileSync(path.join(BASE_DIR, 'mini-program-worldcup/utils/info-data.js'), infoJS);
  console.log(`[${ts}] Info: ${n} matches updated (total: ${Object.keys(existing).length})`);
}

async function updateAll() {
  // Batch all updates, respecting rate limits
  await updateScores();
  await new Promise(r => setTimeout(r, 500));
  await updateOdds();
  await new Promise(r => setTimeout(r, 500));
  await updateInfo();

  // Show usage
  try {
    const r = await apiGet('/firo/basic/usage/remaining');
    if (r.code === 200) console.log(`API: ${r.data.usedCount}/${r.data.totalLimit} used (${r.data.remainingCount} left)`);
  } catch(e) {}
}

// ========== CLI ==========
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

async function main() {
  if (args.includes('--scores')) await updateScores();
  else if (args.includes('--odds')) await updateOdds();
  else if (args.includes('--info')) await updateInfo();
  else await updateAll();
}

if (watchMode) {
  console.log('Auto-update every 3h');
  main().then(() => setInterval(main, 3 * 3600000));
} else {
  main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
