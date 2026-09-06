const { rest, rateLimit } = require('./lib/supabase');
const { json, body, error } = require('./lib/http');
const { moderateText, clientId, name, ipKey } = require('./lib/security');

function id(value) {
  const valueString = String(value || '');
  return /^[0-9a-f-]{36}$/i.test(valueString) ? valueString : null;
}

function publicPosts(rows, viewer) {
  return rows.map((post) => ({
    id: post.id,
    name: post.name,
    text: post.text,
    likes: Number(post.likes || 0),
    createdAt: post.created_at,
    mine: Boolean(viewer && post.client_id === viewer),
  }));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const viewer = clientId(req.headers['x-dogebot-client']);
      const rows = await rest('forum_posts?select=id,name,text,likes,client_id,created_at&status=eq.published&order=created_at.desc&limit=100');
      return json(res, 200, { posts: publicPosts(rows || [], viewer) });
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

    const input = await body(req);
    const action = String(input.action || 'create');
    const viewer = clientId(input.clientId || req.headers['x-dogebot-client']);
    const allowed = await rateLimit(ipKey(req, `forum-${action}`, viewer), action === 'like' ? 60 : 5, action === 'like' ? 60 : 900);
    if (!allowed) return json(res, 429, { error: 'The pack is moving fast. Please try again shortly.' });

    if (action === 'create') {
      const moderated = moderateText(input.text, 500);
      if (!moderated.ok) return json(res, 422, { error: moderated.reason });
      const rows = await rest('forum_posts', {
        method: 'POST',
        body: JSON.stringify([{ name: name(input.name), text: moderated.text, client_id: viewer, status: 'published' }]),
      });
      return json(res, 201, { post: publicPosts(rows || [], viewer)[0] });
    }

    const postId = id(input.postId);
    if (!postId) return json(res, 400, { error: 'A valid post id is required.' });

    if (action === 'like') {
      const rows = await rest(`forum_posts?id=eq.${postId}&status=eq.published&select=id,likes`);
      if (!rows?.length) return json(res, 404, { error: 'Post not found.' });
      const updated = await rest(`forum_posts?id=eq.${postId}`, {
        method: 'PATCH',
        body: JSON.stringify({ likes: Number(rows[0].likes || 0) + 1 }),
      });
      return json(res, 200, { post: updated?.[0] || null });
    }

    if (action === 'delete') {
      const rows = await rest(`forum_posts?id=eq.${postId}&select=id,client_id`);
      if (!rows?.length) return json(res, 404, { error: 'Post not found.' });
      if (rows[0].client_id !== viewer) return json(res, 403, { error: 'You can only delete your own post.' });
      await rest(`forum_posts?id=eq.${postId}`, { method: 'DELETE' });
      return json(res, 200, { ok: true });
    }

    return json(res, 400, { error: 'Unknown forum action.' });
  } catch (err) {
    return error(res, err);
  }
};
