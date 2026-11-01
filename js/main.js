document.querySelectorAll("[data-link]").forEach(a=>{const u=LINKS[a.dataset.link];if(u&&u!=="#")a.href=u;});

/* buy modal */
const buym=document.getElementById("buym");
const buyClose=()=>{buym.classList.remove("on");buym.setAttribute("aria-hidden","true")};
document.querySelectorAll('[data-link="paid"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();buym.classList.add("on");buym.setAttribute("aria-hidden","false")}));
document.getElementById("buyx").onclick=buyClose;
buym.addEventListener("click",e=>{if(e.target===buym)buyClose()});
addEventListener("keydown",e=>{if(e.key==="Escape")buyClose()});
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
