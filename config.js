/* QUICK EDIT CONFIG: change project values here before publishing. */
window.DOGEBOT_CONFIG = Object.freeze({
  contractAddress: '0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3',
  pairSymbol: '$DDOG',
  buyUrl: 'https://app.uniswap.org/swap?chain=robinhood&inputCurrency=NATIVE&outputCurrency=0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3',
  fomoUrl: 'https://fomo.family/coin?address=0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3&chainId=4663&r=reansykes&source=share_link',
  bankrTradeUrl: 'https://bankr.bot/terminal/trade?out=0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3&chain=robinhood',
  geckoChartPageUrl: 'https://www.geckoterminal.com/robinhood/pools/0xc4aa486bbaae46b6503e3871cc3991fdfbb540444218963077ae3cd0eec290b9',
  xUrl: 'https://x.com/dogebotdotfun',
  bankrSkillUrl: 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack',
  network: 'Robinhood Chain',
  apiBase: '/api',
  geckoChartUrl: 'https://www.geckoterminal.com/robinhood/pools/0xc4aa486bbaae46b6503e3871cc3991fdfbb540444218963077ae3cd0eec290b9?embed=1&info=0&swaps=0'
});

(() => {
  const config = window.DOGEBOT_CONFIG;
  const contractButton = document.getElementById('copyContract');
  const contractCode = contractButton?.querySelector('code');

  if (contractButton && contractCode) {
    contractCode.textContent = config.contractAddress;
    contractButton.onclick = async () => {
      try {
        await navigator.clipboard.writeText(config.contractAddress);
      } catch {}
      contractCode.textContent = 'COPIED';
      setTimeout(() => { contractCode.textContent = config.contractAddress; }, 1600);
    };
  }

  const buyLink = document.querySelector('.buy-link');
  if (buyLink) {
    buyLink.href = config.buyUrl;
    buyLink.title = 'Swap DOGEBOT on Uniswap';
    const buyLabel = buyLink.querySelector('code');
    if (buyLabel) buyLabel.textContent = 'BUY / UNISWAP';
  }

  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy && !heroCopy.querySelector('.buy-routes')) {
    const routes = document.createElement('div');
    routes.className = 'buy-routes';
    const routeData = [
      ['Uniswap', config.buyUrl],
      ['FOMO', config.fomoUrl],
      ['Bankr', config.bankrTradeUrl],
      ['Chart', config.geckoChartPageUrl],
    ];
    routeData.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.className = 'buy-route';
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `${label} ↗`;
      routes.append(link);
    });
    heroCopy.append(routes);
    const routeStyle = document.createElement('style');
    routeStyle.textContent = '.buy-routes{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.buy-route{padding:7px 10px;border:1px solid rgba(0,200,5,.22);border-radius:999px;color:#078d24;background:rgba(255,255,255,.62);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.buy-route:hover{border-color:#078d24;background:#d9f8dd}';
    document.head.append(routeStyle);
  }

  document.querySelectorAll('a.footer-x, a[href*="x.com/"]').forEach(link => {
    link.href = config.xUrl;
  });

  document.querySelectorAll('[data-bankr-install], [data-bankr-mobile-install], .bankr-install, a[href*="bankr.bot/"]').forEach(link => {
    link.href = config.bankrSkillUrl;
  });

  const network = document.querySelector('.hero-meta > div:nth-child(2) span:not(.k)');
  if (network) network.textContent = config.network;

  const chartUrl = String(config.geckoChartUrl || '').trim();
  const chartFrame = document.getElementById('geckoChart');
  const chartPlaceholder = document.getElementById('geckoChartPlaceholder');
  const demoChart = document.querySelector('.chart');
  const chartTabs = document.querySelector('.chart-tabs');

  demoChart?.classList.add('chart-hidden');
  chartTabs?.classList.add('chart-tabs-hidden');

  if (chartFrame && chartUrl) {
    chartFrame.src = chartUrl;
    chartFrame.hidden = false;
    if (chartPlaceholder) chartPlaceholder.hidden = true;
  }

  const watchtowerStatus = document.querySelector('.brief-list span');
  if (watchtowerStatus) watchtowerStatus.textContent = 'Contract configured; market data remains read-only.';

  const trustCopy = [...document.querySelectorAll('.trust-card p')]
    .find((node) => node.textContent.includes('official contract'));
  if (trustCopy) trustCopy.textContent = 'The contract, buy routes, and GeckoTerminal chart are configured. Holder data remains read-only until verified.';
})();
