const https = require('https');
const TOKEN = process.env.FD_TOKEN;
if (!TOKEN) { console.error('Set FD_TOKEN environment variable'); process.exit(1); }

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'X-Auth-Token': TOKEN }, timeout: 10000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

(async () => {
  // Check past dates too to get team names
  for (const d of ['2026-06-17','2026-06-16','2026-06-13']) {
    const data = await fetch(`https://api.football-data.org/v4/competitions/2000/matches?dateFrom=${d}&dateTo=${d}`);
    if (data.matches) {
      data.matches.filter(m => m.status === 'FINISHED').forEach(m => {
        const ht = m.homeTeam, at = m.awayTeam;
        console.log(`home: "${ht.shortName}" / "${ht.name}" / "${ht.tla}" | away: "${at.shortName}" / "${at.name}" / "${at.tla}" | score: ${m.score.fullTime.home}-${m.score.fullTime.away}`);
      });
    }
  }
})().catch(e => console.error(e));
