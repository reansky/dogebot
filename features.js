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

  addLink(document.querySelector('.nav-links'), '/memes', 'Meme Contest', true);
  addLink(document.querySelector('.nav-links'), '/tracker', 'Holder Tracker', true);
  addLink(document.querySelector('.mobile-panel'), '/memes', 'Meme Contest');
  addLink(document.querySelector('.mobile-panel'), '/tracker', 'Holder Tracker');
  addLink(document.querySelector('.footer-links'), '/memes', 'Meme Contest');
  addLink(document.querySelector('.footer-links'), '/tracker', 'Holder Tracker');

  const trackerSection = document.createElement('section');
  trackerSection.className = 'section shell tracker-section';
  trackerSection.id = 'tracker';
  trackerSection.innerHTML = `
    <div class="section-head"><div><div class="overline">HOLDER REWARDS / FEE TRACKER</div><h2>Follow the <span>flow.</span></h2><p>Read-only holder context plus claimable fee data from Bankr's public token page. Historical totals and buyback values are not inferred.</p></div><div class="section-readout">TRACKER STATUS<strong id="trackerStatus"><i class="dot-live"></i> SYNCING</strong></div></div>
    <div class="tracker-grid"><article class="tracker-card tracker-card-main glass"><div class="tracker-card-top"><div><strong>Claimable fee snapshot</strong><small>ROBINHOOD CHAIN / READ-ONLY</small></div><span id="trackerFetched">-</span></div><div class="tracker-metrics"><div><small>CLAIMABLE DDOG FEES</small><strong id="trackerFees">NOT EXPOSED</strong><span id="trackerFeesNote">Waiting for Bankr public data</span></div><div><small>CLAIMABLE $DOGEBOT FEES</small><strong id="trackerTokenFees">NOT EXPOSED</strong><span id="trackerTokenFeesNote">Waiting for Bankr public data</span></div><div><small>POSITIVE HOLDERS</small><strong id="trackerHolders">-</strong><span>Robinhood Chain transfer logs</span></div><div><small>CONTRACT</small><strong>LIVE</strong><span>0xe77d...c5ba3</span></div></div></article><aside class="tracker-card tracker-card-action glass"><div class="tracker-card-top"><div><strong>View on Bankr</strong><small>OFFICIAL SOURCE</small></div><span class="tracker-lock">LINK</span></div><p>Bankr's token page is the source of truth for the current claimable balances. This tracker never executes trades.</p><a class="btn btn-primary" href="${config.bankrTradeUrl || 'https://bankr.bot'}" target="_blank" rel="noopener noreferrer">Open Bankr trade page ↗</a><div class="tracker-source" id="trackerSource">Source: connecting to Bankr public token data.</div></aside></div><div class="tracker-telemetry glass"><span class="tracker-telemetry-mark">i</span><div><strong>Bankr fee data note</strong><p id="trackerTelemetry">Bankr public fee data is loading. No historical total or buyback estimate is shown.</p></div></div>`;
  document.querySelector('#dogebot')?.before(trackerSection);

  const formatAmount = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString('en-US', { maximumFractionDigits: 6 }) : 'NOT EXPOSED';
  };

  const loadTracker = async () => {
    try {
      const data = await request('/tracker');
      const ddogFees = data.metrics.claimableDdogFees;
      const tokenFees = data.metrics.claimableTokenFees;
      document.getElementById('trackerFees').textContent = ddogFees == null ? 'NOT EXPOSED' : `${formatAmount(ddogFees)} DDOG`;
      document.getElementById('trackerTokenFees').textContent = tokenFees == null ? 'NOT EXPOSED' : `${formatAmount(tokenFees)} $DOGEBOT`;
      document.getElementById('trackerHolders').textContent = data.metrics.holders?.toLocaleString('en-US') || '-';
      document.getElementById('trackerFeesNote').textContent = ddogFees == null ? 'No public claimable balance' : 'Current claimable balance';
      document.getElementById('trackerTokenFeesNote').textContent = tokenFees == null ? 'No public claimable balance' : 'Current claimable balance';
      document.getElementById('trackerFetched').textContent = data.market.fetchedAt ? new Date(data.market.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      document.getElementById('trackerStatus').innerHTML = '<i class="dot-live"></i> LIVE / READ-ONLY';
      document.getElementById('trackerSource').textContent = `Source: ${data.telemetry.source}. Contract ${data.token.address.slice(0, 8)}...${data.token.address.slice(-6)}.`;
      document.getElementById('trackerTelemetry').textContent = data.telemetry.text || 'Bankr did not expose a verified claimable balance. No estimate is shown.';
    } catch {
      document.getElementById('trackerStatus').innerHTML = '<i class="dot-live"></i> SOURCE UNAVAILABLE';
      document.getElementById('trackerTelemetry').textContent = 'Bankr public fee data is temporarily unavailable. No estimate is shown.';
    }
  };

  const contest = document.querySelector('#memes');
  if (contest && !contest.querySelector('.meme-contest-bar')) {
    const bar = document.createElement('div');
    bar.className = 'meme-contest-bar glass';
    bar.innerHTML = '<div><small>MEME CONTEST / LIVE VOTING</small><strong>Community spotlight is open.</strong></div><span id="memeVoteSummary">Loading votes...</span>';
    contest.querySelector('.meme-pool-head')?.append(bar);
  }

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
  loadTracker();
  loadVotes();
  window.DOGEBOT_FEATURES = true;
})();
