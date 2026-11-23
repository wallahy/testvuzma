document.querySelectorAll("[data-link]").forEach(a=>{const u=LINKS[a.dataset.link];if(u&&u!=="#")a.href=u;});

/* buy modal */
const buym=document.getElementById("buym");
const buyClose=()=>{buym.classList.remove("on");buym.setAttribute("aria-hidden","true")};

/* payment methods – rendered from PAY in config.js; empty links are hidden */
const PAYM=[
 ["card","Card","Visa · Mastercard · instant checkout",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 9.5h19M6 14.5h5"/></svg>'],
 ["paypal","PayPal","check out with your PayPal balance",'<img class="payimg" src="assets/paypal.png" alt="PayPal">'],
 ["crypto","Crypto","BTC · ETH · LTC · USDT",'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1.3 4.6 2.1.5-.4 1.7-1.3-.3-.7 2.8 1.3.3-.4 1.7-2.1-.5-.5 2.1h1.5l-.4 1.7-1.5-.4-.6 2.4-1.7-.4.6-2.4-3.4-.9.4-1.7 1.3.3.7-2.8-1.3-.3.4-1.7 3.4.9.5-2.1 1.7.4-.5 2.1z"/></svg>'],
 ["cashapp","Cash App","pay with your $cashtag",'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 3 12l9 9 9-9-9-9zm1.9 12.6-1.6.7-.4 1.7-1.6-.4.4-1.6-3-1.3.9-1.7 2.9 1.3 1.4-.6-2.4-3.3 1.6-.7.4-1.7 1.6.4-.4 1.6 3 1.3-.9 1.7-2.9-1.3-1.4.6 2.4 3.3z"/></svg>']];
const paylist=document.getElementById("paylist");
const payBtns=PAYM.filter(m=>m[0]==="paypal"||(typeof PAY!=="undefined"&&PAY[m[0]]));
let payHTML="";
/* Sellix = the real checkout — its overlay opens on-site and accepts
   card / PayPal / CashApp / crypto, so it sits on top of the list */
if(typeof SELLIX!=="undefined"&&SELLIX)
 payHTML+=`<button class="paybtn sellixbtn" type="button" data-sellix-product="${SELLIX}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2h12v6H6zM6 8h12v13H6z" transform="rotate(90 12 12) scale(.9)"/><path d="M9 12h6M9 15.5h4" stroke-linecap="round"/></svg></span><span><b>Secure Checkout</b><small>card · paypal · cashapp · crypto</small></span><svg class="arr" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>`;
payHTML+=payBtns.map(m=>{const u=(typeof PAY!=="undefined"&&PAY[m[0]])||LINKS.discord;return `<a class="paybtn" href="${u}" target="_blank" rel="noopener"><span class="ic">${m[3]}</span><span><b>${m[1]}</b><small>${m[2]}</small></span><svg class="arr" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>`}).join("");

/* crypto wallets – zero signup, money goes straight to you
   [key, name, ticker, glyph, tag] – tag = optional blue pill on the row */
const CW=[["btc","Bitcoin","BTC","assets/coins/btc.png"],["ltc","Litecoin","LTC","Ł","Track Me!"],["usdt","USDT","TRC-20","₮"],["eth","Ethereum","ERC-20","assets/coins/eth.png"],["trx","Tron","TRX","T"],["sol","Solana","SOL","assets/coins/sol.png"]];
const CWLT=(typeof CRYPTO!=="undefined")?CRYPTO:{};
const CEXP={btc:"https://blockchair.com/bitcoin/address/",ltc:"https://blockchair.com/litecoin/address/",usdt:"https://tronscan.org/#/address/",eth:"https://etherscan.io/address/",trx:"https://tronscan.org/#/address/",sol:"https://solscan.io/account/"};
const wRows=CW.filter(c=>CWLT[c[0]]);
if(wRows.length){
 const stack=wRows.map(c=>c[3].includes("/")?`<img class="coinic coinimg mini" src="${c[3]}" alt="">`:`<span class="coinic mini">${c[3]}</span>`).join("");
 payHTML+=`<button class="paybtn crybtn" type="button"><span class="coinstack">${stack}</span><span><b>Crypto methods</b><small>${wRows.map(c=>c[2]).join(" · ")} — straight to our wallet</small></span><svg class="arr" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button><div class="crylist">${wRows.map(c=>`<button class="cryrow" type="button" data-c="${c[0]}" data-n="${c[1]}">${c[3].includes("/")?`<img class="coinic coinimg" src="${c[3]}" alt="">`:`<span class="coinic">${c[3]}</span>`}<span class="crynm"><b>${c[1]}${c[4]?` <span class="tracktag">${c[4]}</span>`:""}</b><small>${c[2]}</small></span><code>${CWLT[c[0]].slice(0,10)}…${CWLT[c[0]].slice(-5)}</code></button>`).join("")}<p class="cryalert"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 21h22L12 2zm0 4.4L19.8 19H4.2L12 6.4zM11 10h2v5h-2v-5zm0 6.2h2v2h-2v-2z"/></svg><span>If you don't have ltc join our <a href="${LINKS.discord}" target="_blank" rel="noopener">discord</a> for way more methods</span></p></div><div class="crybox" id="crybox"></div>`;
}

paylist.innerHTML=payHTML||`<p class="paynone">Checkout links are being set up – grab Paid through a Discord ticket for now.</p>`;

/* crypto interactions */
paylist.addEventListener("click",e=>{
 if(e.target.closest(".paybtn"))showThanks();
 const tb=e.target.closest(".crybtn");
 if(tb){tb.nextElementSibling.classList.toggle("open");return;}
 const rw=e.target.closest(".cryrow");
 if(rw){
  const a=CWLT[rw.dataset.c],n=rw.dataset.n;
  const ex=CEXP[rw.dataset.c]||"";
  document.getElementById("crybox").innerHTML=`<div class="cryin"><img alt="${n} address QR" src="https://api.qrserver.com/v1/create-qr-code/?size=132x132&margin=8&data=${encodeURIComponent(a)}"><div class="crya"><small>send $7.99 worth of ${n} to:</small><code>${a}</code><div class="cryacts"><button type="button" class="crycopy" data-c="${a}">copy address</button>${ex?`<a class="crytrack" href="${ex}${a}" target="_blank" rel="noopener">Track Me! ↗</a>`:""}</div><button type="button" class="crysent" data-c="${rw.dataset.c}" data-a="${a}">I've sent it →</button></div></div><p class="crynote">after you send, tap "I've sent it" – we detect the payment on-chain and take you to your customer page.</p>`;
  return;
 }
 const sn=e.target.closest(".crysent");
 if(sn){watchPay(sn.dataset.c,sn.dataset.a);return;}
 const cp=e.target.closest(".crycopy");
 if(cp){navigator.clipboard&&navigator.clipboard.writeText(cp.dataset.c);cp.textContent="copied!";setTimeout(()=>cp.textContent="copy address",1400);}
});

/* ---- payment watcher — polls public explorers, no backend needed ---- */
let watchTimer=null;
async function incoming(coin,addr){
 try{
  if(coin==="btc"){
   const j=await (await fetch(`https://blockchain.info/rawaddr/${addr}?limit=6`)).json();
   return (j.txs||[]).filter(t=>(t.out||[]).some(o=>o.addr===addr&&o.value>0)).map(t=>({id:t.hash,ts:(t.time||0)*1000}));
  }
  if(coin==="ltc"||coin==="eth"){
   const j=await (await fetch(`https://api.blockcypher.com/v1/${coin}/main/addrs/${addr}?limit=8`)).json();
   return (j.txrefs||[]).filter(r=>r.tx_output_n>=0&&r.value>0).map(r=>({id:r.tx_hash,ts:Date.parse(r.confirmed)||0}));
  }
  if(coin==="sol"){
   const r=await fetch("https://api.mainnet-beta.solana.com",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"getSignaturesForAddress",params:[addr,{limit:6}]})});
   const j=await r.json();
   return (j.result||[]).map(s=>({id:s.signature,ts:(s.blockTime||0)*1000}));
  }
  if(coin==="trx"||coin==="usdt"){
   const j=await (await fetch(`https://apilist.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=6&address=${addr}`)).json();
   return (j.data||[]).map(t=>({id:t.hash||t.txID,ts:t.timestamp}));
  }
 }catch(e){}
 return null;
}
function watchPay(coin,addr){
 clearInterval(watchTimer);
 const box=document.getElementById("crybox");
 const seen=new Set(),t0=Date.now();
 let first=true,ticks=0;
 const paid=id=>{clearInterval(watchTimer);location.hash=`paid/${coin}/${id}`;buym.classList.remove("on");};
 const tick=async()=>{
  const list=await incoming(coin,addr);
  if(list){
   if(first){
    list.forEach(t=>seen.add(t.id));
    const recent=list.find(t=>t.ts>t0-45*60*1000);   /* sent before clicking still counts */
    if(recent){paid(recent.id);return;}
   }else{
    const hit=list.find(t=>!seen.has(t.id));
    if(hit){paid(hit.id);return;}
   }
  }
  first=false;
  if(++ticks===12){   /* ~4 min in: offer the manual path */
   const w=document.getElementById("crywait");
   if(w&&!document.getElementById("cryslow"))
    w.insertAdjacentHTML("beforeend",`<p class="cryslow" id="cryslow">taking a while? if it already sent — <a href="#paid/${coin}/manual">continue to your customer page →</a></p>`);
  }
  if(ticks>90)clearInterval(watchTimer);   /* stop after ~30 min */
 };
 if(box)box.innerHTML=`<div class="crywait" id="crywait"><span class="cryspin"></span><div><b>Watching for your payment…</b><small>the moment it lands on-chain you'll be taken to your customer page — keep this window open</small></div></div>`;
 watchTimer=setInterval(tick,20000);
 tick();
}

/* ---- customer page — #paid/<coin>/<tx> ---- */
function renderPaid(){
 const old=document.getElementById("paidpage");if(old)old.remove();
 if(!location.hash.startsWith("#paid")){document.body.style.overflow="";return;}
 const [,coin,tx]=location.hash.split("/");
 const nm=((CW.find(c=>c[0]===coin)||[])[1])||"crypto";
 const addr=CWLT[coin]||"";
 const ex=(CEXP[coin]||"")+ (tx&&tx!=="manual"?tx:"");
 const got=tx&&tx!=="manual";
 const d=document.createElement("div");
 d.id="paidpage";
 d.innerHTML=`<div class="paidcard"><button class="paidx" type="button" aria-label="back">×</button>
  <div class="paidcheck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg></div>
  <h2>${got?"Payment received!":"Almost there"}</h2>
  <p>${got?`we picked up your ${nm} transaction on-chain.`:`we couldn't confirm a tx yet – if you sent it, it'll show up shortly.`}</p>
  ${tx?`<div class="paidtx"><small>transaction</small><code>${tx}</code><div><button type="button" class="crycopy paidcp" data-c="${tx}">copy txid</button>${got?`<a class="crytrack" href="${ex}" target="_blank" rel="noopener">view on explorer ↗</a>`:""}</div></div>`:""}
  <div class="paidnext"><small>last step</small><p>open a Discord ticket${tx?" and paste your txid":""} — we verify it and hand over your download right away.</p></div>
  <div class="paidbtns"><a class="paybtn paiddisc" href="${LINKS.discord}" target="_blank" rel="noopener"><span class="ic"><img class="discic" src="assets/discord.png" alt="Discord"></span><span><b>Open Discord ticket</b><small>we're online and reply fast</small></span></a>
  <a class="paidback" href="#">back to site</a></div></div>`;
 document.body.appendChild(d);
 document.body.style.overflow="hidden";
 d.querySelector(".paidx").onclick=()=>{location.hash="";};
 d.querySelector(".paidback").onclick=e=>{e.preventDefault();location.hash="";};
 const cpb=d.querySelector(".paidcp");
 if(cpb)cpb.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(cpb.dataset.c);cpb.textContent="copied!";setTimeout(()=>cpb.textContent="copy txid",1400);};
}
addEventListener("hashchange",renderPaid);renderPaid();

document.querySelectorAll('[data-link="paid"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();buym.classList.add("on");buym.setAttribute("aria-hidden","false")}));
document.getElementById("buyx").onclick=buyClose;
buym.addEventListener("click",e=>{if(e.target===buym)buyClose()});

/* thanks-for-buying popup */
const tm=document.getElementById("thanks");
const thanksClose=()=>{tm.classList.remove("on");tm.setAttribute("aria-hidden","true")};
const showThanks=()=>{tm.classList.add("on");tm.setAttribute("aria-hidden","false")};
document.getElementById("thanksx").onclick=thanksClose;
tm.addEventListener("click",e=>{if(e.target===tm)thanksClose()});

addEventListener("keydown",e=>{if(e.key==="Escape"){buyClose();thanksClose()}});

/* discord login (OAuth2 implicit) */
const DCBTN=document.getElementById("dcbtn"),DCCLIENT="1572232361125355601";
const dcSet=u=>{
 let chip=document.getElementById("dchip");
 if(!u){if(chip)chip.remove();DCBTN.hidden=false;return}
 DCBTN.hidden=true;
 if(!chip){chip=document.createElement("div");chip.id="dchip";chip.className="dchip";chip.title="Logged in with Discord";chip.innerHTML='<img alt=""><span></span>';DCBTN.parentElement.insertBefore(chip,DCBTN)}
 const av=u.avatar?`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=64`:`https://cdn.discordapp.com/embed/avatars/${Number((BigInt(u.id)>>22n)%6n)}.png`;
 chip.querySelector("img").src=av;
 chip.querySelector("span").textContent=u.global_name||u.username;
};
const dcLoad=async t=>{try{const r=await fetch("https://discord.com/api/users/@me",{headers:{Authorization:`Bearer ${t}`}});if(!r.ok)throw 0;dcSet(await r.json())}catch(e){localStorage.removeItem("dc_tok");dcSet(null)}};
const hp=new URLSearchParams(location.hash.slice(1));
if(hp.get("access_token")){localStorage.setItem("dc_tok",hp.get("access_token"));history.replaceState(null,"",location.pathname+location.search)}
const dct=localStorage.getItem("dc_tok");
if(dct)dcLoad(dct);
DCBTN.onclick=e=>{e.preventDefault();location.href=`https://discord.com/oauth2/authorize?client_id=${DCCLIENT}&response_type=token&redirect_uri=${encodeURIComponent(location.href.split("#")[0])}&scope=identify`};
document.getElementById("yr").textContent=new Date().getFullYear();

const W=[["Many Steam games","One community building clients for a growing list of free and paid Steam games."],["Free to start","Grab a free client and be up and running in minutes. No account walls."],["Paid for more","Premium clients with extended feature sets for players who want everything."],["Made by players","Built by a community that plays the same games you do."],["Updates on Discord","New games and new builds are announced as soon as they are ready."],["Help when you need it","Ask questions, share feedback and get support from the community and team."]];
document.getElementById("cards").innerHTML=W.map((f,i)=>`<div class="card rv" style="--i:${i%3}"><h3>${f[0]}</h3><p style="margin:0">${f[1]}</p></div>`).join("");

/* FAQ */
const Q=[["What is Vyron Client?","Vyron is a large community server that makes clients for free and paid Steam games. Everything is available in one place, with updates posted on Discord."],
["Which games are supported?","New games are added regularly. Join the Discord to see which games are supported and what is coming next."],
["What is the difference between Free and Paid?","Free clients cover the core features at no cost. Paid clients add extended feature sets, faster updates and priority support."],
["How do I get a paid client?","Press Get Paid in the Plans section. You will be taken to the store to complete your purchase and receive your download."],
["Where do I get help and updates?","Join the Discord. Support, announcements and new releases are posted there first."],
["What are the system requirements?","A Windows PC that can run the game you want to use, installed through Steam."]];
const fq=document.getElementById("faqs");
fq.innerHTML=Q.map((q,i)=>`<div class="q rv" style="--i:${i}"><button aria-expanded="false" aria-controls="a${i}">${q[0]}<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button><div class="a" id="a${i}"><div><p>${q[1]}</p></div></div></div>`).join("");
fq.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const q=b.parentElement,o=q.classList.contains("open");fq.querySelectorAll(".q.open").forEach(x=>{x.classList.remove("open");x.firstChild.setAttribute("aria-expanded","false")});if(!o){q.classList.add("open");b.setAttribute("aria-expanded","true")}});

/* reviews carousel + orbit */
const ring=document.getElementById("ring"),track=document.getElementById("track");
ring.innerHTML=ORBIT.map((n,i)=>`<img class="dot" alt="" src="${pfp(n)}" style="--a:${i*360/ORBIT.length+20}deg;--k:${i}">`).join("");
track.innerHTML=REVIEWS.map((r,i)=>`<div class="rc" data-i="${i}"><div class="rh"><img class="av" alt="" width="34" height="34" src="${pfp(r.p)}"><div><b>@${r.u}</b><small>Vyron member</small></div></div><p>${r.t}</p></div>`).join("");
const rcs=[...track.children],N=rcs.length;let cur=0,timer;
function place(){const half=Math.floor(N/2);rcs.forEach((c,i)=>{const o=((i-cur+N+half)%N)-half,abs=Math.abs(o);c.style.setProperty("--o",o);c.style.setProperty("--s",o===0?1:.93);c.style.setProperty("--op",o===0?1:abs===1?.38:0);c.style.pointerEvents=abs>1?"none":"auto";c.classList.toggle("act",o===0)})}
function auto(){clearInterval(timer);if(!matchMedia("(prefers-reduced-motion:reduce)").matches)timer=setInterval(()=>{cur=(cur+1)%N;place()},4500)}
track.addEventListener("click",e=>{const c=e.target.closest(".rc");if(c){cur=+c.dataset.i;place();auto()}});
track.addEventListener("pointerenter",()=>clearInterval(timer));track.addEventListener("pointerleave",auto);
place();auto();

/* window tilt */
const win=document.getElementById("win"),stage=document.getElementById("stage");
stage.addEventListener("pointermove",e=>{const b=stage.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;win.style.setProperty("--ry",(x*10).toFixed(2)+"deg");win.style.setProperty("--rx",(-y*8).toFixed(2)+"deg")});
stage.addEventListener("pointerleave",()=>{win.style.setProperty("--rx","0deg");win.style.setProperty("--ry","0deg")});

/* card spotlight */
document.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest(".card");if(c){const b=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-b.left+"px");c.style.setProperty("--my",e.clientY-b.top+"px")}});

/* client on/off compare slider */
const cmp=document.getElementById("cmp");
if(cmp){const r=cmp.querySelector(".cmp-range"),set=()=>cmp.style.setProperty("--pos",r.value+"%");r.addEventListener("input",set);set()}

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));

/* header, progress, mobile menu */
const hd=document.getElementById("hd"),pg=document.getElementById("prog");
function sc(){const y=scrollY;hd.classList.toggle("s",y>20);const m=document.documentElement.scrollHeight-innerHeight;pg.style.transform=`scaleX(${m>0?y/m:0})`}
addEventListener("scroll",sc,{passive:true});sc();
const mn=document.getElementById("menu"),bb=document.getElementById("bg-btn");
bb.onclick=()=>{const o=mn.classList.toggle("open");bb.setAttribute("aria-expanded",o)};
mn.addEventListener("click",e=>{if(e.target.tagName==="A"){mn.classList.remove("open");bb.setAttribute("aria-expanded","false")}});
