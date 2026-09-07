const { rest, rateLimit } = require('./lib/supabase');
const { json, body, error } = require('./lib/http');
const { clientId, ipKey } = require('./lib/security');

function publicCounts(rows) {
  return (rows || []).reduce((counts, row) => {
    counts[row.meme_id] = (counts[row.meme_id] || 0) + 1;
    return counts;
  }, {});
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await rest('meme_votes?select=meme_id&limit=10000');
      const votes = publicCounts(rows);
      const topMemeId = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      return json(res, 200, { votes, totalVotes: (rows || []).length, topMemeId });
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    const input = await body(req);
    const memeId = String(input.memeId || '').trim();
    const viewer = clientId(input.clientId || req.headers['x-dogebot-client']);
    if (!/^[0-9a-f-]{36}$/i.test(memeId)) return json(res, 422, { error: 'Choose a valid meme.' });
    if (!(await rateLimit(ipKey(req, 'meme-vote', viewer), 20, 3600))) {
      return json(res, 429, { error: 'Voting is limited to twenty votes per hour.' });
    }
    const approved = await rest(`memes?id=eq.${encodeURIComponent(memeId)}&status=eq.approved&select=id&limit=1`);
    if (!approved?.length) return json(res, 404, { error: 'That meme is not available for voting.' });
    await rest('meme_votes', {
      method: 'POST',
      body: JSON.stringify([{ meme_id: memeId, client_id: viewer }]),
    });
    return json(res, 201, { ok: true, memeId });
  } catch (err) {
    if (err.status === 409) return json(res, 409, { error: 'You already voted for this meme.' });
    return error(res, err);
  }
};
