try{const key='dogebot-memes',stored=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(stored)){const valid=stored.filter(m=>m&&typeof m.image==='string'&&/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(m.image)&&m.image.length>100);if(valid.length!==stored.length)localStorage.setItem(key,JSON.stringify(valid))}}catch{}


const seed=[];
const get=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};const set=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
 let user=get('dogebot-user','anonymous_'+Math.random().toString(36).slice(2,6));let posts=[];const feed=document.getElementById('feed');const currentUser=document.getElementById('currentUser');const forumCount=document.getElementById('forumCount');currentUser.textContent=user;
const packNote=document.createElement('div');packNote.className='pack-note glass';packNote.innerHTML='<span class="pack-note-mark">◎</span><div><strong>“Pack” means the DOGEBOT PACK community</strong><p>People who build, discuss, and help keep this space safe. You do not need to own tokens, and the term is not a promise of profit.</p></div>';document.querySelector('#rewards .steps').before(packNote);
function render(){feed.textContent='';forumCount.textContent=posts.length+' posts';posts.forEach(post=>{const card=document.createElement('article');card.className='post glass';const head=document.createElement('div');head.className='post-head';const author=document.createElement('div');author.className='post-author';const avatar=document.createElement('span');avatar.className='avatar';avatar.textContent=post.name.slice(0,1).toUpperCase();const name=document.createElement('strong');name.textContent=post.name;const time=document.createElement('span');time.className='post-time';time.textContent=post.time==='now'?'now':post.time+' ago';author.append(avatar,name);const body=document.createElement('p');body.className='post-body';body.textContent=post.text;const actions=document.createElement('div');actions.className='post-actions';const like=document.createElement('button');like.className='post-action';like.type='button';like.textContent='♡ '+(post.likes||0);like.onclick=()=>{post.likes=(post.likes||0)+1;set('dogebot-posts',posts);render()};actions.append(like);if(post.mine){const del=document.createElement('button');del.className='post-action';del.type='button';del.textContent='✕ delete';del.onclick=()=>{posts=posts.filter(item=>item.id!==post.id);set('dogebot-posts',posts);render()};actions.append(del)}head.append(author,time);card.append(head,body,actions);feed.append(card)})}render();
document.getElementById('publish').onclick=()=>{const box=document.getElementById('compose'),text=box.value.trim(),hint=document.getElementById('postHint');if(!text){hint.textContent='Type a message first';hint.style.color='#f5cb62';box.focus();return}const hasUrl=/(https?:\/\/|www\.|[a-z0-9-]+\.(com|xyz|lol|io|org|net)\b)/i.test(text);if(hasUrl){hint.textContent='Links are blocked in the den';hint.style.color='#f5cb62';return}posts.unshift({id:'p'+Date.now(),name:user,text,time:'now',likes:0,mine:true});set('dogebot-posts',posts);box.value='';hint.textContent='Links are blocked · 500 characters';hint.style.color='';render()};
document.getElementById('changeName').onclick=()=>{const next=prompt('Choose an anonymous name:',user);if(next&&next.trim()){user=next.trim().replace(/\s+/g,' ').slice(0,24);set('dogebot-user',user);currentUser.textContent=user}};
async function copyText(value){try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await Promise.race([navigator.clipboard.writeText(value),new Promise((_,reject)=>setTimeout(()=>reject(new Error('clipboard timeout')),700))])}catch{const helper=document.createElement('textarea');helper.value=value;helper.setAttribute('readonly','');helper.style.position='fixed';helper.style.opacity='0';document.body.append(helper);helper.select();document.execCommand('copy');helper.remove()}}
 document.getElementById('copyContract').onclick=async()=>{const b=document.getElementById('copyContract');await copyText('0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3');b.innerHTML='<code>COPIED</code> ✓';setTimeout(()=>b.innerHTML='<code>0xe77d9fadffdf816edbff9e63943a3ba46c6c5ba3</code> ⧉',1600)};
const chartButtons=[...document.querySelectorAll('.chart-tabs button')];const chartLine=document.querySelector('.chart path.line');const chartArea=document.querySelector('.chart path.area');const chartStatus=document.querySelector('.chart-card .delta');const chartPaths=[['M0 183 C55 177 63 140 111 151 S180 194 226 131 S290 160 334 121 S398 143 445 98 S512 143 556 83 S620 100 700 43','M0 183 C55 177 63 140 111 151 S180 194 226 131 S290 160 334 121 S398 143 445 98 S512 143 556 83 S620 100 700 43 V220 H0Z'],['M0 181 C55 168 81 176 122 130 S193 141 231 153 S300 113 341 128 S408 97 456 115 S512 72 561 91 S632 43 700 66','M0 181 C55 168 81 176 122 130 S193 141 231 153 S300 113 341 128 S408 97 456 115 S512 72 561 91 S632 43 700 66 V220 H0Z'],['M0 154 C58 133 73 158 116 120 S177 96 224 111 S291 65 337 83 S399 44 448 69 S520 45 565 58 S626 23 700 39','M0 154 C58 133 73 158 116 120 S177 96 224 111 S291 65 337 83 S399 44 448 69 S520 45 565 58 S626 23 700 39 V220 H0Z'],['M0 174 C52 170 79 110 125 129 S187 118 232 139 S299 73 345 102 S410 52 455 73 S509 94 554 48 S627 60 700 24','M0 174 C52 170 79 110 125 129 S187 118 232 139 S299 73 345 102 S410 52 455 73 S509 94 554 48 S627 60 700 24 V220 H0Z'],['M0 190 C54 162 83 172 127 116 S196 143 238 102 S303 113 349 78 S406 97 458 50 S526 85 568 40 S636 70 700 18','M0 190 C54 162 83 172 127 116 S196 143 238 102 S303 113 349 78 S406 97 458 50 S526 85 568 40 S636 70 700 18 V220 H0Z']];
 function setChart(index){chartButtons.forEach((button,i)=>button.classList.toggle('active',i===index));chartLine.setAttribute('d',chartPaths[index][0]);chartArea.setAttribute('d',chartPaths[index][1]);chartStatus.textContent=chartButtons[index].textContent+' · READ-ONLY'}chartButtons.forEach((button,index)=>button.addEventListener('click',()=>setChart(index)));setChart(0);
const menu=document.getElementById('menu'),nav=document.getElementById('nav');menu.setAttribute('aria-expanded','false');menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'};document.querySelectorAll('.mobile-panel a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'});
const aiLaunch=document.getElementById('aiLaunch'),aiOverlay=document.getElementById('aiOverlay'),aiClose=document.getElementById('aiClose'),aiMessages=document.getElementById('aiMessages'),aiForm=document.getElementById('aiForm'),aiInput=document.getElementById('aiInput'),aiSend=document.getElementById('aiSend'),aiMode=document.getElementById('aiMode');let aiHistory=get('dogebot-ai-history',[]);if(!Array.isArray(aiHistory)||!aiHistory.length)aiHistory=[{role:'assistant',content:'Hi, I am DOGEBOT PACK AI. I only explain this project, its community, its token page, and its forum.'}];
function saveAi(){set('dogebot-ai-history',aiHistory)}function renderAi(){aiMessages.textContent='';aiHistory.forEach(message=>{const bubble=document.createElement('div');bubble.className='ai-message '+(message.role==='user'?'user':'assistant');const label=document.createElement('span');label.className='ai-label';label.textContent=message.role==='user'?'You':'DOGEBOT PACK AI';const content=document.createElement('span');content.textContent=message.content;bubble.append(label,content);aiMessages.append(bubble)});aiMessages.scrollTop=aiMessages.scrollHeight}function updateAiMode(){aiMode.textContent='Project knowledge mode'}renderAi();updateAiMode();
 function localAi(question){const q=question.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();if(q==='ask about dogebot'||q==='tell me about dogebot'||q==='what is dogebot'||q==='what is this project'||q==='explain dogebot')return 'DOGEBOT PACK is a community-first cyber dog project with a premium token landing page, anonymous forum, market dashboard, and public build-in-the-open approach. You can explore the project, join the pack, and use the forum to talk with the community.';if(q.includes('ddog')||q.includes('datadog')||q.includes('pair'))return '$DOGEBOT is paired with Datadog stock ($DDOG) as a read-only reference-market concept on Robinhood Chain. It is not a live trading pair or a buy recommendation.';if(q.includes('pack'))return 'In DOGEBOT PACK, “the pack” means the community: people who join the conversation, build in public, and help keep the space safe. You do not need to own tokens to be part of it.';if(q.includes('dogebot')||q.includes('what is this')||q.includes('explain')||q.includes('project'))return 'DOGEBOT PACK is a community-first cyber dog project with a premium token landing page, anonymous forum, market dashboard, and public build-in-the-open approach.';if(q.includes('forum')||q.includes('post')||q.includes('rule'))return 'The forum is anonymous by default. You can change your display name, publish a post, like posts, and delete your own posts. URLs are blocked to reduce scam and drainer risk.';if(q.includes('price')||q.includes('market')||q.includes('token')||q.includes('contract'))return 'The market panel is currently a visual demo. No live DOGEBOT PACK contract or price feed has been configured, so the placeholder values are not financial data.';if(q.includes('hero')||q.includes('logo')||q.includes('design'))return 'The hero uses the cybernetic DOGEBOT PACK image, while the logo is used in the navigation and community card. The visual language combines obsidian glass, lime signal green, and champagne gold.';if(q.includes('ai')||q.includes('assistant'))return 'DOGEBOT PACK AI is a local project guide. It explains this site and its features only; it does not browse the web or provide general ChatGPT answers.';return 'I only answer questions about the DOGEBOT PACK project. Try asking about the pack, the forum, the token page, the market demo, the logo, or the hero.'}
 function setAiBusy(busy){aiSend.disabled=busy;aiSend.textContent=busy?'...':'Ask'}async function askAi(question){const text=question.trim()||'Tell me about DOGEBOT PACK.';if(aiSend.disabled)return;aiHistory.push({role:'user',content:text});const pending={role:'assistant',content:'Thinking…'};aiHistory.push(pending);renderAi();setAiBusy(true);await new Promise(resolve=>setTimeout(resolve,260));pending.content=localAi(text);setAiBusy(false);saveAi();renderAi()}
aiForm.onsubmit=event=>{event.preventDefault();const text=aiInput.value;aiInput.value='';askAi(text)};aiInput.onkeydown=event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();aiForm.requestSubmit()}};document.querySelectorAll('[data-ai-prompt]').forEach(button=>button.onclick=()=>{aiInput.value=button.dataset.aiPrompt;aiForm.requestSubmit()});function setAiOpen(open){aiOverlay.classList.toggle('open',open);aiOverlay.setAttribute('aria-hidden',String(!open));aiLaunch.setAttribute('aria-expanded',String(open))}aiLaunch.onclick=()=>setAiOpen(true);aiClose.onclick=()=>setAiOpen(false);aiOverlay.onclick=event=>{if(event.target===aiOverlay)setAiOpen(false)};document.addEventListener('keydown',event=>{if(event.key==='Escape')setAiOpen(false)});document.getElementById('aiClear').onclick=()=>{aiHistory=[{role:'assistant',content:'Chat cleared. Ask me about the DOGEBOT PACK project.'}];saveAi();renderAi()};
 const networkLabel=document.querySelectorAll('.hero-meta > div')[1]?.querySelector('span:not(.k)');if(networkLabel)networkLabel.textContent='Robinhood Chain';const marketTitle=document.querySelector('#dogebot .chart-card .card-top strong');if(marketTitle)marketTitle.textContent='$DOGEBOT / MARKET';const marketLabel=document.querySelector('#dogebot .chart-card .card-top small');if(marketLabel)marketLabel.textContent='Read-only market · Robinhood Chain';const marketOverline=document.querySelector('#dogebot .overline');if(marketOverline)marketOverline.textContent='02 / $DOGEBOT market readout';const marketCopy=document.querySelector('#dogebot .section-head p');if(marketCopy)marketCopy.textContent='Read-only market intelligence for the DOGEBOT PACK community on Robinhood Chain. No swaps, buys, sells, or auto-buy.';const packOverline=document.querySelector('#pack .overline');if(packOverline)packOverline.textContent='03 / What the pack is building';const packCopy=document.querySelector('#pack .section-head p');if(packCopy)packCopy.textContent='The Pack is the DOGEBOT PACK community: holders and contributors who build, discuss, and keep the project safe. Community is the product, not a profit promise.';const newsCopy=document.querySelector('#news .section-head p');if(newsCopy)newsCopy.textContent='Approved project updates, community notes, and read-only market recaps. Official announcements belong in Bankr Space.';const communityOverline=document.querySelector('#community .overline');if(communityOverline)communityOverline.textContent='05 / Forum + Bankr Space';const communityCopy=document.querySelector('#community .section-head p');if(communityCopy)communityCopy.textContent='Use the public forum for conversation and Bankr Space for official posts, pins, polls, and announcements.';
   const bankrSkillUrl='https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack';const navActions=document.querySelector('.nav-actions');if(navActions&&!navActions.querySelector('[data-bankr-install]')){const link=document.createElement('a');link.className='btn btn-ghost bankr-nav-install';link.dataset.bankrInstall='true';link.href=bankrSkillUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Install skill ↗';navActions.prepend(link)}const mobilePanel=document.querySelector('.mobile-panel');if(mobilePanel&&!mobilePanel.querySelector('[data-bankr-mobile-install]')){const link=document.createElement('a');link.dataset.bankrMobileInstall='true';link.href=bankrSkillUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Install DOGEBOT PACK ↗';mobilePanel.append(link)}
 const heroImage=document.querySelector('.hero-ape');if(heroImage){heroImage.alt='DOGEBOT PACK cybernetic pack operator';}const packStatus=document.querySelector('.hero-card');if(packStatus)packStatus.classList.add('hero-card-compact');const workflow=document.createElement('div');workflow.className='workflow-strip';workflow.setAttribute('aria-label','DOGEBOT PACK workflow');workflow.innerHTML='<span>01 / Knowledge</span><i>→</i><span>02 / Read-only signals</span><i>→</i><span>03 / Bankr Space</span><i>→</i><span>04 / Manual approval</span>';document.querySelector('.bankr-banner')?.after(workflow);
 const marquee=document.createElement('div');marquee.className='pack-marquee';marquee.setAttribute('aria-label','DOGEBOT Pack community message');marquee.innerHTML='<div class="pack-marquee-track"><span>BUY $DOGEBOT</span><span>HOLD $DOGEBOT</span><span>JOIN THE PACK</span><span>BUY $DOGEBOT</span><span>HOLD $DOGEBOT</span><span>JOIN THE PACK</span></div>';document.querySelector('.workflow-strip')?.after(marquee);
 const forumMark=document.querySelector('.forum-side-mark');const brandMark=document.querySelector('.brand-mark');if(forumMark&&brandMark)forumMark.src=brandMark.src;
 const statusActions=document.querySelector('.nav-actions');const statusMenu=document.querySelector('#menu');if(statusActions&&!statusActions.querySelector('.nav-pack-status')){const status=document.createElement('span');status.className='nav-pack-status';status.title='Pack status: online';status.innerHTML='<i class="dot-live"></i><span><b>PACK</b><em>ONLINE</em></span>';if(statusMenu)statusActions.insertBefore(status,statusMenu);else statusActions.append(status)}const caLabel=document.querySelector('.hero-meta .k');if(caLabel)caLabel.textContent='CA / CONTRACT';const heroMeta=document.querySelector('.hero-meta > div');if(heroMeta&&!heroMeta.querySelector('.buy-link')){const buy=document.createElement('a');buy.className='copy buy-link';buy.href='#dogebot';buy.title='Replace with the official buy link before launch';buy.innerHTML='<code>BUY / TBA</code> ↗';heroMeta.append(buy)}const heroCopyNode=document.querySelector('.hero-copy');if(heroCopyNode&&!heroCopyNode.querySelector('.hero-brand-marquee')){const brandMarquee=document.createElement('div');brandMarquee.className='hero-brand-marquee';brandMarquee.setAttribute('aria-label','DOGEBOT x BANKR');brandMarquee.innerHTML='<div class="hero-brand-track"><span>DOGEBOT × BANKR</span><span>DOGEBOT × BANKR</span><span>DOGEBOT × BANKR</span><span>DOGEBOT × BANKR</span></div>';heroCopyNode.prepend(brandMarquee)}
 const memeSection=document.createElement('section');memeSection.className='section shell';memeSection.id='memes';memeSection.innerHTML='<div class="meme-pool-head"><div><div class="overline">06 / Meme Pool</div><h2>Make the signal <span>move.</span></h2><p>Submit a meme, add a caption, and let the pack decide what deserves the spotlight.</p></div><div class="meme-pool-badge">Community submissions</div></div><div class="meme-layout"><div class="meme-stage glass"><div class="meme-stage-top"><strong>Pack spotlight</strong><span id="memeCounter">Rotating now</span></div><div class="meme-feature" id="memeFeature"><img id="featuredMeme" alt="Featured DOGEBOT PACK meme"><div class="meme-feature-copy"><strong id="featuredMemeCaption">DOGEBOT PACK</strong><span id="featuredMemeCreator">Community signal</span></div></div></div><div class="meme-form-card glass"><h3>Submit a meme</h3><p>Upload an image and give it a short caption. Keep it original, safe, and on-theme.</p><form class="meme-form" id="memeForm"><label>Meme image<input id="memeImage" type="file" accept="image/png,image/jpeg,image/gif,image/webp" required></label><label>Caption<input id="memeCaption" type="text" maxlength="96" placeholder="Write the signal..."></label><div class="meme-form-foot"><span class="meme-form-hint" id="memeHint">PNG, JPG, GIF, or WEBP · 3 MB max</span><button class="post-btn" type="submit">Submit meme</button></div></form><p class="meme-pool-note">Local demo mode: submissions stay in this browser until a shared backend is connected.</p></div></div><div class="meme-grid" id="memeGrid"></div>';document.querySelector('#news')?.after(memeSection);const memeForm=document.querySelector('#memeForm'),memeImage=document.querySelector('#memeImage'),memeCaption=document.querySelector('#memeCaption'),memeHint=document.querySelector('#memeHint'),memeGrid=document.querySelector('#memeGrid'),memeFeature=document.querySelector('#memeFeature'),featuredMeme=document.querySelector('#featuredMeme'),featuredMemeCaption=document.querySelector('#featuredMemeCaption'),featuredMemeCreator=document.querySelector('#featuredMemeCreator'),memeCounter=document.querySelector('#memeCounter');const memeSeed=()=>[{id:'starter-hero',image:document.querySelector('.hero-ape')?.src,caption:'DOGEBOT × BANKR',creator:'DOGEBOT PACK'},{id:'starter-logo',image:document.querySelector('.brand-mark')?.src,caption:'Join the Pack',creator:'DOGEBOT PACK'}].filter(m=>m.image);let communityMemes=get('dogebot-memes',[]);if(!Array.isArray(communityMemes))communityMemes=[];let featuredIndex=0;let memeTimer;function allMemes(){return[...memeSeed(),...communityMemes]}function showFeatured(){const list=allMemes();if(!list.length){featuredMeme.removeAttribute('src');featuredMemeCaption.textContent='No memes yet';featuredMemeCreator.textContent='Be the first signal';return}const meme=list[featuredIndex%list.length];memeFeature.classList.add('is-changing');setTimeout(()=>{featuredMeme.src=meme.image;featuredMeme.alt=meme.caption+' meme';featuredMemeCaption.textContent=meme.caption;featuredMemeCreator.textContent=(meme.creator||'Anonymous pack member')+' · '+(meme.user?'community upload':'starter signal');memeCounter.textContent=(featuredIndex%list.length+1)+' / '+list.length+' rotating';memeFeature.classList.remove('is-changing')},180)}function renderMemes(){const list=allMemes();memeGrid.textContent='';if(!communityMemes.length){const empty=document.createElement('div');empty.className='meme-empty';empty.textContent='No community uploads yet. Submit the first meme and put it in the spotlight.';memeGrid.append(empty)}communityMemes.forEach(meme=>{const card=document.createElement('article');card.className='meme-card';const image=document.createElement('img');image.src=meme.image;image.alt=meme.caption||'DOGEBOT PACK meme';const copy=document.createElement('div');copy.className='meme-card-copy';const title=document.createElement('strong');title.textContent=meme.caption||'Untitled pack signal';const creator=document.createElement('span');creator.textContent=(meme.creator||'Anonymous pack member')+' · community upload';copy.append(title,creator);const del=document.createElement('button');del.className='meme-card-delete';del.type='button';del.textContent='Delete';del.onclick=()=>{communityMemes=communityMemes.filter(item=>item.id!==meme.id);set('dogebot-memes',communityMemes);renderMemes()};card.append(image,copy,del);memeGrid.append(card)});clearInterval(memeTimer);featuredIndex=0;showFeatured();if(list.length>1)memeTimer=setInterval(()=>{featuredIndex+=1;showFeatured()},4200)}renderMemes();memeForm.onsubmit=event=>{event.preventDefault();const file=memeImage.files?.[0];if(!file){memeHint.textContent='Choose an image first';memeHint.style.color='#b56e0d';return}if(!file.type.startsWith('image/')){memeHint.textContent='Only image files are allowed';memeHint.style.color='#b56e0d';return}if(file.size>3*1024*1024){memeHint.textContent='That image is over the 3 MB limit';memeHint.style.color='#b56e0d';return}const reader=new FileReader();reader.onload=()=>{const next={id:'meme-'+Date.now(),image:reader.result,caption:memeCaption.value.trim()||'Fresh signal from the pack',creator:user,user:true};try{localStorage.setItem('dogebot-memes',JSON.stringify([next,...communityMemes]));communityMemes=[next,...communityMemes];memeForm.reset();memeHint.textContent='Submitted. Your meme is now rotating in the spotlight.';memeHint.style.color='#078d24';renderMemes()}catch{memeHint.textContent='Browser storage is full. Try a smaller image.';memeHint.style.color='#b56e0d'}};reader.readAsDataURL(file)};
  const ddogTitle=document.querySelector('#dogebot .chart-card .card-top strong');if(ddogTitle)ddogTitle.textContent='$DOGEBOT / DATADOG MARKET';const ddogLabel=document.querySelector('#dogebot .chart-card .card-top small');if(ddogLabel)ddogLabel.textContent='DATADOG MARKET · DDOG · READ-ONLY';const ddogCopy=document.querySelector('#dogebot .section-head p');if(ddogCopy)ddogCopy.textContent='$DOGEBOT includes a clearly labeled Datadog market panel ($DDOG) on Robinhood Chain. This page is read-only: no live pair, trades, swaps, or buy recommendation is active.';const pairNote=document.createElement('div');pairNote.className='pair-note glass';pairNote.innerHTML='<span class="pair-note-mark">×</span><div><strong>$DOGEBOT × DATADOG MARKET · DDOG</strong><p>DATADOG MARKET is shown as a read-only market panel for the Pack. No live DOGEBOT/Datadog trading pair, trades, swaps, or buy recommendation is active.</p></div><span class="pair-note-badge">READ-ONLY</span>';const marketSection=document.querySelector('#dogebot');if(marketSection&&!marketSection.querySelector('.pair-note'))marketSection.querySelector('.section-head')?.after(pairNote);const datadogMarketOverline=document.querySelector('#dogebot .overline');if(datadogMarketOverline)datadogMarketOverline.textContent='02 / DATADOG MARKET';const chartPlaceholder=document.querySelector('#geckoChartPlaceholder strong');if(chartPlaceholder)chartPlaceholder.textContent='DATADOG MARKET';const chartPlaceholderCopy=document.querySelector('#geckoChartPlaceholder span');if(chartPlaceholderCopy)chartPlaceholderCopy.textContent='Set geckoChartUrl in config.js to show the DATADOG MARKET chart.';
 localAi=function(question){const raw=String(question||'').toLowerCase();const q=raw.replace(/\$/g,' dollar ').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();const words=q.split(' ');const has=(...terms)=>terms.some(term=>q.includes(term));const word=(...terms)=>terms.some(term=>words.includes(term));if(!q)return 'Ask me about DOGEBOT PACK, Bankr, the $DOGEBOT x $DDOG reference pair, the forum, Meme Pool, market readout, or launch status.';if(word('hi','hello','hey','gm')||has('good morning','good evening'))return 'Hey, pack. I can explain DOGEBOT PACK, Bankr, the read-only market concept, the forum, Meme Pool, safety rules, and what is still pending before launch.';if(has('bankr','install skill','bankr space'))return 'Bankr is the official workspace for DOGEBOT PACK knowledge and announcements. Use the Install on Bankr button to open the DOGEBOT PACK skill. This page does not execute trades, deploy tokens, or auto-buy anything.';if(has('ddog','datadog','pair','pairing','paired','reference market','pasangan'))return '$DOGEBOT x $DDOG means DOGEBOT PACK is shown alongside Datadog stock ($DDOG) as a read-only reference-market concept on Robinhood Chain. It is not a live trading pair, price feed, or buy recommendation.';if(has('meme','memes','meme pool','upload','unggah'))return 'Meme Pool lets the community upload a PNG, JPG, GIF, or WEBP image up to 3 MB, add a caption, and rotate it in the pack spotlight. This demo stores submissions only in the current browser until a shared backend is connected.';if(has('safety','safe','scam','drainer','seed phrase','secret phrase','support link','dm','link'))return 'Keep the pack safe: URLs are blocked in the forum, nobody from the team should DM first, and nobody should ask for a seed phrase or private key. Treat token claims as unverified until an official Bankr announcement exists.';if(has('forum','post','anonymous','community den','forum rules','aturan'))return 'The forum is anonymous by default. You can change your display name, publish a text post, like posts, and delete your own posts. Links are blocked to reduce scam and drainer risk.';if(has('price','market','chart','token','contract','buy','launch','liquidity','weth','ticker','harga','beli','kontrak'))return 'The market readout is currently illustrative. The page has no live contract, price feed, liquidity, swap, or buy flow configured. CA / CONTRACT and BUY / TBA are placeholders until an approved launch announcement is available.';if(has('robinhood','chain','network'))return 'Robinhood Chain is the network context used by this DOGEBOT PACK concept. The page currently shows read-only information and does not connect a wallet or execute blockchain actions.';if(has('how does it work','how it works','what can i do','system','reward','rewards','cara kerja','bagaimana'))return 'The pack loop is simple: join the conversation, share memes and signals, read the project updates, keep links and scams out, and help shape the public roadmap. You do not need to own tokens to participate.';if(has('logo','hero','design','brand'))return 'The visual system combines a cybernetic DOGEBOT hero, a compact pack logo, bright signal green, warm gold, and Robinhood Chain-style light panels. The design is meant to feel clear, social, and launch-ready.';if(has('who are you','what can you answer','ai','chatbot'))return 'I am the local DOGEBOT PACK project guide. I answer from the information built into this page, not from a live market API, and I can explain the project, Bankr, forum, Meme Pool, safety rules, and read-only market notes.';if(has('pack','community','apa itu','tentang','jelaskan','proyek','project','what is','explain','tell me','purpose'))return 'DOGEBOT PACK is a community-first cyber dog project with a public landing page, anonymous forum, Meme Pool, read-only market dashboard, and Bankr knowledge flow. The pack means the people who join, build, discuss, and help keep the space safe.';return 'I can answer questions about DOGEBOT PACK, Bankr, the $DOGEBOT x $DDOG reference pair, Robinhood Chain, the forum, Meme Pool, safety, market readout, and launch status. Try asking one of those directly.'};
  const broadLocalAi=localAi;localAi=function(question){const q=String(question||'').toLowerCase();if(/\b(aman|penipuan|scam|drainer)\b/.test(q))return 'Keep the pack safe: nobody from the team should DM first, and nobody should ask for a seed phrase or private key. Treat token claims as unverified until an official Bankr announcement exists.';return broadLocalAi(question)};const feeLocalAi=localAi;localAi=function(question){const q=String(question||'').toLowerCase();if(/\b(fee|fees|holder|holders|revenue|dividend|distribution|distribute|share|bagikan|dibagikan|pemegang|pendapatan|buyback|buybacks)\b/.test(q)&&/\b(ddog|datadog|stock|saham|reward|rewards|buyback|buybacks)\b/.test(q))return 'Bankr fee model: fees are shared with eligible $DOGEBOT holders in the form of Datadog stock ($DDOG), with a portion allocated to $DOGEBOT buybacks. This page explains the mechanism and does not execute distributions or buybacks.';return feeLocalAi(question)};
 document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const id=link.getAttribute('href').slice(1);const target=document.getElementById(id);if(!target)return;event.preventDefault();if(typeof setAiOpen==='function')setAiOpen(false);if(nav){nav.classList.remove('open');menu.textContent='☰';menu.setAttribute('aria-expanded','false')}target.scrollIntoView({behavior:'smooth',block:'start'});try{history.replaceState(null,'','#'+id)}catch{}}));
// Keep the launch page explicit: no holder fee, dividend, or buyback model is active.
document.querySelector('.fee-share-note')?.remove();
const explainFeeStatus = localAi;
localAi = (question) => /fee|fees|holder|holders|dividend|distribution|buyback|revenue/i.test(String(question || ''))
  ? 'No holder fee, dividend, or buyback model is active or configured for DOGEBOT PACK. The page is read-only and does not execute trades or distributions.'
  : explainFeeStatus(question);
 document.getElementById('memeHint')?.replaceChildren(document.createTextNode('PNG, JPG, GIF, or WEBP · 1.5 MB max'));
const explainDatadogMarket = localAi;
localAi = (question) => /ddog|datadog|pair|market/i.test(String(question || ''))
  ? 'This is the DATADOG MARKET panel for Datadog (DDOG). It is read-only: no live DOGEBOT/Datadog trading pair, trades, swaps, or buy recommendation is active.'
  : explainDatadogMarket(question);
(() => {
  const agentBankrUrl = 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack';
  const navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('[href="#agent"]')) {
    const link = document.createElement('a');
    link.href = '#agent';
     link.textContent = 'Watchtower';
    navLinks.insertBefore(link, navLinks.querySelector('[href="#dogebot"]'));
  }

  const agentSection = document.createElement('section');
  agentSection.className = 'section shell agent-section';
  agentSection.id = 'agent';
  agentSection.innerHTML = `
    <div class="agent-section-head">
      <div>
         <div class="overline">06 / DOGEBOT WATCHTOWER</div>
         <h2>Meet the <span>Watchtower.</span></h2>
         <p>A Bankr-native, read-only copilot for DOGEBOT PACK knowledge, signals, safety checks, and human-approved community updates.</p>
      </div>
       <div class="agent-badge"><i class="dot-live"></i><span>WATCHTOWER</span><small>READ-ONLY</small></div>
    </div>
    <div class="agent-grid">
      <article class="agent-console glass">
         <div class="agent-console-top"><div><strong>Watchtower Console</strong><small>Read-only signals + Bankr Brief mode</small></div><span>ONLINE</span></div>
         <div class="agent-response" id="agentResponse">Ask the Watchtower for a concise readout. It never trades, auto-buys, deploys tokens, or asks for wallet secrets.</div>
        <div class="agent-prompts" aria-label="Agent prompts">
           <button type="button" data-agent-key="brief">Daily Watchtower Brief</button>
           <button type="button" data-agent-key="watch">What is it watching?</button>
          <button type="button" data-agent-key="bankr">Explain Bankr mode</button>
          <button type="button" data-agent-key="launch">Launch checklist</button>
        </div>
        <div class="agent-console-foot"><span id="agentSource">Source: local project knowledge</span><div class="agent-actions"><button type="button" id="agentDraft">Draft for Bankr Space</button><a class="btn btn-primary" href="${agentBankrUrl}" target="_blank" rel="noopener noreferrer">Open in Bankr ↗</a></div></div>
      </article>
      <aside class="agent-brief glass">
        <div class="agent-brief-top"><div><strong>Daily Pack Brief</strong><small>PRE-LAUNCH / HUMAN REVIEW</small></div><span class="agent-brief-mark">SCOUT</span></div>
        <div class="brief-list"><div><small>SIGNAL</small><strong>Community mode</strong><span>No live contract configured yet.</span></div><div><small>WATCH</small><strong>Read-only intelligence</strong><span>Market context, holder plans, and pack activity.</span></div><div><small>GATE</small><strong>Manual approval</strong><span>Nothing reaches Bankr Space automatically.</span></div></div>
        <div class="agent-updates" id="agentUpdates"><div class="agent-empty">No approved agent updates yet. Drafts stay private until reviewed.</div></div>
        <div class="agent-approval-note">Human approval required before Bankr Space publication.</div>
      </aside>
    </div>`;
  document.querySelector('.stat-strip')?.before(agentSection);

  const response = document.getElementById('agentResponse');
  const source = document.getElementById('agentSource');
  const answers = {
     brief: 'Daily Watchtower Brief: DOGEBOT PACK is in community mode. The Watchtower is watching project updates, read-only market context, pack activity, and safety status. No trading or token deployment is active.',
     watch: 'The Watchtower watches the public project timeline, read-only market signals, planned holder tracking, community activity, and safety notes. It reports context, not financial instructions.',
    bankr: 'Bankr is the official home for DOGEBOT PACK knowledge and approved announcements. Install the skill to open the Bankr workspace. Any public update remains subject to human review.',
     launch: 'Launch checklist: confirm the contract address, verify the token page and explorer links, publish the official Bankr brief, confirm community moderation, and keep the Watchtower read-only.'
  };
  document.querySelectorAll('[data-agent-key]').forEach((button) => {
    button.onclick = () => {
      response.textContent = answers[button.dataset.agentKey] || answers.brief;
       source.textContent = 'Source: DOGEBOT PACK Watchtower · read-only';
    };
  });

  document.getElementById('agentDraft')?.addEventListener('click', async () => {
    const draft = 'DOGEBOT PACK Bankr Brief\n\nSignal: community mode\nWatch: read-only market context, pack activity, and safety status\nNext: confirm official launch details\n\nRead-only context. No publishing, trading, or token deployment.';
    await copyText(draft);
    response.textContent = 'Bankr Brief copied. Review the content before sharing it anywhere.';
    source.textContent = 'Source: Bankr Brief draft · read-only';
  });
})();

// Keep market and holder copy aligned with the configured live data sources.
(() => {
  const marketCopy = document.querySelector('#dogebot .section-head p');
  if (marketCopy) marketCopy.textContent = '$DOGEBOT includes a clearly labeled Datadog market panel ($DDOG) on Robinhood Chain. Live price, market cap, liquidity, volume, and holder data are read-only public signals; no trades or buy recommendation are active.';
  const pairCopy = document.querySelector('.pair-note p');
  if (pairCopy) pairCopy.textContent = 'Live read-only market data is sourced from the configured pool and public APIs. This panel is not a swap interface and does not execute trades or recommend a purchase.';
})();

// Keep launch metrics and copy honest until each live data source is connected.
(() => {
  const statUpdates = {
    'MARKET CAP': ['—', 'data source pending'],
    'PACK SIZE': ['—', 'shared count pending'],
    LIQUIDITY: ['—', 'data source pending'],
    'MEME POWER': ['—', 'community signal'],
  };
  document.querySelectorAll('.stat').forEach((stat) => {
    const key = stat.querySelector('small')?.textContent?.trim();
    const update = statUpdates[key];
    if (!update) return;
    const value = stat.querySelector('strong');
    const note = stat.querySelector('p');
    if (value) value.textContent = update[0];
    if (note) note.textContent = update[1];
    note?.classList.remove('up');
  });

  const quoteLabels = [...document.querySelectorAll('#dogebot .quote')];
  const quoteUpdates = {
    HOLDERS: ['—', 'read-only feed pending'],
    ROUNDS: ['—', 'not enabled'],
    FEES: ['—', 'not configured'],
  };
  quoteLabels.forEach((quote) => {
    const key = quote.querySelector('small')?.textContent?.trim();
    const update = quoteUpdates[key];
    if (!update) return;
    quote.querySelector('strong').textContent = update[0];
    quote.querySelector('span').textContent = update[1];
  });

  const explainLiveState = localAi;
  localAi = (question) => explainLiveState(question).replace(
    'The market panel is currently a visual demo. No live DOGEBOT PACK contract or price feed has been configured, so the placeholder values are not financial data.',
    'The market panel is read-only and uses the configured GeckoTerminal source. No trading actions are enabled.'
  );
})();

(() => {
  const bankrBriefUrl = 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack';
  const addLink = (parent, href, text, before) => {
    if (!parent || parent.querySelector(`[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    if (before) parent.insertBefore(link, before);
    else parent.append(link);
  };

  const navLinks = document.querySelector('.nav-links');
  addLink(navLinks, '#trust', 'Trust Center', navLinks?.querySelector('[href="#community"]'));
  const mobilePanel = document.querySelector('.mobile-panel');
  addLink(mobilePanel, '#trust', 'Trust Center', mobilePanel?.querySelector('[href="#community"]'));
  addLink(document.querySelector('.footer-links'), '#trust', 'Trust Center');

  const section = document.createElement('section');
  section.className = 'section shell trust-section';
  section.id = 'trust';
  section.innerHTML = `
    <div class="section-head trust-section-head">
      <div>
        <div class="overline">08 / TRUST CENTER</div>
        <h2>Trust the <span>process.</span></h2>
        <p>A plain-language status board for what DOGEBOT PACK can do today, what is still pending, and which actions always require a human.</p>
      </div>
      <div class="section-readout">POLICY STATUS<strong><i class="dot-live"></i> PUBLIC</strong></div>
    </div>
    <div class="trust-grid">
      <article class="trust-card glass"><span class="trust-index">01</span><div><small>MARKET MODE</small><strong>READ-ONLY</strong><p>Charts, market context, and holder plans are informational. No swaps, buys, sells, or auto-buy are enabled.</p></div></article>
      <article class="trust-card glass"><span class="trust-index">02</span><div><small>BANKR GATE</small><strong>HUMAN REVIEW</strong><p>Bankr Brief can explain the project. Bankr Space publication requires owner approval.</p></div></article>
      <article class="trust-card glass"><span class="trust-index">03</span><div><small>SAFETY RULE</small><strong>NO SECRET REQUESTS</strong><p>The Pack does not ask for seed phrases or private keys. URLs and common drainer prompts are blocked in the den.</p></div></article>
      <article class="trust-card glass"><span class="trust-index">04</span><div><small>LAUNCH STATE</small><strong>VERIFY BEFORE LIVE</strong><p>The official contract, buy link, chart source, and holder data remain placeholders until verified and configured.</p></div></article>
    </div>
    <div class="trust-foot glass"><span class="trust-foot-mark">✓</span><div><strong>Simple rule for the Pack</strong><p>If a claim is not in the verified Bankr Space or configured on this page, treat it as unconfirmed.</p></div><a class="btn btn-ghost" href="${bankrBriefUrl}" target="_blank" rel="noopener noreferrer">Open Bankr Brief ↗</a></div>`;

  const holders = document.getElementById('holders');
  if (holders) holders.after(section);
  else document.querySelector('main')?.append(section);
})();

(() => {
  const bankrBriefUrl = 'https://bankr.bot/skills/0x0b127f65d167159e4e2bf0b73c2975a14ac3d056/dogebot-pack';
  const addLink = (parent, href, text, before) => {
    if (!parent || parent.querySelector(`[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    if (before) parent.insertBefore(link, before);
    else parent.append(link);
  };

  const navLinks = document.querySelector('.nav-links');
   addLink(document.querySelector('.mobile-panel'), '#agent', 'Watchtower', document.querySelector('.mobile-panel')?.querySelector('[href="#community"]'));
   addLink(document.querySelector('.footer-links'), '#agent', 'Watchtower', document.querySelector('.footer-links')?.querySelector('[href="#community"]'));
  const mobilePanel = document.querySelector('.mobile-panel');
  addLink(mobilePanel, '#holders', 'Read-only holder intelligence', mobilePanel?.querySelector('[href="#community"]'));
  addLink(document.querySelector('.footer-links'), '#holders', 'Holder Intel');

  const bankrCopy = document.querySelector('.bankr-copy p');
  if (bankrCopy) bankrCopy.innerHTML = 'Project knowledge, <em>read-only</em> market intelligence, holder tracking plans, Bankr Brief, and the official Bankr Space community hub.';

  const communityOverline = document.querySelector('#community .overline');
  if (communityOverline) communityOverline.textContent = '05 / Forum + Bankr Brief + Space';
  const communityCopy = document.querySelector('#community .section-head p');
  if (communityCopy) communityCopy.textContent = 'Use the public forum for conversation, Bankr Brief for read-only project context, and Bankr Space for verified announcements, pins, polls, and governance.';
  const newsCopy = document.querySelector('#news .section-head p');
  if (newsCopy) newsCopy.textContent = 'Approved project updates, Bankr Brief context, community notes, and read-only market recaps. Official announcements belong in Bankr Space.';

  const workflow = document.querySelectorAll('.workflow-strip span')[2];
  if (workflow) workflow.textContent = '03 / BANKR BRIEF + SPACE';
  const agentMode = document.querySelector('.agent-console-top small');
   if (agentMode) agentMode.textContent = 'READ-ONLY SIGNALS + BANKR BRIEF MODE';
  const briefMode = document.querySelector('.agent-brief-top small');
  if (briefMode) briefMode.textContent = 'READ-ONLY / LIVE WHEN CONNECTED';
  const briefTitle = document.querySelector('.agent-brief-top strong');
  if (briefTitle) briefTitle.textContent = 'Bankr Brief';
  const gateTitle = document.querySelector('.brief-list div:nth-child(3) strong');
  if (gateTitle) gateTitle.textContent = 'Bankr Space';
  const gateCopy = document.querySelector('.brief-list div:nth-child(3) span');
  if (gateCopy) gateCopy.textContent = 'Verified announcements with owner approval.';
  const approvalNote = document.querySelector('.agent-approval-note');
  if (approvalNote) approvalNote.textContent = 'Bankr Brief is read-only. Bankr Space announcements require manual owner approval.';
  const draftButton = document.getElementById('agentDraft');
  if (draftButton) draftButton.textContent = 'Copy Bankr Brief';

  const bankrPrompt = document.querySelector('[data-agent-key="bankr"]');
  bankrPrompt?.addEventListener('click', () => {
    const response = document.getElementById('agentResponse');
    const source = document.getElementById('agentSource');
    if (response) response.textContent = 'Bankr Brief is the read-only knowledge layer for DOGEBOT PACK. Bankr Space is the official hub for verified announcements, pins, polls, and governance with owner approval.';
    if (source) source.textContent = 'Source: Bankr Brief · read-only';
  });
  draftButton?.addEventListener('click', () => {
    const response = document.getElementById('agentResponse');
    const source = document.getElementById('agentSource');
    if (response) response.textContent = 'Bankr Brief copied. Review the content before sharing it anywhere.';
    if (source) source.textContent = 'Source: Bankr Brief draft · read-only';
  });

  if (!document.getElementById('holders')) {
    const section = document.createElement('section');
    section.className = 'section shell holder-section';
    section.id = 'holders';
    section.innerHTML = `
      <div class="section-head">
        <div>
          <div class="overline">07 / READ-ONLY HOLDER INTELLIGENCE</div>
          <h2>Know the <span>pack.</span></h2>
          <p>Holder context for the community, designed to stay transparent and read-only. Live data activates only after the official contract is configured.</p>
        </div>
        <div class="section-readout">DATA MODE<strong><i class="dot-live"></i> READ-ONLY</strong></div>
      </div>
      <div class="holder-layout">
        <article class="holder-summary glass">
          <div class="holder-card-top"><div><strong>Holder intelligence</strong><small>BANKR BRIEF / COMMUNITY VIEW</small></div><span class="holder-state">AWAITING LAUNCH</span></div>
          <div class="holder-total"><span>HOLDER COUNT</span><strong>—</strong><p>Activates after the official contract is configured.</p></div>
          <div class="holder-metrics"><div><small>CONCENTRATION</small><strong>—</strong><span>not live yet</span></div><div><small>TOP WALLET</small><strong>—</strong><span>not live yet</span></div><div><small>LAST SYNC</small><strong>TBA</strong><span>Bankr Brief source</span></div><div><small>MODE</small><strong>READ-ONLY</strong><span>no actions enabled</span></div></div>
        </article>
        <article class="holder-notes glass">
          <div class="holder-card-top"><div><strong>What this view will show</strong><small>NO FINANCIAL INSTRUCTIONS</small></div><span class="holder-mark">PACK</span></div>
          <div class="holder-note-list"><div><i>01</i><span><strong>Distribution context</strong><em>How the pack is distributed, without exposing wallets.</em></span></div><div><i>02</i><span><strong>Holder activity</strong><em>Read-only changes after launch, sourced from Bankr.</em></span></div><div><i>03</i><span><strong>Safety status</strong><em>Official contract and source checks before any claim.</em></span></div></div>
          <a class="btn btn-ghost holder-brief-link" href="${bankrBriefUrl}" target="_blank" rel="noopener noreferrer">Open Bankr Brief ↗</a>
        </article>
      </div>`;
    document.querySelector('#news')?.after(section);
  }
})();

(() => {
  const passportKey = 'dogebot-passport';
  const passport = get(passportKey, {
    name: user,
    bio: '',
    watchtower: true,
    bankr: true,
    safety: true,
  });
  const navActions = document.querySelector('.nav-actions');
  const menu = document.getElementById('menu');
  const mobilePanel = document.querySelector('.mobile-panel');

  const openButton = document.createElement('button');
  openButton.className = 'passport-nav-btn';
  openButton.type = 'button';
  openButton.dataset.passportOpen = 'true';
  openButton.innerHTML = '<span class="passport-nav-dot"></span><span>Pack Passport</span>';
  if (navActions) {
    if (menu) navActions.insertBefore(openButton, menu);
    else navActions.append(openButton);
  }

  const mobileButton = document.createElement('button');
  mobileButton.className = 'passport-mobile-link';
  mobileButton.type = 'button';
  mobileButton.dataset.passportOpen = 'true';
  mobileButton.textContent = 'Open Pack Passport';
  mobilePanel?.append(mobileButton);

  const overlay = document.createElement('div');
  overlay.className = 'passport-overlay';
  overlay.id = 'passportOverlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <section class="passport-panel glass" role="dialog" aria-modal="true" aria-labelledby="passportTitle">
      <header class="passport-head">
        <div><div class="overline">PACK PASSPORT / MEMBER PRODUCT</div><h2 id="passportTitle">Your place in the <span>pack.</span></h2><p>Personal settings for the DOGEBOT PACK experience.</p></div>
        <button class="passport-close" type="button" aria-label="Close Pack Passport">×</button>
      </header>
      <div class="passport-grid">
        <form class="passport-identity" id="passportForm">
          <div class="passport-card-label"><span>01 / IDENTITY</span><strong>Anonymous by default</strong></div>
          <label>Pack name<input id="passportName" name="name" maxlength="24" autocomplete="nickname" placeholder="anonymous_pack_member"></label>
          <label>Short bio<textarea id="passportBio" name="bio" maxlength="120" rows="3" placeholder="What are you bringing to the pack?"></textarea></label>
          <div class="passport-form-foot"><span id="passportSaveNote">Saved in this browser only.</span><button class="post-btn" type="submit">Save passport</button></div>
        </form>
        <aside class="passport-stats">
          <div class="passport-card-label"><span>02 / PACK STATUS</span><strong id="passportDisplayName">anonymous</strong></div>
          <div class="passport-stat-grid"><div><small>SAVED SIGNALS</small><strong>0</strong><span>ready to add</span></div><div><small>MEME DRAFTS</small><strong>0</strong><span>creator mode</span></div><div><small>REPUTATION</small><strong>NEW</strong><span>non-financial</span></div><div><small>ACCESS</small><strong>LOCAL</strong><span>shared auth next</span></div></div>
        </aside>
      </div>
      <div class="passport-preferences">
        <div class="passport-card-label"><span>03 / YOUR SIGNALS</span><strong>Choose what reaches you</strong></div>
        <label><input type="checkbox" data-passport-pref="watchtower"> <span><strong>Watchtower Briefs</strong><small>Read-only weekly project and safety recaps.</small></span></label>
        <label><input type="checkbox" data-passport-pref="bankr"> <span><strong>Bankr Space updates</strong><small>Verified announcements and community notes.</small></span></label>
        <label><input type="checkbox" data-passport-pref="safety"> <span><strong>Safety alerts</strong><small>Scam, drainer, and impersonation reminders.</small></span></label>
      </div>
      <div class="passport-locked"><span class="passport-locked-mark">NEXT</span><div><strong>Cross-device login comes with Supabase Auth.</strong><p>Until shared auth is connected, this passport stays local to this browser. No passwords or wallet secrets are stored.</p></div><button class="btn btn-ghost" type="button" disabled>Magic link next</button></div>
      <footer class="passport-foot"><span>Pack Passport is optional. Reading remains open without an account.</span><a class="btn btn-primary" href="#community">Enter the den ↗</a></footer>
    </section>`;
  document.body.append(overlay);

  const nameInput = overlay.querySelector('#passportName');
  const bioInput = overlay.querySelector('#passportBio');
  const displayName = overlay.querySelector('#passportDisplayName');
  const saveNote = overlay.querySelector('#passportSaveNote');
  const form = overlay.querySelector('#passportForm');

  function renderPassport() {
    nameInput.value = passport.name || user;
    bioInput.value = passport.bio || '';
    displayName.textContent = passport.name || user;
    overlay.querySelectorAll('[data-passport-pref]').forEach((input) => {
      input.checked = passport[input.dataset.passportPref] !== false;
    });
  }

  function setOpen(open) {
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      renderPassport();
      nameInput.focus();
    }
  }

  document.querySelectorAll('[data-passport-open]').forEach((button) => button.addEventListener('click', () => setOpen(true)));
  overlay.querySelector('.passport-close').addEventListener('click', () => setOpen(false));
  overlay.addEventListener('click', (event) => { if (event.target === overlay) setOpen(false); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    passport.name = String(nameInput.value || user).replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24) || user;
    passport.bio = String(bioInput.value || '').replace(/[<>]/g, '').trim().slice(0, 120);
    user = passport.name;
    set('dogebot-user', user);
    set(passportKey, passport);
    currentUser.textContent = user;
    displayName.textContent = user;
    saveNote.textContent = 'Passport saved locally.';
    setTimeout(() => { saveNote.textContent = 'Saved in this browser only.'; }, 2200);
  });
  overlay.querySelectorAll('[data-passport-pref]').forEach((input) => input.addEventListener('change', () => {
    passport[input.dataset.passportPref] = input.checked;
    set(passportKey, passport);
  }));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  overlay.querySelector('.passport-foot a')?.addEventListener('click', () => setOpen(false));
})();

(() => {
  const launchCard = [...document.querySelectorAll('.trust-card')]
    .find((card) => card.querySelector('small')?.textContent?.includes('LAUNCH STATE'));
  if (launchCard) {
    launchCard.querySelector('strong').textContent = 'LIVE CONFIGURED';
    launchCard.querySelector('p').textContent = 'The contract, buy routes, chart source, and shared community APIs are configured.';
  }
  document.querySelectorAll('.brief-list span').forEach((node) => {
    if (node.textContent.includes('No live contract configured')) node.textContent = 'Contract and route configuration are live.';
  });
  document.querySelectorAll('.holder-metrics span').forEach((node) => {
    if (node.textContent.includes('not live yet')) node.textContent = 'awaiting read-only feed';
  });
})();

// Apply holder copy after the dynamic holder section has been created.
(() => {
  const holderCopy = document.querySelector('#holders .section-head p');
  if (holderCopy) holderCopy.textContent = 'Holder context for the community, calculated from Robinhood Chain transfer logs and kept read-only.';
  const holderState = document.querySelector('.holder-state');
  if (holderState) holderState.textContent = 'SYNCING';
  const holderTotalNote = document.querySelector('.holder-total p');
  if (holderTotalNote) holderTotalNote.textContent = 'Reading the latest positive-balance addresses.';
  const holderMetrics = [...document.querySelectorAll('.holder-metrics > div')];
  if (holderMetrics[0]) {
    holderMetrics[0].querySelector('small').textContent = 'TOP 10 CONCENTRATION';
    holderMetrics[0].querySelector('span').textContent = 'syncing supply share';
  }
  if (holderMetrics[1]) {
    holderMetrics[1].querySelector('small').textContent = 'TOP BALANCE';
    holderMetrics[1].querySelector('span').textContent = 'syncing largest balance';
  }
  if (holderMetrics[2]) {
    holderMetrics[2].querySelector('small').textContent = 'LAST SYNC';
    holderMetrics[2].querySelector('strong').textContent = '—';
    holderMetrics[2].querySelector('span').textContent = 'Robinhood Chain RPC';
  }
  const explainLiveMarket = localAi;
  localAi = (question) => /price|market|token|contract|ddog|datadog/i.test(String(question || ''))
    ? 'The market panel uses live read-only data from configured GeckoTerminal, DexScreener, and Robinhood Chain sources. It does not execute trades.'
    : explainLiveMarket(question);
})();
