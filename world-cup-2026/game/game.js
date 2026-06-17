/**
 * 2026 Road to World Cup
 * 纯代码 UI - 黑金极简风格
 */
const c = wx.createCanvas();
const ctx = c.getContext('2d');
const S = wx.getSystemInfoSync();
const W = S.windowWidth, H = S.windowHeight;
c.width = W * S.pixelRatio; c.height = H * S.pixelRatio;
ctx.scale(S.pixelRatio, S.pixelRatio);

// ====== 安全区域 (刘海屏适配) ======
const SAFE_TOP = 44;

// ====== 设计系统 ======
const DS = {
  bg: '#0a0a0f',
  card: '#12121f',
  gold: '#c8963e',
  goldL: '#e8c96a',
  white: '#e0e0e0',
  dim: '#666',
  red: '#d44040',
  green: '#2d8a2d',
  radius: 14,
  gap: 16,
  font: (s, w) => `${w || ''} ${s}px -apple-system, sans-serif`,
};
const SZ = { title: 28, h1: 22, h2: 18, body: 15, sm: 13, xs: 11 };

// ====== 绘制函数 ======
function rect(x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath(); ctx.fill();
}
function txt(t, x, y, s, color, align) {
  ctx.font = DS.font(s || SZ.body, '');
  ctx.fillStyle = color || DS.white;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(t, x, y);
}
function tC(t, x, y, s, c) { txt(t, x, y, s, c, 'center'); }
function tR(t, x, y, s, c) { txt(t, x, y, s, c, 'right'); }
function btn(id, x, y, w, h, label, primary) {
  const cl = primary ? DS.gold : 'rgba(255,255,255,0.08)';
  const tc = primary ? '#000' : DS.white;
  rect(x, y, w, h, DS.radius, cl);
  tC(label, x + w / 2, y + h / 2 - SZ.body / 2, SZ.body, tc);
  G.btns.push({ id, x, y, w, h });
}
function line(y, color) {
  ctx.strokeStyle = color || 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(DS.gap, y); ctx.lineTo(W - DS.gap, y); ctx.stroke();
}

// ====== 游戏状态 ======
// 奖杯图片
const trophyImg = wx.createImage();
trophyImg.src = 'assets/trophy.png';

const G = {
  screen: 'home', user: null, all: [], form: '4-3-3', slots: null, sel: -1, mentality: 'balanced',
  scrollY: 0, touchStartY: 0,
  standingsTab: 0,  // 0=本组积分, 1=全部小组, 2=射手榜
  // 比赛
  opp: null, gh: 0, ga: 0, shg: 0, sag: 0, ev: [], allEv: [], shownIdx: 0, btns: [], isEt: false, isPen: false, penH: 0, penA: 0, matchDone: false,
  // 赛事系统
  phase: 'group',           // 'group' | 'knockout' | 'champion'
  groupMatches: [],         // [{opp, hg, ag, played}]
  groupStandings: [],       // [{team, pts, gf, ga}]
  koRound: 0,              // 0=round32, 1=round16, 2=quarter, 3=semi, 4=final
  koOpponent: null,
  tournamentOver: false,
};
let ripple = null;

// ====== 球队实力分 (基于FIFA排名) ======
function teamPower(t) {
  const pts = t.players.reduce((s,p) => s + p.attributes.attack + p.attributes.defense, 0) / (t.players.length || 1);
  return Math.round(pts * 2 + (100 - t.fifaRank) * 0.3);
}

// ====== 小组赛初始化 ======
// 真实2026世界杯小组赛对阵 (每队3轮对手 + 每轮另外两队的对阵)
// 格式: teamId → { opp: [3轮对手id], other: [[每轮另两队id]] }
const REAL_SCHEDULE = {};
function buildSchedule(g, t1, t2, t3, t4) {
  // 标准轮转: 1vs2/3vs4, 1vs3/2vs4, 1vs4/2vs3
  REAL_SCHEDULE[t1] = { order: [t2, t3, t4], other: [[t3, t4], [t2, t4], [t2, t3]] };
  REAL_SCHEDULE[t2] = { order: [t1, t4, t3], other: [[t3, t4], [t1, t3], [t1, t4]] };
  REAL_SCHEDULE[t3] = { order: [t4, t1, t2], other: [[t1, t2], [t4, t2], [t4, t1]] };
  REAL_SCHEDULE[t4] = { order: [t3, t2, t1], other: [[t1, t2], [t3, t1], [t3, t2]] };
}
buildSchedule('A','mexico','south-africa','south-korea','czech-republic');
buildSchedule('B','canada','bosnia','qatar','switzerland');
buildSchedule('C','brazil','morocco','haiti','scotland');
buildSchedule('D','united-states','paraguay','australia','turkey');
buildSchedule('E','germany','curacao','ivory-coast','ecuador');
buildSchedule('F','netherlands','japan','sweden','tunisia');
buildSchedule('G','belgium','egypt','iran','new-zealand');
buildSchedule('H','spain','cape-verde','saudi-arabia','uruguay');
buildSchedule('I','france','senegal','iraq','norway');
buildSchedule('J','argentina','algeria','austria','jordan');
buildSchedule('K','portugal','dr-congo','uzbekistan','colombia');
buildSchedule('L','england','croatia','ghana','panama');

function initGroupStage() {
  if (!G.user) return;
  const sch = REAL_SCHEDULE[G.user.id] || { order: [], other: [] };
  // 按真实赛程排对手 (依用户具体球队)
  G.groupMatches = sch.order.map(id => {
    const opp = G.all.find(t => t.id === id);
    return { opp, hg: 0, ag: 0, played: false };
  });
  // 同时进行的其他比赛
  G._otherMatches = sch.other.map(([aId, bId]) => ({
    a: G.all.find(t => t.id === aId), b: G.all.find(t => t.id === bId)
  }));
  G.groupStandings = [G.user, ...G.groupMatches.map(m => m.opp)].map(t => ({ team: t, pts: 0, gf: 0, ga: 0, played: 0, won: 0, drawn: 0, lost: 0 }));
  G.phase = 'group';
  G.tournamentOver = false;
}

function simOtherMatch(matchIdx) {
  if (!G._otherMatches || matchIdx >= G._otherMatches.length) return;
  const m = G._otherMatches[matchIdx];
  const r = simMatchScore(m.a, m.b);
  // 生成进球者
  const pickP = (team) => { const f = team.players.filter(p => ['ST','CF','LW','RW','CAM'].includes(p.position)); return f.length ? f[Math.floor(Math.random()*f.length)] : team.players[0]; };
  const aScorers = [], bScorers = [];
  for (let i = 0; i < r.hg; i++) { const s = pickP(m.a); if (s) aScorers.push(s.name); }
  for (let i = 0; i < r.ag; i++) { const s = pickP(m.b); if (s) bScorers.push(s.name); }
  // 红牌
  const reds = [];
  if (Math.random() < 0.08) { const p = m.a.players[Math.floor(Math.random()*11)]; if (p) reds.push(p.name + ' (主)'); }
  if (Math.random() < 0.08) { const p = m.b.players[Math.floor(Math.random()*11)]; if (p) reds.push(p.name + ' (客)'); }
  m._score = { hg: r.hg, ag: r.ag, aScorers, bScorers, reds };
  const sa = G.groupStandings.find(s => s.team.id === m.a.id);
  const sb = G.groupStandings.find(s => s.team.id === m.b.id);
  if (sa && sb) {
    sa.gf += r.hg; sa.ga += r.ag; sb.gf += r.ag; sb.ga += r.hg;
    sa.played = (sa.played||0)+1; sb.played = (sb.played||0)+1;
    if (r.hg > r.ag) { sa.pts += 3; sa.won = (sa.won||0)+1; sb.lost = (sb.lost||0)+1; }
    else if (r.ag > r.hg) { sb.pts += 3; sb.won = (sb.won||0)+1; sa.lost = (sa.lost||0)+1; }
    else { sa.pts += 1; sb.pts += 1; sa.drawn = (sa.drawn||0)+1; sb.drawn = (sb.drawn||0)+1; }
  }
}

function findNextGroupMatch() {
  return G.groupMatches.find(m => !m.played);
}

function simMatchScore(home, away) {
  const hp = teamPower(home), ap = teamPower(away);
  const diff = (hp - ap) / 15;
  const hg = Math.max(0, Math.round(1.2 + diff + (Math.random() - 0.5) * 3));
  const ag = Math.max(0, Math.round(1.0 - diff + (Math.random() - 0.5) * 3));
  return { hg, ag };
}

// 模拟所有小组 (生成真实晋级球队)
function simulateAllGroups() {
  // 只统计到用户当前轮次 (0=未开赛, 1=第1轮后, 2=第2轮后, 3=全部)
  // 首次随机生成并缓存 (同一赛事期间不跳变)
  if (!G._matchCache) {
    G._matchCache = {};
    'ABCDEFGHIJKL'.split('').forEach(g => {
      G._matchCache[g] = {};
      const ts = G.all.filter(t => t.group === g);
      for (let a = 0; a < 4; a++) for (let b = a+1; b < 4; b++) {
        G._matchCache[g][ts[a].id+'_'+ts[b].id] = simMatchScore(ts[a], ts[b]);
      }
    });
  }
  const userRounds = G.groupMatches ? G.groupMatches.filter(m => m.played).length : 0;
  const allStandings = {};
  'ABCDEFGHIJKL'.split('').forEach(g => {
    const teams = G.all.filter(t => t.group === g);
    const standings = teams.map(t => ({ team: t, pts: 0, gf: 0, ga: 0, played: 0, won: 0, drawn: 0, lost: 0 }));
    // 生成该组轮次对阵
    let roundPairs;
    if (g === G.user?.group && G._otherMatches) {
      // 用户组: 使用真实赛程
      roundPairs = [];
      for (let r = 0; r < 3; r++) {
        const userOpp = G.groupMatches[r]?.opp;
        const om = G._otherMatches[r];
        if (userOpp && om) roundPairs.push([[G.user, userOpp], [om.a, om.b]]);
      }
    } else {
      // 其他组: 标准轮转
      roundPairs = [[[0,1],[2,3]], [[0,2],[1,3]], [[0,3],[1,2]]].map(r =>
        r.map(([a,b]) => [teams[a], teams[b]])
      );
    }
    for (let r = 0; r < userRounds && r < roundPairs.length; r++) {
      roundPairs[r].forEach(([ta, tb]) => {
        let hg, ag;
        if (g === G.user?.group && (ta.id === G.user.id || tb.id === G.user.id)) {
          const oppId = ta.id === G.user.id ? tb.id : ta.id;
          const um = G.groupMatches.find(m => m.opp.id === oppId);
          if (!um?.played) return;
          if (ta.id === G.user.id) { hg = um.hg; ag = um.ag; }
          else { hg = um.ag; ag = um.hg; }
        } else {
          const key = ta.id + '_' + tb.id;
          const key2 = tb.id + '_' + ta.id;
          const s = (G._matchCache[g] || {})[key] || (G._matchCache[g] || {})[key2] || simMatchScore(ta, tb);
          hg = s.hg; ag = s.ag;
        }
        const sa = standings.find(s => s.team.id === ta.id);
        const sb = standings.find(s => s.team.id === tb.id);
        if (!sa || !sb) return;
        sa.gf += hg; sa.ga += ag; sa.played++;
        sb.gf += ag; sb.ga += hg; sb.played++;
        if (hg > ag) { sa.pts += 3; sa.won++; sb.lost++; }
        else if (ag > hg) { sb.pts += 3; sb.won++; sa.lost++; }
        else { sa.pts++; sb.pts++; sa.drawn++; sb.drawn++; }
      });
    }
    standings.sort((a,b)=>{if(b.pts!==a.pts)return b.pts-a.pts;const gdA=a.gf-a.ga,gdB=b.gf-b.ga;if(gdB!==gdA)return gdB-gdA;return b.gf-a.gf;});
    allStandings[g] = standings;
  });
  return allStandings;
}

// 选出32强 (真实FIFA规则)
function getQualifiers(allStandings) {
  const groupWinners = {}, groupRunnersUp = {}, thirds = [];
  Object.entries(allStandings).forEach(([g, s]) => {
    groupWinners[g] = s[0].team;
    groupRunnersUp[g] = s[1].team;
    thirds.push({ ...s[2], group: g });
  });
  thirds.sort((a,b) => { if(b.pts!==a.pts)return b.pts-a.pts; const gdA=a.gf-a.ga,gdB=b.gf-b.ga; if(gdB!==gdA)return gdB-gdA; return b.gf-a.gf; });
  const bestThirds = thirds.slice(0, 8);
  return { groupWinners, groupRunnersUp, bestThirds };
}

// FIFA 2026 32强对阵表
const R32_MATCHUPS = [
  { match: 1, a: '1A', b: '3C/D/E/F' },
  { match: 2, a: '1B', b: '3A/E/F/G' },
  { match: 3, a: '1C', b: '3A/B/F/G' },
  { match: 4, a: '1D', b: '3B/C/E/F' },
  { match: 5, a: '1E', b: '3A/B/C/D' },
  { match: 6, a: '1F', b: '3C/D/E/G' },
  { match: 7, a: '1G', b: '3A/C/D/E' },
  { match: 8, a: '1H', b: '3B/D/F/G' },
  { match: 9, a: '1I', b: '3A/B/D/G' },
  { match: 10, a: '1J', b: '3C/E/F/G' },
  { match: 11, a: '1K', b: '3A/B/C/D' },
  { match: 12, a: '1L', b: '3E/F/G/H' },
  { match: 13, a: '2A', b: '2B' },
  { match: 14, a: '2C', b: '2D' },
  { match: 15, a: '2E', b: '2F' },
  { match: 16, a: '2G', b: '2H' },
  { match: 17, a: '2I', b: '2J' },
  { match: 18, a: '2K', b: '2L' },
];

// 16强对阵 (胜者编号)
const R16_MATCHUPS = [
  [1,2], [3,4], [5,6], [7,8], [9,10], [11,12], [13,14], [15,16]
];

// 查找用户对手
function findKnockoutOpponent(allStandings) {
  const { groupWinners, groupRunnersUp, bestThirds } = getQualifiers(allStandings);
  const userGroup = G.user.group;

  // 检查用户是否晋级: 小组第1、第2、还是最佳第3
  const gs = allStandings[userGroup];
  let userRank = -1, userType = '';
  for (let i = 0; i < 4; i++) { if (gs[i].team.id === G.user.id) { userRank = i; break; } }
  if (userRank === 0) userType = '1' + userGroup;
  else if (userRank === 1) userType = '2' + userGroup;
  else {
    const isBestThird = bestThirds.some(t => t.team.id === G.user.id);
    if (isBestThird) userType = '3' + userGroup;
  }
  if (!userType) return null; // 未晋级

  // 在R32对阵中找用户
  for (const m of R32_MATCHUPS) {
    if (m.a === userType) {
      // 找到对手: m.b 是 "3C/D/E/F" 这种格式
      const possible = m.b.split('/');
      for (const p of possible) {
        const g = p.slice(1); // 小组字母
        const ranked = p[0]; // 1, 2, or 3
        if (ranked === '1') return groupWinners[g];
        if (ranked === '2') return groupRunnersUp[g];
        if (ranked === '3') {
          const bt = bestThirds.find(t => t.group === g);
          if (bt) return bt.team;
        }
      }
      // 如果精确匹配不到，返回第一个可能的对手
      return G.all.find(t => t.id !== G.user.id && t.group !== userGroup);
    }
    if (m.b.includes(userType)) {
      if (m.a[0] === '1') return groupWinners[m.a.slice(1)];
      if (m.a[0] === '2') return groupRunnersUp[m.a.slice(1)];
      if (m.a[0] === '3') { const bt = bestThirds.find(t => t.group === m.a.slice(1)); if (bt) return bt.team; }
      return G.all.find(t => t.id !== G.user.id);
    }
  }
  return G.all.find(t => t.id !== G.user.id); // fallback
}

function updateStandings() {
  // 重置 + 重新计算 (用户比赛 + 已sim的其他比赛)
  const groupTeams = G.all.filter(t => t.group === G.user.group);
  G.groupStandings = groupTeams.map(t => ({ team: t, pts: 0, gf: 0, ga: 0, played: 0, won: 0, drawn: 0, lost: 0 }));
  // 用户比赛
  G.groupMatches.forEach(m => {
    if (!m.played) return;
    const us = G.groupStandings.find(s => s.team.id === G.user.id);
    const them = G.groupStandings.find(s => s.team.id === m.opp.id);
    if (us && them) {
      us.gf += m.hg; us.ga += m.ag; us.played = (us.played||0)+1; if(!us.won)us.won=0;if(!us.drawn)us.drawn=0;if(!us.lost)us.lost=0;
      them.gf += m.ag; them.ga += m.hg; them.played = (them.played||0)+1; if(!them.won)them.won=0;if(!them.drawn)them.drawn=0;if(!them.lost)them.lost=0;
      if (m.hg > m.ag) { us.pts += 3; us.won = (us.won||0)+1; them.lost = (them.lost||0)+1; }
      else if (m.hg < m.ag) { them.pts += 3; them.won = (them.won||0)+1; us.lost = (us.lost||0)+1; }
      else { us.pts += 1; them.pts += 1; us.drawn = (us.drawn||0)+1; them.drawn = (them.drawn||0)+1; }
    }
  });
  // 同轮其他比赛 (缓存结果)
  if (G._otherMatches) {
    G._otherMatches.forEach(m => {
      if (!m._score) return;
      const sa = G.groupStandings.find(s => s.team.id === m.a.id);
      const sb = G.groupStandings.find(s => s.team.id === m.b.id);
      if (sa && sb) {
        const { hg, ag } = m._score;
        sa.gf += hg; sa.ga += ag; sa.played = (sa.played||0)+1; if(!sa.won)sa.won=0;if(!sa.drawn)sa.drawn=0;if(!sa.lost)sa.lost=0;
        sb.gf += ag; sb.ga += hg; sb.played = (sb.played||0)+1; if(!sb.won)sb.won=0;if(!sb.drawn)sb.drawn=0;if(!sb.lost)sb.lost=0;
        if (hg > ag) { sa.pts += 3; sa.won++; sb.lost++; }
        else if (ag > hg) { sb.pts += 3; sb.won++; sa.lost++; }
        else { sa.pts += 1; sb.pts += 1; sa.drawn++; sb.drawn++; }
      }
    });
  }
  // 排名
  G.groupStandings.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

function checkGroupDone() {
  return G.groupMatches.every(m => m.played);
}

function initKnockout() {
  updateStandings();
  const allSt = simulateAllGroups();
  const opp = findKnockoutOpponent(allSt);
  if (opp && opp.id !== G.user?.id) {
    G.koOpponent = opp;
    G.koRound = 0;
    G.phase = 'knockout';
    G.tournamentOver = false;
    return true;
  } else {
    // 安全兜底：排除用户自己和同组球队
    const fallback = G.all.find(t => t.id !== G.user?.id && t.group !== G.user?.group);
    if (fallback) { G.koOpponent = fallback; G.koRound = 0; G.phase = 'knockout'; G.tournamentOver = false; return true; }
    G.phase = 'group'; G.tournamentOver = true;
    return false;
  }
}

// ====== 阵型 ======
const FRM = {
  '4-3-3': [{l:'GK',x:.5,y:.92,r:['GK']},{l:'LB',x:.12,y:.68,r:['LB','RB']},{l:'CB',x:.36,y:.74,r:['CB']},{l:'CB',x:.64,y:.74,r:['CB']},{l:'RB',x:.88,y:.68,r:['RB','LB']},{l:'CM',x:.26,y:.46,r:['CM','CDM','CAM']},{l:'CDM',x:.5,y:.52,r:['CDM','CM']},{l:'CM',x:.74,y:.46,r:['CM','CAM']},{l:'LW',x:.14,y:.18,r:['LW','RW','ST']},{l:'ST',x:.5,y:.1,r:['ST','CF']},{l:'RW',x:.86,y:.18,r:['RW','LW']}],
  '4-4-2': [{l:'GK',x:.5,y:.92,r:['GK']},{l:'LB',x:.12,y:.68,r:['LB']},{l:'CB',x:.36,y:.74,r:['CB']},{l:'CB',x:.64,y:.74,r:['CB']},{l:'RB',x:.88,y:.68,r:['RB']},{l:'LM',x:.12,y:.46,r:['LM','LW']},{l:'CM',x:.36,y:.48,r:['CM','CDM']},{l:'CM',x:.64,y:.48,r:['CM','CAM']},{l:'RM',x:.88,y:.46,r:['RM','RW']},{l:'ST',x:.33,y:.14,r:['ST','CF']},{l:'ST',x:.67,y:.14,r:['ST','CF']}],
  '4-2-3-1': [{l:'GK',x:.5,y:.92,r:['GK']},{l:'LB',x:.12,y:.68,r:['LB']},{l:'CB',x:.36,y:.74,r:['CB']},{l:'CB',x:.64,y:.74,r:['CB']},{l:'RB',x:.88,y:.68,r:['RB']},{l:'CDM',x:.33,y:.54,r:['CDM','CM']},{l:'CDM',x:.67,y:.54,r:['CDM','CM']},{l:'LW',x:.16,y:.28,r:['LW','RW']},{l:'CAM',x:.5,y:.3,r:['CAM','CM']},{l:'RW',x:.84,y:.28,r:['RW','LW']},{l:'ST',x:.5,y:.1,r:['ST','CF']}],
  '3-5-2': [{l:'GK',x:.5,y:.92,r:['GK']},{l:'CB',x:.2,y:.72,r:['CB']},{l:'CB',x:.5,y:.78,r:['CB']},{l:'CB',x:.8,y:.72,r:['CB']},{l:'LWB',x:.08,y:.52,r:['LB','LM','LW']},{l:'CM',x:.3,y:.48,r:['CM','CDM']},{l:'CM',x:.5,y:.42,r:['CM','CAM']},{l:'CM',x:.7,y:.48,r:['CM','CDM']},{l:'RWB',x:.92,y:.52,r:['RB','RM','RW']},{l:'ST',x:.35,y:.14,r:['ST','CF']},{l:'ST',x:.65,y:.14,r:['ST','CF']}],
  '3-4-3': [{l:'GK',x:.5,y:.92,r:['GK']},{l:'CB',x:.2,y:.72,r:['CB']},{l:'CB',x:.5,y:.78,r:['CB']},{l:'CB',x:.8,y:.72,r:['CB']},{l:'LM',x:.1,y:.48,r:['LM','LW']},{l:'CM',x:.38,y:.46,r:['CM','CDM']},{l:'CM',x:.62,y:.46,r:['CM','CAM']},{l:'RM',x:.9,y:.48,r:['RM','RW']},{l:'LW',x:.16,y:.18,r:['LW','ST']},{l:'ST',x:.5,y:.1,r:['ST','CF']},{l:'RW',x:.84,y:.18,r:['RW','ST']}],
};

function autoLineup() {
  if (!G.user) return;
  // 解除上轮禁赛
  G.user.players.forEach(p => { if (p._servingSusp) { p._suspended = false; p._servingSusp = false; } });
  G.slots = (FRM[G.form] || FRM['4-3-3']).map(p => ({ ...p, pid: null }));
  const u = new Set();
  G.slots.forEach(s => {
    const c = G.user.players.filter(p => s.r.includes(p.position) && !u.has(p.id) && !p._suspended);
    if (c.length) { s.pid = c[0].id; u.add(c[0].id); }
  });
  G.user.players.forEach(p => { p.isStarter = u.has(p.id); });
}
function str(t) { const s = t.players.filter(p => p.isStarter).slice(0, 11); let a = 0, d = 0; s.forEach(p => { a += p.attributes.attack; d += p.attributes.defense; }); return { a: Math.round(a / (s.length || 1)), d: Math.round(d / (s.length || 1)) }; }
function pickScorer(players) { const f = players.filter(p => ['ST','CF','LW','RW','CAM'].includes(p.position)); return (f.length ? f[Math.floor(Math.random()*f.length)] : players[0]); }
// FM风格事件描述
const GOAL_TXT = [
  '{p}一脚精准的射门洞穿球门！球进了！', '{p}晃过防守队员，冷静推射破门！',
  '{p}头球攻门！门将毫无办法！', '{p}远射世界波！这球太精彩了！', '{p}禁区内抢点成功，一蹴而就！',
  '{p}任意球直接破门！完美的弧线！', '{p}单刀赴会，冷静推射远角得分！', '{p}凌空抽射！门将鞭长莫及！',
];
const YELLOW_TXT = [
  '{p}吃到一张黄牌，动作有些大', '裁判向{p}出示黄牌警告', '{p}被记名警告，这球确实犯规了',
];
const RED_TXT = [
  '红牌！{p}被罚下场！球队少一人应战！', '{p}严重犯规，直接被红牌罚下！',
];
const SHOT_TXT = [
  '{p}尝试一脚远射……稍稍偏出！', '{p}的射门被门将神勇扑出！', '{p}头球攻门！可惜顶高了',
  '{p}禁区内起脚……打在立柱上！险些得分！', '{p}一脚劲射！被防守队员挡出底线',
  '{p}单刀机会！门将出击及时化解险情', '{p}禁区边缘的射门！擦着横梁飞出',
];
const INJURY_TXT = [
  '{p}痛苦地倒在地上，队医进场查看伤势', '{p}似乎拉伤了肌肉，一瘸一拐地走向场边',
];
const SUB_TXT = [
  '换人调整：{p1}替换下场，{p2}披挂上阵', '{p2}替补登场，换下了{p1}',
];

function genEv(hg, ag, minStart, maxMin) {
  const ev = [], hp = G.user.players.filter(p => p.isStarter), ap = G.opp.players.filter(p => p.isStarter);
  const end = maxMin || (minStart + 45);
  for (let i = 0; i < hg; i++) { const s = pickScorer(hp); if (s) ev.push({ m: minStart + 3 + Math.floor(Math.random() * (end - minStart - 3)), t: 'goal', p: s.name, d: GOAL_TXT[Math.floor(Math.random()*GOAL_TXT.length)].replace('{p}', s.name) }); }
  for (let i = 0; i < ag; i++) { const s = pickScorer(ap); if (s) ev.push({ m: minStart + 3 + Math.floor(Math.random() * (end - minStart - 3)), t: 'goal', p: s.name, a: true, d: GOAL_TXT[Math.floor(Math.random()*GOAL_TXT.length)].replace('{p}', s.name) }); }
  for (let i = 0; i < 2 + Math.floor(Math.random() * 4); i++) { const side = Math.random() < .5; const t = side ? G.user : G.opp; const p = t.players[Math.floor(Math.random() * 11)]; if (p) ev.push({ m: minStart + Math.floor(Math.random() * (end - minStart)), t: 'yellow', p: p.name, a: !side, d: YELLOW_TXT[Math.floor(Math.random()*YELLOW_TXT.length)].replace('{p}', p.name) }); }
  if (Math.random() < .10) { const side = Math.random() < .5; const t = side ? G.user : G.opp; const starters = t.players.filter(p => p.isStarter && p.position !== 'GK'); const p = starters[Math.floor(Math.random() * starters.length)]; if (p) { const isUser = t === G.user; ev.push({ m: minStart + 5 + Math.floor(Math.random() * (end - minStart - 5)), t: 'red', p: p.name, a: !isUser, d: RED_TXT[Math.floor(Math.random()*RED_TXT.length)].replace('{p}', p.name) }); if (isUser) { p._redThisMatch = true; p.isStarter = false; } } }
  for (let i = 0; i < 3 + Math.floor(Math.random() * 6); i++) { const side = Math.random() < .5; const t = side ? G.user : G.opp; const p = pickScorer(t.players); if (p) ev.push({ m: minStart + Math.floor(Math.random() * (end - minStart)), t: 'shot', p: p.name, a: !side, d: SHOT_TXT[Math.floor(Math.random()*SHOT_TXT.length)].replace('{p}', p.name) }); }
  if (Math.random() < .05) { const side = Math.random() < .5; const t = side ? G.user : G.opp; const p = t.players[Math.floor(Math.random() * 11)]; if (p) ev.push({ m: minStart + 10 + Math.floor(Math.random() * (end - minStart - 10)), t: 'injury', p: p.name, a: !side, d: INJURY_TXT[Math.floor(Math.random()*INJURY_TXT.length)].replace('{p}', p.name) }); }
  return ev.sort((a, b) => a.m - b.m);
}

// 换人系统: 3次暂停, 5名球员, 中场休息不计暂停
let subsRemaining = 5, subStops = 3, subMode = 0, subOutId = null;
let lastSub = null; // {pOut, pIn} 最近一次
let pendingSubs = []; // 本次暂停内所有换人，可逐个撤销
function resetSubs() { subsRemaining = 5; subStops = 3; subMode = 0; subOutId = null; lastSub = null; pendingSubs = []; }
function isHalfTime() {
  return G._htShown && !G.ev.some(e => e.m > 45) && !G.matchDone;
}
function simGoals(h, a, mul) {
  const m = mul || 1;
  // 心态修正
  const mentMods = { attack: [8, -6], possession: [3, 2], counter: [-2, 5], defend: [-6, 8], balanced: [0, 0] };
  const [atkMod, defMod] = mentMods[G.mentality] || [0, 0];
  return {
    hg: Math.max(0, Math.round(((h.a + atkMod - a.d + 13) / 13) * m + (Math.random() - .5) * 2.5 * m)),
    ag: Math.max(0, Math.round(((a.a - h.d - defMod + 10) / 13) * m + (Math.random() - .5) * 2.5 * m))
  };
}
function simPen() { let hp = 0, ap = 0; for (let i = 0; i < 5; i++) { if (Math.random() < .78) hp++; if (Math.random() < .78) ap++; } while (hp === ap) { if (Math.random() < .78) hp++; if (Math.random() < .78) ap++; } return { hp, ap }; }

function sim() {
  resetSubs();
  if (G.user) G.user.players.forEach(p => { p._subbedOut = false; p._redThisMatch = false; });
  const h = str(G.user), a = str(G.opp);
  const r1 = simGoals(h, a, 0.5); const r2 = simGoals(h, a, 0.5);
  G.gh = r1.hg + r2.hg; G.ga = r1.ag + r2.ag;
  G.isEt = false; G.isPen = false; G.matchDone = false;
  G.ev = []; G.shownIdx = 0; G.shg = 0; G.sag = 0; G._htShown = false; G.scrollY = 0;
  G.allEv = [...genEv(r1.hg, r1.ag, 0, 45), ...genEv(r2.hg, r2.ag, 45, 90)];
  // 淘汰赛平局→加时→点球
  if (G.phase === 'knockout' && G.gh === G.ga) {
    const et = simGoals(h, a, 0.35); G.gh += et.hg; G.ga += et.ag; G.isEt = true;
    G.allEv = [...G.allEv, ...genEv(et.hg, et.ag, 90, 120)];
    if (G.gh === G.ga) { G._needsPenTakers = true; }
  }
}

function nextEvent() {
  // 中场休息：上半场播完但还没进下半场 → 先暂停一次
  const h2Idx = G.allEv.findIndex(e => e.m > 45);
  const needHT = !G._htShown && h2Idx >= 0 && G.shownIdx >= h2Idx && !G.ev.some(e => e.m > 45);

  if (needHT) {
    G._htShown = true;
    return; // 不推进事件，显示中场休息
  }

  if (G.shownIdx < G.allEv.length) {
    const e = G.allEv[G.shownIdx];
    G.ev.push(e);
    if (e.t === 'goal') { if (e.a) G.sag++; else G.shg++; }
    G.shownIdx++;
    // 自动滚动: 最新事件保持在屏幕下半部
    const evH = G.ev.length * 20 + 100;
    const visibleH = H - 200;
    if (evH > visibleH) G.scrollY = visibleH - evH;
  }
  if (G.shownIdx >= G.allEv.length) G.matchDone = true;
}

// ====== 页面渲染 ======

function home() {
  const y0 = H * 0.06 + SAFE_TOP;
  tC('ROAD TO', W / 2, y0, SZ.xs, DS.dim);
  tC('WORLD CUP', W / 2, y0 + 32, 44, DS.goldL);
  tC('2026 美加墨世界杯推演', W / 2, y0 + 82, SZ.sm, DS.dim);

  // 真实大力神杯
  const tw = 110;
  ctx.drawImage(trophyImg, W / 2 - tw / 2, y0 + 108, tw, tw);

  // 球队卡片
  if (G.user) {
    const cy = H * 0.42;
    rect(W * 0.08, cy, W * 0.84, 70, DS.radius, DS.card);
    tC(G.user.flag, W * 0.14, cy + 18, 30, DS.white);
    tC(G.user.name, W * 0.50, cy + 14, SZ.h1, DS.white);
    tC('小组 ' + G.user.group + '  ·  FIFA #' + G.user.fifaRank, W * 0.50, cy + 40, SZ.xs, DS.dim);
    tC('更换 ›', W * 0.88, cy + 26, SZ.sm, DS.gold);
    G.btns.push({ id: 'teams', x: W * 0.08, y: cy, w: W * 0.84, h: 70 });
  } else {
    const cy = H * 0.42;
    rect(W * 0.08, cy, W * 0.84, 90, DS.radius, DS.card);
    tC('选择你的球队，开启世界杯之旅', W / 2, cy + 28, SZ.body, DS.white);
    tC('48 支球队，由你指挥', W / 2, cy + 52, SZ.xs, DS.dim);
    G.btns.push({ id: 'teams', x: W * 0.08, y: cy, w: W * 0.84, h: 90 });
  }

  btn('play', W * 0.12, H * 0.58, W * 0.76, 52, G.user ? '⚽  开始征程' : '⚽  开始征程', true);
  if (G.user) btn('reset', W * 0.12, H * 0.69, W * 0.76, 40, '重新开始', false);

  // 底栏
  const sf = W * 0.2;
  [{n:'48',l:'参赛球队'},{n:'12',l:'小组'},{n:'104',l:'场比赛'},{n:'16',l:'城市'}].forEach((s, i) => {
    rect(W * 0.08 + i * sf, H * 0.82, sf - 8, 60, DS.radius, DS.card);
    tC(s.n, W * 0.08 + i * sf + (sf - 8) / 2, H * 0.83, 24, DS.gold);
    tC(s.l, W * 0.08 + i * sf + (sf - 8) / 2, H * 0.89, SZ.xs, DS.dim);
  });
}

function teams() {
  const gs = 'ABCDEFGHIJKL';
  const tw = (W - 48) / 4;
  let y = 6 + SAFE_TOP;
  tC('选择球队', W / 2, y, SZ.h2, DS.white);
  y += 30;

  gs.split('').forEach(g => {
    const gts = G.all.filter(t => t.group === g);
    rect(6, y, 24, 24, 5, DS.gold);
    tC(g, 18, y + 4, SZ.body, '#000');
    gts.forEach((t, i) => {
      const tx = 36 + i * tw;
      const sel = G.user && G.user.id === t.id;
      rect(tx, y, tw - 4, 36, 8, sel ? 'rgba(200,150,62,0.18)' : DS.card);
      if (sel) { ctx.strokeStyle = DS.gold; ctx.lineWidth = 1.5; ctx.stroke(); }
      tC(t.flag, tx + (tw - 4) / 2, y + 2, 18, DS.white);
      tC(t.name, tx + (tw - 4) / 2, y + 20, 11, sel ? DS.goldL : DS.dim);
      G.btns.push({ id: 't_' + t.id, x: tx, y: y, w: tw - 4, h: 36 });
    });
    y += 42;
  });
}

function squad() {
  if (!G.user) { console.log('[SQUAD] no user'); G.screen = 'home'; return; }
  if (!G.groupMatches.length) initGroupStage();
  // 只在阵容为空时自动布阵
  if (!G.slots || G.slots.every(s => !s.pid)) autoLineup();

  console.log('[SQUAD] rendering, slots:', G.slots?.length, 'starters:', G.user.players.filter(p=>p.isStarter).length);
  tC(G.user.name + ' · 阵容', W / 2, 8 + SAFE_TOP, SZ.h2, DS.white);
  tC('点击场上位置选择球员', W / 2, 28 + SAFE_TOP, 11, DS.dim);

  // 阵型选择器
  const fs = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3'];
  fs.forEach((f, i) => {
    const fw = W / 5;
    const fx = 4 + i * fw;
    const act = G.form === f;
    rect(fx, 42 + SAFE_TOP, fw - 6, 26, 8, act ? DS.gold : DS.card);
    tC(f, fx + (fw - 6) / 2, 48 + SAFE_TOP, 11, act ? '#000' : DS.white);
    G.btns.push({ id: 'f_' + f, x: fx, y: 42 + SAFE_TOP, w: fw - 6, h: 26 });
  });

  // 球场 - 清晰绘制
  // 战术心态
  const ment = ['attack','possession','counter','defend'];
  const mentCN = ['全力进攻','控球为上','稳守突击','全力防守'];
  ment.forEach((m, i) => {
    const mw = (W - 8) / 4;
    const mx = 4 + i * mw;
    const act = G.mentality === m;
    rect(mx, 60 + SAFE_TOP, mw - 4, 20, 5, act ? DS.gold : DS.card);
    tC(mentCN[i], mx + (mw - 4) / 2, 63 + SAFE_TOP, 9, act ? '#000' : DS.white);
    G.btns.push({ id: 'ment_' + m, x: mx, y: 60 + SAFE_TOP, w: mw - 4, h: 20 });
  });

  const px = 8, py = 82 + SAFE_TOP, pw = W - 16, ph = pw * 1.05;
  // 草地
  rect(px, py, pw, ph, 4, '#2d7a2d');
  // 条纹
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let sx = px; sx < px + pw; sx += 18) ctx.fillRect(sx, py, 9, ph);
  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.strokeRect(px, py, pw, ph);
  // 中线
  ctx.beginPath(); ctx.setLineDash([]); ctx.moveTo(px, py + ph / 2); ctx.lineTo(px + pw, py + ph / 2); ctx.stroke();
  // 中圈
  ctx.beginPath(); ctx.arc(px + pw / 2, py + ph / 2, pw * 0.1, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(px + pw / 2, py + ph / 2, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
  // 小禁区
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
  const gw = pw * 0.22, gh = ph * 0.05;
  ctx.strokeRect(px + (pw - gw) / 2, py, gw, gh);
  ctx.strokeRect(px + (pw - gw) / 2, py + ph - gh, gw, gh);

  // 球员点 - 放大
  if (G.slots) {
    G.slots.forEach((s, i) => {
      const x = px + s.x * pw, y = py + s.y * ph;
      const pl = s.pid ? G.user.players.find(p => p.id === s.pid) : null;
      const act = G.sel === i;
      const suspended = pl?._suspended;
      const r = pl ? 20 : 16;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = suspended ? DS.red : (pl ? DS.gold : 'rgba(255,255,255,0.25)');
      ctx.fill();
      ctx.strokeStyle = pl ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5; ctx.stroke();
      if (act) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); }
      if (pl) { tC(pl.name + (suspended ? ' ⛔' : ''), x, y + r + 4, 10, suspended ? DS.red : '#fff'); }
      else { tC(s.l, x, y - 5, 9, 'rgba(255,255,255,0.6)'); }
      if (!suspended) G.btns.push({ id: 's_' + i, x: x - 22, y: y - 22, w: 44, h: 44 });
    });
  }

  // 候选球员 (点击场上位置后显示)
  const ly = py + ph + 6;
  if (G.sel >= 0 && G.slots && G.slots[G.sel]) {
    const sl = G.slots[G.sel];
    tC('为 ' + sl.l + ' 选择球员', W / 2, ly, 10, DS.goldL);
    const curPid = sl.pid;
    const cand = G.user.players.filter(p => sl.r.includes(p.position) && !p._suspended && p.id !== curPid);
    if (cand.length === 0) tC('无合适替补', W / 2, ly + 16, 10, DS.dim);
    else cand.slice(0, 8).forEach((p, i) => {
      const cx = 4 + (i % 2) * (W / 2), cy = ly + 14 + Math.floor(i / 2) * 22;
      const onField = p.isStarter;
      rect(cx, cy, W / 2 - 6, 20, 3, onField ? 'rgba(200,150,62,0.3)' : DS.card);
      txt((onField ? '↔ ' : '+ ') + p.name, cx + 3, cy + 3, 10, onField ? DS.goldL : DS.white);
      G.btns.push({ id: 'p_' + p.id, x: cx, y: cy, w: W / 2 - 6, h: 20 });
    });
  } else {
    tC('👆 点击场上位置选择球员', W / 2, ly + 8, 11, DS.dim);
  }

  btn('go', W * 0.1, H - 42, W * 0.8, 38, '开始比赛', true);
}

function match() {
  if (!G.opp) { G.screen = 'home'; return; }

  // 滚动偏移
  const scrollOff = G.scrollY || 0;

  // ====== 赛事阶段标签 ======
  const koNames = ['32强','16强','8强','半决赛','决赛'];
  const roundLabel = G.phase === 'group'
    ? '🏆 小组赛 ' + G.user.group + '组 · 第' + (G.groupMatches.filter(m=>m.played).length+1) + '/3场'
    : '🏆 淘汰赛 · ' + (koNames[G.koRound] || '');
  rect(W*.1, 6 + SAFE_TOP, W*.8, 22, 8, DS.gold);
  tC(roundLabel, W/2, 9 + SAFE_TOP, 13, '#000');

  // ====== 比分板 ======
  const sbY = 34 + SAFE_TOP, sbH = 80;
  rect(0, sbY, W, sbH, 0, DS.card);
  // 主队
  tC(G.user.name, W*.28, sbY+8, 16, DS.white);
  tC(G.user.flag, W*.28, sbY+28, 22, DS.white);
  // vs
  tC('VS', W/2, sbY+30, 14, DS.dim);
  // 客队
  tC(G.opp.name, W*.72, sbY+8, 16, DS.dim);
  tC(G.opp.flag, W*.72, sbY+28, 22, DS.white);
  // 比分 - 大号实时
  tC(G.shg + ' : ' + G.sag, W/2, sbY+50, 36, DS.goldL);

  // ====== 比赛阶段指示条 ======
  const phaseY = sbY + sbH + 4;
  const currentMin = G.ev.length > 0 ? G.ev[G.ev.length-1].m : 0;
  let phaseText, phaseColor;
  const shownH2 = G.ev.some(e => e.m > 45);
  if (currentMin === 0) { phaseText = '比赛即将开始'; phaseColor = DS.gold; }
  else if (G._htShown && !shownH2) { phaseText = '⏸ 中场休息'; phaseColor = DS.gold; }
  else if (currentMin <= 45) { phaseText = '上半场 ' + currentMin + "'"; phaseColor = DS.dim; }
  else if (currentMin <= 90) { phaseText = '下半场 ' + currentMin + "'"; phaseColor = DS.dim; }
  else { phaseText = '加时赛 ' + currentMin + "'"; phaseColor = DS.dim; }
  if (G.matchDone) { phaseText = '全场结束'; phaseColor = DS.goldL; }
  tC(phaseText, W/2, phaseY+2, 13, phaseColor);

  // 进度条
  const progress = G.matchDone ? 1 : (G.allEv.length > 0 ? G.shownIdx / G.allEv.length : 0);
  rect(20, phaseY+20, W-40, 4, 2, 'rgba(255,255,255,0.08)');
  rect(20, phaseY+20, (W-40)*progress, 4, 2, DS.gold);

  // ====== 事件列表 ======
  const eventsMinY = phaseY + 34; // 进度条下方，不可再往上
  let ey = eventsMinY + scrollOff;
  if (ey < eventsMinY) ey = eventsMinY; // 不覆盖进度条
  if (G.ev.length === 0) {
    tC('点击下方「继续」开始比赛', W/2, ey, 13, DS.dim);
  } else {
    // 上半场标题
    const h1 = G.ev.filter(e=>e.m<=45);
    const h2 = G.ev.filter(e=>e.m>45&&e.m<=90);
    const et = G.ev.filter(e=>e.m>90);
    if (h1.length > 0) { tC('━ 上半场 ━', W/2, ey, 10, DS.dim); ey+=14; }

    G.ev.forEach((e, i) => {
      // 中场休息分割线
      if (i > 0 && G.ev[i-1].m <= 45 && e.m > 45 && e.m <= 90) {
        rect(W*.1, ey, W*.8, 1, 0, 'rgba(200,150,62,0.3)');
        ey+=4; tC('⏸ 中场休息', W/2, ey, 11, DS.gold); ey+=14;
        rect(W*.1, ey, W*.8, 1, 0, 'rgba(200,150,62,0.3)');
        ey+=4;
      }
      // 加时赛分割线
      if (i > 0 && G.ev[i-1].m <= 90 && e.m > 90) {
        ey+=4; tC('━ 加时赛 ━', W/2, ey, 10, DS.dim); ey+=14;
      }

      const isHome = !e.a;
      const cl = e.a ? DS.red : (e.t==='goal' ? DS.goldL : DS.white);
      const ic = e.t==='goal'?'⚽':e.t==='yellow'?'🟨':e.t==='red'?'🟥':e.t==='shot'?'💥':e.t==='injury'?'🏥':e.t==='sub'?'🔄':'';

      if (e.d) {
        // FM风格长描述：自适应换行
        const maxLen = 22;
        const fullText = e.m+'\' '+ic+' '+e.d;
        if (isHome) {
          if (fullText.length > maxLen) {
            txt(fullText.slice(0, maxLen), 4, ey, 11, cl);
            txt(fullText.slice(maxLen), 4, ey + 14, 11, cl); ey += 14;
          } else { txt(fullText, 4, ey, 11, cl); }
        } else {
          // 右边事件：右对齐，从右边界向左展开
          if (fullText.length > maxLen) {
            txt(fullText.slice(maxLen), W - 4, ey + 14, 11, cl, 'right'); ey += 14;
            txt(fullText.slice(0, maxLen), W - 4, ey, 11, cl, 'right');
          } else { txt(fullText, W - 4, ey, 11, cl, 'right'); }
        }
        ey += 15;
      } else {
        txt(e.m+"' "+ic+' '+e.p, isHome?4:W-4, ey, 11, cl, isHome?'left':'right');
        ey += 14;
      }
    });

    if (G.matchDone && G.ev.length===0) { tC('全场结束，互交白卷', W/2, ey, 14, DS.dim); ey+=24; }
  }

  // ==== 重绘顶栏防穿透 ====
  rect(0, 0, W, phaseY + 24, 0, DS.bg);
  // 轮次标签
  rect(W*.1, 6 + SAFE_TOP, W*.8, 22, 8, DS.gold);
  tC(roundLabel, W/2, 9 + SAFE_TOP, 13, '#000');
  // 比分板 + 阶段指示
  rect(0, sbY, W, sbH, 0, DS.card);
  tC(G.user.name, W*.28, sbY+8, 16, DS.white);
  tC(G.user.flag, W*.28, sbY+28, 22, DS.white);
  tC('VS', W/2, sbY+30, 14, DS.dim);
  tC(G.opp.name, W*.72, sbY+8, 16, DS.dim);
  tC(G.opp.flag, W*.72, sbY+28, 22, DS.white);
  tC(G.shg + ' : ' + G.sag, W/2, sbY+50, 36, DS.goldL);
  let phaseText2, phaseColor2;
  const cm2 = G.ev.length > 0 ? G.ev[G.ev.length-1].m : 0;
  if (cm2 === 0) { phaseText2 = '比赛即将开始'; phaseColor2 = DS.gold; }
  else if (G._htShown && !G.ev.some(e=>e.m>45)) { phaseText2 = '⏸ 中场休息'; phaseColor2 = DS.gold; }
  else if (cm2 <= 45) { phaseText2 = '上半场 ' + cm2 + "'"; phaseColor2 = DS.dim; }
  else if (cm2 <= 90) { phaseText2 = '下半场 ' + cm2 + "'"; phaseColor2 = DS.dim; }
  else { phaseText2 = '加时赛 ' + cm2 + "'"; phaseColor2 = DS.dim; }
  if (G.matchDone) { phaseText2 = '全场结束'; phaseColor2 = DS.goldL; }
  tC(phaseText2, W/2, phaseY+2, 13, phaseColor2);
  const progress2 = G.matchDone ? 1 : (G.allEv.length > 0 ? G.shownIdx / G.allEv.length : 0);
  rect(20, phaseY+20, W-40, 4, 2, 'rgba(255,255,255,0.08)');
  rect(20, phaseY+20, (W-40)*progress2, 4, 2, DS.gold);

  // ====== 结果 (比赛结束后显示) ======
  // 点球大战前：选点球手
  if (G.matchDone && G._needsPenTakers) {
    btn('penTakers', W*.1, H*.7, W*.8, 48, '⚽ 选择点球手顺序', true);
    return;
  }

  // 点球大战逐轮展示 (覆盖全屏)
  if (G._penEvents && !G._penDone) {
    ctx.fillStyle = 'rgba(0,0,0,0.97)'; ctx.fillRect(0, 0, W, H);

    const userTeam = G.user?.name || '我方';
    const oppTeam = G.opp?.name || '对手';
    tC('🥅 点球大战', W / 2, SAFE_TOP + 8, 22, DS.goldL);
    tC(userTeam + '  vs  ' + oppTeam, W / 2, SAFE_TOP + 34, 14, DS.dim);

    // 当前比分
    const shown = G._penEvents.slice(0, (G._penIdx||0)+1);
    const us = shown.filter(e => e.user && e.scored).length;
    const them = shown.filter(e => !e.user && e.scored).length;
    tC(us + ' : ' + them, W / 2, SAFE_TOP + 52, 32, DS.goldL);

    // 逐条展示
    let py = SAFE_TOP + 90;
    const uLbl = userTeam.slice(0, 4);
    const oLbl = oppTeam.slice(0, 4);
    for (let i = 0; i <= (G._penIdx || 0) && i < G._penEvents.length; i++) {
      const e = G._penEvents[i];
      const icon = e.scored ? '✅' : '❌';
      const cl = e.scored ? DS.goldL : DS.red;
      const lbl = e.user ? uLbl : oLbl;
      txt(e.round + '. [' + lbl + '] ' + icon + ' ' + e.p, 8, py, 12, cl);
      if (e.desc) txt('      ' + e.desc, 8, py + 14, 10, e.scored ? DS.goldL : DS.red);
      py += e.desc ? 30 : 20;
    }

    if ((G._penIdx || 0) < G._penEvents.length - 1) {
      btn('nextPen', W * 0.15, H * 0.82, W * 0.7, 44, '▶ 下一轮', true);
    } else {
      btn('penResult', W * 0.15, H * 0.82, W * 0.7, 44, '查看结果', true);
    }
    return;
  }

  if (G.matchDone) {
    ey += 8;
    const userWin = G.isPen ? G.penH > G.penA : G.gh > G.ga;
    const userLose = G.isPen ? G.penH < G.penA : G.gh < G.ga;
    const r = userWin ? 'win' : userLose ? (G.phase==='knockout'?'elim':'lose') : 'draw';
    const results = { win:'🎉 恭喜获胜！', lose:'遗憾失利', draw:'🤝 握手言和', elim:'💔 被淘汰' };
    const rcl = { win: DS.goldL, lose: DS.red, draw: DS.dim, elim: DS.red };
    rect(W*.15, ey, W*.7, 36, DS.radius, rcl[r]);
    tC(results[r], W/2, ey+10, 18, '#000');
    if (G.isEt) tC('⚡ 加时赛', W/2, ey-14, 11, DS.dim);
    if (G.isPen) tC('🥅 点球 ' + G.penH + ':' + G.penA, W/2, ey-14, 14, DS.goldL);
  }

  // ====== 底部按钮 ======
  if (!G.matchDone) {
    const nextLabel = (G._htShown && !G.ev.some(e=>e.m>45)) ? '▶ 下半场' : '▶ 继续';
    btn('nextEv', W*.06, H - 84, W*.42, 46, nextLabel, true);
    btn('tactic', W*.52, H - 84, W*.42, 46, '⚙ 战术', false);
  }

  // 结束后按钮
  if (G.matchDone) {
    const bty = H - 82;
    if (G.phase==='group' && !checkGroupDone()) {
      btn('standings',W*.1,bty,W*.8,44,'查看积分榜',true);
    } else if (G.phase==='group' && checkGroupDone()) {
      btn('knockout',W*.1,bty,W*.8,44,'进入淘汰赛 →',true);
    } else if (G.phase==='knockout' && !G.tournamentOver) {
      if (G.koRound>=4) {
        btn('champ',W*.1,bty,W*.8,44,'🏆 荣耀时刻',true);
      } else {
        const userWin = G.isPen ? G.penH>G.penA : G.gh>G.ga;
        if (userWin) { btn('nextKo',W*.1,bty,W*.5,44,'下一轮',true); btn('standings',W*.62,bty,W*.28,44,'晋级图',false); }
        else { G.tournamentOver = true; G.screen = 'gameover'; return; }
      }
    } else { btn('champ',W*.1,bty,W*.5,44,'🏆 最终成绩',true); btn('standings',W*.62,bty,W*.28,44,'晋级图',false); }
  }
}

function standings() {
  updateStandings();
  const allSt = simulateAllGroups();
  const tab = G.standingsTab;

  // 淘汰赛阶段 → 纵向晋级图
  if (G.phase === 'knockout' || G.tournamentOver) {
    const allSt = simulateAllGroups();
    const { groupWinners, groupRunnersUp, bestThirds } = getQualifiers(allSt);
    tC('🏆 淘汰赛对阵图', W / 2, 8 + SAFE_TOP, SZ.h2, DS.goldL);

    // 构建R32
    const r32 = [];
    R32_MATCHUPS.slice(0, 16).forEach(m => {
      const w = groupWinners[m.a.slice(1)];
      let o = null;
      const p = m.b.split('/')[0];
      if (p[0] === '1') o = groupWinners[p.slice(1)];
      else if (p[0] === '2') o = groupRunnersUp[p.slice(1)];
      else { const bt = bestThirds.find(t => t.group === p.slice(1)); if (bt) o = bt.team; }
      if (w && o) r32.push([w, o]);
    });

    const rounds = ['32强','16强','8强','半决赛','决赛'];
    let by = 32 + SAFE_TOP + (G.scrollY || 0);

    // 逐轮向下展示
    for (let r = 0; r < 5; r++) {
      rect(4, by, W - 8, 22, 5, DS.gold);
      tC(rounds[r], W / 2, by + 3, 13, '#000');
      by += 26;

      if (r === 0) {
        // 32强: 显示所有对阵
        r32.forEach(([a, b], i) => {
          const isUser = a.id === G.user?.id || b.id === G.user?.id;
          rect(4, by, W - 8, 24, 4, isUser ? 'rgba(200,150,62,0.2)' : DS.card);
          if (isUser) { ctx.strokeStyle = DS.gold; ctx.lineWidth = 1.5; ctx.stroke(); }
          txt(a.name.slice(0,10), 10, by + 4, 11, a.id === G.user?.id ? DS.goldL : DS.white);
          txt('vs', W/2 - 8, by + 4, 10, DS.dim);
          txt(b.name.slice(0,10), W - 10, by + 4, 11, b.id === G.user?.id ? DS.goldL : DS.dim, 'right');
          // 晋级连线
          if (i % 2 === 0 && r32[i+1]) {
            ctx.strokeStyle = isUser ? DS.gold : 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            const midY = by + 12;
            ctx.beginPath();
            ctx.moveTo(W - 4, midY);
            ctx.lineTo(W - 4, midY + 24);
            ctx.stroke();
          }
          by += 26;
        });
      } else {
        // 后续轮次: 显示晋级对阵 (2^(5-r) 个)
        const count = Math.pow(2, 5 - r);
        for (let i = 0; i < count; i += 2) {
          const isUser = (r <= G.koRound + 1); // 用户相关
          rect(4, by, W - 8, 28, 4, DS.card);
          txt('待定', 10, by + 6, 11, DS.dim);
          txt('vs', W/2 - 8, by + 6, 10, DS.dim);
          txt('待定', W - 10, by + 6, 11, DS.dim, 'right');
          if (i % 2 === 0) {
            ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(W - 4, by + 14);
            ctx.lineTo(W - 4, by + 14 + 28);
            ctx.stroke();
          }
          by += 30;
        }
      }
      by += 4;
    }

    tC('⚽ 你的球队: ' + (G.user?.name||''), W / 2, by + 4, 11, DS.goldL);
    if (G.phase === 'knockout' && !G.tournamentOver) {
      btn('nextKoBracket', W * 0.1, H - 92, W * 0.8, 42, '下一场比赛', true);
    }
    btn('home', W * 0.15, H - 46, W * 0.7, 38, '返回首页', true);
    return;
  }

  // 小组赛阶段 → 正常积分榜

  // 标签切换
  const tabs = ['本组赛况', '所有小组', '射手榜'];
  const tw = (W - 16) / 3;
  tabs.forEach((tb, i) => {
    rect(4 + i * tw, 4 + SAFE_TOP, tw - 4, 28, 8, tab === i ? DS.gold : DS.card);
    tC(tb, 4 + i * tw + (tw - 4) / 2, 10 + SAFE_TOP, 13, tab === i ? '#000' : DS.white);
    G.btns.push({ id: 'stab_' + i, x: 4 + i * tw, y: 4 + SAFE_TOP, w: tw - 4, h: 28 });
  });

  let y = 40 + SAFE_TOP + (G.scrollY || 0);

  if (tab === 0) {
    // ==== 本组积分 ====
    tC(G.user.group + ' 组 积分榜', W / 2, y, SZ.h2, DS.white);
    y += 28;
  // 表头
  rect(6, y - 2, W - 12, 24, 6, DS.card);
  txt('球队', 14, y + 2, SZ.xs, DS.dim);
  ['赛','胜','平','负','+/-','分'].forEach((h, i) => {
    txt(h, W - 30 - (5 - i) * 28, y + 2, SZ.xs, DS.dim);
  });
  y += 26;

  G.groupStandings.forEach((s, i) => {
    const isUser = s.team.id === G.user.id;
    rect(6, y, W - 12, 30, 6, isUser ? 'rgba(200,150,62,0.12)' : DS.card);
    txt(s.team.flag, 12, y + 5, 20, DS.white);
    txt((i + 1) + '. ' + s.team.name, 36, y + 7, SZ.sm, isUser ? DS.goldL : DS.white);
    const gd = s.gf - s.ga;
    txt(String(s.played||0), W - 140, y + 7, SZ.xs, DS.dim);
    txt(String(s.won||0), W - 112, y + 7, SZ.xs, DS.dim);
    txt(String(s.drawn||0), W - 88, y + 7, SZ.xs, DS.dim);
    txt(String(s.lost||0), W - 64, y + 7, SZ.xs, DS.dim);
    txt((gd > 0 ? '+' : '') + gd, W - 44, y + 7, SZ.xs, gd > 0 ? DS.green : gd < 0 ? DS.red : DS.dim);
    txt(String(s.pts), W - 22, y + 7, SZ.h2, DS.goldL);
    y += 34;
  });

  // ====== 同组比赛结果 ======
  y += 6;
  tC('━ 本轮比赛 ━', W / 2, y, 10, DS.dim); y += 16;

  // 用户已完赛的场次
  G.groupMatches.forEach((m, idx) => {
    if (!m.played) return;
    const om = G._otherMatches?.[idx];
    const r1 = m.hg + ':' + m.ag;
    const r2 = om?._score ? om._score.hg + ':' + om._score.ag : '?:?';
    const t1 = G.user.name + ' vs ' + m.opp.name;
    const t2 = om ? (om.a.name + ' vs ' + om.b.name) : '';

    rect(4, y, W - 8, 40, 6, DS.card);
    txt('第' + (idx+1) + '轮', 10, y + 2, 10, DS.gold);
    txt(t1, 10, y + 16, 11, DS.white);
    txt(r1, W - 30, y + 16, 11, DS.goldL, 'right');
    // 进球者和红牌
    if (m.scorers && m.scorers.length > 0) txt('⚽ ' + m.scorers.join(', '), 10, y + 28, 9, DS.goldL);
    if (m.redCards && m.redCards.length > 0) txt('🟥 ' + m.redCards.join(', '), W * 0.5, y + 28, 9, DS.red);
    y += 38;
    if (t2) {
      const score = om._score;
      const scA = score?.aScorers?.join(', ') || '';
      const scB = score?.bScorers?.join(', ') || '';
      const reds = score?.reds?.join(', ') || '';
      rect(4, y, W - 8, 28 + (scA ? 12 : 0) + (reds ? 12 : 0), 6, DS.card);
      txt(t2, 10, y + 6, 10, DS.dim);
      txt(r2, W - 30, y + 6, 10, DS.dim, 'right');
      if (scA) txt('⚽ ' + scA + (scB ? ' | ' + scB : ''), 10, y + 18, 9, DS.goldL);
      if (reds) txt('🟥 ' + reds, W * 0.5, y + 18, 9, DS.red);
      y += 28 + (scA ? 12 : 0) + (reds ? 12 : 0) + 2;
    }
    y += 4;
  });

  const userRank = G.groupStandings.findIndex(s => s.team.id === G.user.id) + 1;
  const qual = userRank <= 2;
  const done = checkGroupDone();

  if (!done) {
    tC('比赛进行中...', W / 2, y + 6, SZ.h2, DS.gold);
    btn('next', W * 0.15, H * 0.88, W * 0.7, 44, '下一场比赛', true);
  } else {
    tC(qual ? '✅ 晋级淘汰赛！' : '❌ 小组出局', W / 2, y + 6, SZ.h2, qual ? DS.green : DS.red);
    if (qual) btn('knockout', W * 0.15, H * 0.88, W * 0.7, 44, '进入淘汰赛 →', true);
    else btn('over', W * 0.15, H * 0.88, W * 0.7, 44, '结束征程', true);
  }
  } // end tab 1
  else if (tab === 1) {
    // ==== 本组积分 ====
    tC('全部小组积分', W / 2, y, SZ.h2, DS.white); y += 22;
    // 表头
    rect(4, y, W - 8, 20, 4, DS.card);
    txt('组', 8, y + 2, 10, DS.dim);
    txt('球队', W * 0.15, y + 2, 10, DS.dim);
    txt('赛', W - 80, y + 2, 10, DS.dim);
    txt('分', W - 40, y + 2, 10, DS.dim);
    y += 22;
    'ABCDEFGHIJKL'.split('').forEach(g => {
      const st = allSt[g];
      if (!st) return;
      rect(4, y, 20, 20, 4, DS.gold); tC(g, 14, y + 2, 12, '#000');
      st.forEach((s, i) => {
        txt((i+1)+'. '+s.team.name, W * 0.15, y, 10, i < 2 ? DS.white : DS.dim);
        txt(String(s.played||0), W - 80, y, 10, DS.dim);
        txt(String(s.pts), W - 40, y, 10, DS.gold);
        y += 14;
      });
      y += 2;
    });
  }
  else if (tab === 2) {
    tC('射手榜', W / 2, y, SZ.h2, DS.white); y += 24;
    // 基于真实比赛数据 + 缓存模拟比分
    const scorers = {};
    // 用户比赛实际进球者
    G.groupMatches.forEach(m => { if (m.played) (m.scorers||[]).forEach(n => { scorers[n]=(scorers[n]||0)+1; }); });
    // 其他组: 基于缓存的比赛比分分配进球
    if (G._matchCache) {
      Object.entries(G._matchCache).forEach(([g, matches]) => {
        Object.entries(matches).forEach(([key, score]) => {
          const [idA, idB] = key.split('_vs_');
          const tA = G.all.find(t => t.id === idA);
          const tB = G.all.find(t => t.id === idB);
          // 模拟进球者 (确定性: 用球队ID hash选前锋)
          const pickForward = (team, goals) => {
            if (!team || goals <= 0) return;
            const fwds = team.players.filter(p => ['ST','CF','LW','RW'].includes(p.position));
            for (let g = 0; g < goals; g++) {
              const p = fwds[g % fwds.length];
              if (p) scorers[p.name] = (scorers[p.name]||0) + 1;
            }
          };
          pickForward(tA, score.hg);
          pickForward(tB, score.ag);
        });
      });
    }
    Object.entries(scorers).sort((a,b)=>b[1]-a[1]).filter(([_,g])=>g>0).slice(0,15).forEach(([name, goals], i) => {
      txt((i+1)+'. '+name, 10, y, 12, i < 3 ? DS.goldL : DS.white);
      txt(String(goals)+'球', W - 30, y, 12, DS.gold, 'right');
      y += 20;
    });
  }
}

function champion() {
  rect(W * 0.06, H * 0.08 + SAFE_TOP, W * 0.88, H * 0.78, DS.radius, DS.card);
  // 真实大力神杯 (保持原始比例)
  const ctw = 120;
  const ratio = trophyImg.height && trophyImg.width ? trophyImg.height / trophyImg.width : 1;
  ctx.drawImage(trophyImg, W / 2 - ctw / 2, H * 0.06, ctw, ctw * ratio);
  tC('恭喜你！夺得 2026', W / 2, H * 0.36, 20, DS.goldL);
  tC('世界杯冠军！', W / 2, H * 0.42, 32, DS.goldL);
  if (G.user) {
    tC(G.user.flag, W / 2, H * 0.50, 44, DS.white);
    tC(G.user.name, W / 2, H * 0.57, SZ.h1, DS.white);
  }
  tC('冠军教练', W / 2, H * 0.65, SZ.body, DS.gold);
  btn('reset', W * 0.2, H * 0.73, W * 0.6, 44, '再来一次', true);
}

function gameover() {
  const roundNames = { group: '小组赛', round32: '32强', round16: '16强', quarter: '8强', semi: '半决赛', final: '决赛' };
  const koRoundNames = ['32强', '16强', '8强', '半决赛', '决赛'];
  let result = '';
  if (G.phase === 'group' && G.tournamentOver) result = '止步小组赛';
  else if (G.phase === 'knockout' && G.tournamentOver) result = '止步 ' + (koRoundNames[G.koRound] || '淘汰赛');
  else result = '征程结束';

  rect(W * 0.08, H * 0.15 + SAFE_TOP, W * 0.84, H * 0.6, DS.radius, DS.card);
  tC('💔', W / 2, H * 0.22, 60, DS.red);
  tC(result, W / 2, H * 0.32, 32, DS.red);
  if (G.user) {
    tC(G.user.flag + ' ' + G.user.name, W / 2, H * 0.40, SZ.h2, DS.white);
    tC('小组 ' + G.user.group + ' · FIFA #' + G.user.fifaRank, W / 2, H * 0.46, SZ.sm, DS.dim);
  }
  // 战绩
  const played = G.groupMatches.filter(m => m.played).length;
  const won = G.groupMatches.filter(m => m.played && m.hg > m.ag).length;
  const drawn = G.groupMatches.filter(m => m.played && m.hg === m.ag).length;
  const lost = G.groupMatches.filter(m => m.played && m.hg < m.ag).length;
  tC('小组赛战绩: ' + won + '胜 ' + drawn + '平 ' + lost + '负', W / 2, H * 0.54, SZ.body, DS.dim);
  if (G.koRound > 0) tC('淘汰赛: 止步 ' + (koRoundNames[G.koRound - 1] || ''), W / 2, H * 0.60, SZ.body, DS.dim);

  btn('reset', W * 0.2, H * 0.68, W * 0.6, 44, '重新开始', true);
}

// 保存比赛结果
function saveMatchResult() {
  if (!G.opp) return;
  const cur = G.groupMatches.find(m => !m.played && m.opp.id === G.opp.id);
  if (cur) {
    cur.hg = G.gh; cur.ag = G.ga; cur.played = true;
    cur.scorers = G.allEv.filter(e => e.t === 'goal' && !e.a).map(e => e.p);
    cur.oppScorers = G.allEv.filter(e => e.t === 'goal' && e.a).map(e => e.p);
    cur.redCards = G.allEv.filter(e => e.t === 'red').map(e => e.p + (e.a ? '(客)' : '(主)'));
    // 红牌 → 下一场禁赛
    G.allEv.filter(e => e.t === 'red' && !e.a).forEach(e => {
      const p = G.user.players.find(p => p.name === e.p);
      if (p) { p._suspended = true; p._servingSusp = false; }
    });
    // 黄牌累计 → 两黄停赛
    const yellows = {};
    G.allEv.filter(e => e.t === 'yellow' && !e.a).forEach(e => {
      yellows[e.p] = (yellows[e.p] || 0) + 1;
    });
    Object.entries(yellows).forEach(([name, count]) => {
      if (count >= 2) {
        const p = G.user.players.find(p => p.name === name);
        if (p) p._suspended = true;
      }
    });
    // 本场未出场的禁赛球员→禁赛已执行→下一场解除
    G.user.players.forEach(p => {
      if (p._suspended && !p._servingSusp && !p.isStarter && !G.allEv.some(e => (e.t === 'sub' || e.t === 'injury') && e.p === p.name)) {
        p._servingSusp = true;
      }
    });
    const playedCount = G.groupMatches.filter(m => m.played).length;
    simOtherMatch(playedCount - 1);
  }
}
function exitMatch() {
  if (G.screen === 'match') saveMatchResult();
  G.ev = []; G.allEv = []; G.shownIdx = 0; G.opp = null; G.gh = 0; G.ga = 0; G.matchDone = false;
}

// ====== 主循环 ======
function loop() {
  ctx.fillStyle = DS.bg;
  ctx.fillRect(0, 0, W, H);
  G.btns = [];

  switch (G.screen) {
    case 'home': home(); break;
    case 'teams': teams(); break;
    case 'squad': squad(); break;
    case 'match': match(); break;
    case 'champion': champion(); break;
    case 'tactics': tactics(); break;
    case 'penalty': penalty(); break;
    case 'gameover': gameover(); break;
    case 'standings': standings(); break;
  }

  if (ripple) {
    ripple.r += 5; ripple.a -= 0.06;
    if (ripple.a <= 0) ripple = null;
    else { ctx.strokeStyle = `rgba(200,150,62,${ripple.a})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2); ctx.stroke(); }
  }

  requestAnimationFrame(loop);
}

// ====== 赛中战术调整 ======
function tactics() {
  ctx.fillStyle = 'rgba(0,0,0,0.97)';
  ctx.fillRect(0, 0, W, H);
  if (!G.user) { G.screen = 'match'; return; }

  let y = 4 + SAFE_TOP;

  // 阵型
  const fs = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3'];
  fs.forEach((f, i) => {
    const fw = W / 5, fx = 4 + i * fw;
    const act = G.form === f;
    rect(fx, y, fw - 6, 22, 5, act ? DS.gold : DS.card);
    tC(f, fx + (fw - 6) / 2, y + 4, 10, act ? '#000' : DS.white);
    G.btns.push({ id: 'tf_' + f, x: fx, y, w: fw - 6, h: 22 });
  });
  y += 26;

  // 心态
  const ments = ['attack','possession','counter','defend'];
  const mentCN = ['全力进攻','控球为上','稳守突击','全力防守'];
  ments.forEach((m, i) => {
    const mw = (W - 8) / 2, mx = 4 + (i % 2) * mw, my = y + Math.floor(i / 2) * 24;
    const act = G.mentality === m;
    rect(mx, my, mw - 6, 20, 5, act ? DS.gold : DS.card);
    tC(mentCN[i], mx + (mw - 6) / 2, my + 4, 10, act ? '#000' : DS.white);
    G.btns.push({ id: 'ment_' + m, x: mx, y: my, w: mw - 6, h: 20 });
  });
  y += 52;

  // 球场 + 球员
  const px = 6, py = y, pw = W - 12, ph = pw * 1.1;
  rect(px, py, pw, ph, 4, '#1d5a1d');
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5;
  ctx.strokeRect(px, py, pw, ph);
  ctx.beginPath(); ctx.moveTo(px, py + ph / 2); ctx.lineTo(px + pw, py + ph / 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(px + pw / 2, py + ph / 2, pw * 0.1, 0, Math.PI * 2); ctx.stroke();

  if (G.slots) {
    G.slots.forEach((s, i) => {
      const x = px + s.x * pw, y2 = py + s.y * ph;
      const pl = s.pid ? G.user.players.find(p => p.id === s.pid) : null;
      const gettingSubbed = subMode === 1 && subOutId === (pl?.id);
      const redCarded = pl?._redThisMatch;
      ctx.beginPath(); ctx.arc(x, y2, 13, 0, Math.PI * 2);
      ctx.fillStyle = redCarded ? DS.red : (gettingSubbed ? DS.red : (pl ? DS.gold : 'rgba(255,255,255,0.2)'));
      ctx.fill();
      if (gettingSubbed) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
      if (pl) tC(pl.name + (redCarded ? ' 🟥' : ''), x, y2 + 15, 8, redCarded ? DS.red : '#fff');
      else tC(s.l, x, y2 - 3, 8, 'rgba(255,255,255,0.5)');
      if (!subMode && !pl?._redThisMatch) G.btns.push({ id: 'subo_' + (pl?.id || ''), x: x - 14, y: y2 - 14, w: 28, h: 28 });
    });
  }

  y = py + ph + 6;

  // 换人状态
  const usedSubs = 5 - subsRemaining;
  const ht = isHalfTime();
  tC('已换' + usedSubs + '/5人 | 暂停' + (3-subStops) + '/3' + (ht ? ' | 中场不计' : ''), W / 2, y, 11, DS.goldL);
  y += 16;
  if (subMode === 1 && subOutId) {
    const pOut = G.user.players.find(p => p.id === subOutId);
    // 找到该位置的允许角色
    const slot = G.slots?.find(s => s.pid === subOutId);
    const allowedRoles = slot?.r || (pOut ? [pOut.position] : []);
    tC('换下 ' + (pOut?.name || '') + ' (同位置替补)', W / 2, y + 14, 11, DS.goldL);
    y += 18;
    const subs = G.user.players.filter(p => !p.isStarter && !p._subbedOut && !p._suspended && (allowedRoles.includes(p.position) || p.position === pOut?.position));
    if (subs.length === 0) tC('没有合适的替补球员', W / 2, y + 16, 11, DS.dim);
    subs.slice(0, 10).forEach((p, i) => {
      const cx = 4 + (i % 3) * (W / 3), cy = y + 16 + Math.floor(i / 3) * 24;
      rect(cx, cy, W / 3 - 6, 22, 4, DS.card);
      txt(p.name, cx + 3, cy + 4, 11, DS.white);
      txt(p.position, cx + W / 3 - 22, cy + 4, 9, DS.dim, 'right');
      G.btns.push({ id: 'subi_' + p.id, x: cx, y: cy, w: W / 3 - 6, h: 22 });
    });
    y += 16 + Math.ceil(Math.min(subs.length, 10) / 3) * 24 + 6;
  }
  if (subMode > 0) { btn('subc', W * 0.2, y, W * 0.6, 30, '取消选择', false); y += 34; }
  if (!subMode && pendingSubs.length > 0) {
    tC('可撤销的换人:', W / 2, y, 10, DS.dim); y += 14;
    pendingSubs.forEach((s, idx) => {
      const pIn = G.user.players.find(p => p.id === s.pIn);
      if (pIn) { btn('undo_' + idx, W * 0.1, y, W * 0.8, 24, '撤销: ' + pIn.name + ' 上场', false); y += 26; }
    });
  }
  btn('back', W * 0.15, H - 50, W * 0.7, 38, '返回比赛', true);
}

// ====== 点球手选择 ======
function penalty() {
  ctx.fillStyle = 'rgba(0,0,0,0.97)';
  ctx.fillRect(0, 0, W, H);
  tC('🥅 点球大战', W / 2, 8 + SAFE_TOP, SZ.h2, DS.goldL);
  tC('选择 5 名点球手 (按顺序)', W / 2, 32 + SAFE_TOP, 14, DS.dim);

  const slots = G._penSlots || [];
  if (slots.length < 5) {
    const y0 = 54 + SAFE_TOP;
    // 已选顺序
    slots.forEach((pid, idx) => {
      const p = G.user.players.find(p => p.id === pid);
      tC((idx+1)+'. '+(p?.name||''), W / 2, y0 + idx * 20, 13, DS.goldL);
    });
    // 可选球员
    const y1 = y0 + Math.max(slots.length, 1) * 20 + 10;
    tC('点击球员加入队列', W / 2, y1, 10, DS.dim);
    G.user.players.filter(p => !slots.includes(p.id)).slice(0, 12).forEach((p, i) => {
      const cx = 4 + (i % 3) * (W / 3), cy = y1 + 14 + Math.floor(i / 3) * 26;
      const ovr = Math.round((p.attributes.shooting + p.attributes.skill) / 2);
      rect(cx, cy, W / 3 - 6, 24, 4, DS.card);
      txt(p.name + ' ' + ovr, cx + 4, cy + 4, 11, DS.white);
      G.btns.push({ id: 'penPick_' + p.id, x: cx, y: cy, w: W / 3 - 6, h: 24 });
    });
  }

  // 已选满5人
  if (slots.length >= 5) {
    tC('点球顺序已确定', W / 2, H * 0.55, 14, DS.goldL);
    btn('penGo', W * 0.15, H * 0.62, W * 0.7, 44, '🥅 开始点球大战', true);
  }
  if (slots.length > 0) btn('penClear', W * 0.15, H * 0.72, W * 0.7, 32, '清空重选', false);
  btn('back', W * 0.15, H - 50, W * 0.7, 38, '返回', true);
}

// ====== 触摸 ======
wx.onTouchStart(e => {
  if (!e.touches || !e.touches[0]) return;
  const x = e.touches[0].clientX || e.touches[0].x || 0;
  const y = e.touches[0].clientY || e.touches[0].y || 0;
  G.touchStartY = y;
  G._touchMoved = false;
  ripple = { x, y, r: 0, a: 1 };
});

wx.onTouchMove(e => {
  if (!e.touches || !e.touches[0]) return;
  const y = e.touches[0].clientY || e.touches[0].y || 0;
  const dy = G.touchStartY - y;
  if (Math.abs(dy) > 10) G._touchMoved = true;
  // 滚动赛事内容
  if (Math.abs(dy) > 5 && (G.screen === 'match' || G.screen === 'standings')) {
    G.scrollY = Math.max(-400, Math.min(SAFE_TOP, G.scrollY + dy));
  }
});

wx.onTouchEnd(e => {
  if (!e.changedTouches || !e.changedTouches[0]) return;
  const x = e.changedTouches[0].clientX || e.changedTouches[0].x || 0;
  const y = e.changedTouches[0].clientY || e.changedTouches[0].y || 0;
  if (G._touchMoved) { G._touchMoved = false; return; }
  for (let i = G.btns.length - 1; i >= 0; i--) {
    const b = G.btns[i];
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      console.log('[TAP]', b.id);
      handle(b.id);
      return;
    }
  }
  console.log('[MISS]', x.toFixed(0), y.toFixed(0), 'btns:', G.btns.length, 'screen:', G.screen);
});

// ====== 导航 ======
function handle(id) {
  if (id === 'home') { exitMatch(); G.screen = 'home'; }
  else if (id === 'back') {
    if (G.screen === 'tactics') { lastSub = null; pendingSubs = []; G.screen = 'match'; }
    else if (G.screen === 'penalty') { G._penSlots = []; G.screen = 'match'; }
    else { exitMatch(); G.screen = 'home'; }
  }
  else if (id === 'teams') { exitMatch(); G.screen = 'teams'; }
  else if (id === 'standings') { if (G.screen === 'match') saveMatchResult(); G.scrollY = 0; G.standingsTab = 0; G.screen = 'standings'; }
  else if (id.startsWith('stab_')) { G.standingsTab = parseInt(id.slice(5)); }
  else if (id === 'play') {
    if (!G.user) { wx.showToast({ title: '请先选择球队', icon: 'none' }); G.screen = 'teams'; return; }
    if (!G.groupMatches.length) initGroupStage();
    autoLineup(); G.screen = 'squad';
  }
  else if (id === 'go') {
    // 重置换人标记
    if (G.user) G.user.players.forEach(p => { p._subbedOut = false; });
    console.log('[GO] user:', !!G.user, 'groupMatches:', G.groupMatches.length, 'slots:', !!G.slots);
    exitMatch();
    const next = findNextGroupMatch();
    console.log('[GO] next match:', next?.opp?.name);
    let opp = next ? next.opp : G.koOpponent;
    if (!opp || opp.id === G.user?.id) opp = G.all.find(t => t.id !== G.user?.id && t.group !== G.user?.group);
    if (!opp || opp.id === G.user?.id) opp = G.all.find(t => t.id !== G.user?.id);
    G.opp = opp || G.all[0];
    console.log('[GO] opp:', G.opp?.name);
    G.phase = next ? 'group' : G.phase;
    sim();
    G.scrollY = 0;
    G.screen = 'match';
  }
  else if (id === 'next') {
    saveMatchResult();
    autoLineup(); G.screen = 'squad';
  }
  else if (id === 'over') { G.tournamentOver = true; G.screen = 'gameover'; }
  else if (id === 'knockout') {
    saveMatchResult();
    const qual = initKnockout();
    if (!qual) G.screen = 'gameover';
    else { autoLineup(); G.screen = 'squad'; }
  }
  else if (id === 'nextKo') {
    saveMatchResult();
    // 淘汰赛输了就结束了
    const userWin = G.isPen ? G.penH > G.penA : G.gh > G.ga;
    if (!userWin) { G.tournamentOver = true; G.screen = 'gameover'; return; }
    G.koRound++;
    if (G.koRound >= 4) { G.screen = 'champion'; G.tournamentOver = true; return; }
    else {
      const pool = G.all.filter(t => t.id !== G.user?.id && t.group !== G.user?.group);
      G.koOpponent = pool[Math.floor(Math.random() * pool.length)] || G.all.find(t => t.id !== G.user?.id);
      G.opp = G.koOpponent; G.phase = 'knockout'; sim(); G.screen = 'match';
    }
  }
  else if (id === 'champ') { G.tournamentOver = true; G.screen = 'champion'; }
  else if (id === 'nextEv') { nextEvent(); }  // 播放下一个事件
  else if (id === 'sub') { subMode = 1; subOutId = null; }   // 进入换人模式
  else if (id === 'subc') { subMode = 0; subOutId = null; }  // 取消选择
  else if (id.startsWith('undo_')) {  // 撤销指定换人
    const idx = parseInt(id.slice(5));
    const sub = pendingSubs[idx];
    if (sub) {
      const pOut = G.user.players.find(p => p.id === sub.pOut);
      const pIn = G.user.players.find(p => p.id === sub.pIn);
      if (pOut && pIn) { pOut.isStarter = true; pOut._subbedOut = false; pIn.isStarter = false; subsRemaining++; if (G.slots) { const sl = G.slots.find(s => s.pid === sub.pIn); if (sl) sl.pid = sub.pOut; } }
      G.ev = G.ev.filter(e => !(e.t === 'sub' && e.p === pIn?.name));
      G.allEv = G.allEv.filter(e => !(e.t === 'sub' && e.p === pIn?.name));
      G.shownIdx = Math.max(0, G.shownIdx - 1);
      pendingSubs.splice(idx, 1);
      if (pendingSubs.length === 0) lastSub = null;
    }
  }
  else if (id.startsWith('penPick_')) {
    const pid = id.slice(8);
    if (!G._penSlots) G._penSlots = [];
    if (!G._penSlots.includes(pid) && G._penSlots.length < 5) G._penSlots.push(pid);
  }
  else if (id === 'penClear') { G._penSlots = []; }
  else if (id === 'penGo') {
    if (!G._penSlots || G._penSlots.length < 5) return;
    const takers = G._penSlots.map(pid => G.user.players.find(p => p.id === pid)).filter(Boolean);
    const oppTakers = G.opp.players.filter(p => ['ST','CF','CAM','CM'].includes(p.position)).slice(0, 5);
    // 生成全部点球事件
    G._penEvents = [];
    let hp = 0, ap = 0;
    const addPen = (round, taker, isUser, scored) => {
      const desc = scored
        ? taker.name + ' 一蹴而就！稳稳命中！🥅'
        : taker.name + ' 射门被门将扑出！错失良机！❌';
      G._penEvents.push({ round, p: taker.name, user: isUser, scored, desc });
    };
    for (let i = 0; i < 5; i++) {
      const ut = takers[i];
      const us = ut ? (ut.attributes.shooting + ut.attributes.skill) / 2 : 70;
      const uScored = Math.random() < us / 100 + 0.15;
      if (uScored) { hp++; addPen(i+1, ut, true, true); }
      else { addPen(i+1, ut, true, false); }

      const ot = oppTakers[i];
      const oScored = Math.random() < 0.78;
      if (oScored) { ap++; addPen(i+1, ot, false, true); }
      else { addPen(i+1, ot, false, false); }

      if (i >= 4 && hp !== ap) break;
    }
    // 突然死亡
    let sd = 0;
    while (hp === ap) {
      const ut = takers[(hp + sd) % takers.length];
      const us = ut ? (ut.attributes.shooting + ut.attributes.skill) / 2 : 70;
      const uScored = Math.random() < us / 100 + 0.15;
      if (uScored) { hp++; addPen('SD', ut, true, true); }
      else { addPen('SD', ut, true, false); }

      const ot = oppTakers[(ap + sd) % oppTakers.length];
      const oScored = Math.random() < 0.78;
      if (oScored) { ap++; addPen('SD', ot, false, true); }
      else { addPen('SD', ot, false, false); }
      sd++;
    }
    G.penH = hp; G.penA = ap; G.isPen = true;
    G._needsPenTakers = false; G._penSlots = [];
    G._penIdx = 0; G._penDone = false;
    G.screen = 'match';
  }
  else if (id.startsWith('subo_')) {
    const pid = id.slice(5);
    if (pid && subsRemaining > 0) { subOutId = pid; subMode = 1; }
  }
  else if (id.startsWith('subi_')) {  // 选了要换上的，执行换人
    const inId = id.slice(5);
    if (subOutId && subsRemaining > 0) {
      const pOut = G.user.players.find(p => p.id === subOutId);
      const pIn = G.user.players.find(p => p.id === inId);
      // 同位置验证
      const slot = G.slots?.find(s => s.pid === subOutId);
      const ok = !slot || slot.r.includes(pIn?.position) || pOut?.position === pIn?.position;
      if (pOut && pIn && ok) {
        pOut.isStarter = false; pOut._subbedOut = true; pIn.isStarter = true;
        // 更新场上位置
        if (G.slots) { const sl = G.slots.find(s => s.pid === subOutId); if (sl) sl.pid = inId; }
        subsRemaining--;
        // 中场休息不计暂停次数
        if (!isHalfTime() && !G._tacticStopUsed && subStops > 0) { subStops--; G._tacticStopUsed = true; }
        const subDesc = SUB_TXT[Math.floor(Math.random()*SUB_TXT.length)].replace('{p1}', pOut.name).replace('{p2}', pIn.name);
        // 换人时间基于当前比赛时刻 (确保不超过半场)
        const lastMin = G.ev.length > 0 ? G.ev[G.ev.length-1].m : 0;
        const inFirstHalf = lastMin <= 45 && !isHalfTime();
        const ht = isHalfTime();
        const subMin = ht ? 45 : (inFirstHalf ? Math.min(lastMin + 2, 44) : Math.max(lastMin + 1, 47));
        G.ev.push({ m: subMin, t: 'sub', p: pIn.name, d: subDesc });
        G.ev.sort((a, b) => a.m - b.m);
        // 插入到 allEv 并跳过 (已显示)
        G.allEv.splice(G.shownIdx, 0, { m: subMin, t: 'sub', p: pIn.name, d: subDesc });
        G.shownIdx++;
        // 记录本次换人，允许撤销
        lastSub = { pOut: subOutId, pIn: inId };
        pendingSubs.push({ pOut: subOutId, pIn: inId });
      }
    }
    subMode = 0; subOutId = null;
  }
  else if (id === 'reset') { G.user = null; G.groupMatches = []; G.slots = null; G.koRound = 0; G.phase = 'group'; G.tournamentOver = false; G.ev = []; G.opp = null; G.gh = 0; G.ga = 0; G.isEt = false; G.isPen = false; G._groupOthers = null; G._otherMatches = null; G._matchCache = null; subsRemaining = 5; subStops = 3; G.screen = 'home'; }
  else if (id.startsWith('t_')) { G.user = G.all.find(t => t.id === id.slice(2)); G.groupMatches = []; G.slots = null; G.screen = 'home'; }
  else if (id.startsWith('f_')) { G.form = id.slice(2); autoLineup(); }
  else if (id.startsWith('tf_')) { G.form = id.slice(3); autoLineup(); }
  else if (id.startsWith('ment_')) { G.mentality = id.slice(5); }
  else if (id === 'tactic') { G.screen = 'tactics'; G._tacticStopUsed = false; }
  else if (id === 'nextKoBracket') { exitMatch(); G.opp = G.koOpponent; G.phase = 'knockout'; sim(); G.scrollY = 0; G.screen = 'match'; }
  else if (id === 'penTakers') { G.screen = 'penalty'; G._penSlots = []; }
  else if (id === 'nextPen') { G._penIdx = (G._penIdx || 0) + 1; }
  else if (id === 'penResult') { G._penDone = true; G._penIdx = 0; }  // 进入战术页，重置暂停标记
  else if (id.startsWith('s_')) G.sel = parseInt(id.slice(2));
  else if (id.startsWith('pl_')) {
    const pid = id.slice(3);
    const pl = G.user.players.find(p => p.id === pid);
    if (!pl || pl._suspended) return;
    if (pl.isStarter) {
      // 首发→替补: 清空位置
      pl.isStarter = false;
      if (G.slots) { const sl = G.slots.find(s => s.pid === pid); if (sl) sl.pid = null; }
    } else {
      // 替补→首发: 找同位置空位, 没有则自动替换同位置首发
      if (G.slots) {
        let slot = G.slots.find(s => !s.pid && s.r.includes(pl.position));
        if (slot) { slot.pid = pid; pl.isStarter = true; }
        else {
          // 自动交换: 找同位置首发替换
          slot = G.slots.find(s => s.r.includes(pl.position));
          if (slot && slot.pid) {
            const old = G.user.players.find(p => p.id === slot.pid);
            if (old) old.isStarter = false;
            slot.pid = pid;
            pl.isStarter = true;
          }
        }
      } else { pl.isStarter = true; }
    }
  }
  else if (id.startsWith('p_') && G.sel >= 0 && G.slots) {
    const pid = id.slice(2), sl = G.slots[G.sel];
    console.log('[P_] selecting player', pid, 'for slot', G.sel, 'slot roles:', sl?.r);
    const pl = G.user.players.find(p => p.id === pid);
    if (pl && sl && sl.r.includes(pl.position)) {
      // 如果球员已在其他位置，先清掉
      G.slots.forEach(s => { if (s.pid === pid) s.pid = null; });
      sl.pid = pid;
      G.user.players.forEach(p => p.isStarter = false);
      G.slots.forEach(s => { if (s.pid) { const pp = G.user.players.find(ppp => ppp.id === s.pid); if (pp) pp.isStarter = true; } });
    }
  }
}

// ====== 启动 ======
try { const d = require('./data.js'); G.all = d.teams; console.log('[Game]', G.all.length, 'teams'); } catch (e) { console.error(e); }
requestAnimationFrame(loop);
