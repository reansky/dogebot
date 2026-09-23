/* QUICK EDIT CONFIG: change project values here before publishing. */
window.DOGEBOT_CONFIG = Object.freeze({
  contractAddress: '0x009dd26859b3aa58ac30194e6c48a2e6087daba3',
  poolAddress: '0x6a392bba62ae48cdc544adebcdff3642795e08390ea83ca7ec8f8b47a93108a3',
  pairSymbol: '$TSLA',
  buyUrl: 'https://bankr.bot/terminal/trade?out=0x009dd26859b3aa58ac30194e6c48a2e6087daba3&chain=robinhood',
  livePoolUrl: 'https://www.geckoterminal.com/robinhood/pools/0x6a392bba62ae48cdc544adebcdff3642795e08390ea83ca7ec8f8b47a93108a3',
  fomoUrl: '',
  bankrTradeUrl: 'https://bankr.bot/terminal/trade?out=0x009dd26859b3aa58ac30194e6c48a2e6087daba3&chain=robinhood',
  geckoChartPageUrl: 'https://www.geckoterminal.com/robinhood/pools/0x6a392bba62ae48cdc544adebcdff3642795e08390ea83ca7ec8f8b47a93108a3',
  xUrl: 'https://x.com/dogebotfun',
  bankrSkillUrl: 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack',
  network: 'Robinhood Chain',
  apiBase: '/api',
  marketApiUrl: '/api/market',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  geckoChartUrl: 'https://www.geckoterminal.com/robinhood/pools/0x6a392bba62ae48cdc544adebcdff3642795e08390ea83ca7ec8f8b47a93108a3?embed=1&info=0&swaps=0&grayscale=0',
});

(() => {
  const config = window.DOGEBOT_CONFIG;
  const buyLink = document.querySelector('.buy-link');
  if (buyLink) {
    buyLink.href = config.livePoolUrl || config.geckoChartPageUrl;
    buyLink.title = 'Open the DOGEBOT live pool';
    buyLink.innerHTML = '<span class="buy-link-mark" aria-hidden="true"><img src="images/buy-geckoterminal.png" alt=""></span><code>OPEN / LIVE POOL</code>';
  }

  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy && !heroCopy.querySelector('.buy-routes')) {
    const routes = document.createElement('div');
    routes.className = 'buy-routes';
    const bankrLogo = document.querySelector('.bankr-logo')?.src || '';
    const routeData = [
      {
        label: 'Bankr',
        type: 'Buy DOGEBOT',
        href: config.buyUrl,
        className: 'bankr-buy',
        icon: bankrLogo ? `<img src="${bankrLogo}" alt="">` : '<span class="route-letter" aria-hidden="true">B</span>'
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
        type: 'Official skill',
        href: config.bankrSkillUrl,
        className: 'bankr',
        icon: bankrLogo ? `<img src="${bankrLogo}" alt="">` : '<span class="route-letter" aria-hidden="true">B</span>'
      },
      {
        label: 'GeckoTerminal',
         type: 'Live pool',
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

  document.querySelectorAll('a[href*="x.com/"]:not(.footer-x)').forEach(link => {
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
      const label = link.textContent.trim();
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
