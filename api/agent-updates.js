const { rest } = require('./lib/supabase');
const { json, body, error } = require('./lib/http');
const { moderateText } = require('./lib/security');

function authorized(req) {
  const token = String(process.env.MODERATOR_TOKEN || '');
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return token && supplied && supplied === token;
}

function publicUpdate(update) {
  return {
    id: update.id,
    title: update.title,
    body: update.body,
    source: update.source,
    createdAt: update.created_at,
  };
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await rest('agent_updates?select=id,title,body,source,created_at&status=eq.approved&order=created_at.desc&limit=12');
      return json(res, 200, { updates: (rows || []).map(publicUpdate) });
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    if (!authorized(req)) return json(res, 401, { error: 'Moderator authorization required.' });

    const input = await body(req);
    const title = moderateText(input.title, 120);
    const copy = moderateText(input.body, 1500);
    if (!title.ok) return json(res, 422, { error: title.reason });
    if (!copy.ok) return json(res, 422, { error: copy.reason });

    const rows = await rest('agent_updates', {
      method: 'POST',
      body: JSON.stringify([{
        title: title.text,
        body: copy.text,
        source: String(input.source || 'DOGEBOT PACK Agent').slice(0, 80),
        status: 'pending',
      }]),
    });
    return json(res, 201, { update: rows?.[0] || null, message: 'Agent update submitted for approval.' });
  } catch (err) {
    return error(res, err);
  }
};
