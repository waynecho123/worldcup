// Tournament clock management
// Uses real date (BJT timezone) — the clock function adapts to current time

function getTournamentNow() {
  return new Date();
}

function getTournamentDateStr() {
  var now = new Date();
  // Use UTC+8 (BJT) — add 8 hours to UTC
  var bjt = new Date(now.getTime() + 8 * 3600000);
  return bjt.toISOString().slice(0, 10);
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
