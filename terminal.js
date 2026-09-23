(() => {
  const pane = document.querySelector('#hub-pane-chat');
  if (!pane) return;

  const input = pane.querySelector('#hub-chat-input');
  const send = pane.querySelector('#hub-chat-send');
  const feed = pane.querySelector('#hub-chat-feed');
  if (!input || !send || !feed) return;

  const config = window.DOGEBOT_CONFIG || {};
  const livePoolUrl = config.livePoolUrl || config.geckoChartPageUrl || '';
  const obsoleteMenuLabels = new Set(['SOUNDBOARD', 'HOLDER TRACKER', 'MEME CONTEST', 'PACK SENTINEL HUB']);
  document.querySelectorAll('.nav-links a, .mobile-panel a, .footer-links a').forEach((link) => {
    if (obsoleteMenuLabels.has(link.textContent.trim().toUpperCase())) link.remove();
  });
  const mainBuy = document.querySelector('.hero-cta a.btn-primary');
   if (mainBuy && (livePoolUrl || config.buyUrl || config.bankrTradeUrl)) {
     mainBuy.href = livePoolUrl || config.buyUrl || config.bankrTradeUrl;
     mainBuy.target = '_blank';
     mainBuy.rel = 'noopener noreferrer';
     mainBuy.title = livePoolUrl ? 'Open the DOGEBOT live pool' : 'Open DOGEBOT on Bankr';
  }
  const routes = document.querySelector('.buy-routes');
  if (routes) {
     document.querySelector('.hero-cta')?.after(routes);
    routes.style.setProperty('display', 'grid', 'important');
    routes.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
    routes.style.gap = '10px';
    routes.style.marginTop = '14px';
    routes.style.width = '100%';
    if (!document.getElementById('dogebot-route-style')) {
      const routeStyle = document.createElement('style');
      routeStyle.id = 'dogebot-route-style';
      routeStyle.textContent = '.buy-routes-label{grid-column:1/-1}.buy-route{min-width:0}@media(max-width:700px){.buy-routes{grid-template-columns:1fr!important}.buy-routes-label{margin-bottom:2px}}';
      document.head.append(routeStyle);
    }
  }
  const mobileBuy = document.querySelector('.mobile-panel a[href*="app.uniswap.org"]');
  if (mobileBuy && config.bankrTradeUrl) {
    mobileBuy.href = config.bankrTradeUrl;
     mobileBuy.title = 'Open DOGEBOT on Bankr';
  }

  const history = [];
  const hub = document.querySelector('#integration-hub');
  if (hub) {
    hub.classList.add('dogebot-chat-only');
    const heading = hub.querySelector('.hub-container > h3');
    if (heading) heading.textContent = 'DOGEBOT';
    const intro = hub.querySelector('.hub-container > p');
    if (intro) intro.textContent = 'Ask DOGEBOT anything about crypto, technology, current events, or everyday topics.';
    hub.querySelector('.hub-cmd-bar')?.remove();
    hub.querySelector('.hub-tabs')?.remove();
    ['hub-pane-treasury', 'hub-pane-gating', 'hub-pane-airdrop'].forEach((id) => document.getElementById(id)?.remove());
    pane.classList.add('active');
    pane.querySelector('h4')?.replaceChildren(document.createTextNode('DOGEBOT'));
  }
  const bar = document.createElement('div');
  bar.className = 'chatgpt-terminal-bar';
  bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:10px 12px;border:1px solid rgba(194,255,0,.28);border-radius:8px;background:rgba(194,255,0,.05);font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;';
  bar.innerHTML = '<strong style="color:#c2ff00">DOGEBOT</strong><span data-agent-status style="color:#8e9991">CHECKING SERVER</span>';
  pane.prepend(bar);
  input.placeholder = 'Ask anything';
  const status = bar.querySelector('[data-agent-status]');

  const terminalOverlay = document.createElement('div');
  terminalOverlay.id = 'dogebot-terminal-overlay';
  terminalOverlay.setAttribute('aria-hidden', 'true');
  terminalOverlay.innerHTML = '<div class="dogebot-terminal-backdrop"></div><section class="dogebot-terminal-panel" role="dialog" aria-modal="true" aria-labelledby="dogebot-terminal-title"><header class="dogebot-terminal-head"><div><span class="dogebot-terminal-kicker">DOGEBOT / GENERAL ASSISTANT</span><h2 id="dogebot-terminal-title">DOGEBOT</h2></div><button class="dogebot-terminal-close" type="button" aria-label="Close DOGEBOT terminal">×</button></header><div class="dogebot-terminal-slot"></div></section>';
  const terminalStyle = document.createElement('style');
  terminalStyle.id = 'dogebot-terminal-overlay-style';
  terminalStyle.textContent = `
     #dogebot-terminal-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:clamp(16px,4vw,48px);background:rgba(0,0,0,.68);backdrop-filter:blur(10px)}
     #dogebot-terminal-overlay.is-open{display:flex}
     .dogebot-terminal-panel{position:relative;width:min(680px,100%);max-height:min(760px,calc(100vh - 32px));overflow:auto;border:1px solid rgba(194,255,0,.5);border-radius:24px;background:linear-gradient(145deg,rgba(8,14,9,.99),rgba(13,16,24,.98));box-shadow:0 28px 100px rgba(0,0,0,.72),0 0 50px rgba(194,255,0,.14);animation:dogebot-terminal-in .32s cubic-bezier(.2,.8,.2,1) both}
     .dogebot-terminal-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 24px;border-bottom:1px solid rgba(194,255,0,.22);background:linear-gradient(90deg,rgba(194,255,0,.08),transparent 60%)}
     .dogebot-terminal-kicker{display:block;color:#c2ff00;font:700 10px/1.4 ui-monospace,monospace;letter-spacing:.14em}
     .dogebot-terminal-head h2{margin:6px 0 0;color:#f5f7ef;font:800 clamp(28px,4vw,38px)/1 'Space Grotesk',Inter,sans-serif;letter-spacing:.02em}
     .dogebot-terminal-close{width:38px;height:38px;border:1px solid rgba(194,255,0,.45);border-radius:50%;background:rgba(194,255,0,.06);color:#c2ff00;font-size:24px;line-height:1;cursor:pointer;transition:transform .2s ease,background .2s ease}
     .dogebot-terminal-close:hover{transform:rotate(90deg);background:rgba(194,255,0,.16)}
     .dogebot-terminal-slot{padding:22px}
     .dogebot-terminal-slot .hub-tab-pane.active{display:block}
     .dogebot-terminal-slot .hub-card{margin:0;border-color:rgba(194,255,0,.2);border-radius:18px;background:rgba(255,255,255,.025)}
     .dogebot-terminal-slot .hub-card h4{display:none}
     .dogebot-terminal-slot #hub-chat-feed{max-height:min(42vh,330px);overflow:auto;scrollbar-color:#c2ff00 transparent}
     .dogebot-terminal-slot #hub-chat-input{min-height:48px;border-radius:12px}
     .dogebot-terminal-slot #hub-chat-send{min-width:82px;border-radius:12px}
     @keyframes dogebot-terminal-in{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
     @media(max-width:700px){#dogebot-terminal-overlay{align-items:flex-end;padding:10px} .dogebot-terminal-panel{width:100%;max-height:calc(100svh - 20px);border-radius:22px 22px 14px 14px;animation-name:dogebot-terminal-sheet-in}.dogebot-terminal-head{padding:18px 17px}.dogebot-terminal-slot{padding:12px}@keyframes dogebot-terminal-sheet-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}}
     @media(prefers-reduced-motion:reduce){.dogebot-terminal-panel,.dogebot-terminal-close{animation:none;transition:none}}
  `;
  document.head.append(terminalStyle);
  document.body.append(terminalOverlay);
  terminalOverlay.querySelector('.dogebot-terminal-slot').append(pane);
  pane.querySelector('h4')?.setAttribute('hidden', 'hidden');
  if (hub) {
    hub.hidden = true;
    hub.setAttribute('aria-hidden', 'true');
    hub.style.display = 'none';
  }
  document.querySelector('#aiLaunch')?.remove();
  document.querySelector('#aiOverlay')?.remove();

  const closeTerminal = () => {
    terminalOverlay.classList.remove('is-open');
    terminalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const openTerminal = () => {
    terminalOverlay.classList.add('is-open');
    terminalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 40);
  };
  terminalOverlay.querySelector('.dogebot-terminal-close').addEventListener('click', closeTerminal);
  terminalOverlay.querySelector('.dogebot-terminal-backdrop').addEventListener('click', closeTerminal);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeTerminal(); });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const label = link.textContent.trim().toUpperCase();
    if (link.dataset.terminalLaunch !== 'true' && label !== 'TERMINAL' && label !== 'ENTER TERMINAL') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openTerminal();
  }, true);

  const append = (label, text, accent) => {
    const message = document.createElement('div');
    message.className = 'hub-msg';
    message.innerHTML = `<strong style="color:${accent}">${label}</strong><br>`;
    const copy = document.createElement('span');
    copy.textContent = text;
    message.append(copy);
    feed.append(message);
    feed.scrollTop = feed.scrollHeight;
  };

  fetch('/api/agent').then((response) => response.json()).then((data) => {
    if (data.configured) {
      status.textContent = 'ONLINE / READ-ONLY';
      status.style.color = '#68f29a';
      append('SYSTEM', 'Browser Use agent is connected. This terminal is read-only and cannot execute transactions.', '#68f29a');
    } else {
      status.textContent = 'SERVER KEY REQUIRED';
      status.style.color = '#f5a623';
      append('SYSTEM', 'Browser Use Terminal is installed but its server key has not been configured yet.', '#f5a623');
    }
  }).catch(() => {
    status.textContent = 'SOURCE UNAVAILABLE';
    status.style.color = '#f5a623';
  });

  async function loadWatchtower() {
    if (!config.contractAddress) {
      const statusNode = document.querySelector('#trackerStatus');
      const copyNode = document.querySelector('#tracker .section-head p');
      if (statusNode) statusNode.innerHTML = '<i class="dot-live"></i> PAUSED / CA PENDING';
      if (copyNode) copyNode.textContent = 'TSLA reference tracking will activate after a new contract address is configured.';
      return;
    }
    try {
      const response = await fetch('/api/tracker');
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Tracker data is unavailable.');
      const metrics = data.metrics || {};
      const format = (value, symbol) => value == null ? 'NOT EXPOSED' : `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 })} ${symbol}`;
      const fetched = data.market?.fetchedAt ? new Date(data.market.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'LIVE';
      const statusNode = document.querySelector('#trackerStatus');
      const fetchedNode = document.querySelector('#trackerFetched');
      const feesNote = document.querySelector('#trackerFeesNote');
      const tokenFeesNote = document.querySelector('#trackerTokenFeesNote');
      const sourceNode = document.querySelector('#trackerSource');
      const telemetryNode = document.querySelector('#trackerTelemetry');
      const copyNode = document.querySelector('#tracker .section-head p');
      if (statusNode) statusNode.innerHTML = '<i class="dot-live"></i> LIVE / READ-ONLY';
      if (fetchedNode) fetchedNode.textContent = fetched;
      if (document.querySelector('#trackerFees')) document.querySelector('#trackerFees').textContent = format(metrics.claimableNumeraireFees, metrics.claimableNumeraireSymbol || 'TSLA');
      if (document.querySelector('#trackerTokenFees')) document.querySelector('#trackerTokenFees').textContent = format(metrics.claimableTokenFees, metrics.claimableTokenSymbol || 'DOGEBOT');
      if (document.querySelector('#trackerHolders')) document.querySelector('#trackerHolders').textContent = metrics.holders == null ? 'NOT EXPOSED' : Number(metrics.holders).toLocaleString('en-US');
      if (feesNote) feesNote.textContent = 'Current claimable balance · Bankr public data';
      if (tokenFeesNote) tokenFeesNote.textContent = 'Current claimable balance · Bankr public data';
      if (sourceNode) sourceNode.textContent = `Source: ${data.telemetry?.source || 'Bankr public token data'} · live read-only`;
      if (telemetryNode) telemetryNode.textContent = data.telemetry?.text || 'Current Bankr public fee balance loaded.';
      if (copyNode) copyNode.textContent = 'Live read-only holder context and current claimable fee balances from Bankr public data.';
    } catch {
      const statusNode = document.querySelector('#trackerStatus');
      if (statusNode) statusNode.innerHTML = '<i class="dot-live"></i> SOURCE UNAVAILABLE';
    }
  }
  loadWatchtower();

  async function waitForRun(runId) {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`/api/agent?runId=${encodeURIComponent(runId)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Browser Use agent is unavailable.');
      if (data.status === 'completed') return data.result || 'The agent returned no text.';
      if (['failed', 'cancelled'].includes(data.status)) throw new Error(data.error || `Agent run ${data.status}.`);
      status.textContent = `${String(data.status || 'RUNNING').toUpperCase()} / READ-ONLY`;
    }
    throw new Error('The agent is still working. Please try again in a moment.');
  }

  async function ask(text) {
    const question = String(text || input.value || '').trim();
    if (!question || send.disabled) return;
    input.value = '';
    append('YOU', question, '#f5a623');
    history.push({ role: 'user', content: question });
    send.disabled = true;
    send.textContent = '...';
    status.textContent = 'STARTING AGENT';
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dogebot-client': localStorage.getItem('dogebot-shared-client-id') || 'anonymous' },
        body: JSON.stringify({ messages: history.slice(-8) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Browser Use agent is unavailable.');
      const reply = await waitForRun(data.runId);
      history.push({ role: 'assistant', content: reply });
      append('BROWSER USE', reply, '#c2ff00');
      status.textContent = 'ONLINE / READ-ONLY';
    } catch (error) {
      append('SYSTEM', error.message, '#f5a623');
      status.textContent = error.message.includes('key') ? 'SERVER KEY REQUIRED' : 'READY';
    } finally {
      send.disabled = false;
      send.textContent = 'Send';
    }
  }

  send.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    ask();
  }, true);
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    ask();
  }, true);
  pane.querySelectorAll('[data-cmd]').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    ask(button.dataset.cmd);
  }, true));
})();
