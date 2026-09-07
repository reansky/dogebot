(() => {
  if (document.getElementById('visuals')) return;

  const section = document.createElement('section');
  section.className = 'section shell pack-visuals-section';
  section.id = 'visuals';
  section.innerHTML = `
    <div class="section-head">
      <div>
        <div class="overline">THE PACK / VISUAL SIGNAL</div>
        <h2>Three faces of the <span>signal.</span></h2>
        <p>The original DOGEBOT artwork now has its own visual wall. The existing hero remains the entry point; these frames add depth without replacing it.</p>
      </div>
      <div class="section-readout">MEDIA STATUS<strong><i class="dot-live"></i> CURATED</strong></div>
    </div>
    <div class="pack-visual-grid">
      <article class="pack-visual-card glass">
        <img src="images/dogebot-pack-sentinel.webp" alt="DOGEBOT sentinel surrounded by neon green energy" loading="lazy">
        <div class="pack-visual-copy"><small>01 / SENTINEL</small><h3>Signal in the dark.</h3><p>The pack watches the edge of the network.</p></div>
      </article>
      <article class="pack-visual-card glass">
        <img src="images/dogebot-pack-guardian.webp" alt="DOGEBOT guardian beneath the moon above a floating city" loading="lazy">
        <div class="pack-visual-copy"><small>02 / GUARDIAN</small><h3>Built for the long night.</h3><p>A bigger world for a community-first token.</p></div>
      </article>
      <article class="pack-visual-card glass">
        <img src="images/dogebot-pack-den.webp" alt="DOGEBOT working from a neon-lit den with a laptop" loading="lazy">
        <div class="pack-visual-copy"><small>03 / THE DEN</small><h3>Build in public.</h3><p>Ideas, memes, and market readouts stay in one place.</p></div>
      </article>
    </div>`;

  document.querySelector('.hero')?.after(section);

  const addLink = (parent) => {
    if (!parent || parent.querySelector('a[href="#visuals"]')) return;
    const link = document.createElement('a');
    link.href = '#visuals';
    link.textContent = 'Visuals';
    parent.append(link);
  };

  addLink(document.querySelector('.nav-links'));
  addLink(document.querySelector('.mobile-panel'));
  addLink(document.querySelector('.footer-links'));
})();
