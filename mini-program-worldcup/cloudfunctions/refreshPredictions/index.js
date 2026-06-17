// Cloud function: refresh AI predictions based on latest match results
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const JC_RETURN_RATE = 0.71;

/**
 * Update prediction log with latest reason
 */
exports.main = async (event) => {
  const { matchId, homeTeam, awayTeam, reason } = event;

  // Store prediction update log
  const logEntry = {
    matchId: matchId || 'unknown',
    homeTeam: homeTeam || '',
    awayTeam: awayTeam || '',
    reason: reason || '定期更新',
    lastUpdate: new Date().toISOString()
  };

  try {
    // Upsert prediction log
    const existing = await db.collection('prediction_logs')
      .where({ matchId: logEntry.matchId })
      .get();

    if (existing.data && existing.data.length > 0) {
      await db.collection('prediction_logs')
        .doc(existing.data[0]._id)
        .update({ data: logEntry });
    } else {
      await db.collection('prediction_logs').add({ data: logEntry });
    }

    return {
      ok: true,
      matchId: logEntry.matchId,
      reason: logEntry.reason,
      updatedAt: logEntry.lastUpdate
    };
  } catch (e) {
    return {
      ok: false,
      error: e.message
    };
  }
};

/**
 * Batch refresh all predictions
 */
exports.batchRefresh = async (event) => {
  const matchIds = event.matchIds || [];
  const now = new Date().toISOString();
  const results = [];

  for (const id of matchIds) {
    try {
      const existing = await db.collection('prediction_logs')
        .where({ matchId: id })
        .get();

      const logData = {
        matchId: id,
        reason: '定期批量更新',
        lastUpdate: now
      };

      if (existing.data && existing.data.length > 0) {
        await db.collection('prediction_logs')
          .doc(existing.data[0]._id)
          .update({ data: logData });
      } else {
        await db.collection('prediction_logs').add({ data: logData });
      }

      results.push({ matchId: id, ok: true });
    } catch (e) {
      results.push({ matchId: id, ok: false, error: e.message });
    }
  }

  return {
    ok: true,
    total: matchIds.length,
    success: results.filter(r => r.ok).length,
    results: results,
    refreshedAt: now
  };
};
