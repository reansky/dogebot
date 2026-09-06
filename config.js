/* QUICK EDIT CONFIG: change project values here before publishing. */
window.DOGEBOT_CONFIG = Object.freeze({
  contractAddress: 'CA / TBA',
  buyUrl: '#dogebot',
  xUrl: 'https://x.com/dogebotdotfun',
  bankrSkillUrl: 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack',
  network: 'Robinhood Chain',
  apiBase: '/api',
  // Paste a full GeckoTerminal pool embed URL here.
  geckoChartUrl: ''
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
    buyLink.title = 'Official buy link configured in config.js';
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
})();
