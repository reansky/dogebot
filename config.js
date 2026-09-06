/* QUICK EDIT CONFIG: update these values before publishing. */
   window.DOGEBOT_CONFIG=Object.freeze({
     contractAddress:'CA / TBA',
     buyUrl:'#dogebot',
     xUrl:'https://x.com/dogebotdotfun',
     bankrSkillUrl:'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack',
     network:'Robinhood Chain'
   });
   (()=>{const c=window.DOGEBOT_CONFIG,button=document.getElementById('copyContract'),code=button?.querySelector('code');if(button&&code){code.textContent=c.contractAddress;button.onclick=async()=>{try{await navigator.clipboard.writeText(c.contractAddress)}catch{}code.textContent='COPIED';setTimeout(()=>{code.textContent=c.contractAddress},1600)}}const buy=document.querySelector('.buy-link');if(buy){buy.href=c.buyUrl;buy.title='Replace with the official buy link in DOGEBOT_CONFIG'}document.querySelectorAll('a.footer-x,a[href*="x.com/"]').forEach(a=>a.href=c.xUrl);document.querySelectorAll('a[data-bankr-install],a[data-bankr-mobile-install],a.bankr-install,a[href*="bankr.bot/"]').forEach(a=>a.href=c.bankrSkillUrl);const network=document.querySelector('.hero-meta > div:nth-child(2) span:not(.k)');if(network)network.textContent=c.network})();
