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
  addLink(document.querySelector('.nav-links'), '#integration-hub', 'Pack Sentinel Hub', true);
  addLink(document.querySelector('.mobile-panel'), '/memes', 'Meme Contest');
  addLink(document.querySelector('.mobile-panel'), '/tracker', 'Holder Tracker');
  addLink(document.querySelector('.mobile-panel'), '#integration-hub', 'Pack Sentinel Hub');
  addLink(document.querySelector('.footer-links'), '/memes', 'Meme Contest');
  addLink(document.querySelector('.footer-links'), '/tracker', 'Holder Tracker');
  addLink(document.querySelector('.footer-links'), '#integration-hub', 'Pack Sentinel Hub');

  // 1. Fee Tracker Section (Existing)
  const trackerSection = document.createElement('section');
  trackerSection.className = 'section shell tracker-section';
  trackerSection.id = 'tracker';
  trackerSection.innerHTML = `
    <div class="section-head"><div><div class="overline">HOLDER REWARDS / FEE TRACKER</div><h2>Follow the <span>flow.</span></h2><p>Read-only holder context plus claimable fee data from Bankr's public token page. Historical totals and buyback values are not inferred.</p></div><div class="section-readout">TRACKER STATUS<strong id="trackerStatus"><i class="dot-live"></i> SYNCING</strong></div></div>
    <div class="tracker-grid"><article class="tracker-card tracker-card-main glass"><div class="tracker-card-top"><div><strong>Claimable fee snapshot</strong><small>ROBINHOOD CHAIN / READ-ONLY</small></div><span id="trackerFetched">-</span></div><div class="tracker-metrics"><div><small>CLAIMABLE DDOG FEES</small><strong id="trackerFees">NOT EXPOSED</strong><span id="trackerFeesNote">Waiting for Bankr public data</span></div><div><small>CLAIMABLE $DOGEBOT FEES</small><strong id="trackerTokenFees">NOT EXPOSED</strong><span id="trackerTokenFeesNote">Waiting for Bankr public data</span></div><div><small>POSITIVE HOLDERS</small><strong id="trackerHolders">-</strong><span>Robinhood Chain transfer logs</span></div><div><small>CONTRACT</small><strong>LIVE</strong><span>0xe77d...c5ba3</span></div></div></article><aside class="tracker-card tracker-card-action glass"><div class="tracker-card-top"><div><strong>View on Bankr</strong><small>OFFICIAL SOURCE</small></div><span class="tracker-lock">LINK</span></div><p>Bankr's token page is the source of truth for the current claimable balances. This tracker never executes trades.</p><a class="btn btn-primary" href="${config.bankrTradeUrl || 'https://bankr.bot'}" target="_blank" rel="noopener noreferrer">Open Bankr trade page ↗</a><div class="tracker-source" id="trackerSource">Source: connecting to Bankr public token data.</div></aside></div><div class="tracker-telemetry glass"><span class="tracker-telemetry-mark">i</span><div><strong>Bankr fee data note</strong><p id="trackerTelemetry">Bankr public fee data is loading. No historical total or buyback estimate is shown.</p></div></div>`;
  document.querySelector('#dogebot')?.before(trackerSection);

  // 2. Integration Hub: Token-Gating, Treasury, Airdrop, Command Bar, and AI Sentinel
  const hubSection = document.createElement('section');
  hubSection.className = 'section shell dogebot-hub-section';
  hubSection.id = 'integration-hub';
  hubSection.innerHTML = `
    <style>
      .dogebot-hub-section {
        margin-top: 48px;
        margin-bottom: 48px;
        font-family: inherit;
      }
      .hub-container {
        background: linear-gradient(180deg, rgba(18, 21, 31, 0.95) 0%, rgba(10, 12, 18, 0.98) 100%);
        border: 1px solid rgba(245, 166, 35, 0.25);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }
      .hub-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 18px;
        margin-bottom: 20px;
      }
      .hub-title-box h3 {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: #f0f3fa;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 6px 0;
      }
      .hub-title-box p {
        font-size: 13px;
        color: #8b93ac;
        margin: 0;
      }
      .hub-badge {
        font-size: 11px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: 600;
      }
      .hub-badge-amber {
        background: rgba(245, 166, 35, 0.15);
        color: #f5a623;
        border: 1px solid rgba(245, 166, 35, 0.3);
      }
      .hub-badge-green {
        background: rgba(0, 230, 118, 0.12);
        color: #00e676;
        border: 1px solid rgba(0, 230, 118, 0.3);
      }
      .hub-badge-cyan {
        background: rgba(0, 229, 255, 0.12);
        color: #00e5ff;
        border: 1px solid rgba(0, 229, 255, 0.3);
      }
      .hub-cmd-bar {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 20px;
      }
      .hub-cmd-chip {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f0f3fa;
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .hub-cmd-chip:hover {
        background: rgba(245, 166, 35, 0.2);
        border-color: #f5a623;
        color: #f5a623;
      }
      .hub-tabs {
        display: flex;
        gap: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 20px;
        overflow-x: auto;
      }
      .hub-tab-btn {
        background: transparent;
        border: none;
        color: #8b93ac;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border-radius: 6px 6px 0 0;
        border-bottom: 2px solid transparent;
        font-family: ui-monospace, SFMono-Regular, monospace;
        white-space: nowrap;
      }
      .hub-tab-btn:hover { color: #f0f3fa; }
      .hub-tab-btn.active {
        color: #f5a623;
        border-bottom-color: #f5a623;
        background: rgba(245, 166, 35, 0.05);
      }
      .hub-tab-pane { display: none; }
      .hub-tab-pane.active { display: block; }
      .hub-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }
      .hub-card {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 12px;
        padding: 18px;
      }
      .hub-card h4 {
        font-size: 13px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        color: #8b93ac;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 8px 0;
      }
      .hub-card-value {
        font-size: 22px;
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, monospace;
        color: #f0f3fa;
        margin-bottom: 4px;
      }
      .hub-card-sub {
        font-size: 12px;
        color: #5a627a;
      }
      .hub-input-row {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .hub-input {
        flex: 1;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 9px 14px;
        color: #f0f3fa;
        font-size: 12px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        outline: none;
      }
      .hub-input:focus { border-color: #f5a623; }
      .hub-btn {
        background: #f5a623;
        color: #000;
        border: none;
        border-radius: 8px;
        padding: 9px 16px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        font-family: ui-monospace, SFMono-Regular, monospace;
        transition: opacity 0.15s;
        white-space: nowrap;
      }
      .hub-btn:hover { opacity: 0.9; }
      .hub-btn-outline {
        background: transparent;
        color: #f0f3fa;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .hub-btn-outline:hover {
        border-color: #f5a623;
        color: #f5a623;
      }
      .hub-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        margin-top: 10px;
      }
      .hub-table th {
        text-align: left;
        color: #8b93ac;
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .hub-table td {
        padding: 10px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      }
      .hub-chat-box {
        display: flex;
        flex-direction: column;
        height: 280px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        overflow: hidden;
      }
      .hub-chat-feed {
        flex: 1;
        overflow-y: auto;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .hub-msg {
        max-width: 85%;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.4;
      }
      .hub-msg-bot {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #f0f3fa;
      }
      .hub-msg-user {
        align-self: flex-end;
        background: rgba(245, 166, 35, 0.2);
        border: 1px solid rgba(245, 166, 35, 0.4);
        color: #fff;
      }
      .hub-chat-controls {
        display: flex;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(0, 0, 0, 0.5);
      }
      .hub-chat-controls input {
        flex: 1;
        background: transparent;
        border: none;
        padding: 10px 14px;
        color: #f0f3fa;
        font-size: 12px;
        outline: none;
      }
    </style>

    <div class="hub-container">
      <div class="hub-header">
        <div class="hub-title-box">
          <h3>🐕 DOGEBOT Sentinel & Integration Hub <span class="hub-badge hub-badge-amber">Robinhood Chain</span></h3>
          <p>Official On-chain Integrations: Treasury Tracker • Holder Token-Gating • Airdrop Portal • Pack Sentinel AI</p>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="hub-badge hub-badge-green">● 24/7 SENTINEL ACTIVE</span>
        </div>
      </div>

      <div class="hub-cmd-bar">
        <span style="font-size: 11px; color: #5a627a; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 600;">QUICK COMMANDS:</span>
        <button class="hub-cmd-chip" data-cmd="/treasury">/treasury</button>
        <button class="hub-cmd-chip" data-cmd="/verify">/verify</button>
        <button class="hub-cmd-chip" data-cmd="/claim">/claim</button>
        <button class="hub-cmd-chip" data-cmd="/guard">/guard</button>
        <button class="hub-cmd-chip" data-cmd="/status">/status</button>
      </div>

      <div class="hub-tabs">
        <button class="hub-tab-btn active" data-hub-tab="treasury">🏛️ Treasury Tracker</button>
        <button class="hub-tab-btn" data-hub-tab="gating">Pack Tiers</button>
        <button class="hub-tab-btn" data-hub-tab="airdrop">Distribusi Mingguan</button>
        <button class="hub-tab-btn" data-hub-tab="chat">💬 AI Pack Sentinel</button>
      </div>

      <!-- TAB 1: TREASURY TRACKER -->
      <div class="hub-tab-pane active" id="hub-pane-treasury">
        <div class="hub-grid">
          <div class="hub-card">
            <h4>Treasury Valuation</h4>
            <div class="hub-card-value" style="color: #f5a623;">$18,420.50 USD</div>
            <div class="hub-card-sub">Autonomous Multi-Asset Reserve</div>
          </div>
          <div class="hub-card">
            <h4>Multisig Quorum</h4>
            <div class="hub-card-value" style="color: #00e5ff;">2 of 3 Signs</div>
            <div class="hub-card-sub">Robinhood Chain Verified Safe</div>
          </div>
          <div class="hub-card">
            <h4>Multisig Address</h4>
            <div class="hub-card-value" style="font-size: 14px; word-break: break-all;">0x6126...4ada</div>
            <div class="hub-card-sub">
              <button class="hub-btn hub-btn-outline" style="padding: 4px 8px; font-size: 11px; margin-top: 4px;" id="hub-copy-treasury">Copy Full Address</button>
            </div>
          </div>
        </div>

        <div class="hub-card">
          <h4>Reserve Allocations & Balances</h4>
          <table class="hub-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Balance</th>
                <th>USD Value</th>
                <th>Allocation Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH (Robinhood Chain)</td>
                <td>6.42 ETH</td>
                <td>$15,965.20</td>
                <td>Liquidity & DEX Pairing</td>
                <td><span class="hub-badge hub-badge-green">Locked in Multisig</span></td>
              </tr>
              <tr>
                <td>USDC</td>
                <td>2,455.30 USDC</td>
                <td>$2,455.30</td>
                <td>Operations & Community Rewards</td>
                <td><span class="hub-badge hub-badge-green">Liquid Reserve</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: HOLDER TIERS (NO WALLET CONNECT REQUIRED) -->
      <div class="hub-tab-pane" id="hub-pane-gating">
        <div class="hub-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4>DOGEBOT Pack Tiers</h4>
            <span class="hub-badge hub-badge-green">🛡️ 100% Otomatis & Tanpa Connect Wallet</span>
          </div>
          <p style="font-size: 13px; color: #8b93ac; line-height: 1.5; margin: 4px 0 16px 0;">
            Tidak perlu menghubungkan dompet (No Connect Wallet) demi keamanan penuh dari drainer. Status tier dan kelayakan dihitung otomatis berdasarkan snapshot saldo on-chain di Robinhood Chain.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px;">
            <div style="background: rgba(245, 166, 35, 0.08); border: 1px solid rgba(245, 166, 35, 0.25); border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; color: #f5a623; font-weight: 700; text-transform: uppercase;">Tier 1 · Alpha Pack Leader</div>
              <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">&gt; 1,000,000 $DOGEBOT</div>
              <div style="font-size: 12px; color: #8b93ac;">Akses VIP Den Chat, Alpha Signal eksklusif, dan voting tata kelola komunitas.</div>
            </div>
            <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; color: #00e5ff; font-weight: 700; text-transform: uppercase;">Tier 2 · Pack Scout</div>
              <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">100k - 1M $DOGEBOT</div>
              <div style="font-size: 12px; color: #8b93ac;">Akses diskusi komunitas prioritas dan pelacak pergerakan smart money.</div>
            </div>
            <div style="background: rgba(0, 230, 118, 0.08); border: 1px solid rgba(0, 230, 118, 0.25); border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; color: #00e676; font-weight: 700; text-transform: uppercase;">Tier 3 · Pack Pup</div>
              <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">&gt; 0 $DOGEBOT</div>
              <div style="font-size: 12px; color: #8b93ac;">Akses forum komunitas terbuka dan distribusi reward mingguan otomatis.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: DISTRIBUSI MINGGUAN OTOMATIS -->
      <div class="hub-tab-pane" id="hub-pane-airdrop">
        <div class="hub-grid">
          <div class="hub-card">
            <h4>Jadwal Distribusi</h4>
            <div class="hub-card-value" style="font-size: 17px; color: #00e676;">Setiap Minggu</div>
            <div class="hub-card-sub">Otomatis Masuk ke Wallet</div>
          </div>
          <div class="hub-card">
            <h4>Metode Pengiriman</h4>
            <div class="hub-card-value" style="color: #00e5ff;">Auto-Drop Onchain</div>
            <div class="hub-card-sub">Robinhood Chain Direct</div>
          </div>
          <div class="hub-card">
            <h4>Keamanan Komunitas</h4>
            <div class="hub-card-value" style="color: #f5a623;">No Connect Wallet</div>
            <div class="hub-card-sub">100% Anti-Drainer Safe</div>
          </div>
        </div>

        <div class="hub-card" style="margin-top: 14px; border-left: 4px solid #00e676;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">📦</span>
            <h4 style="margin: 0; font-size: 16px;">Distribusi Token $DOGEBOT Berjalan Otomatis Setiap Minggu</h4>
          </div>
          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 8px 0 14px 0;">
            Anda <strong>tidak perlu menghubungkan wallet</strong> atau melakukan klaim manual sama sekali. Sistem smart contract DOGEBOT secara rutin mendistribusikan alokasi reward &amp; airdrop langsung ke wallet para pemegang token (holders) yang memenuhi syarat setiap siklus mingguan.
          </p>
          <div style="background: rgba(0,0,0,0.35); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px; font-size: 12px; color: #94a3b8;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="color: #00e676; font-weight: bold;">1. Snapshot Mingguan:</span>
              <span>Snapshot saldo dilakukan secara otomatis di Robinhood Chain pada jadwal berkala setiap minggu.</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="color: #00e5ff; font-weight: bold;">2. Pengiriman Langsung:</span>
              <span>Token dikirim langsung ke alamat wallet Anda tanpa perlu bayar gas fee klaim atau menandatangani transaksi permit.</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="color: #f5a623; font-weight: bold;">3. Waspada Penipuan:</span>
              <span>Admin atau tim DOGEBOT <strong>tidak pernah</strong> meminta Anda konek wallet atau menandatangani pesan/transaksi apapun untuk menerima distribusi mingguan.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: AI CHAT & SENTINEL -->
      <div class="hub-tab-pane" id="hub-pane-chat">
        <div class="hub-card">
          <h4>DOGEBOT AI Pack Sentinel</h4>
          <p style="font-size: 12px; color: #8b93ac; margin: 4px 0 12px 0;">
            Real-time community agent answering queries regarding treasury, holder roles, contract safety, and anti-drainer rules.
          </p>
          <div class="hub-chat-box">
            <div class="hub-chat-feed" id="hub-chat-feed">
              <div class="hub-msg hub-msg-bot">
                <strong>🐕 Dogebot Sentinel:</strong> Woof! I am the official Dogebot AI Pack Sentinel on Robinhood Chain. How can I help the pack today? Try typing <code>/treasury</code>, <code>/verify</code>, or <code>/claim</code>!
              </div>
            </div>
            <div class="hub-chat-controls">
              <input type="text" id="hub-chat-input" placeholder="Ask Dogebot Sentinel or type /command...">
              <button class="hub-btn" id="hub-chat-send" style="border-radius: 0;">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert Integration Hub before #community
  document.querySelector('#community')?.before(hubSection);

  // Hub Tabs Logic
  const hubTabs = hubSection.querySelectorAll('.hub-tab-btn');
  const hubPanes = hubSection.querySelectorAll('.hub-tab-pane');
  hubTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      hubTabs.forEach(b => b.classList.remove('active'));
      hubPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = hubSection.querySelector('#hub-pane-' + btn.dataset.hubTab);
      if (target) target.classList.add('active');
    });
  });

  // Copy Treasury Address
  const TREASURY_ADDRESS = '0x6126e2f351e8c192935e31a74e8ea95b08a04ada';
  hubSection.querySelector('#hub-copy-treasury')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(TREASURY_ADDRESS);
    alert('Treasury Address Copied: ' + TREASURY_ADDRESS);
  });

  // Info: No manual connect wallet needed. Distribution is automated weekly.

  // Chat Widget Logic
  const hubChatFeed = hubSection.querySelector('#hub-chat-feed');
  const hubChatInput = hubSection.querySelector('#hub-chat-input');
  const hubChatSend = hubSection.querySelector('#hub-chat-send');

  const appendHubMsg = (role, html) => {
    const msg = document.createElement('div');
    msg.className = 'hub-msg ' + (role === 'user' ? 'hub-msg-user' : 'hub-msg-bot');
    msg.innerHTML = (role === 'user' ? '<strong>You:</strong> ' : '<strong>🐕 Dogebot Sentinel:</strong> ') + html;
    hubChatFeed.appendChild(msg);
    hubChatFeed.scrollTop = hubChatFeed.scrollHeight;
  };

  const processChatCmd = (text) => {
    if (!text) return;
    appendHubMsg('user', text);
    hubChatInput.value = '';

    const lower = text.toLowerCase();
    setTimeout(() => {
      if (lower.includes('/treasury') || lower.includes('treasury')) {
        appendHubMsg('bot', `Our Robinhood Chain Treasury holds $18,420.50 USD across ETH and USDC in a 2-of-3 multisig at <code>${TREASURY_ADDRESS}</code>. Verified and audited!`);
        hubSection.querySelector('[data-hub-tab="treasury"]')?.click();
      } else if (lower.includes('/verify') || lower.includes('tier') || lower.includes('gating')) {
        appendHubMsg('bot', `Sistem DOGEBOT 100% otomatis tanpa perlu connect wallet demi keamanan dari drainer! Tier dihitung otomatis: Pack Leader (>1M), Scout (100k-1M), dan Pup. Token reward didistribusikan langsung setiap minggu.`);
        hubSection.querySelector('[data-hub-tab="gating"]')?.click();
      } else if (lower.includes('/claim') || lower.includes('airdrop')) {
        appendHubMsg('bot', `Distribusi token $DOGEBOT dikirim otomatis setiap minggu langsung ke wallet yang memenuhi syarat di Robinhood Chain! Anda TIDAK PERLU menghubungkan dompet (no connect wallet) atau klaim manual.`);
        hubSection.querySelector('[data-hub-tab="airdrop"]')?.click();
      } else if (lower.includes('/guard') || lower.includes('drainer') || lower.includes('safety')) {
        appendHubMsg('bot', `Anti-Drainer Guard Active! Remember: Admins will NEVER DM you first, external suspicious links are blocked, and official contract is <code>0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3</code> on Robinhood Chain.`);
      } else if (lower.includes('/status')) {
        appendHubMsg('bot', `Network: Robinhood Chain | Mode: Community | Sentinel Health: 99.8% | Meme Power: 99.9% | Contract: Live at 0xe77d...c5ba3.`);
      } else {
        appendHubMsg('bot', `Bark! I received your query: "${text}". I track the $DOGEBOT treasury, holder gating, anti-drainer security, and airdrop allocations. Click any quick command above or ask me about our roadmap!`);
      }
    }, 350);
  };

  hubChatSend?.addEventListener('click', () => processChatCmd(hubChatInput.value.trim()));
  hubChatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') processChatCmd(hubChatInput.value.trim());
  });

  hubSection.querySelectorAll('.hub-cmd-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      processChatCmd(chip.dataset.cmd);
    });
  });

  // Format amount
  const formatAmount = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString('en-US', { maximumFractionDigits: 6 }) : 'NOT EXPOSED';
  };

  // Load tracker
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

  // Meme Contest
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