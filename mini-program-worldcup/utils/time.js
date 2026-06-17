// Tournament clock management
// Uses real date (BJT timezone) — the clock function adapts to current time

function getTournamentNow() {
  return new Date();
}

function getTournamentDateStr() {
  var now = new Date();
  // Use BJT for tournament date
  var bjt = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  return bjt.getFullYear() + '-' + String(bjt.getMonth() + 1).padStart(2, '0') + '-' + String(bjt.getDate()).padStart(2, '0');
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
