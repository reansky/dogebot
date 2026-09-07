const { configured, job, submitPrompt } = require('./lib/bankr');
const { json, error } = require('./lib/http');

const TOKEN = '0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseTelemetry(text) {
  const match = String(text || '').match(/\{[\s\S]*\}/);
  if (!match) return {};
  try {
    const value = JSON.parse(match[0]);
    return {
      swapFees: finite(value.swapFees ?? value.totalSwapFees ?? value.fees),
      buyback: finite(value.buyback ?? value.buybacks ?? value.accumulatedBuyback),
      currency: String(value.currency || 'USD').slice(0, 12),
    };
  } catch {
    return {};
  }
}

async function marketSnapshot(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'www.dogebot.fun';
  const response = await fetch(`${protocol}://${host}/api/market`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error('Market snapshot is unavailable.');
  return response.json();
}

async function bankrTelemetry() {
  if (!configured()) return { status: 'not_configured', text: null, metrics: {} };
  const prompt = [
    'Read-only DOGEBOT PACK tracker request on Robinhood Chain.',
    `Contract: ${TOKEN}.`,
    'Return JSON only with this shape: {"swapFees": number|null, "buyback": number|null, "currency": "USD"|"TOKEN", "status": "verified"|"not_exposed"}.',
    'Report only publicly verifiable on-chain values for total swap fees collected and accumulated buybacks. Never execute any transaction. Use null when the contract or public telemetry does not expose a verified value.',
  ].join(' ');
  const started = await submitPrompt(prompt);
  if (!started.jobId) return { status: 'unavailable', text: started.response, metrics: parseTelemetry(started.response) };
  let result = started;
  for (let attempt = 0; attempt < 6 && ['pending', 'processing'].includes(result.status); attempt += 1) {
    await wait(650);
    result = await job(started.jobId);
  }
  return {
    status: result.status === 'completed' ? 'live' : result.status,
    text: result.response || null,
    metrics: parseTelemetry(result.response),
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
  try {
    const [market, telemetry] = await Promise.all([marketSnapshot(req), bankrTelemetry()]);
    return json(res, 200, {
      token: { address: TOKEN, symbol: 'DOGEBOT', network: 'Robinhood Chain' },
      metrics: {
        holders: market.holders?.count ?? null,
        swapFees: telemetry.metrics.swapFees,
        buyback: telemetry.metrics.buyback,
        currency: telemetry.metrics.currency || 'USD',
      },
      market: {
        priceUsd: market.priceUsd ?? null,
        liquidityUsd: market.liquidityUsd ?? null,
        volume24hUsd: market.volume24hUsd ?? null,
        fetchedAt: market.fetchedAt || null,
      },
      telemetry: {
        status: telemetry.status,
        text: telemetry.text,
        source: configured() ? 'Bankr Agent read-only telemetry' : 'Bankr Agent API not configured',
      },
      tradeUrl: 'https://bankr.bot',
    });
  } catch (err) {
    return error(res, err);
  }
};
