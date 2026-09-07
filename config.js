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
    buyLink.innerHTML = '<span class="buy-link-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.4 4.1c3.2.3 5.2 1.2 6.1 2.7-1.2-.3-2.2-.2-3 .2 2.7.3 4.4 1.3 5.2 3.1-1.5-.7-3-.7-4.5-.1 1.3.2 2.5.7 3.4 1.6-2.2-.1-4.1-.8-5.6-2.1C6.9 8.1 6.4 6.3 6.4 4.1Zm8.9 8.2c1.7.2 2.7.8 3.1 1.9-.8-.2-1.5-.2-2.1.1 1.2.1 2 .5 2.4 1.2-.9-.2-1.7-.1-2.5.3.8.1 1.4.4 1.9.9-1.3.1-2.4-.2-3.2-.8-.2-1.5-.1-2.7-.4-3.6Z"/></svg></span><code>BUY / UNISWAP</code>';
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
        icon: '<span class="route-letter" aria-hidden="true">F</span>'
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
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17.5 9 12l3 2.6 6-7.1 2 1.7-7.9 9.2L9 15.7l-3.1 3.1L4 17.5Z"/></svg>'
      }
    ];
    routes.innerHTML = '<span class="buy-routes-label">BUY $DOGEBOT</span>';
    routeData.forEach(({ label, type, href, className, icon }) => {
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

  const network = document.querySelector('.hero-meta > div:nth-child(2) span:not(.k)');
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
    chartFrame.title = 'DOGEBOT / DDOG GeckoTerminal chart';
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
  if (watchtowerStatus) watchtowerStatus.textContent = 'Contract configured; market data remains read-only.';

  const trustCopy = [...document.querySelectorAll('.trust-card p')]
    .find((node) => node.textContent.includes('official contract'));
  if (trustCopy) trustCopy.textContent = 'The contract, buy routes, and GeckoTerminal chart are configured. Holder data remains read-only until verified.';
})();
