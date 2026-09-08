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
    dogebot: "01 / MARKET READOUT",
    pack: "02 / THE PACK",
    "integration-hub": "03 / DEN INTEGRATION HUB",
    tracker: "04 / HOLDER + FEE WATCHTOWER",
    community: "05 / FORUM + BANKR SPACE",
    memes: "06 / MEME POOL",
    holders: "07 / HOLDER INTELLIGENCE",
    trust: "08 / TRUST CENTER",
  };

  Object.entries(labels).forEach(([id, label]) => {
    const overline = document.querySelector(`#${id} .overline`);
    if (overline) overline.textContent = label;
  });
})();
