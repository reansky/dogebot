const baseUrl = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'dogebot-memes';

function assertConfig() {
  if (!baseUrl || !serviceKey) {
    const err = new Error('Supabase environment variables are missing.');
    err.status = 503;
    throw err;
  }
}

async function rest(path, options = {}) {
  assertConfig();
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...(options.headers || {}),
  };
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const err = new Error(data?.message || data?.hint || `Supabase request failed (${response.status}).`);
    err.status = response.status >= 500 ? 502 : response.status;
    throw err;
  }
  return data;
}

async function rateLimit(key, limit, windowSeconds) {
  const result = await rest('rpc/check_rate_limit', {
    method: 'POST',
    body: JSON.stringify({ p_key: key, p_limit: limit, p_window_seconds: windowSeconds }),
  });
  return result === true || result?.allowed === true;
}

async function upload(path, buffer, contentType) {
  assertConfig();
  const response = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': contentType,
      'x-upsert': 'false',
    },
    body: buffer,
  });
  if (!response.ok) {
    const message = await response.text();
    const err = new Error(message || 'Image upload failed.');
    err.status = response.status >= 500 ? 502 : response.status;
    throw err;
  }
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

module.exports = { rest, rateLimit, upload };
