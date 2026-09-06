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
  let remoteForum = false;
  let remoteMemes = false;

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
      setHint(postHint, 'Local demo mode · connect Supabase to share posts', true);
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
    const localPublish = publish.onclick;
    publish.onclick = async () => {
      if (!remoteForum) return localPublish?.();
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
    if (memeCounter) memeCounter.textContent = `${memes.length} approved signal${memes.length === 1 ? '' : 's'}`;
    if (memeFeature) memeFeature.classList.toggle('has-meme', memes.length > 0);
    if (memes[0]) {
      featuredMeme.src = memes[0].imageUrl;
      featuredMeme.alt = `Featured DOGEBOT PACK meme: ${memes[0].caption}`;
      featuredCaption.textContent = memes[0].caption;
      featuredCreator.textContent = 'Approved community signal';
    } else {
      featuredMeme.removeAttribute('src');
      featuredMeme.alt = 'No approved DOGEBOT PACK meme yet';
      featuredCaption.textContent = 'Awaiting approved signal';
      featuredCreator.textContent = 'Submit the first meme';
    }
    memeGrid?.replaceChildren(...memes.slice(1).map((meme) => {
      const card = document.createElement('article');
      card.className = 'meme-card glass';
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
      setHint(memeHint, 'Local demo mode · connect Supabase to share memes', true);
    }
  }

  if (memeForm) {
    const localMemeSubmit = memeForm.onsubmit;
    memeForm.onsubmit = async (event) => {
      if (!remoteMemes) return localMemeSubmit?.(event);
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
})();
