const app = getApp();
const data = require('../../utils/data');
const predict = require('../../utils/predict');
const odds = require('../../utils/odds');
const names = require('../../utils/names');

// Live data from GitHub Pages
let liveOdds = {};
let liveInfo = {};
let matchDetails = {};

wx.request({
  url: 'https://waynecho123.github.io/worldcup/match-details.json',
  timeout: 10000,
  success: function(res) { if (res.data) matchDetails = res.data; }
});

Page({
  data: {
    match: null,
    pred: null,
    analysis: null,
    topScores: [],
    htFT: [],
    goalDist: [],
    histData: null,
    homeLineup: null,
    awayLineup: null,
    liveOdds: null,
    liveInjuries: null,
    marketConsensus: null,
    postReview: null,
    actualResult: null,
    showPreMatch: false,
    loading: true,
    // Post-match visual
    hasReview: false,
    reviewScore: null,
    statBars: [],
    goalTimeline: [],
    playerRatings: [],
    reviewText: ''
  },

  togglePreMatch() {
    this.setData({ showPreMatch: !this.data.showPreMatch });
  },

  onLoad(options) {
    const matchId = options.id;
    if (!matchId) { this.setData({ loading: false }); return; }
    this.buildDetail(matchId);
  },

  buildDetail(matchId) {
    const m = data.MATCH_SCHEDULE.find(x => x.id === matchId);
    if (!m) { this.setData({ loading: false }); return; }

    const ht = data.TEAMS.find(t => t.id === m.home);
    const at = data.TEAMS.find(t => t.id === m.away);
    if (!ht || !at) { this.setData({ loading: false }); return; }

    // Core prediction — pass live odds for market consensus
    const apiOdds = liveOdds[matchId] || null;
    const pred = predict.predictMatch(ht, at, apiOdds);
    const mol = data.MATCH_ODDS[matchId];

    // Top scores
    const topScoresList = odds.topScores(pred.expH, pred.expA, 6);

    // Half-time / full-time distribution
    const htftData = odds.calcHtFt(pred.expH, pred.expA);
    const htftResults = [
      { label: '胜-胜', prob: htftData.htH * pred.homeWinProb },
      { label: '平-胜', prob: htftData.htD * pred.homeWinProb },
      { label: '胜-平', prob: htftData.htH * pred.drawProb },
      { label: '平-平', prob: htftData.htD * pred.drawProb },
      { label: '负-胜', prob: htftData.htA * pred.homeWinProb },
      { label: '平-负', prob: htftData.htD * pred.awayWinProb },
      { label: '负-平', prob: htftData.htA * pred.drawProb },
      { label: '负-负', prob: htftData.htA * pred.awayWinProb },
      { label: '胜-负', prob: htftData.htH * pred.awayWinProb }
    ].sort((a, b) => b.prob - a.prob);
    const htftSum = htftResults.reduce((s, v) => s + v.prob, 0);
    htftResults.forEach(r => r.prob = r.prob / htftSum);

    // Total goals distribution
    const totG = odds.calcTotalGoals(pred.expH, pred.expA);

    // Historical data
    let histData = null;
    if (mol) {
      const hist = odds.getHistoricalDistribution(mol.h, mol.d, mol.a);
      if (hist && hist.total >= 3) {
        histData = {
          total: hist.total,
          hRate: (hist.hRate * 100).toFixed(0),
          dRate: (hist.dRate * 100).toFixed(0),
          aRate: (hist.aRate * 100).toFixed(0),
          hWins: hist.hWins,
          draws: hist.draws,
          aWins: hist.aWins,
          bucket: hist.coarseBucket || '',
          totalDataset: hist.totalDataset || 9557
        };
      }
    }

    // Fair odds
    let fairProbs = null;
    if (mol) {
      const fair = odds.oddsToFairProb(mol.h, mol.d, mol.a);
      fairProbs = {
        home: (fair.home * 100).toFixed(0),
        draw: (fair.draw * 100).toFixed(0),
        away: (fair.away * 100).toFixed(0)
      };
    }

    // Lineups — process player names to Chinese + jersey
    const fmtLineup = (lu) => {
      if (!lu) return null;
      const toP = (n) => {
        const clean = n.replace('(C)', '').trim();
        return {
          name: clean,
          cn: data.cnName(clean),
          num: data.JERSEY_NUM[clean] || data.JERSEY_NUM[n] || '?',
          isCaptain: n.includes('(C)')
        };
      };
      const all = [];
      if (lu.g) all.push(toP(lu.g));
      (lu.d || []).forEach(n => all.push(toP(n)));
      (lu.m || []).forEach(n => all.push(toP(n)));
      (lu.fwd || []).forEach(n => all.push(toP(n)));
      if (lu.subs) lu.subs.split(',').forEach(n => all.push(toP(n.trim())));
      return { f: lu.f, players: all, note: lu.note || '' };
    };
    const hLu = fmtLineup(data.STARTING_XI[m.home]);
    const aLu = fmtLineup(data.STARTING_XI[m.away]);
    // Cross-reference injuries with lineup: mark absent players
    const markInjured = (lu, team) => {
      if (!lu || !team.inj) return;
      const injNames = team.inj.toLowerCase();
      lu.players.forEach(p => {
        if (injNames.includes(p.name.toLowerCase()) || injNames.includes(p.cn)) {
          p.isInjured = true;
        }
      });
      if (team.inj && lu.note) lu.note = team.inj + ' | ' + lu.note;
    };
    markInjured(hLu, ht);
    markInjured(aLu, at);

    // Live injuries from API
    const apiInfo = liveInfo[matchId] || null;

    // Generate textual analysis with live data
    const analysis = this.generateAnalysis(m, ht, at, pred, mol, apiInfo);

    // Post-match review: only for finished matches with actual results
    const actualResult = app.globalData.actualResults[matchId];
    let postReview = null;
    let reviewData = { hasReview: false, reviewScore: null, statBars: [], goalTimeline: [], playerRatings: [], reviewText: '' };
    if (actualResult && actualResult.homeScore !== undefined) {
      postReview = this.generatePostMatchReview(m, ht, at, pred, actualResult, apiInfo);
      // Build visual review data from matchDetails
      var detail = matchDetails[matchId];
      if (detail) {
        reviewData.hasReview = true;
        reviewData.reviewScore = {
          homeFlag: ht.flag, homeName: ht.cn, homeScore: actualResult.homeScore,
          awayFlag: at.flag, awayName: at.cn, awayScore: actualResult.awayScore,
          predH: pred.predScore[0], predA: pred.predScore[1],
          outcomeColor: actualResult.homeScore > actualResult.awayScore ? '#2563eb' : actualResult.homeScore === actualResult.awayScore ? '#7c3aed' : '#dc2626'
        };
        // Stat bars
        var hStats = detail.statistics ? (detail.statistics[detail.homeTeam] || {}) : {};
        var aStats = detail.statistics ? (detail.statistics[detail.awayTeam] || {}) : {};
        var statKeys = [
          {key:'Ball Possession',label:'控球率',suf:'%'},
          {key:'Expected Goals',label:'预期进球',suf:''},
          {key:'Total Shots',label:'射门',suf:''},
          {key:'Shots on Goal',label:'射正',suf:''},
          {key:'Passes %',label:'传球成功率',suf:'%'},
          {key:'Corner Kicks',label:'角球',suf:''},
        ];
        statKeys.forEach(function(sk){
          var hv = parseFloat(hStats[sk.key]) || 0, av = parseFloat(aStats[sk.key]) || 0;
          if (hv === 0 && av === 0) return;
          var total = hv + av || 1;
          reviewData.statBars.push({
            label: sk.label,
            homeVal: sk.suf==='%' ? hv+'%' : (sk.key==='Expected Goals'? hv.toFixed(1) : Math.round(hv)),
            awayVal: sk.suf==='%' ? av+'%' : (sk.key==='Expected Goals'? av.toFixed(1) : Math.round(av)),
            homePct: Math.round(hv/total*100),
            awayPct: Math.round(av/total*100)
          });
        });
        // Goal timeline
        var events = detail.events || [];
        var goals = events.filter(function(e){return e.type==='Goal';});
        var reds = events.filter(function(e){return e.type==='Card' && e.detail==='Red Card';});
        var keyEvents = goals.concat(reds).sort(function(a,b){return parseInt(a.time)-parseInt(b.time);});
        keyEvents.forEach(function(e){
          reviewData.goalTimeline.push({
            time: e.time,
            player: e.player,
            teamName: e.team === detail.homeTeam ? ht.cn : at.cn,
            isGoal: e.type === 'Goal',
            isRed: e.type === 'Card',
            assist: e.assist || '',
            penalty: e.detail === 'Penalty'
          });
        });
        // Player ratings
        var players = detail.players || [];
        players.forEach(function(td){
          var top3 = (td.players||[]).filter(function(p){return p.rating;}).sort(function(a,b){return parseFloat(b.rating)-parseFloat(a.rating);}).slice(0,3);
          top3.forEach(function(p){
            reviewData.playerRatings.push({
              teamName: td.team === detail.homeTeam ? ht.cn : at.cn,
              teamFlag: td.team === detail.homeTeam ? ht.flag : at.flag,
              name: p.name,
              rating: p.rating,
              ratingPct: Math.round(parseFloat(p.rating)/10*100),
              goals: p.goals||0,
              assists: p.assists||0,
              color: parseFloat(p.rating) >= 7.5 ? '#16a34a' : parseFloat(p.rating) >= 6.5 ? '#ea580c' : '#dc2626'
            });
          });
        });
      }
    }

    // Update info
    const predLog = app.globalData.predLog || {};
    const logEntry = predLog[matchId];
    let updateInfo = '';
    if (logEntry && logEntry.lastUpdate) {
      const lu = new Date(logEntry.lastUpdate);
      const now = new Date();
      const diffMin = Math.floor((now - lu) / 60000);
      const ago = diffMin < 3 ? '刚刚' : diffMin < 60 ? diffMin+'分钟前' : Math.floor(diffMin/60)+'小时前';
      updateInfo = '🕐 ' + ago + '更新' + (logEntry.reason && logEntry.reason !== '定期更新' ? ' · '+logEntry.reason : '');
    }
    const apiInjuries = apiInfo ? apiInfo.injuries || [] : [];
    const homeInjuries = apiInjuries.filter(function(i) { return i.teamType === 'home'; });
    const awayInjuries = apiInjuries.filter(function(i) { return i.teamType === 'away'; });

    // Team stats from feature data
    const teamStats = apiInfo && apiInfo.feature ? {
      homeAvgGoals: apiInfo.feature.homeTeamAvgGoals || '-',
      awayAvgGoals: apiInfo.feature.awayTeamAvgGoals || '-',
      homeAvgLoss: apiInfo.feature.homeTeamAvgLossGoals || '-',
      awayAvgLoss: apiInfo.feature.awayTeamAvgLossGoals || '-',
      homeHomeWins: apiInfo.feature.homeTeamHomeWins || 0,
      homeHomeDraws: apiInfo.feature.homeTeamHomeDraws || 0,
      homeHomeLosses: apiInfo.feature.homeTeamHomeLosses || 0,
      awayAwayWins: apiInfo.feature.awayTeamAwayWins || 0,
      awayAwayDraws: apiInfo.feature.awayTeamAwayDraws || 0,
      awayAwayLosses: apiInfo.feature.awayTeamAwayLosses || 0,
    } : null;

    // Market consensus (AI vs live odds)
    const marketConsensus = pred.marketConsensus || null;

    this.setData({
      match: {
        id: m.id, date: m.date, time: m.time, venue: m.venue || 'TBD',
        group: m.grp, stage: m.stage,
        homeFlag: ht.flag, homeName: ht.cn, homeRank: ht.rk,
        homeAtt: ht.att, homeDef: ht.def, homeStr: predict.getStrength(ht).toFixed(1),
        homeNews: ht.news || '', homeInj: ht.inj || '',
        awayFlag: at.flag, awayName: at.cn, awayRank: at.rk,
        awayAtt: at.att, awayDef: at.def, awayStr: predict.getStrength(at).toFixed(1),
        awayNews: at.news || '', awayInj: at.inj || ''
      },
      pred: {
        score: pred.topScores.map(function(s) { return s.home + ':' + s.away; }).join(' · '),
        scores: pred.topScores,
        homeProb: (pred.homeWinProb * 100).toFixed(0),
        drawProb: (pred.drawProb * 100).toFixed(0),
        awayProb: (pred.awayWinProb * 100).toFixed(0),
        expH: pred.expH.toFixed(1),
        expA: pred.expA.toFixed(1),
        tacNarrative: (pred.tacAnalysis && pred.tacAnalysis.narrative) || '',
        tacAdjPct: (pred.tacAnalysis && pred.tacAnalysis.adjPct) || '',
        tacKeyPoints: (pred.tacAnalysis && pred.tacAnalysis.keyPoints) || [],
        homeStyle: (pred.tacAnalysis && pred.tacAnalysis.homeStyle) || '',
        awayStyle: (pred.tacAnalysis && pred.tacAnalysis.awayStyle) || '',
        tacticalAdj: pred.tacticalAdj
      },
      liveOdds: apiOdds,
      liveInjuries: apiInjuries,
      homeInjuries: homeInjuries,
      awayInjuries: awayInjuries,
      teamStats: teamStats,
      marketConsensus: marketConsensus,
      odds: mol ? { h: mol.h.toFixed(2), d: mol.d.toFixed(2), a: mol.a.toFixed(2) } : null,
      fairProbs,
      topScores: topScoresList.slice(0, 6).map(s => ({
        score: s.h + ':' + s.a,
        prob: (s.prob * 100).toFixed(1),
        isBest: pred.topScores.some(function(t) { return t.home === s.h && t.away === s.a; })
      })),
      htFT: htftResults.slice(0, 5).map(r => ({
        label: r.label, prob: (r.prob * 100).toFixed(1)
      })),
      goalDist: totG.labels.map((l, i) => ({
        label: l, prob: (totG.dist[i] * 100).toFixed(0),
        isExpected: i === Math.round(pred.expH + pred.expA)
      })),
      expTotalGoals: (pred.expH + pred.expA).toFixed(1),
      histData,
      homeLineup: hLu || null,
      awayLineup: aLu || null,
      analysis,
      postReview,
      hasReview: reviewData.hasReview,
      reviewScore: reviewData.reviewScore,
      statBars: reviewData.statBars,
      goalTimeline: reviewData.goalTimeline,
      playerRatings: reviewData.playerRatings,
      reviewText: reviewData.reviewText,
      actualResult,
      updateInfo,
      loading: false
    });
  },

  generateAnalysis(m, ht, at, pred, mol, apiInfo) {
    const hTac = data.TACTICAL[ht.id] || {};
    const aTac = data.TACTICAL[at.id] || {};
    const hStr = predict.getStrength(ht), aStr = predict.getStrength(at);
    const gap = Math.abs(hStr - aStr);
    const gapDesc = gap > 15 ? '实力悬殊' : gap > 8 ? '差距明显' : gap > 4 ? '实力接近' : '势均力敌';
    const fav = hStr > aStr ? ht.cn : at.cn;
    const favProb = hStr > aStr ? (pred.homeWinProb*100).toFixed(0) : (pred.awayWinProb*100).toFixed(0);
    const parts = [];

    parts.push('📋 【比赛概述】本场' + ht.cn + '对阵' + at.cn + '，AI模型评定为"' + gapDesc + '"（' + fav + '取胜概率' + favProb + '%）。' + ht.cn + 'FIFA排名第' + ht.rk + '位，综合实力' + hStr.toFixed(1) + '；' + at.cn + 'FIFA排名第' + at.rk + '位，综合实力' + aStr.toFixed(1) + '。');

    // Live data: recent form
    if (apiInfo && apiInfo.recentForm && apiInfo.recentForm.home) {
      var hForm = apiInfo.recentForm.home;
      var aForm = apiInfo.recentForm.away || {};
      var feat = apiInfo.feature || {};
      parts.push('📊 【近期战绩】' + ht.cn + '：近' + (parseInt(hForm.homeTeamWins||0) + parseInt(hForm.homeTeamDraws||0) + parseInt(hForm.homeTeamLosses||0)) + '场 ' + hForm.homeTeamWins + '胜' + hForm.homeTeamDraws + '平' + hForm.homeTeamLosses + '负，胜率' + (hForm.homeTeamWinRate || '?') + '，场均进' + (feat.homeTeamAvgGoals || '?') + '球。' + at.cn + '：近' + (parseInt(aForm.awayTeamWins||0) + parseInt(aForm.awayTeamDraws||0) + parseInt(aForm.awayTeamLosses||0)) + '场 ' + (aForm.awayTeamWins||'?') + '胜' + (aForm.awayTeamDraws||'?') + '平' + (aForm.awayTeamLosses||'?') + '负，胜率' + (aForm.awayTeamWinRate || '?') + '。');
    }

    if (hTac.strength) parts.push('💪 【' + ht.cn + '优势】' + hTac.strength + '。短板：' + (hTac.weakness || '暂无明显短板') + '。');
    if (aTac.strength) parts.push('💪 【' + at.cn + '优势】' + aTac.strength + '。短板：' + (aTac.weakness || '暂无明显短板') + '。');

    if (pred.tacAnalysis) {
      let tac = '⚔️ 【战术博弈】' + pred.tacAnalysis.narrative + '（' + pred.tacAnalysis.adjPct + '）。';
      if (pred.tacAnalysis.keyPoints && pred.tacAnalysis.keyPoints.length > 0) {
        tac += '关键点：' + pred.tacAnalysis.keyPoints.slice(0,3).join('；') + '。';
      }
      parts.push(tac);
    }

    parts.push('⭐ 【核心球员】' + ht.cn + '：' + ht.stars.slice(0,2).join('、') + '。' + at.cn + '：' + at.stars.slice(0,2).join('、') + '。');

    // Market consensus from live odds
    if (pred.marketConsensus) {
      parts.push('🏷️ 【机构参考】' + pred.marketConsensus.label + '。机构隐含概率：' + ht.cn + '胜' + pred.marketConsensus.mktHome + '% / 平' + pred.marketConsensus.mktDraw + '% / ' + at.cn + '胜' + pred.marketConsensus.mktAway + '%。');
    }

    var topStr = pred.topScores.map(function(s) { return s.home + ':' + s.away; }).join(' · ');
    parts.push('🎯 【比分预测】AI预期进球' + pred.expH.toFixed(1) + '-' + pred.expA.toFixed(1) + '，最可能比分TOP3：' + topStr + '。模型推演' + ht.cn + '胜' + (pred.homeWinProb*100).toFixed(0) + '% / 平' + (pred.drawProb*100).toFixed(0) + '% / ' + at.cn + '胜' + (pred.awayWinProb*100).toFixed(0) + '%。');

    // Live injuries from API
    if (apiInfo && apiInfo.injuries && apiInfo.injuries.length > 0) {
      var injNames = apiInfo.injuries.map(function(i) {
        return (i.playerName || i.player) + (i.reason ? '(' + i.reason + ')' : '') + (i.isSuspended ? '[停赛]' : '');
      }).join('、');
      parts.push('🏥 【实时伤停】' + injNames + '。');
    } else if (ht.inj || at.inj) {
      let inj = '🏥 【伤病影响】';
      if (ht.inj) inj += ht.cn + '：' + ht.inj.replace(/[🔴⚠️]/g,'').trim() + '。';
      if (at.inj) inj += at.cn + '：' + at.inj.replace(/[🔴⚠️]/g,'').trim() + '。';
      parts.push(inj);
    }

    // Head-to-head history
    if (apiInfo && apiInfo.history && parseInt(apiInfo.history.totalMatches) > 0) {
      var hist = apiInfo.history;
      parts.push('📜 【历史交锋】双方交手' + hist.totalMatches + '次，' + ht.cn + ' ' + hist.wins + '胜' + hist.draws + '平' + hist.losses + '负，胜率' + (hist.winRate || '?') + '。');
    }

    const closeProb = Math.max(pred.homeWinProb, pred.drawProb, pred.awayWinProb);
    const closeResult = closeProb === pred.homeWinProb ? ht.cn+'取胜' : closeProb === pred.awayWinProb ? at.cn+'取胜' : '平局收场';
    const confidence = closeProb > 0.6 ? '较高信心' : closeProb > 0.45 ? '中等信心' : '偏低信心';
    parts.push('🔮 【综合研判】模型倾向' + closeResult + '（' + confidence + '）。走势将由' + (gap > 8 ? fav+'的发挥决定' : '双方临场和中场争夺决定') + '。');

    return parts;
  },

  /** Post-match review: AI reflects on its prediction vs actual result */
  generatePostMatchReview(m, ht, at, pred, actual, apiInfo) {
    const parts = [];
    const actH = actual.homeScore, actA = actual.awayScore;
    const predH = pred.predScore[0], predA = pred.predScore[1];
    const actualDiff = actH - actA;
    const predDiff = predH - predA;
    const goalErr = Math.abs(actH - pred.expH) + Math.abs(actA - pred.expA);
    const totalGoals = actH + actA;
    const predTotal = pred.expH + pred.expA;

    // Outcome correctness
    const predOutcome = predH > predA ? 'home' : predH === predA ? 'draw' : 'away';
    const actualOutcome = actH > actA ? 'home' : actH === actA ? 'draw' : 'away';
    const outcomeCorrect = predOutcome === actualOutcome;
    const exactCorrect = predH === actH && predA === actA;

    // Which probability did AI assign to the actual outcome?
    const actualProb = actualOutcome === 'home' ? pred.homeWinProb :
                       actualOutcome === 'draw' ? pred.drawProb : pred.awayWinProb;
    const probPct = (actualProb * 100).toFixed(0);
    const probLevel = actualProb > 0.5 ? '高置信区间(>50%)' :
                      actualProb > 0.35 ? '中等置信区间(35-50%)' :
                      actualProb > 0.2 ? '低置信区间(20-35%)' : '极低概率(<20%)';

    // Overview
    const resultDesc = actH + ':' + actA;
    const predDesc = predH + ':' + predA;
    const icon = exactCorrect ? '🎯' : outcomeCorrect ? '✅' : '❌';
    const verdict = exactCorrect ? '比分完全命中！AI模型精准捕捉了本场比赛。' :
                    outcomeCorrect ? '胜负方向判断正确，但比分有偏差。' :
                    '预测错误，模型对本场判断出现较大偏差。';
    parts.push('📋 【赛后复盘】' + ht.cn + ' ' + resultDesc + ' ' + at.cn + '。AI赛前预测' + predDesc + '。' + icon + ' ' + verdict);

    // 1. Strength review
    const hStr = predict.getStrength(ht), aStr = predict.getStrength(at);
    const strGap = hStr - aStr;
    const strPredictedFav = strGap > 4 ? ht.cn : strGap < -4 ? at.cn : '势均力敌';
    const strAssessment = (strGap > 4 && actualOutcome === 'home') || (strGap < -4 && actualOutcome === 'away')
      ? '✅ 准确：实力较强一方顺利取胜，模型评分合理。'
      : (strGap > 4 && actualOutcome !== 'home')
        ? '❌ 偏差：实力占优的' + ht.cn + '未能取胜，模型可能高估了实力差距（' + strGap.toFixed(1) + '分）。'
        : (strGap < -4 && actualOutcome !== 'away')
          ? '❌ 偏差：实力占优的' + at.cn + '未能取胜，模型可能高估了实力差距。'
          : '⚖️ 双方实力接近（差距' + Math.abs(strGap).toFixed(1) + '分），比赛结果在合理范围内。';
    parts.push('📊 【实力复盘】AI评分 ' + ht.cn + ' ' + hStr.toFixed(1) + ' vs ' + at.cn + ' ' + aStr.toFixed(1) + '，预判' + strPredictedFav + '占优。实际：' + strAssessment);

    // 2. Tactical review
    if (pred.tacAnalysis) {
      const tacAdj = pred.tacticalAdj || 0;
      const tacDir = tacAdj > 0.02 ? ht.cn + '战术占优' : tacAdj < -0.02 ? at.cn + '战术占优' : '战术层面互有制衡';
      const tacCheck = (tacAdj > 0.02 && actualOutcome === 'home') || (tacAdj < -0.02 && actualOutcome === 'away')
        ? '✅ 战术克制关系被实际比赛验证。'
        : (tacAdj > 0.02 && actualOutcome !== 'home')
          ? '⚠️ 预测' + ht.cn + '战术占优，但未能转化为胜势，战术克制可能被高估。'
          : (tacAdj < -0.02 && actualOutcome !== 'away')
            ? '⚠️ 预测' + at.cn + '战术占优，但未能转化为胜势。'
            : '⚖️ 战术层面预测基本中性，与实际走势一致。';
      parts.push('⚔️ 【战术复盘】赛前分析：' + pred.tacAnalysis.narrative + '（调整' + pred.tacAnalysis.adjPct + '）。实际：' + tacCheck);
    }

    // 3. Score review
    const goalDiffErr = Math.abs(actualDiff - predDiff);
    const totalGoalErr = Math.abs(totalGoals - predTotal);
    const scoreVerdict = exactCorrect ? '🎯 完美命中！AI精确预测了比分。' :
                         goalDiffErr === 0 ? '✅ 净胜球差预测正确（' + (predDiff > 0 ? ht.cn + '赢' + predDiff + '球' : predDiff === 0 ? '平局' : at.cn + '赢' + Math.abs(predDiff) + '球') + '）。' :
                         '⚠️ 净胜球差偏差' + goalDiffErr + '球，总进球偏差' + totalGoalErr.toFixed(1) + '球（预测' + predTotal.toFixed(1) + ' vs 实际' + totalGoals + '）。';
    parts.push('🎯 【比分复盘】AI预测' + predDesc + '（期望进球' + pred.expH.toFixed(1) + '-' + pred.expA.toFixed(1) + '），实际' + resultDesc + '。' + scoreVerdict);

    // 4. Probability review
    parts.push('📈 【概率复盘】AI给出' + ht.cn + '胜' + (pred.homeWinProb * 100).toFixed(0) + '% / 平' + (pred.drawProb * 100).toFixed(0) + '% / ' + at.cn + '胜' + (pred.awayWinProb * 100).toFixed(0) + '%。实际结果为' + (actualOutcome === 'home' ? ht.cn + '胜' : actualOutcome === 'draw' ? '平局' : at.cn + '胜') + '，该结果落在' + probLevel + '（AI赋概率' + probPct + '%）。' + (actualProb > 0.35 ? '模型对此结果有充分预期。' : '这是一个小概率结果，模型对此准备不足。'));

    // 5. Star players
    const hStars = ht.stars ? ht.stars.slice(0, 2).join('、') : '核心球员';
    const aStars = at.stars ? at.stars.slice(0, 2).join('、') : '核心球员';
    parts.push('⭐ 【球星复盘】赛前关注' + ht.cn + '的' + hStars + '与' + at.cn + '的' + aStars + '。球星临场发挥往往是预测偏差的重要来源，建议赛后关注球员评分数据以完善此维度。');

    // 6. Injury impact
    const hasInjuries = (ht.inj || at.inj || (apiInfo && apiInfo.injuries && apiInfo.injuries.length > 0));
    if (hasInjuries) {
      const injSummary = [];
      if (ht.inj) injSummary.push(ht.cn + '：' + ht.inj.replace(/[🔴⚠️]/g, '').trim());
      if (at.inj) injSummary.push(at.cn + '：' + at.inj.replace(/[🔴⚠️]/g, '').trim());
      const injPenalty = ((ht.inj || '').match(/🔴/g) || []).length * 4 + ((ht.inj || '').match(/⚠️/g) || []).length * 2 +
                         ((at.inj || '').match(/🔴/g) || []).length * 4 + ((at.inj || '').match(/⚠️/g) || []).length * 2;
      const injVerdict = (injPenalty >= 6 && actualOutcome !== (strGap > 0 ? 'home' : 'away'))
        ? '⚠️ 伤病影响较大，可能是预测偏差的重要原因。'
        : '伤病影响在可控范围内，未显著改变比赛走势。';
      parts.push('🏥 【伤病复盘】赛前伤停：' + injSummary.join('；') + '。伤病扣分合计' + injPenalty + '分。' + injVerdict);
    } else {
      parts.push('🏥 【伤病复盘】本场双方阵容齐整，无重大伤病影响预测准确性。');
    }

    // 7. Market consensus review
    if (pred.marketConsensus) {
      const mc = pred.marketConsensus;
      const mktDirection = mc.mktFav === 'home' ? ht.cn + '胜' : mc.mktFav === 'away' ? at.cn + '胜' : '平局';
      const whoRight = mc.agree
        ? (actualOutcome === mc.aiFav ? '✅ AI与机构方向一致且均正确。' : '❌ AI与机构方向一致但均判断错误，市场也存在系统性偏差。')
        : (actualOutcome === mc.aiFav ? '💡 AI判断正确而机构方向有误，模型捕捉到了市场未充分定价的信息。' :
           actualOutcome === mc.mktFav ? '⚠️ 机构方向正确而AI判断失误，市场信息（如赔率变动）可能包含了模型未捕捉到的关键信号。' :
           '❌ AI和机构方向均错误，本场结果超出常规预期。');
      parts.push('🏷️ 【机构复盘】赛前' + mc.label + '。机构方向：' + mktDirection + '，AI方向：' + (mc.aiFav === 'home' ? ht.cn + '胜' : mc.aiFav === 'away' ? at.cn + '胜' : '平局') + '。实际：' + whoRight);
    }

    // 8. Upset review
    if (pred.upsetProb !== undefined) {
      const upsetPct = (pred.upsetProb * 100).toFixed(0);
      const isUpset = (hStr > aStr && actualOutcome !== 'home') || (aStr > hStr && actualOutcome !== 'away') || (Math.abs(strGap) <= 4 && actualOutcome === 'away');
      const upsetVerdict = pred.upsetAlert
        ? (isUpset ? '⚠️ 模型成功预警了冷门风险（' + upsetPct + '%），实际确实出现冷门。' : '模型预警了冷门风险（' + upsetPct + '%），但强队顺利取胜，属于过度预警。')
        : (isUpset ? '❌ 模型未预警冷门（风险仅' + upsetPct + '%），但实际爆冷。模型对冷门信号捕捉不足。' : '✅ 模型判断冷门概率低（' + upsetPct + '%），比赛正常走势。');
      parts.push('⚠️ 【冷门复盘】赛前Monte Carlo冷门概率' + upsetPct + '%。' + upsetVerdict);
    }

    // 9. Root cause analysis (when prediction was wrong)
    if (!outcomeCorrect) {
      var favTeam = hStr > aStr ? ht : at;
      var underTeam = hStr > aStr ? at : ht;
      var gap = Math.abs(hStr - aStr);
      var rootCauses = [];
      if (gap > 15 && underTeam.news && /黑马|崛起|强劲|势头|impressive|surprise|giant.killer/i.test(underTeam.news)) {
        rootCauses.push('弱队' + underTeam.cn + '赛前标签"' + underTeam.news + '"被严重低估');
      }
      if (gap > 10) {
        rootCauses.push('实力差距' + gap.toFixed(1) + '分过大，模型对强弱悬殊比赛的冷门概率天然偏低');
      }
      if (favTeam.cn === '葡萄牙' || (favTeam.stars && favTeam.stars.some(function(s){return /Ronaldo|Messi|Modric|Suarez/i.test(s)}))) {
        rootCauses.push(favTeam.cn + '核心球星年龄偏大，模型未对老将状态衰减建模');
      }
      if (underTeam.recent && /4强|亚军|冠军|决赛|semi|final/i.test(underTeam.recent)) {
        rootCauses.push(underTeam.cn + '近期成绩"' + underTeam.recent + '"表明其状态远超标称排名');
      }
      if (/CAF|AFC/.test(underTeam.conf) && gap > 10) {
        rootCauses.push(underTeam.cn + '来自' + (underTeam.conf === 'CAF' ? '非洲' : '亚洲') + '，世界杯历史上该洲球队常以弱胜强');
      }
      if (rootCauses.length === 0) rootCauses.push('实力评分与战术矩阵未能捕捉到本场关键变量');
      parts.push('🔬 【偏差归因】' + rootCauses.join('；') + '。改进方向：引入洲际爆冷先验、动态年龄衰减、近期大赛成绩权重。');
    }

    // 10. Overall summary
    const overallVerdict = exactCorrect ? 'A+ 完美预测' :
                           outcomeCorrect && goalDiffErr <= 1 ? 'A 方向准确，比分接近' :
                           outcomeCorrect ? 'B+ 胜负正确，比分有偏差' :
                           goalDiffErr <= 1 ? 'B 比分接近但方向错误' : 'C 预测出现较大偏差';
    parts.push('🔮 【综合总结】本次预测综合评级：' + overallVerdict + '。' +
      (exactCorrect ? '模型在所有维度上表现优秀。' :
       outcomeCorrect ? '方向判断准确，比分有偏差。' :
       '模型出现偏差，详见偏差归因分析。'));

    return parts;
  }
});
