const { rest } = require('./_lib/supabase');
const { json, body, error } = require('./_lib/http');

function authorized(req) {
  const token = String(process.env.MODERATOR_TOKEN || '');
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return token && supplied && supplied === token;
}

module.exports = async function handler(req, res) {
  try {
    if (!authorized(req)) return json(res, 401, { error: 'Moderator authorization required.' });
    if (req.method === 'GET') {
      const [posts, memes] = await Promise.all([
        rest('forum_posts?select=id,name,text,created_at,status,moderation_reason&status=eq.pending&order=created_at.asc'),
        rest('memes?select=id,image_url,caption,created_at,status,moderation_reason&status=eq.pending&order=created_at.asc'),
      ]);
      const agentUpdates = await rest('agent_updates?select=id,title,body,source,created_at,status,moderation_reason&status=eq.pending&order=created_at.asc');
      return json(res, 200, { posts, memes, agentUpdates });
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    const input = await body(req);
    const table = input.type === 'meme' ? 'memes' : input.type === 'agent' ? 'agent_updates' : 'forum_posts';
    const id = String(input.id || '');
    const status = input.action === 'approve' ? 'approved' : input.action === 'reject' ? 'rejected' : '';
    if (!/^[0-9a-f-]{36}$/i.test(id) || !status) return json(res, 400, { error: 'Valid id and moderation action are required.' });
    const rows = await rest(`${table}?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ status, moderation_reason: input.reason ? String(input.reason).slice(0, 240) : null }) });
    return json(res, 200, { item: rows?.[0] || null });
  } catch (err) {
    return error(res, err);
  }
};
