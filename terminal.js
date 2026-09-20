(() => {
  const pane = document.querySelector('#hub-pane-chat');
  if (!pane) return;

  const input = pane.querySelector('#hub-chat-input');
  const send = pane.querySelector('#hub-chat-send');
  const feed = pane.querySelector('#hub-chat-feed');
  if (!input || !send || !feed) return;

  const history = [];
  const hub = document.querySelector('#integration-hub');
  if (hub) {
    hub.classList.add('dogebot-chat-only');
    const heading = hub.querySelector('.hub-container > h3');
    if (heading) heading.textContent = 'DOGEBOT';
    const intro = hub.querySelector('.hub-container > p');
    if (intro) intro.textContent = 'Ask DOGEBOT about the project, safety, market context, or the pack.';
    hub.querySelector('.hub-cmd-bar')?.remove();
    hub.querySelector('.hub-tabs')?.remove();
    ['hub-pane-treasury', 'hub-pane-gating', 'hub-pane-airdrop'].forEach((id) => document.getElementById(id)?.remove());
    pane.querySelector('h4')?.replaceChildren(document.createTextNode('DOGEBOT'));
  }
  const bar = document.createElement('div');
  bar.className = 'chatgpt-terminal-bar';
  bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:10px 12px;border:1px solid rgba(194,255,0,.28);border-radius:8px;background:rgba(194,255,0,.05);font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;';
  bar.innerHTML = '<strong style="color:#c2ff00">DOGEBOT</strong><span data-agent-status style="color:#8e9991">CHECKING SERVER</span>';
  pane.prepend(bar);
  pane.querySelectorAll('[data-hub-tab="chat"]').forEach((tab) => { tab.textContent = 'Browser Use Terminal'; });
  input.placeholder = 'Ask the DOGEBOT agent';
  const status = bar.querySelector('[data-agent-status]');

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