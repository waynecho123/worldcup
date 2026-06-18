/**
 * Cloudflare Worker - WC2026 GitHub Actions Trigger
 *
 * Every 5 min:  trigger update.yml (scores)
 * Every 2 hours: trigger update-deep.yml (news, details, standings, players)
 *
 * Cron trigger: every 5 min
 */

const GITHUB_TOKEN = 'GITHUB_PAT_HERE';  // ← Replace with your PAT
const REPO = 'waynecho123/worldcup';

async function triggerWorkflow(workflowFile) {
  const url = `https://api.github.com/repos/${REPO}/actions/workflows/${workflowFile}/dispatches`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'WC2026-Cloudflare-Worker',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'main' }),
  });
}

addEventListener('scheduled', event => {
  event.waitUntil(handleSchedule());
});

async function handleSchedule() {
  const s1 = await triggerWorkflow('update.yml');

  const now = new Date();
  const hours = now.getUTCHours();
  const mins = now.getUTCMinutes();
  // Every 2 hours at :05-:10 UTC
  if (hours % 2 === 0 && mins >= 5 && mins <= 10) {
    const s2 = await triggerWorkflow('update-deep.yml');
    console.log(`scores=${s1.status} deep=${s2.status}`);
  } else {
    console.log(`scores=${s1.status}`);
  }
}
