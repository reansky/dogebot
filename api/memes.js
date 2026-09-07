const crypto = require('crypto');
const { rest, rateLimit, upload } = require('./lib/supabase');
const { json, body, error } = require('./lib/http');
const { moderateText, clientId, ipKey } = require('./lib/security');

const MAX_BYTES = 3 * 1024 * 1024;
const IMAGE_PATTERN = /^data:(image\/(?:png|jpeg|gif|webp));base64,([a-z0-9+/=]+)$/i;
const extensions = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' };

function publicMemes(rows) {
  return (rows || []).map((meme) => ({
    id: meme.id,
    imageUrl: meme.image_url,
    caption: meme.caption,
    createdAt: meme.created_at,
    status: meme.status,
  }));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await rest('memes?select=id,image_url,caption,created_at,status&status=eq.approved&order=created_at.desc&limit=60');
      return json(res, 200, { memes: publicMemes(rows) });
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

    const input = await body(req);
    const viewer = clientId(input.clientId || req.headers['x-dogebot-client']);
    if (!(await rateLimit(ipKey(req, 'meme-create', viewer), 10, 3600))) {
      return json(res, 429, { error: 'Meme submissions are limited to ten per hour.' });
    }
    const moderated = moderateText(input.caption || 'DOGEBOT PACK signal', 96);
    if (!moderated.ok) return json(res, 422, { error: moderated.reason });
    const match = String(input.imageData || '').match(IMAGE_PATTERN);
    if (!match) return json(res, 422, { error: 'Upload a PNG, JPG, GIF, or WEBP image.' });
    const buffer = Buffer.from(match[2], 'base64');
    if (!buffer.length || buffer.length > MAX_BYTES) return json(res, 413, { error: 'Meme images must be 3 MB or smaller.' });

    const extension = extensions[match[1].toLowerCase()];
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const imageUrl = await upload(path, buffer, match[1].toLowerCase());
    const rows = await rest('memes', {
      method: 'POST',
      body: JSON.stringify([{ image_url: imageUrl, caption: moderated.text, client_id: viewer, status: 'pending' }]),
    });
    return json(res, 201, { meme: { ...publicMemes(rows || [])[0], status: 'pending' }, message: 'Meme submitted for moderation.' });
  } catch (err) {
    return error(res, err);
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '4.5mb' } } };
