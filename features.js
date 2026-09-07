(() => {
  const config = window.DOGEBOT_CONFIG || {};
  const apiBase = String(config.apiBase || '/api').replace(/\/$/, '');
  const clientKey = 'dogebot-shared-client-id';
  const clientId = (() => {
    try {
      const saved = localStorage.getItem(clientKey);
      if (saved) return saved;
      const next = crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(clientKey, next);
      return next;
    } catch {
      return `client_${Date.now()}`;
    }
  })();

  const request = async (path, options = {}) => {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', 'x-dogebot-client': clientId, ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'DOGEBOT request failed.');
    return data;
  };

  const addLink = (parent, href, text, prepend = false) => {
    if (!parent || parent.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    if (prepend) parent.prepend(link);
    else parent.append(link);
  };

  addLink(document.querySelector('.nav-links'), '#bankr-agent', 'Bankr Bot Agent', true);
  addLink(document.querySelector('.nav-links'), '/memes', 'Meme Contest', true);
  addLink(document.querySelector('.nav-links'), '/tracker', 'Holder Tracker', true);
  addLink(document.querySelector('.mobile-panel'), '#bankr-agent', 'Bankr Bot Agent');
  addLink(document.querySelector('.mobile-panel'), '/memes', 'Meme Contest');
  addLink(document.querySelector('.mobile-panel'), '/tracker', 'Holder Tracker');
  addLink(document.querySelector('.footer-links'), '#bankr-agent', 'Bankr Bot Agent');
  addLink(document.querySelector('.footer-links'), '/memes', 'Meme Contest');
  addLink(document.querySelector('.footer-links'), '/tracker', 'Holder Tracker');

  const agentSection = document.createElement('section');
  agentSection.className = 'section shell bankr-agent-section';
  agentSection.id = 'bankr-agent';
  agentSection.innerHTML = `
    <div class="section-head bankr-agent-head">
      <div><div class="overline">BANKR BOT AGENT / LIVE TERMINAL</div><h2>Ask the <span>pack agent.</span></h2><p>Read-only Bankr intelligence for $DOGEBOT on Robinhood Chain. Price, holder context, and token status stay inside the site.</p></div>
      <div class="section-readout">API STATUS<strong id="bankrAgentStatus"><i class="dot-live"></i> CONNECTING</strong></div>
    </div>
    <div class="bankr-agent-grid">
      <article class="bankr-agent-console glass">
        <div class="bankr-agent-console-top"><div><strong>Bankr Bot Agent</strong><small>SERVER-SIDE API PROXY · READ-ONLY</small></div><span class="bankr-agent-live">ROBINHOOD CHAIN</span></div>
        <div class="bankr-agent-stats" id="bankrAgentStats"><div><small>PRICE</small><strong id="agentPrice">—</strong><span>live market source</span></div><div><small>24H CHANGE</small><strong id="agentChange">—</strong><span>read-only signal</span></div><div><small>HOLDERS</small><strong id="agentHolders">—</strong><span>RPC transfer logs</span></div><div><small>TOKEN STATUS</small><strong id="agentTokenStatus">LIVE</strong><span>$DOGEBOT configured</span></div></div>
        <div class="bankr-agent-messages" id="bankrAgentMessages" aria-live="polite"><div class="bankr-agent-message agent"><small>BANKR BOT AGENT</small><p>Ask for a concise read-only DOGEBOT status, market readout, or safety check.</p></div></div>
        <div class="bankr-agent-prompts"><button type="button" data-bankr-prompt="Give me a read-only DOGEBOT market status.">Market status</button><button type="button" data-bankr-prompt="What is the current DOGEBOT holder context?">Holder context</button><button type="button" data-bankr-prompt="Explain the DOGEBOT Pack safety rules.">Safety rules</button></div>
        <form class="bankr-agent-form" id="bankrAgentForm"><input id="bankrAgentInput" maxlength="420" placeholder="Ask the Bankr Bot Agent..." autocomplete="off"><button class="post-btn" type="submit">Send</button></form>
      </article>
      <aside class="bankr-agent-side glass"><div class="bankr-agent-side-top"><strong>Agent boundary</strong><span>LOCKED</span></div><ul><li>Market and holder data are read-only.</li><li>Swap, buy, sell, transfer, and deploy prompts are blocked.</li><li>The API key stays server-side in Vercel.</li></ul><a class="btn btn-primary" href="https://bankr.bot" target="_blank" rel="noopener noreferrer">Open Bankr ↗</a></aside>
    </div>`;
  document.querySelector('#dogebot')?.before(agentSection);

  const trackerSection = document.createElement('section');
  trackerSection.className = 'section shell tracker-section';
  trackerSection.id = 'tracker';
  trackerSection.innerHTML = `
    <div class="section-head"><div><div class="overline">HOLDER REWARDS / BUYBACK TRACKER</div><h2>Follow the <span>flow.</span></h2><p>On-chain holder context plus Bankr telemetry. Values remain blank when a fee or buyback source is not publicly verified.</p></div><div class="section-readout">TRACKER STATUS<strong id="trackerStatus"><i class="dot-live"></i> SYNCING</strong></div></div>
    <div class="tracker-grid"><article class="tracker-card tracker-card-main glass"><div class="tracker-card-top"><div><strong>Rewards and buyback ledger</strong><small>ROBINHOOD CHAIN / READ-ONLY</small></div><span id="trackerFetched">—</span></div><div class="tracker-metrics"><div><small>SWAP FEES COLLECTED</small><strong id="trackerFees">NOT EXPOSED</strong><span id="trackerFeesNote">Waiting for verified Bankr telemetry</span></div><div><small>ACCUMULATED BUYBACK</small><strong id="trackerBuyback">NOT EXPOSED</strong><span id="trackerBuybackNote">Waiting for verified Bankr telemetry</span></div><div><small>POSITIVE HOLDERS</small><strong id="trackerHolders">—</strong><span>Robinhood Chain transfer logs</span></div><div><small>CONTRACT</small><strong>LIVE</strong><span>0xe77d...c5ba3</span></div></div></article><aside class="tracker-card tracker-card-action glass"><div class="tracker-card-top"><div><strong>Trade on Bankr</strong><small>OFFICIAL ROUTE</small></div><span class="tracker-lock">LINK</span></div><p>Use the official Bankr terminal for any wallet action. This tracker never executes trades.</p><a class="btn btn-primary" href="https://bankr.bot" target="_blank" rel="noopener noreferrer">Trade on Bankr ↗</a><div class="tracker-source" id="trackerSource">Source: connecting to Bankr Agent and Robinhood Chain RPC.</div></aside></div><div class="tracker-telemetry glass"><span class="tracker-telemetry-mark">i</span><div><strong>Bankr telemetry note</strong><p id="trackerTelemetry">Telemetry is loading. Unverified metrics remain clearly labeled.</p></div></div>`;
  agentSection.after(trackerSection);

  const contest = document.querySelector('#memes');
  if (contest && !contest.querySelector('.meme-contest-bar')) {
    const bar = document.createElement('div');
    bar.className = 'meme-contest-bar glass';
    bar.innerHTML = '<div><small>MEME CONTEST / LIVE VOTING</small><strong>Community spotlight is open.</strong></div><span id="memeVoteSummary">Loading votes...</span>';
    contest.querySelector('.meme-pool-head')?.append(bar);
  }

  const agentFab = document.createElement('button');
  agentFab.type = 'button';
  agentFab.className = 'bankr-agent-fab';
  agentFab.innerHTML = '<span class="bankr-agent-fab-mark">⌁</span><span>Bankr Bot Agent</span><i class="dot-live"></i>';
  agentFab.setAttribute('aria-label', 'Open Bankr Bot Agent');
  document.body.append(agentFab);

  const agentOverlay = document.createElement('div');
  agentOverlay.className = 'bankr-agent-overlay';
  agentOverlay.setAttribute('aria-hidden', 'true');
  agentOverlay.innerHTML = '<section class="bankr-agent-popover glass" role="dialog" aria-modal="true" aria-labelledby="bankrAgentPopoverTitle"><header><div><div class="overline">BANKR BOT AGENT</div><h2 id="bankrAgentPopoverTitle">Pack terminal.</h2></div><button type="button" class="bankr-agent-close" aria-label="Close Bankr Bot Agent">×</button></header><div class="bankr-popover-status"><i class="dot-live"></i><span id="bankrPopoverStatus">Read-only connection</span></div><div class="bankr-agent-messages" id="bankrPopoverMessages"><div class="bankr-agent-message agent"><small>BANKR BOT AGENT</small><p>Ask for a live read-only DOGEBOT status.</p></div></div><div class="bankr-agent-prompts"><button type="button" data-bankr-pop-prompt="Give me the current DOGEBOT price and holder status.">Live status</button><button type="button" data-bankr-pop-prompt="What is the DOGEBOT contract and network?">Contract</button></div><form class="bankr-agent-form" id="bankrPopoverForm"><input id="bankrPopoverInput" maxlength="420" placeholder="Ask Bankr..." autocomplete="off"><button class="post-btn" type="submit">Send</button></form></section>';
  document.body.append(agentOverlay);

  const formatPrice = (value) => Number.isFinite(Number(value)) ? `$${Number(value).toFixed(10).replace(/0+$/, '').replace(/\.$/, '')}` : '—';
  const formatCompact = (value) => Number.isFinite(Number(value)) ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value)) : '—';
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const appendMessage = (container, role, text) => {
    if (!container) return;
    const message = document.createElement('div');
    message.className = `bankr-agent-message ${role}`;
    const label = document.createElement('small');
    label.textContent = role === 'user' ? 'YOU' : 'BANKR BOT AGENT';
    const copy = document.createElement('p');
    copy.textContent = text;
    message.append(label, copy);
    container.append(message);
    container.scrollTop = container.scrollHeight;
  };

  const loadAgentSnapshot = async () => {
    const status = document.getElementById('bankrAgentStatus');
    try {
      const [market, bankr] = await Promise.all([request('/market'), request('/bankr?mode=summary')]);
      document.getElementById('agentPrice').textContent = formatPrice(market.priceUsd);
      document.getElementById('agentChange').textContent = Number.isFinite(Number(market.priceChange24hPct)) ? `${Number(market.priceChange24hPct).toFixed(1)}%` : '—';
      document.getElementById('agentHolders').textContent = market.holders?.count?.toLocaleString('en-US') || '—';
      if (status) status.innerHTML = '<i class="dot-live"></i> CONNECTED';
      document.getElementById('bankrPopoverStatus').textContent = bankr.connected ? 'Bankr API connected · read-only' : 'Bankr API unavailable';
    } catch {
      if (status) status.innerHTML = '<i class="dot-live"></i> MARKET ONLY';
      const popoverStatus = document.getElementById('bankrPopoverStatus');
      if (popoverStatus) popoverStatus.textContent = 'Bankr API needs configuration';
    }
  };

  const askAgent = async (input, messages) => {
    const prompt = String(input || '').trim();
    if (!prompt) return;
    appendMessage(messages, 'user', prompt);
    try {
      const started = await request('/bankr', { method: 'POST', body: JSON.stringify({ prompt, clientId }) });
      let result = started;
      const activeStatuses = ['queued', 'submitted', 'pending', 'processing', 'in_progress', 'running'];
      for (let attempt = 0; attempt < 18 && result.jobId && activeStatuses.includes(String(result.status).toLowerCase()); attempt += 1) {
        await wait(700);
        result = await request(`/bankr?job=${encodeURIComponent(started.jobId)}`);
      }
      appendMessage(messages, result.response || (result.status === 'completed' ? 'Bankr returned no text.' : `Bankr job status: ${result.status}.`), 'agent');
    } catch (err) {
      appendMessage(messages, err.message, 'agent');
    }
  };

  const openAgent = () => {
    agentOverlay.classList.add('open');
    agentOverlay.setAttribute('aria-hidden', 'false');
    loadAgentSnapshot();
  };
  const closeAgent = () => {
    agentOverlay.classList.remove('open');
    agentOverlay.setAttribute('aria-hidden', 'true');
  };
  agentFab.onclick = openAgent;
  const navAgent = document.createElement('button');
  navAgent.type = 'button';
  navAgent.className = 'nav-bankr-agent';
  navAgent.innerHTML = '<i class="dot-live"></i><span>Bankr Bot Agent</span>';
  navAgent.onclick = openAgent;
  const navActions = document.querySelector('.nav-actions');
  if (navActions && !navActions.querySelector('.nav-bankr-agent')) navActions.insertBefore(navAgent, document.getElementById('menu'));
  agentOverlay.querySelector('.bankr-agent-close').onclick = closeAgent;
  agentOverlay.onclick = (event) => { if (event.target === agentOverlay) closeAgent(); };
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeAgent(); });
  document.querySelectorAll('[data-bankr-prompt]').forEach((button) => button.onclick = () => askAgent(button.dataset.bankrPrompt, document.getElementById('bankrAgentMessages')));
  document.querySelectorAll('[data-bankr-pop-prompt]').forEach((button) => button.onclick = () => askAgent(button.dataset.bankrPopPrompt, document.getElementById('bankrPopoverMessages')));
  document.getElementById('bankrAgentForm').onsubmit = (event) => { event.preventDefault(); const input = document.getElementById('bankrAgentInput'); const text = input.value; input.value = ''; askAgent(text, document.getElementById('bankrAgentMessages')); };
  document.getElementById('bankrPopoverForm').onsubmit = (event) => { event.preventDefault(); const input = document.getElementById('bankrPopoverInput'); const text = input.value; input.value = ''; askAgent(text, document.getElementById('bankrPopoverMessages')); };

  const loadTracker = async () => {
    try {
      const data = await request('/tracker');
      const metric = (value, currency) => value === null || value === undefined ? 'NOT EXPOSED' : `${formatCompact(value)} ${currency || ''}`.trim();
      document.getElementById('trackerFees').textContent = metric(data.metrics.swapFees, data.metrics.currency);
      document.getElementById('trackerBuyback').textContent = metric(data.metrics.buyback, data.metrics.currency);
      document.getElementById('trackerHolders').textContent = data.metrics.holders?.toLocaleString('en-US') || '—';
      document.getElementById('trackerFeesNote').textContent = data.metrics.swapFees == null ? 'No verified public telemetry' : 'Bankr read-only telemetry';
      document.getElementById('trackerBuybackNote').textContent = data.metrics.buyback == null ? 'No verified public telemetry' : 'Bankr read-only telemetry';
      document.getElementById('trackerFetched').textContent = data.market.fetchedAt ? new Date(data.market.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
      document.getElementById('trackerStatus').innerHTML = '<i class="dot-live"></i> LIVE / READ-ONLY';
      document.getElementById('trackerSource').textContent = `Source: ${data.telemetry.source}. Contract ${data.token.address.slice(0, 8)}...${data.token.address.slice(-6)}.`;
      document.getElementById('trackerTelemetry').textContent = data.telemetry.text || 'Bankr did not expose a verified fee or buyback value. No estimate is shown.';
    } catch (err) {
      document.getElementById('trackerStatus').innerHTML = '<i class="dot-live"></i> SOURCE UNAVAILABLE';
      document.getElementById('trackerTelemetry').textContent = err.message;
    }
  };

  let votes = {};
  const voteSummary = document.getElementById('memeVoteSummary');
  const decorateVotes = () => {
    const cards = [...document.querySelectorAll('#memeGrid .meme-card[data-meme-id]'), document.querySelector('#memeFeature[data-meme-id]')].filter(Boolean);
    cards.forEach((card) => {
      if (card.querySelector('[data-meme-vote]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'meme-vote';
      button.dataset.memeVote = card.dataset.memeId;
      button.textContent = `Vote ${votes[card.dataset.memeId] || 0}`;
      if (card.id === 'memeFeature') button.classList.add('meme-feature-vote');
      card.append(button);
    });
    document.querySelectorAll('[data-meme-vote]').forEach((button) => { button.textContent = `Vote ${votes[button.dataset.memeVote] || 0}`; });
  };
  const loadVotes = async () => {
    try {
      const data = await request('/meme-votes');
      votes = data.votes || {};
      if (voteSummary) voteSummary.textContent = `${data.totalVotes || 0} public votes · one vote per meme`; 
      decorateVotes();
    } catch {
      if (voteSummary) voteSummary.textContent = 'Voting activates with the shared backend';
    }
  };
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-meme-vote]');
    if (!button) return;
    button.disabled = true;
    try {
      await request('/meme-votes', { method: 'POST', body: JSON.stringify({ memeId: button.dataset.memeVote, clientId }) });
      votes[button.dataset.memeVote] = (votes[button.dataset.memeVote] || 0) + 1;
      decorateVotes();
    } catch (err) {
      button.textContent = err.message;
      setTimeout(() => decorateVotes(), 1800);
    } finally {
      button.disabled = false;
    }
  });
  const memeGrid = document.getElementById('memeGrid');
  if (memeGrid) new MutationObserver(decorateVotes).observe(memeGrid, { childList: true });
  const memeFeature = document.getElementById('memeFeature');
  if (memeFeature) new MutationObserver(decorateVotes).observe(memeFeature, { attributes: true, attributeFilter: ['data-meme-id'] });

  const route = location.pathname.replace(/\/$/, '');
  const target = route === '/memes' ? 'memes' : route === '/tracker' ? 'tracker' : null;
  if (target) setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 240);
  loadAgentSnapshot();
  loadTracker();
  loadVotes();
  window.DOGEBOT_FEATURES = true;
})();
