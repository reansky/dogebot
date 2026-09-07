const { configured, job, submitPrompt, wallet } = require('./_lib/bankr');
const { json, body, error } = require('./lib/http');
const { clientId, ipKey } = require('./lib/security');

const buckets = globalThis.__dogebotBankrBuckets || new Map();
globalThis.__dogebotBankrBuckets = buckets;

function limited(key) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now - current.startedAt > 60_000) {
    buckets.set(key, { startedAt: now, hits: 1 });
    return false;
  }
  current.hits += 1;
  return current.hits > 12;
}

function readOnlyPrompt(prompt) {
  return [
    'You are the DOGEBOT PACK public website Bankr Bot Agent.',
    'Answer in concise plain text using public, read-only information only.',
    'Never execute or recommend swaps, buys, sells, transfers, approvals, deployments, or any transaction.',
    'Token: $DOGEBOT on Robinhood Chain.',
    'Contract: 0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3.',
    `Visitor question: ${prompt}`,
  ].join('\n');
}

module.exports = async function handler(req, res) {
  try {
    if (!configured()) return json(res, 503, { error: 'Bankr Bot Agent is not configured yet.' });

    if (req.method === 'GET') {
      const jobId = String(req.query?.job || '').trim();
      if (jobId) return json(res, 200, await job(jobId));
      if (String(req.query?.mode || '') === 'summary') {
        const account = await wallet();
        return json(res, 200, {
          configured: true,
          connected: true,
          network: 'Robinhood Chain',
          walletReady: Boolean(account),
          source: 'Bankr Wallet API',
        });
      }
      return json(res, 400, { error: 'Use mode=summary or provide a job id.' });
    }

    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    const input = await body(req);
    const viewer = clientId(input.clientId || req.headers['x-dogebot-client']);
    if (limited(ipKey(req, 'bankr-agent', viewer))) return json(res, 429, { error: 'Bankr Agent is rate-limited. Try again shortly.' });

    const prompt = String(input.prompt || '').replace(/\s+/g, ' ').trim().slice(0, 420);
    if (!prompt) return json(res, 422, { error: 'Ask a question first.' });
    if (/\b(swap|buy|sell|send|transfer|deploy|launch|approve|withdraw|trade)\b/i.test(prompt)) {
      return json(res, 422, { error: 'This public agent is read-only. Trading and transaction requests are blocked.' });
    }

    const result = await submitPrompt(readOnlyPrompt(prompt));
    return json(res, 202, result);
  } catch (err) {
    return error(res, err);
  }
};
