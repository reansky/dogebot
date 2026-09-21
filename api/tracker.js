const { json, error } = require('./lib/http');

const DATA_ENABLED = String(process.env.DOGEBOT_DATA_ENABLED || '').toLowerCase() === 'true';
const TOKEN = DATA_ENABLED ? String(process.env.DOGEBOT_CONTRACT_ADDRESS || '').trim() : '';
const BANKR_PUBLIC = 'https://api.bankr.bot';

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function marketSnapshot(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'www.dogebot.fun';
  const response = await fetch(`${protocol}://${host}/api/market`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error('Market snapshot is unavailable.');
  return response.json();
}

async function bankrSnapshot() {
  const response = await fetch(`${BANKR_PUBLIC}/token-launches/${TOKEN}`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error('Bankr public fee data is unavailable.');
  const data = await response.json();
  const launch = data.launch || {};
  const fees = launch.unclaimedFees || {};
  const tokenAmount = finite(fees.tokenAmount);
  const numeraireAmount = finite(fees.wethAmount);
  const numeraireSymbol = String(fees.numeraireSymbol || 'TSLA').slice(0, 12);
  const tokenSymbol = String(fees.tokenSymbol || 'DOGEBOT').slice(0, 12);
  const usdValue = finite(fees.usdValue);
  const usdNote = usdValue == null ? '' : ` (about $${usdValue.toFixed(2)})`;
  return {
    numeraireAmount,
    numeraireSymbol,
    tokenAmount,
    tokenSymbol,
    usdValue,
    text: `Bankr public token data currently shows ${numeraireAmount == null ? 'no' : numeraireAmount} ${numeraireSymbol} and ${tokenAmount == null ? 'no' : tokenAmount} ${tokenSymbol} as claimable fees${usdNote}. This is a current claimable balance, not a historical fee total, transfer tax, or buyback figure.`,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
  if (!TOKEN) return json(res, 503, { error: 'Tracker data is pending pair configuration.' });
  try {
    const [market, bankr] = await Promise.all([marketSnapshot(req), bankrSnapshot()]);
    return json(res, 200, {
      token: { symbol: 'DOGEBOT', network: 'Robinhood Chain' },
      metrics: {
        holders: market.holders?.count ?? null,
        claimableNumeraireFees: bankr.numeraireAmount,
        claimableNumeraireSymbol: bankr.numeraireSymbol,
        claimableTokenFees: bankr.tokenAmount,
        claimableTokenSymbol: bankr.tokenSymbol,
        claimableFeesUsd: bankr.usdValue,
      },
      market: {
        priceUsd: market.priceUsd ?? null,
        liquidityUsd: market.liquidityUsd ?? null,
        volume24hUsd: market.volume24hUsd ?? null,
        fetchedAt: market.fetchedAt || null,
      },
      telemetry: {
        status: 'live',
        text: bankr.text,
        source: 'Bankr public token-launch data',
      },
      tradeUrl: 'https://bankr.bot',
    });
  } catch (err) {
    return error(res, err);
  }
};