const { json, body } = require('./lib/http');
const { moderateText, clientId } = require('./lib/security');

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const buckets = globalThis.__dogebotChatBuckets || (globalThis.__dogebotChatBuckets = new Map());
const SYSTEM_PROMPT = `You are the DOGEBOT PACK ChatGPT Terminal. Respond in clear English and keep answers concise.

Project facts:
- DOGEBOT is on Robinhood Chain.
- Contract: 0xb6e42960061c55e32d73dab204718dBB1aE2Cba3.
- The configured reference market is $NVDA. It is read-only and is not a live DOGEBOT/NVDA trading pair.
- The site provides public market data, holder context, Bankr information, and community tools.
- Bankr is an external official workspace for project knowledge and owner-approved announcements.

Safety rules:
- This terminal is informational only. Never execute, simulate, or promise a swap, trade, claim, buyback, distribution, wallet connection, or token deployment.
- Never request or handle a seed phrase, private key, password, API key, or one-time code.
- Treat claims, rewards, and unsolicited support messages as unverified unless they appear in an official project source.
- Do not give financial advice or promise profit. Say when live data is unavailable instead of inventing values.`;

function allowed(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const id = clientId(req.headers['x-dogebot-client']);
  const key = `${ip}:${id}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const recent = (buckets.get(key) || []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= 30) return false;
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

function cleanMessages(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-8).flatMap((message) => {
    const role = message?.role === 'assistant' ? 'assistant' : 'user';
    const text = String(message?.content || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 1200);
    if (!text) return [];
    if (role === 'user') {
      const safe = moderateText(text, 1200);
      if (!safe.ok) return [];
      return [{ role, content: safe.text }];
    }
    return [{ role, content: text }];
  });
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return json(res, 200, { configured: Boolean(process.env.OPENAI_API_KEY), provider: 'ChatGPT', model: MODEL });
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  if (!process.env.OPENAI_API_KEY) return json(res, 503, { error: 'ChatGPT Terminal is not configured on the server yet.' });
  if (!allowed(req)) return json(res, 429, { error: 'Terminal limit reached. Please try again later.' });

  const input = await body(req);
  const messages = cleanMessages(input.messages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return json(res, 422, { error: 'A user message is required.' });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.2,
      max_tokens: 450,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return json(res, 502, { error: 'ChatGPT is temporarily unavailable.' });
  const reply = String(data.choices?.[0]?.message?.content || '').trim();
  if (!reply) return json(res, 502, { error: 'ChatGPT returned an empty response.' });
  return json(res, 200, { reply, model: data.model || MODEL });
};