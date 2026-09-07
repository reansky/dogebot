const TOKEN = '0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3';
const POOL = '0xc4aa486bbaae46b6503e3871cc3991fdfbb540444218963077ae3cd0eec290b9';
const RPC = 'https://rpc.mainnet.chain.robinhood.com';
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const ZERO = '0x0000000000000000000000000000000000000000';
const DEAD = '0x000000000000000000000000000000000000dead';

async function getJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Market source returned ${response.status}.`);
  return response.json();
}

async function rpc(method, params) {
  const response = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`Robinhood RPC returned ${response.status}.`);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || 'Robinhood RPC request failed.');
  return payload.result;
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function ratioPercent(value, total) {
  if (!total || total <= 0n || value <= 0n) return null;
  return Number((value * 1000000n) / total) / 10000;
}

async function holderSnapshot() {
  const [logs, supplyHex, blockHex] = await Promise.all([
    rpc('eth_getLogs', [{ address: TOKEN, fromBlock: '0x0', toBlock: 'latest', topics: [TRANSFER_TOPIC] }]),
    rpc('eth_call', [{ to: TOKEN, data: '0x18160ddd' }, 'latest']),
    rpc('eth_blockNumber', []),
  ]);

  const balances = new Map();
  for (const log of logs || []) {
    if (!log?.topics || log.topics.length < 3) continue;
    const from = `0x${log.topics[1].slice(-40).toLowerCase()}`;
    const to = `0x${log.topics[2].slice(-40).toLowerCase()}`;
    const amount = BigInt(log.data || '0x0');
    balances.set(from, (balances.get(from) || 0n) - amount);
    balances.set(to, (balances.get(to) || 0n) + amount);
  }

  const totalSupply = BigInt(supplyHex || '0x0');
  const holders = [...balances.values()].filter((balance) => balance > 0n);
  const eligible = [...balances.entries()]
    .filter(([address, balance]) => address !== ZERO && address !== DEAD && balance > 0n)
    .sort((a, b) => (a[1] === b[1] ? 0 : a[1] > b[1] ? -1 : 1));

  return {
    count: eligible.length,
    concentrationPct: ratioPercent(eligible.slice(0, 10).reduce((sum, [, balance]) => sum + balance, 0n), totalSupply),
    topHolderPct: ratioPercent(eligible[0]?.[1] || 0n, totalSupply),
    transferCount: (logs || []).length,
    block: Number.parseInt(blockHex, 16),
    totalSupplyRaw: totalSupply.toString(),
    source: 'Robinhood Chain RPC transfer logs',
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const [tokenResult, poolResult, dexResult, holdersResult] = await Promise.allSettled([
      getJson(`https://api.geckoterminal.com/api/v2/networks/robinhood/tokens/${TOKEN}`),
      getJson(`https://api.geckoterminal.com/api/v2/networks/robinhood/pools/${POOL}`),
      getJson(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN}`),
      holderSnapshot(),
    ]);

    const token = tokenResult.status === 'fulfilled' ? tokenResult.value?.data?.attributes || {} : {};
    const pool = poolResult.status === 'fulfilled' ? poolResult.value?.data?.attributes || {} : {};
    const pair = dexResult.status === 'fulfilled'
      ? (dexResult.value?.pairs || []).find((item) => item.pairAddress?.toLowerCase() === POOL)
      : null;
    const holders = holdersResult.status === 'fulfilled' ? holdersResult.value : null;

    const priceUsd = number(pair?.priceUsd ?? token.price_usd ?? pool.base_token_price_usd);
    const marketCapUsd = number(pair?.marketCap ?? token.market_cap_usd ?? pool.market_cap_usd ?? token.fdv_usd);
    const liquidityUsd = number(pair?.liquidity?.usd ?? token.total_reserve_in_usd);
    const volume24hUsd = number(pair?.volume?.h24 ?? token.volume_usd?.h24 ?? pool.volume_usd?.h24);
    const priceChange24hPct = number(pair?.priceChange?.h24 ?? pool.price_change_percentage?.h24);
    const fdvUsd = number(pair?.fdv ?? token.fdv_usd ?? pool.fdv_usd);

    if (priceUsd === null && marketCapUsd === null && liquidityUsd === null) {
      throw new Error('No live market data is available.');
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({
      token: {
        address: TOKEN,
        symbol: pair?.baseToken?.symbol || token.symbol || 'DOGEBOT',
        decimals: token.decimals ?? 18,
        totalSupply: token.normalized_total_supply || null,
      },
      priceUsd,
      marketCapUsd,
      liquidityUsd,
      volume24hUsd,
      fdvUsd,
      priceChange24hPct,
      holders,
      pool: { address: POOL, name: pair?.baseToken?.symbol && pair?.quoteToken?.symbol ? `${pair.baseToken.symbol} / ${pair.quoteToken.symbol}` : pool.name },
      sources: ['GeckoTerminal', 'DexScreener', ...(holders ? [holders.source] : [])],
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Live market data is unavailable.' });
  }
};
