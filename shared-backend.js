(() => {
  const apiBase = String(window.DOGEBOT_CONFIG?.apiBase || '/api').replace(/\/$/, '');
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

  const feed = document.getElementById('feed');
  const forumCount = document.getElementById('forumCount');
  const publish = document.getElementById('publish');
  const compose = document.getElementById('compose');
  const postHint = document.getElementById('postHint');
  const currentUser = document.getElementById('currentUser');
  const memeForm = document.getElementById('memeForm');
  const memeImage = document.getElementById('memeImage');
  const memeCaption = document.getElementById('memeCaption');
  const memeHint = document.getElementById('memeHint');
  const memeGrid = document.getElementById('memeGrid');
  const memeFeature = document.getElementById('memeFeature');
  const featuredMeme = document.getElementById('featuredMeme');
  const featuredCaption = document.getElementById('featuredMemeCaption');
  const featuredCreator = document.getElementById('featuredMemeCreator');
  const memeCounter = document.getElementById('memeCounter');
  const agentUpdates = document.getElementById('agentUpdates');
  let remoteForum = false;
  let remoteMemes = false;
  document.querySelector('.meme-pool-note')?.replaceChildren(document.createTextNode('Shared backend: uploads are moderated before appearing in the Pack spotlight.'));

  function setHint(node, text, warning = false) {
    if (!node) return;
    node.textContent = text;
    node.style.color = warning ? '#b56d10' : '';
  }

  async function request(path, options = {}) {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-dogebot-client': clientId,
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Shared backend request failed.');
    return data;
  }

  function relativeTime(value) {
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function renderPosts(posts) {
    if (!feed) return;
    feed.replaceChildren();
    if (forumCount) forumCount.textContent = `${posts.length} posts`;
    posts.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post glass';
      const head = document.createElement('div');
      head.className = 'post-head';
      const author = document.createElement('div');
      author.className = 'post-author';
      const avatar = document.createElement('span');
      avatar.className = 'avatar';
      avatar.textContent = String(post.name || 'A').slice(0, 1).toUpperCase();
      const name = document.createElement('strong');
      name.textContent = post.name || 'anonymous_pack_member';
      author.append(avatar, name);
      const time = document.createElement('span');
      time.className = 'post-time';
      time.textContent = post.createdAt ? relativeTime(post.createdAt) : 'now';
      head.append(author, time);
      const body = document.createElement('p');
      body.className = 'post-body';
      body.textContent = post.text;
      const actions = document.createElement('div');
      actions.className = 'post-actions';
      const like = document.createElement('button');
      like.className = 'post-action';
      like.type = 'button';
      like.dataset.sharedAction = 'like';
      like.dataset.postId = post.id;
      like.textContent = `♡ ${post.likes || 0}`;
      actions.append(like);
      if (post.mine) {
        const remove = document.createElement('button');
        remove.className = 'post-action';
        remove.type = 'button';
        remove.dataset.sharedAction = 'delete';
        remove.dataset.postId = post.id;
        remove.textContent = '✕ delete';
        actions.append(remove);
      }
      card.append(head, body, actions);
      feed.append(card);
    });
  }

  async function loadPosts() {
    try {
      const data = await request('/forum');
      remoteForum = true;
      renderPosts(Array.isArray(data.posts) ? data.posts : []);
      if (postHint) setHint(postHint, 'Shared feed · links and scam prompts are blocked');
      window.DOGEBOT_SHARED_BACKEND = true;
    } catch {
      setHint(postHint, 'Shared forum unavailable · try again shortly', true);
    }
  }

  feed?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-shared-action]');
    if (!button || !remoteForum) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    button.disabled = true;
    try {
      await request('/forum', { method: 'POST', body: JSON.stringify({ action: button.dataset.sharedAction, postId: button.dataset.postId, clientId }) });
      await loadPosts();
    } catch (err) {
      setHint(postHint, err.message, true);
      button.disabled = false;
    }
  }, true);

  if (publish) {
    publish.onclick = async () => {
      if (!remoteForum) {
        setHint(postHint, 'Shared forum unavailable · try again shortly', true);
        return;
      }
      const text = String(compose?.value || '').trim();
      if (!text) {
        setHint(postHint, 'Type a message first', true);
        compose?.focus();
        return;
      }
      publish.disabled = true;
      try {
        await request('/forum', { method: 'POST', body: JSON.stringify({ action: 'create', name: currentUser?.textContent, text, clientId }) });
        compose.value = '';
        setHint(postHint, 'Shared post published · links and scam prompts are blocked');
        await loadPosts();
      } catch (err) {
        setHint(postHint, err.message, true);
      } finally {
        publish.disabled = false;
      }
    };
  }

  function fileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderMemes(memes) {
    const memeStat = [...document.querySelectorAll('.stat')]
      .find((stat) => stat.querySelector('small')?.textContent?.trim() === 'MEME POWER');
    if (memeStat) {
      memeStat.querySelector('strong').textContent = String(memes.length);
      memeStat.querySelector('p').textContent = 'approved signals';
      memeStat.querySelector('p').classList.remove('up');
    }
    if (memeCounter) memeCounter.textContent = `${memes.length} approved signal${memes.length === 1 ? '' : 's'}`;
    if (memeFeature) memeFeature.classList.toggle('has-meme', memes.length > 0);
    if (memes[0]) {
      memeFeature.dataset.memeId = memes[0].id;
      featuredMeme.src = memes[0].imageUrl;
      featuredMeme.alt = `Featured DOGEBOT PACK meme: ${memes[0].caption}`;
      featuredCaption.textContent = memes[0].caption;
      featuredCreator.textContent = 'Approved community signal';
    } else {
      memeFeature?.removeAttribute('data-meme-id');
      featuredMeme.removeAttribute('src');
      featuredMeme.alt = 'No approved DOGEBOT PACK meme yet';
      featuredCaption.textContent = 'Awaiting approved signal';
      featuredCreator.textContent = 'Submit the first meme';
    }
    memeGrid?.replaceChildren(...memes.slice(1).map((meme) => {
      const card = document.createElement('article');
      card.className = 'meme-card glass';
      card.dataset.memeId = meme.id;
      const image = document.createElement('img');
      image.src = meme.imageUrl;
      image.alt = meme.caption;
      const caption = document.createElement('strong');
      caption.textContent = meme.caption;
      card.append(image, caption);
      return card;
    }));
  }

  async function loadMemes() {
    try {
      const data = await request('/memes');
      remoteMemes = true;
      renderMemes(Array.isArray(data.memes) ? data.memes : []);
      const note = document.querySelector('.meme-pool-note');
      if (note) note.textContent = 'Shared backend: uploads are moderated before appearing in the Pack spotlight.';
    } catch {
      setHint(memeHint, 'Meme Pool unavailable · try again shortly', true);
    }
  }

  function renderAgentUpdates(updates) {
    if (!agentUpdates) return;
    if (!updates.length) {
      agentUpdates.replaceChildren(Object.assign(document.createElement('div'), {
        className: 'agent-empty',
        textContent: 'No approved agent updates yet. Drafts stay private until reviewed.',
      }));
      return;
    }
    agentUpdates.replaceChildren(...updates.map((update) => {
      const card = document.createElement('article');
      card.className = 'agent-update-card';
      const meta = document.createElement('small');
      meta.textContent = `${update.source || 'DOGEBOT PACK Agent'} · ${relativeTime(update.createdAt)}`;
      const title = document.createElement('strong');
      title.textContent = update.title;
      const copy = document.createElement('p');
      copy.textContent = update.body;
      card.append(meta, title, copy);
      return card;
    }));
  }

  async function loadAgentUpdates() {
    try {
      const data = await request('/agent-updates');
      renderAgentUpdates(Array.isArray(data.updates) ? data.updates : []);
    } catch {
      renderAgentUpdates([]);
    }
  }

  function formatUsd(value) {
    if (!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPrice(value) {
    if (!Number.isFinite(value)) return '—';
    if (value < 0.0001) return `$${value.toFixed(10).replace(/0+$/, '').replace(/\.$/, '')}`;
    return `$${value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}`;
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) return '—';
    return `${value < 1 ? value.toFixed(2) : value.toFixed(1)}%`;
  }

  function stat(label) {
    return [...document.querySelectorAll('.stat')]
      .find((node) => node.querySelector('small')?.textContent?.trim() === label);
  }

  function updateStat(label, value, note) {
    const node = stat(label);
    if (!node) return;
    node.querySelector('strong').textContent = value;
    node.querySelector('p').textContent = note;
    node.querySelector('p').classList.remove('up');
  }

  function updateQuote(label, value, note) {
    const node = [...document.querySelectorAll('#dogebot .quote')]
      .find((quote) => quote.querySelector('small')?.textContent?.trim() === label);
    if (!node) return;
    node.querySelector('strong').textContent = value;
    node.querySelector('span').textContent = note;
  }

  function updateHolderView(market) {
    const snapshot = market.holders;
    const state = document.querySelector('.holder-state');
    const total = document.querySelector('.holder-total strong');
    const totalNote = document.querySelector('.holder-total p');
    const metrics = [...document.querySelectorAll('.holder-metrics > div')];
    if (!snapshot) {
      if (state) state.textContent = 'FEED UNAVAILABLE';
      if (total) total.textContent = '—';
      if (totalNote) totalNote.textContent = 'The read-only holder feed is temporarily unavailable.';
      return;
    }
    if (state) state.textContent = 'LIVE · RPC SYNC';
    if (total) total.textContent = snapshot.count.toLocaleString('en-US');
    if (totalNote) totalNote.textContent = `${snapshot.count.toLocaleString('en-US')} positive-balance addresses · block ${snapshot.block.toLocaleString('en-US')}`;
    if (metrics[0]) {
      metrics[0].querySelector('small').textContent = 'TOP 10 CONCENTRATION';
      metrics[0].querySelector('strong').textContent = formatPercent(snapshot.concentrationPct);
      metrics[0].querySelector('span').textContent = 'share of total supply';
    }
    if (metrics[1]) {
      metrics[1].querySelector('small').textContent = 'TOP BALANCE';
      metrics[1].querySelector('strong').textContent = formatPercent(snapshot.topHolderPct);
      metrics[1].querySelector('span').textContent = 'largest positive balance';
    }
    if (metrics[2]) {
      metrics[2].querySelector('small').textContent = 'LAST SYNC';
      metrics[2].querySelector('strong').textContent = new Date(market.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      metrics[2].querySelector('span').textContent = 'Robinhood Chain RPC';
    }
  }

  async function loadMarket() {
    try {
      const market = await request('/market');
      window.DOGEBOT_MARKET = market;
      updateStat('PRICE', formatPrice(market.priceUsd), 'live USD price');
      updateStat('MARKET CAP', formatUsd(market.marketCapUsd), 'live market data');
      updateStat('PACK SIZE', market.holders ? market.holders.count.toLocaleString('en-US') : '—', market.holders ? 'positive-balance addresses' : 'holder feed unavailable');
      updateStat('LIQUIDITY', formatUsd(market.liquidityUsd), 'live pool liquidity');
      updateStat('VOLUME 24H', formatUsd(market.volume24hUsd), 'live 24h volume');
      updateQuote('HOLDERS', market.holders ? market.holders.count.toLocaleString('en-US') : '—', market.holders ? 'RPC transfer-log index' : 'holder feed unavailable');
      const navPrice = document.getElementById('nav-price');
      if (navPrice) navPrice.textContent = formatPrice(market.priceUsd);
      const navDelta = document.querySelector('.pill-price .delta');
      if (navDelta) navDelta.textContent = 'LIVE';
      const chartDelta = document.querySelector('.chart-card .delta');
      if (chartDelta) chartDelta.textContent = `LIVE · ${formatPercent(market.priceChange24hPct)} / 24H`;
      const marketLabel = document.querySelector('#dogebot .chart-card .card-top small');
      if (marketLabel) marketLabel.textContent = 'LIVE MARKET DATA · READ-ONLY · API SOURCES SHOWN BELOW';
      const sourceNote = document.querySelector('#dogebot .quote-card .card-top small');
      if (sourceNote) sourceNote.textContent = `${market.sources.join(' + ')} · ${new Date(market.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const holderCopy = document.querySelector('#holders .section-head p');
      if (holderCopy) holderCopy.textContent = 'Positive-balance addresses and concentration calculated from Robinhood Chain transfer logs. Read-only, no wallet actions.';
      updateHolderView(market);
    } catch {
      updateStat('PRICE', '—', 'live source unavailable');
      updateStat('MARKET CAP', '—', 'live source unavailable');
      updateStat('LIQUIDITY', '—', 'live source unavailable');
      updateStat('VOLUME 24H', '—', 'live source unavailable');
      updateQuote('HOLDERS', '—', 'live source unavailable');
      const state = document.querySelector('.holder-state');
      if (state) state.textContent = 'FEED UNAVAILABLE';
    }
  }

  if (memeForm) {
    memeForm.onsubmit = async (event) => {
      if (!remoteMemes) {
        event.preventDefault();
        setHint(memeHint, 'Meme Pool unavailable · try again shortly', true);
        return;
      }
      event.preventDefault();
      const file = memeImage?.files?.[0];
      if (!file) return setHint(memeHint, 'Choose an image first', true);
      if (file.size > 1.5 * 1024 * 1024) return setHint(memeHint, 'Meme images must be 1.5 MB or smaller', true);
      if (!/^image\/(png|jpeg|gif|webp)$/i.test(file.type)) return setHint(memeHint, 'Use PNG, JPG, GIF, or WEBP', true);
      memeForm.querySelector('button[type="submit"]').disabled = true;
      try {
        await request('/memes', { method: 'POST', body: JSON.stringify({ imageData: await fileAsDataUrl(file), caption: memeCaption.value.trim(), clientId }) });
        memeForm.reset();
        setHint(memeHint, 'Submitted for moderation.');
        await loadMemes();
      } catch (err) {
        setHint(memeHint, err.message, true);
      } finally {
        memeForm.querySelector('button[type="submit"]').disabled = false;
      }
    };
  }

  loadPosts();
  loadMemes();
  loadAgentUpdates();
  loadMarket();
})();
