/* QUICK EDIT CONFIG: change project values here before publishing. */
window.DOGEBOT_CONFIG = Object.freeze({
  contractAddress: '0xb6e42960061c55e32d73dab204718dBB1aE2Cba3',
  poolAddress: '0x56d5776e4c6b3da818f6922102dc156a98bc9156ddbb25f9c18afe7fbd7cd8b8',
  pairSymbol: '$NVDA',
  buyUrl: 'https://app.uniswap.org/swap?chain=robinhood&inputCurrency=0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC&outputCurrency=0xb6e42960061c55e32d73dab204718dBB1aE2Cba3',
  fomoUrl: 'https://fomo.family/coin?address=0xb6e42960061c55e32d73dab204718dBB1aE2Cba3&chainId=4663&r=reansykes&source=share_link',
  bankrTradeUrl: 'https://bankr.bot/terminal/trade?out=0xb6e42960061c55e32d73dab204718dBB1aE2Cba3&chain=robinhood',
  geckoChartPageUrl: 'https://www.geckoterminal.com/robinhood/pools/0x56d5776e4c6b3da818f6922102dc156a98bc9156ddbb25f9c18afe7fbd7cd8b8',
  xUrl: 'https://x.com/dogebotfun',
  bankrSkillUrl: 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack',
  network: 'Robinhood Chain',
  apiBase: '/api',
  marketApiUrl: '/api/market',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  geckoChartUrl: 'https://www.geckoterminal.com/robinhood/pools/0x56d5776e4c6b3da818f6922102dc156a98bc9156ddbb25f9c18afe7fbd7cd8b8?embed=1&info=0&swaps=0'
});

(() => {
  const config = window.DOGEBOT_CONFIG;
  const buyLink = document.querySelector('.buy-link');
  if (buyLink) {
    buyLink.href = config.buyUrl;
    buyLink.title = 'Swap DOGEBOT on Uniswap';
    buyLink.innerHTML = '<span class="buy-link-mark" aria-hidden="true"><img src="images/buy-uniswap.jpeg" alt=""></span><code>BUY / UNISWAP</code>';
  }

  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy && !heroCopy.querySelector('.buy-routes')) {
    const routes = document.createElement('div');
    routes.className = 'buy-routes';
    const bankrLogo = document.querySelector('.bankr-logo')?.src || '';
    const routeData = [
      {
        label: 'Uniswap',
        type: 'Swap',
        href: config.buyUrl,
        className: 'uniswap',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 4.1c3.2.3 5.2 1.2 6.1 2.7-1.2-.3-2.2-.2-3 .2 2.7.3 4.4 1.3 5.2 3.1-1.5-.7-3-.7-4.5-.1 1.3.2 2.5.7 3.4 1.6-2.2-.1-4.1-.8-5.6-2.1C6.9 8.1 6.4 6.3 6.4 4.1Zm8.9 8.2c1.7.2 2.7.8 3.1 1.9-.8-.2-1.5-.2-2.1.1 1.2.1 2 .5 2.4 1.2-.9-.2-1.7-.1-2.5.3.8.1 1.4.4 1.9.9-1.3.1-2.4-.2-3.2-.8-.2-1.5-.1-2.7.4-3.6Z"/></svg>'
      },
      {
        label: 'FOMO',
        type: 'Token page',
        href: config.fomoUrl,
        className: 'fomo',
        icon: '<img src="images/buy-fomo.webp" alt="">'
      },
      {
        label: 'Bankr',
        type: 'Trade link',
        href: config.bankrTradeUrl,
        className: 'bankr',
        icon: bankrLogo ? `<img src="${bankrLogo}" alt="">` : '<span class="route-letter" aria-hidden="true">B</span>'
      },
      {
        label: 'GeckoTerminal',
        type: 'Pool chart',
        href: config.geckoChartPageUrl,
        className: 'gecko',
        icon: '<img src="images/buy-geckoterminal.png" alt="">'
      }
    ];
    routes.innerHTML = `<span class="buy-routes-label">PAIR ${config.pairSymbol}</span>`;
    routeData.filter(({ href }) => href).forEach(({ label, type, href, className, icon }) => {
      const link = document.createElement('a');
      link.className = `buy-route ${className}`;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${label} ${type}`);
      link.innerHTML = `<span class="buy-route-mark">${icon}</span><span class="buy-route-copy"><b>${label}</b><small>${type}</small></span>`;
      routes.append(link);
    });
    heroCopy.append(routes);
  }

  document.querySelectorAll('a.footer-x, a[href*="x.com/"]').forEach(link => {
    link.href = config.xUrl;
  });

  document.querySelectorAll('[data-bankr-install], [data-bankr-mobile-install], .bankr-install, a[href*="bankr.bot/"]:not(.buy-route)').forEach(link => {
    link.href = config.bankrSkillUrl;
  });

  const network = document.querySelector('.hero-meta > div:first-child span:not(.k)');
  if (network) network.textContent = config.network;

  const chartUrl = String(config.geckoChartUrl || '').trim();
  let chartFrame = document.getElementById('geckoChart');
  const chartPlaceholder = document.getElementById('geckoChartPlaceholder');
  const demoChart = document.querySelector('.chart');
  const chartTabs = document.querySelector('.chart-tabs');

  demoChart?.classList.add('chart-hidden');
  chartTabs?.classList.add('chart-tabs-hidden');

  if (!chartFrame && chartUrl) {
    chartFrame = document.createElement('iframe');
    chartFrame.id = 'geckoChart';
    chartFrame.title = `DOGEBOT / ${config.pairSymbol} GeckoTerminal chart`;
    chartFrame.loading = 'lazy';
    chartFrame.referrerPolicy = 'no-referrer';
    chartFrame.style.cssText = 'display:block;width:100%;height:430px;border:0;border-radius:16px;background:#071009;';
    document.querySelector('.chart-card')?.append(chartFrame);
  }

  if (chartFrame && chartUrl) {
    chartFrame.src = chartUrl;
    chartFrame.hidden = false;
    if (chartPlaceholder) chartPlaceholder.hidden = true;
    const chartStatus = document.querySelector('.chart-card .delta');
    if (chartStatus) chartStatus.textContent = 'GECKOTERMINAL · LIVE';
  }

  const watchtowerStatus = document.querySelector('.brief-list span');
  if (watchtowerStatus) watchtowerStatus.textContent = 'Live pair configured; market data remains read-only.';

  const trustCopy = [...document.querySelectorAll('.trust-card p')]
    .find((node) => node.textContent.includes('official contract'));
  if (trustCopy) trustCopy.textContent = 'The contract, buy routes, GeckoTerminal chart, and holder data are configured. All actions remain read-only until a user opens an external route.';

  const decorateBankrButtons = () => {
    document.querySelectorAll('[data-bankr-install], [data-bankr-mobile-install], .bankr-install, a[href*="bankr.bot/"]:not(.buy-route)').forEach((link) => {
      if (link.querySelector('.bankr-button-logo')) return;
      const label = link.textContent.replace(/↗/g, '').trim();
      const logo = document.createElement('img');
      logo.className = 'bankr-button-logo';
      logo.src = 'images/bankr-logo.webp';
      logo.alt = '';
      link.classList.add('bankr-logo-action');
      link.replaceChildren(logo, document.createTextNode(label));
    });
  };
  decorateBankrButtons();
  new MutationObserver(decorateBankrButtons).observe(document.body, { childList: true, subtree: true });
})();
