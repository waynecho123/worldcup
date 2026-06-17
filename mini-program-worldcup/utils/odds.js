// Odds & JC Lottery Analysis Engine - CHO的世界杯小站

const data = require('./data');
const TEAMS = data.TEAMS;
const MATCH_SCHEDULE = data.MATCH_SCHEDULE;
const MATCH_ODDS = data.MATCH_ODDS;
const JC_ODDS = data.JC_ODDS;
const ODDS_STATS = data.ODDS_STATS;
const ODDS_FINE = data.ODDS_FINE;
const HISTORICAL_WC = data.HISTORICAL_WC;
const JC_RETURN_RATE = 0.71;

const predict = require('./predict');

function oddsToFairProb(h, d, a) {
  const raw = 1/h + 1/d + 1/a; // includes margin
  return { home: (1/h)/raw, draw: (1/d)/raw, away: (1/a)/raw };
}

const TOTAL_REAL_MATCHES = 9557;

function getOddsBucket(homeOdds) {
  const o = homeOdds;
  if (o <= 1.15) return '1.01-1.15';
  if (o <= 1.25) return '1.16-1.25';
  if (o <= 1.40) return '1.26-1.40';
  if (o <= 1.55) return '1.41-1.55';
  if (o <= 1.70) return '1.56-1.70';
  if (o <= 1.85) return '1.71-1.85';
  if (o <= 2.00) return '1.86-2.00';
  if (o <= 2.20) return '2.01-2.20';
  if (o <= 2.50) return '2.21-2.50';
  if (o <= 3.00) return '2.51-3.00';
  if (o <= 4.00) return '3.01-4.00';
  if (o <= 6.00) return '4.01-6.00';
  if (o <= 10.0) return '6.01-10.00';
  return '10.01+';
}

function getHistoricalDistribution(oddsH, oddsD, oddsA) {
  // Primary: coarse bucket from 9,557 real matches
  const bucket = getOddsBucket(oddsH);
  const coarse = ODDS_STATS[bucket];

  // Secondary: try fine-grained lookup
  const fineKey = `${Math.floor(oddsH*10)/10}-${Math.floor(oddsH*10+1)/10}`;
  const fine = ODDS_FINE[fineKey] || null;

  // Find WC examples
  const wcExamples = findSimilarWCMatches(oddsH, oddsD, oddsA, 0.35);

  if (!coarse || coarse.n < 3) return null;

  return {
    total: coarse.n,
    hWins: Math.round(coarse.H * coarse.n),
    draws: Math.round(coarse.D * coarse.n),
    aWins: Math.round(coarse.A * coarse.n),
    hRate: coarse.H, dRate: coarse.D, aRate: coarse.A,
    coarseBucket: bucket,
    fineBucket: fine ? { key: fineKey, ...fine } : null,
    wcExamples: wcExamples.map(h => ({
      match: h.m, result: h.r === 'H' ? '主胜' : h.r === 'D' ? '平局' : '客胜', year: h.y,
      odds: Array.isArray(h.odds) ? `${h.odds[0].toFixed(2)}/${h.odds[1].toFixed(2)}/${h.odds[2].toFixed(2)}` : `${h.odds.h}/${h.odds.d}/${h.odds.a}`
    })),
    totalDataset: TOTAL_REAL_MATCHES
  };
}

function findSimilarWCMatches(oddsH, oddsD, oddsA, tolerance = 0.3) {
  return HISTORICAL_WC.filter(h => {
    const hOdds = Array.isArray(h.odds) ? h.odds : [h.odds.h, h.odds.d, h.odds.a];
    const hRatio = hOdds[0] / oddsH, dRatio = hOdds[1] / oddsD, aRatio = hOdds[2] / oddsA;
    return Math.abs(hRatio-1) < tolerance && Math.abs(dRatio-1) < tolerance*1.5 && Math.abs(aRatio-1) < tolerance*1.5;
  }).slice(0, 10);
}

function renderHistoricalAnalysis(oddsH, oddsD, oddsA, aiHomeProb, aiDrawProb, aiAwayProb) {
  const hist = getHistoricalDistribution(oddsH, oddsD, oddsA);
  if (!hist || hist.total < 3) return '';

  const hPct = (hist.hRate * 100).toFixed(0);
  const dPct = (hist.dRate * 100).toFixed(0);
  const aPct = (hist.aRate * 100).toFixed(0);

  // AI vs History comparison
  const aiH = (aiHomeProb * 100).toFixed(0);
  const aiD = (aiDrawProb * 100).toFixed(0);
  const aiA = (aiAwayProb * 100).toFixed(0);

  return `
    <div style="margin-top:10px;padding:10px 12px;background:rgba(139,92,246,.06);border-radius:8px;border:1px solid rgba(139,92,246,.2)">
      <div style="font-weight:700;font-size:.8rem;margin-bottom:4px;color:var(--purple)">📚 历史同指数回溯</div>
      <div style="font-size:.65rem;color:var(--text2);margin-bottom:6px">主胜指数${oddsH.toFixed(2)}→区间${hist.coarseBucket||''} · ${hist.total.toLocaleString()}场真实比赛（数据集${hist.totalDataset.toLocaleString()}场）</div>
      <div style="display:flex;justify-content:space-around;text-align:center;margin-bottom:8px">
        <div><div style="font-size:.7rem;color:var(--text2)">历史主胜</div><div style="font-weight:700;color:var(--accent);font-size:1rem">${hPct}%</div><div style="font-size:.65rem;color:var(--text3)">${hist.hWins}/${hist.total}</div></div>
        <div><div style="font-size:.7rem;color:var(--text2)">历史平局</div><div style="font-weight:700;color:var(--text3);font-size:1rem">${dPct}%</div><div style="font-size:.65rem;color:var(--text3)">${hist.draws}/${hist.total}</div></div>
        <div><div style="font-size:.7rem;color:var(--text2)">历史客胜</div><div style="font-weight:700;color:var(--red);font-size:1rem">${aPct}%</div><div style="font-size:.65rem;color:var(--text3)">${hist.aWins}/${hist.total}</div></div>
      </div>
      <div style="display:flex;justify-content:space-around;text-align:center;margin-bottom:8px;padding-top:6px;border-top:1px dashed var(--border)">
        <div><div style="font-size:.65rem;color:var(--text2)">🤖AI预测</div><div style="font-weight:600;font-size:.78rem;color:var(--gold)">${aiH}%/${aiD}%/${aiA}%</div></div>
        <div>
          <div style="font-size:.65rem;color:var(--text2)">偏差</div>
          <div style="font-weight:600;font-size:.78rem;color:${Math.abs(parseInt(hPct)-parseInt(aiH))>15?'var(--orange)':'var(--green)'}">${(parseInt(hPct)-parseInt(aiH)>0?'历史高':'AI高')} ${Math.abs(parseInt(hPct)-parseInt(aiH))}%</div>
        </div>
      </div>
      ${hist.wcExamples && hist.wcExamples.length > 0 ? `
      <details style="margin-top:6px"><summary style="font-size:.7rem;color:var(--text3);cursor:pointer">🌍 世界杯相似指数案例 (${hist.wcExamples.length}场)</summary>
        <div style="font-size:.68rem;color:var(--text2);margin-top:4px;max-height:120px;overflow-y:auto">
          ${hist.wcExamples.map(e => `<div style="padding:2px 0">${e.year} ${e.match}: <span style="color:${e.result==='主胜'?'var(--accent)':e.result==='平局'?'var(--text3)':'var(--red)'}">${e.result}</span> (${e.odds})</div>`).join('')}
        </div>
      </details>` : ''}
      <div style="font-size:.6rem;color:var(--text3);margin-top:4px">数据来源：football-data.co.uk · 英超/德甲/西甲/意甲/法甲+次级 2022-2025</div>
    </div>`;
}

function renderHistoricalMini(oddsH, oddsD, oddsA, aiH, aiD, aiA) {
  const hist = getHistoricalDistribution(oddsH, oddsD, oddsA);
  if (!hist || hist.total < 3) return '';
  return `<div style="margin-top:4px;font-size:.68rem;color:var(--purple)">
    📚 同指数历史(${hist.total.toLocaleString()}场真实比赛)：主${(hist.hRate*100).toFixed(0)}% 平${(hist.dRate*100).toFixed(0)}% 客${(hist.aRate*100).toFixed(0)}%
  </div>`;
}

function calcHtFt(homeLambda, awayLambda) {
  const htLambdaH = homeLambda * 0.43, htLambdaA = awayLambda * 0.43;
  let htH = 0, htD = 0, htA = 0;
  const htScores = [];
  for (let h = 0; h <= 6; h++) {
    for (let a = 0; a <= 6; a++) {
      const prob = predict.poissonPMF(htLambdaH, h) * predict.poissonPMF(htLambdaA, a);
      if (h > a) htH += prob; else if (h === a) htD += prob; else htA += prob;
      if (prob > 0.01) htScores.push({h,a,prob});
    }
  }
  // Normalize
  const htTotal = htH + htD + htA;
  return { htH: htH/htTotal, htD: htD/htTotal, htA: htA/htTotal, htScores: htScores.sort((a,b) => b.prob-a.prob).slice(0,5) };
}

function calcTotalGoals(lambdaH, lambdaA) {
  const dist = Array(8).fill(0);
  for (let h = 0; h <= 7; h++) {
    for (let a = 0; a <= 7; a++) {
      const prob = predict.poissonPMF(lambdaH, h) * predict.poissonPMF(lambdaA, a);
      const total = h + a;
      if (total < 7) dist[total] += prob;
      else dist[7] += prob; // 7+
    }
  }
  const sum = dist.reduce((s,v) => s+v, 0);
  return { dist: dist.map(v => v/sum), labels: ['0','1','2','3','4','5','6','7+'] };
}

function topScores(lambdaH, lambdaA, n = 8) {
  const scores = [];
  for (let h = 0; h <= 7; h++) {
    for (let a = 0; a <= 7; a++) {
      scores.push({h, a, prob: predict.poissonPMF(lambdaH, h) * predict.poissonPMF(lambdaA, a)});
    }
  }
  const sum = scores.reduce((s,v) => s+v.prob, 0);
  return scores.sort((a,b) => b.prob-a.prob).slice(0,n).map(s => ({...s, prob: s.prob/sum}));
}

function getJCRecommendation(mid,ht,at){
  const jc=JC_ODDS[mid];if(!jc)return null;
  const pred=predict.predictMatch(ht,at),fair=jcFair(jc.spf);
  const devs=[{type:'胜',prob:pred.homeWinProb,market:fair.home,dev:(pred.homeWinProb-fair.home)*100,odds:jc.spf[0]},{type:'平',prob:pred.drawProb,market:fair.draw,dev:(pred.drawProb-fair.draw)*100,odds:jc.spf[1]},{type:'负',prob:pred.awayWinProb,market:fair.away,dev:(pred.awayWinProb-fair.away)*100,odds:jc.spf[2]}];
  const best=devs.sort((a,b)=>b.dev-a.dev)[0];
  const s=[];const minDev=Math.min(...devs.map(d=>Math.abs(d.dev)));
  if(minDev===Math.abs(devs[0].dev))s.push({type:'保守',pick:ht.cn+'胜',odds:jc.spf[0],reason:'AI与竞猜共识'});
  else if(minDev===Math.abs(devs[1].dev))s.push({type:'保守',pick:'平局',odds:jc.spf[1],reason:'AI与竞猜共识'});
  else s.push({type:'保守',pick:at.cn+'胜',odds:jc.spf[2],reason:'AI与竞猜共识'});
  const maxDev=Math.max(devs[0].dev,devs[1].dev,devs[2].dev);
  if(maxDev>3){if(maxDev===devs[0].dev)s.push({type:'均衡',pick:ht.cn+'胜',odds:jc.spf[0],reason:'AI高估'+maxDev.toFixed(1)+'%'});else if(maxDev===devs[1].dev)s.push({type:'均衡',pick:'平局',odds:jc.spf[1],reason:'AI高估'+maxDev.toFixed(1)+'%'});else s.push({type:'均衡',pick:at.cn+'胜',odds:jc.spf[2],reason:'AI高估'+maxDev.toFixed(1)+'%'});}
  const gd=pred.predScore[0]-pred.predScore[1];if(jc.rq&&jc.rqO&&Math.abs(gd)>Math.abs(parseInt(jc.rq))+1)s.push({type:'进取',pick:gd>0?'让胜':'让负',odds:gd>0?jc.rqO[0]:jc.rqO[2],reason:'预测净胜'+Math.abs(gd)+'球'});
  const risk=Math.abs(best.dev)>10?'进取型':Math.abs(best.dev)>5?'均衡型':'保守型';
  const riskC=risk==='进取型'?'var(--red)':risk==='均衡型'?'var(--orange)':'var(--green)';
  return{spf:jc.spf,fair,devs,best,s,risk,riskC,rq:jc.rq,rqO:jc.rqO||[],predScore:pred.predScore,totalG:pred.predScore[0]+pred.predScore[1]};
}

function jcFair(spf){const r=1/spf[0]+1/spf[1]+1/spf[2];return{home:(1/spf[0])/r,draw:(1/spf[1])/r,away:(1/spf[2])/r}}


module.exports = {
  oddsToFairProb, getHistoricalDistribution, findSimilarWCMatches,
  renderHistoricalAnalysis, renderHistoricalMini,
  calcHtFt, calcTotalGoals, topScores,
  getJCRecommendation, jcFair
};
