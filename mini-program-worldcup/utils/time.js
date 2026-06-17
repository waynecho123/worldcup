// Tournament clock management
// The tournament clock is hardcoded to June 16, 2026 with real-time hours

function getTournamentNow() {
  var real = new Date();
  return new Date(2026, 5, 16, real.getHours(), real.getMinutes(), real.getSeconds());
}

function getTournamentDateStr() {
  var d = getTournamentNow();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getTodayStr() {
  return getTournamentDateStr();
}

function getNextDayDate() {
  var d = getTournamentNow();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

module.exports = {
  getTournamentNow, getTournamentDateStr, getTodayStr, getNextDayDate
};
