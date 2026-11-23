/* ====== EDIT YOUR LINKS HERE ====== */
const LINKS={download:"#versions",paid:"#versions",discord:"https://discord.gg/meownet"};
/* ================================== */
/* ====== SELLIX – real on-site checkout ======
   sellix.io -> your shop -> Developers -> Embed Products -> Generate Code
   -> pick your product -> copy the data-sellix-product="XXXXX" value here.
   Sellix checkout accepts card / PayPal / CashApp / crypto for you, delivers
   the product automatically and tracks every sale in your dashboard.
   Leave empty ("") to hide the Sellix button.                              */
const SELLIX="";   // product uniqid, e.g. "64aeff68a36da"
/* ============================================ */
/* ====== PAYMENT LINKS – paste yours here ======
   Any method left empty ("") is hidden automatically.
   card   : a hosted checkout link – fastest free setups:
            • Sellix  (sellix.io  -> product -> copy link)   card+paypal+crypto
            • Sellpass(sellpass.io-> product -> copy link)   card+crypto
            • Stripe  (dashboard.stripe.com -> Payment Links) cards only
            • Gumroad / Payhip product URL also works
   paypal : your PayPal.me link  -> https://paypal.me/YourName/7.99
   crypto : any crypto checkout link (Sellix product, Coinbase Commerce…)
   cashapp: https://cash.app/$YourTag/7.99                     */
const PAY={card:"",paypal:"",crypto:"",cashapp:""};
/* ============================================== */
/* ====== YOUR CRYPTO WALLETS – no signup needed ======
   Paste YOUR wallet addresses here – buyers send crypto straight to you,
   no middleman, no ID, no fees. Each coin with an address shows in the
   checkout; empty ones are hidden. Get a wallet at trustwallet.com /
   exodus.com / electrum.org – none of them need ID either.              */
const CRYPTO={
 btc:"bc1qpftnxa2slcdpdny9dwrj0gas57n89s0steqzha", // Bitcoin  (bc1...)
 ltc:"LdRfgT6uLbDMzxd5MSDHZoRhbxZS9Qk1HM",          // Litecoin (ltc1... / L...)
 usdt:"",                                          // USDT on TRON (T...) – cheapest to send
 eth:"0x60b4fa66E80316890bcB6983CdfFa9E1Ae6ef289", // Ethereum / USDT ERC-20 (0x...)
 trx:"",                                           // Tron    (T...)
 sol:"EFKmu1GB3Dgor9uKzRekKP51N7cMKC5W2sVqpfKVd76N"}; // Solana
/* ================================================== */
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
