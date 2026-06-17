// Review & Accuracy Analysis Engine - CHO的世界杯小站
const data = require('./data');
const predict = require('./predict');

function analyzeBias(comps) {
  if (!comps || comps.length < 3) return null;

  const biases = [];

  const homeWinPred = comps.reduce(function(s, c){
    return s + (c.predHomeProb || 0);
  }, 0) / comps.length;
  const homeWinAct = comps.filter(function(c){
    return c.actScore && c.actScore[0] > c.actScore[1];
  }).length / comps.length;

  biases.push({
    type: '主胜预测',
    detail: 'AI预测主胜概率均' + (homeWinPred*100).toFixed(1) + '%，实际主胜率' + (homeWinAct*100).toFixed(1) + '%' +
      (Math.abs(homeWinPred - homeWinAct) > 0.08 ? (homeWinPred > homeWinAct ? ' ⚠️高估主队' : ' ⚠️低估主队') : ' ✓基本准确')
  });

  const drawPred = comps.reduce(function(s, c){
    return s + (c.predDrawProb || 0);
  }, 0) / comps.length;
  const drawAct = comps.filter(function(c){
    return c.actScore && c.actScore[0] === c.actScore[1];
  }).length / comps.length;

  biases.push({
    type: '平局预测',
    detail: 'AI预测平局概率均' + (drawPred*100).toFixed(1) + '%，实际平局率' + (drawAct*100).toFixed(1) + '%' +
      (Math.abs(drawPred - drawAct) > 0.06 ? (drawPred > drawAct ? ' ⚠️高估平局' : ' ⚠️低估平局') : ' ✓基本准确')
  });

  // Total goals
  const avgPredGoals = comps.reduce(function(s, c){
    var ps = typeof c.predScore === 'string' ? c.predScore.split(':').map(Number) : c.predScore;
    return s + ps[0] + ps[1];
  }, 0) / comps.length;
  const avgActGoals = comps.reduce(function(s, c){
    return s + (c.actScore ? c.actScore[0] + c.actScore[1] : 0);
  }, 0) / comps.length;

  biases.push({
    type: '总进球',
    detail: 'AI预测场均' + avgPredGoals.toFixed(1) + '球，实际场均' + avgActGoals.toFixed(1) + '球' +
      (Math.abs(avgPredGoals - avgActGoals) > 0.5 ? ' ⚠️偏差较大' : ' ✓基本准确')
  });

  return biases;
}

function compareMatch(m, ht, at, pred, actual) {
  const predHome = pred.predScore[0], predAway = pred.predScore[1];
  const actHome = actual.homeScore, actAway = actual.awayScore;

  const correctOutcome = (predHome > predAway && actHome > actAway) ||
                         (predHome === predAway && actHome === actAway) ||
                         (predHome < predAway && actHome < actAway);
  const correctExact = predHome === actHome && predAway === actAway;

  return {
    matchId: m.id, date: m.date, time: m.time, grp: m.grp,
    homeTeam: ht, awayTeam: at,
    predScore: pred.predScore, actScore: [actHome, actAway],
    correctOutcome, correctExact,
    predHomeProb: pred.homeWinProb, predDrawProb: pred.drawProb, predAwayProb: pred.awayWinProb
  };
}

module.exports = { analyzeBias, compareMatch };
