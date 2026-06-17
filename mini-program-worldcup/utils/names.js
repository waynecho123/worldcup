// Player Name & Jersey Utilities - CHO的世界杯小站

const data = require('./data');
const TEAMS = data.TEAMS;
const STARTING_XI = data.STARTING_XI;
const PLAYER_CN = data.PLAYER_CN;
const JERSEY_NUM = data.JERSEY_NUM;


function getJerseyNum(teamId, playerRaw) {
  const name = playerRaw.replace('(C)','').trim();
  // Check specific mapping first
  if (JERSEY_NUM[name]) return JERSEY_NUM[name];
  // Generate default based on position in team
  const lu = STARTING_XI[teamId];
  if (!lu) return '?';
  const allPlayers = [];
  (Array.isArray(lu.g)?lu.g:[lu.g]).forEach(n => allPlayers.push(n));
  if (lu.d) lu.d.forEach(n => allPlayers.push(n));
  if (lu.m) lu.m.forEach(n => allPlayers.push(n));
  if (lu.am) lu.am.forEach(n => allPlayers.push(n));
  if (lu.fwd) lu.fwd.forEach(n => allPlayers.push(n));
  if (lu.st) (Array.isArray(lu.st)?lu.st:[lu.st]).forEach(n => allPlayers.push(n));
  const idx = allPlayers.findIndex(p => p.replace('(C)','').trim() === name);
  if (idx < 0) return '?';
  if (idx === 0) return '1'; // GK
  if (idx <= 5) return (idx+1).toString(); // DF
  if (idx <= 9) return (idx+1).toString(); // MF
  return (idx+1).toString(); // FW
}

function categorizePlayers(lu) {
  const players = [];
  // GK
  const gkNames = Array.isArray(lu.g) ? lu.g : [lu.g];
  gkNames.forEach(function(n){ players.push({name:n,role:'gk',pos:'GK'}); });
  // DF
  if (lu.d) lu.d.forEach(function(n){ players.push({name:n,role:'df',pos:'DF'}); });
  // MF
  if (lu.m) lu.m.forEach(function(n){ players.push({name:n,role:'mf',pos:'MF'}); });
  // AM if exists
  if (lu.am) lu.am.forEach(function(n){ players.push({name:n,role:'mf',pos:'AM'}); });
  // FW if exists
  if (lu.fwd) lu.fwd.forEach(function(n){ players.push({name:n,role:'fw',pos:'FW'}); });
  // ST if exists
  if (lu.st) {
    var stNames = Array.isArray(lu.st) ? lu.st : [lu.st];
    stNames.forEach(function(n){ players.push({name:n,role:'fw',pos:'ST'}); });
  }
  return players;
}

function getFormationPositions(formation) {
  // Returns array of {x, y, role} for each outfield player (excluding GK)
  // x: 5-95 (left to right), y: 10-90 (top=opponent goal, bottom=own goal)
  // GK always at bottom center
  const positions = [];
  const parts = formation.split('-').map(Number); // e.g., [4,3,3] or [3,4,2,1]
  const lines = parts.length;
  const ySpacing = 65 / (lines + 1); // space from defense to attack
  const topY = 25;

  parts.forEach((count, i) => {
    const y = topY + ySpacing * (i + 0.5);
    const totalWidth = 60 + i * 10; // wider as we go up
    const startX = (100 - totalWidth) / 2;
    const xSpacing = totalWidth / (count - 1 || 1);
    for (let j = 0; j < count; j++) {
      positions.push({
        x: count === 1 ? 50 : startX + xSpacing * j,
        y: y,
        role: i === lines - 1 ? 'fw' : i === lines - 2 && lines >= 3 ? 'mf' : 'df'
      });
    }
  });
  return positions;
}


module.exports = {
  getJerseyNum, categorizePlayers, getFormationPositions
};
