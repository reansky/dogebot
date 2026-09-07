const BASE_URL = 'https://api.bankr.bot';

function apiKey() {
  return String(process.env.BANKR_API_KEY || '').trim();
}

function assertKey() {
  if (!apiKey()) {
    const err = new Error('Bankr Agent API is not configured.');
    err.status = 503;
    throw err;
  }
}

async function request(path, options = {}) {
  assertKey();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      accept: 'application/json',
      'X-API-Key': apiKey(),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }
  if (!response.ok) {
    const err = new Error(data?.message || data?.error || `Bankr API returned ${response.status}.`);
    err.status = response.status >= 500 ? 502 : response.status;
    throw err;
  }
  return data;
}

function publicJob(data) {
  return {
    success: data?.success !== false,
    jobId: data?.jobId || null,
    status: data?.status || 'pending',
    response: typeof data?.response === 'string' ? data.response.slice(0, 5000) : null,
    createdAt: data?.createdAt || null,
    completedAt: data?.completedAt || null,
  };
}

async function submitPrompt(prompt) {
  return publicJob(await request('/agent/prompt', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  }));
}

async function job(jobId) {
  return publicJob(await request(`/agent/job/${encodeURIComponent(jobId)}`));
}

async function wallet() {
  return request('/wallet/me');
}

function configured() {
  return Boolean(apiKey());
}

module.exports = { configured, job, submitPrompt, wallet };
