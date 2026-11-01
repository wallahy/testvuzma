/* ====== EDIT YOUR LINKS HERE ====== */
const LINKS={download:"#versions",paid:"#versions",discord:"#"};
/* ================================== */
/* ====== EDIT YOUR CONTENT HERE ====== */
const REVIEWS=[ /* sample community members – replace with real ones when you have them. p = picture index */
 {u:"coolkid",p:0,t:"Been using Vyron for a few weeks now and the updates keep coming. Super easy to set up too."},
 {u:"voidwalker",p:1,t:"Great community and the staff reply fast. The free version got me hooked, then I upgraded."},
 {u:"yuki",p:2,t:"Clean, simple and does exactly what I wanted. Joined the Discord and everyone is helpful."},
 {u:"lunaa",p:3,t:"Love that everything is in one place. New games get added all the time."},
 {u:"kairo",p:4,t:"Setup took a couple of minutes and support helped me on day one. 10/10."},
 {u:"mxrcus",p:5,t:"Free tier is solid and the paid tier is worth it. Recommend it to anyone."},
 {u:"zephyr",p:6,t:"Fast updates, friendly people and everything just works. Best community I have joined."}];
const ORBIT=[3,5,1,6,0,4,2];
/* ===================================== */

/* profile picture files (assets/pfp/) */
const PFP=["assets/pfp/1.jpg","assets/pfp/2.jpg","assets/pfp/3.jpg","assets/pfp/4.jpg","assets/pfp/5.jpg","assets/pfp/6.jpg","assets/pfp/7.jpg"];
const pfp=i=>PFP[i%PFP.length];
