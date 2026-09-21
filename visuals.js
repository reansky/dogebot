// Cinematic hero assets are split into static segments for reliable delivery.
(() => {
  const hiddenHrefs = new Set(["#rewards", "#news", "#visuals", "#holders"]);

  document.querySelectorAll(".nav-links a, .mobile-panel a, .footer-links a").forEach((link) => {
    if (hiddenHrefs.has(link.getAttribute("href"))) link.remove();
  });

  document.querySelectorAll("#rewards, #news, #visuals").forEach((section) => section.remove());

  const cta = [...document.querySelectorAll(".hero-cta a")].find((link) => link.getAttribute("href") === "#rewards");
  if (cta) {
    cta.href = "#integration-hub";
    cta.textContent = "Explore Den integrations";
  }

  const tracker = document.getElementById("tracker");
  const hub = document.getElementById("integration-hub");
  if (tracker && hub) hub.after(tracker);

  const labels = {
    dogebot: "MARKET READOUT",
    pack: "THE PACK",
    "integration-hub": "DEN INTEGRATION HUB",
    tracker: "HOLDER + FEE WATCHTOWER",
    community: "FORUM + BANKR SPACE",
    memes: "MEME POOL",
    holders: "HOLDER INTELLIGENCE",
    trust: "TRUST CENTER",
  };

  Object.entries(labels).forEach(([id, label]) => {
    const overline = document.querySelector(`#${id} .overline`);
    if (overline) overline.textContent = label;
  });

  document.querySelectorAll('.overline, .workflow-strip span, .sound-key strong').forEach((node) => {
    node.textContent = node.textContent.replace(/^\s*\d+\s*\/\s*/, '');
  });
})();

(() => {
  const hero = document.querySelector('.hero');
  const statStrip = document.querySelector('.stat-strip');
  if (!hero || !statStrip || document.getElementById('cinematic-hero')) return;

  const section = document.createElement('section');
  section.id = 'cinematic-hero';
  section.className = 'cinematic-hero shell';
  section.innerHTML = `
    <div class="cinematic-shell">
      <video class="cinematic-video" muted loop playsinline preload="metadata" poster="images/dogebot-hero.webp" aria-label="DOGEBOT cinematic signal"></video>
      <div class="cinematic-grid"></div>
      <div class="cinematic-wash"></div>
       <div class="cinematic-topline"><span>FIELD TRANSMISSION</span><span data-cinematic-state>LOADING SIGNAL</span></div>
      <div class="cinematic-copy">
        <span class="cinematic-kicker">DOGEBOT / AFTER DARK</span>
        <h2>The pack moves<br><span>after dark.</span></h2>
        <p>A living signal for the DOGEBOT community. Read the market, keep the den safe, and stay close to the pack.</p>
        <div class="cinematic-actions"><a class="btn btn-primary" data-terminal-launch="true" href="#integration-hub">OPEN TERMINAL <b>→</b></a><span>READ-ONLY / ROBINHOOD CHAIN</span></div>
      </div>
      <div class="cinematic-hud cinematic-hud-top"><span>VISUAL SIGNAL</span><strong>ONLINE</strong><small>NO WALLET ACTIONS</small></div>
      <div class="cinematic-hud cinematic-hud-bottom"><span>PACK FEED</span><strong>24 / 7</strong><small>DOGEBOT NEVER SLEEPS</small></div>
    </div>`;
  hero.after(section);

  const video = section.querySelector('.cinematic-video');
  const state = section.querySelector('[data-cinematic-state]');
  const parts = Array.from({ length: 36 }, (_, index) => `images/dogebot-cinematic.part${String(index).padStart(2, '0')}`);
  Promise.all(parts.map((path) => fetch(path).then((response) => {
    if (!response.ok) throw new Error('Video segment unavailable.');
    return response.arrayBuffer();
  }))).then((buffers) => {
    video.src = URL.createObjectURL(new Blob(buffers, { type: 'video/mp4' }));
    state.textContent = 'CINEMA FEED READY';
    return video.play();
  }).catch(() => {
    section.classList.add('cinematic-fallback');
    state.textContent = 'POSTER SIGNAL';
  });
})();

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    ...document.querySelectorAll('.stat-strip, .section:not(#integration-hub), .agent-section, .cinematic-hero, .footer'),
  ].filter((node) => !node.hidden);
  const cardTargets = document.querySelectorAll('.stat, .step, .news-card, .chart-card, .quote-card, .tracker-card, .meme-stage, .meme-form-card, .forum-side, .forum-compose, .agent-console, .agent-brief, .trust-card');

  [...revealTargets, ...cardTargets].forEach((node, index) => {
    node.classList.add('motion-in');
    node.style.setProperty('--motion-delay', `${Math.min(index * 45, 240)}ms`);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.motion-in').forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.motion-in').forEach((node) => observer.observe(node));
})();

(() => {
  if (document.getElementById('cinematic-hero-style')) return;
  const style = document.createElement('style');
  style.id = 'cinematic-hero-style';
  style.textContent = `
    .reference-theme .cinematic-hero{width:min(calc(100% - 96px),1280px);margin:28px auto 42px}
    .reference-theme .cinematic-shell{position:relative;min-height:clamp(390px,48vw,620px);overflow:hidden;border:1px solid rgba(212,255,0,.38);border-radius:2px;background:#060a05;box-shadow:0 30px 80px rgba(0,0,0,.36),0 0 38px rgba(194,255,0,.08);isolation:isolate}
    .reference-theme .cinematic-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:saturate(1.16) contrast(1.08) brightness(.58);z-index:-3}
    .reference-theme .cinematic-wash{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,7,2,.98) 0%,rgba(3,7,2,.86) 28%,rgba(3,7,2,.22) 62%,rgba(3,7,2,.48) 100%),linear-gradient(0deg,rgba(3,7,2,.72),transparent 45%,rgba(3,7,2,.2));z-index:-1}
    .reference-theme .cinematic-grid{position:absolute;inset:0;opacity:.17;background-image:linear-gradient(rgba(212,255,0,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(212,255,0,.22) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(90deg,#000,transparent 88%);z-index:0;pointer-events:none}
    .reference-theme .cinematic-shell:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(212,255,0,.025) 4px 5px);mix-blend-mode:screen;pointer-events:none;z-index:1}
    .reference-theme .cinematic-topline{position:absolute;top:20px;left:22px;right:22px;display:flex;justify-content:space-between;gap:16px;color:var(--ref-lime);font:700 10px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.13em;text-transform:uppercase;z-index:2}
    .reference-theme .cinematic-topline span:last-child{color:var(--ref-soft)}
    .reference-theme .cinematic-copy{position:relative;z-index:2;width:min(620px,60%);padding:clamp(80px,11vw,145px) 0 70px 6%;}
    .reference-theme .cinematic-kicker{color:var(--ref-lime);font:700 11px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.16em}
    .reference-theme .cinematic-copy h2{margin:18px 0 16px;color:var(--ref-ink);font:800 clamp(42px,6vw,84px)/.9 'Space Grotesk',Inter,sans-serif;letter-spacing:-.06em;text-transform:uppercase;text-shadow:0 0 28px rgba(212,255,0,.08)}
    .reference-theme .cinematic-copy h2 span{color:var(--ref-lime)}
    .reference-theme .cinematic-copy p{max-width:430px;margin:0;color:var(--ref-muted);font-size:15px;line-height:1.65}
    .reference-theme .cinematic-actions{display:flex;align-items:center;gap:18px;margin-top:28px}
    .reference-theme .cinematic-actions .btn{min-width:210px}
    .reference-theme .cinematic-actions .btn b{float:right;font-size:18px}
    .reference-theme .cinematic-actions>span{color:var(--ref-dim);font:700 9px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.1em}
    .reference-theme .cinematic-hud{position:absolute;z-index:2;border:1px solid rgba(212,255,0,.35);background:rgba(3,7,2,.5);box-shadow:inset 0 0 18px rgba(212,255,0,.05);font-family:'IBM Plex Mono',ui-monospace,monospace;text-transform:uppercase}
    .reference-theme .cinematic-hud-top{top:92px;right:26px;padding:12px 15px;color:var(--ref-lime);font-size:9px;letter-spacing:.1em}
    .reference-theme .cinematic-hud-top strong{display:block;margin-top:8px;color:var(--ref-ink);font-size:16px}
    .reference-theme .cinematic-hud-top small,.reference-theme .cinematic-hud-bottom small{display:block;margin-top:8px;color:var(--ref-dim);font-size:8px}
    .reference-theme .cinematic-hud-bottom{right:26px;bottom:24px;width:132px;padding:12px;color:var(--ref-lime);font-size:9px;letter-spacing:.1em;text-align:center}
    .reference-theme .cinematic-hud-bottom strong{display:block;margin-top:9px;color:var(--ref-ink);font-size:28px;line-height:1}
    .reference-theme .cinematic-fallback .cinematic-video{background:url('images/dogebot-hero.webp') center/cover no-repeat}
    @media(max-width:700px){
      .reference-theme .cinematic-hero{width:calc(100% - 30px);margin:18px auto 30px}
      .reference-theme .cinematic-shell{min-height:550px}
      .reference-theme .cinematic-wash{background:linear-gradient(180deg,rgba(3,7,2,.85),rgba(3,7,2,.2) 38%,rgba(3,7,2,.95) 100%)}
      .reference-theme .cinematic-topline{top:15px;left:15px;right:15px;font-size:8px}
      .reference-theme .cinematic-copy{width:auto;padding:255px 22px 80px}
      .reference-theme .cinematic-copy h2{font-size:clamp(42px,13vw,66px);letter-spacing:-.07em}
      .reference-theme .cinematic-copy p{font-size:13px}
      .reference-theme .cinematic-actions{display:grid;gap:12px;margin-top:22px}
      .reference-theme .cinematic-actions .btn{width:100%}
      .reference-theme .cinematic-actions>span{font-size:8px}
      .reference-theme .cinematic-hud-top{top:55px;right:15px;transform:scale(.82);transform-origin:top right}
      .reference-theme .cinematic-hud-bottom{right:15px;bottom:15px;transform:scale(.74);transform-origin:bottom right}
    }
  `;
  document.head.append(style);
})();
