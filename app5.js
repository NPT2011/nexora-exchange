/* Nexora Refer & Earn page (#ref). Loaded after app.js. */
(function(){
var RATE=0.20,FEE=0.001,DATA=null;
function q5(id){return document.getElementById(id);}
function e5(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function u5(v,d){v=+v||0;return v.toLocaleString('en-US',{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d});}
function m5(v){v=+v||0;if(v>=1e6)return '$'+(v/1e6).toFixed(v>=1e7?0:1)+'M';if(v>=1e3)return '$'+(v/1e3).toFixed(v>=1e4?0:1)+'K';return '$'+v.toFixed(0);}
function link5(uid){return 'https://www.nexorax.io/?ref='+encodeURIComponent(uid);}
function pct(){return Math.round(RATE*100);}
function dt5(s){try{var d=new Date(s);return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});}catch(e){return '';}}

var css='#p-ref{gap:16px}'+
'.rf-hero{position:relative;overflow:hidden;border-radius:22px;padding:26px 20px 22px;background:radial-gradient(120% 90% at 100% 0%,rgba(242,201,111,.35),transparent 55%),linear-gradient(160deg,#16264A 0%,#0E1830 70%);border:1px solid rgba(230,180,80,.35)}'+
'.rf-hero:after{content:"";position:absolute;right:-60px;bottom:-60px;width:200px;height:200px;border-radius:50%;border:30px solid rgba(230,180,80,.08)}'+
'.rf-kick{display:inline-block;font-size:11px;font-weight:700;letter-spacing:2.5px;color:var(--gold);border:1px solid rgba(230,180,80,.5);border-radius:30px;padding:6px 12px}'+
'.rf-big{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:30px;line-height:1.12;margin:14px 0 8px;color:var(--tx)}'+
'.rf-big b{color:var(--gold2);font-size:58px;display:block;line-height:1;letter-spacing:-1px}'+
'.rf-sub{font-size:14px;color:var(--soft);line-height:1.55;max-width:460px}'+
'.rf-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;position:relative;z-index:1}'+
'.rf-pill{font-size:12px;font-weight:600;padding:7px 11px;border-radius:30px;background:rgba(63,211,154,.12);color:var(--up);border:1px solid rgba(63,211,154,.3)}'+
'.rf-link{display:flex;flex-direction:column;gap:10px}'+
'.rf-box{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px dashed rgba(230,180,80,.55);border-radius:12px;padding:12px}'+
'.rf-box span{flex:1;min-width:0;font-size:13px;color:var(--soft);word-break:break-all}'+
'.rf-box b{font-family:"Space Grotesk",sans-serif;font-size:20px;color:var(--gold2);letter-spacing:1px;flex:1}'+
'.rf-cp{flex:none;height:34px;padding:0 14px;border-radius:9px;border:0;background:var(--gold);color:#0B1426;font-weight:700;font-size:13px;cursor:pointer}'+
'.rf-share{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}'+
'.rf-share a,.rf-share button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:11px 4px;border-radius:12px;background:var(--card2);border:1px solid var(--line);color:var(--tx);font-size:11.5px;font-weight:600;text-decoration:none;cursor:pointer;font-family:inherit}'+
'.rf-share i{width:34px;height:34px;border-radius:17px;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:800;font-size:15px;color:#fff}'+
'.rf-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}'+
'.rf-st{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px}'+
'.rf-st div{font-size:12px;color:var(--mut)}.rf-st b{display:block;font-family:"Space Grotesk",sans-serif;font-size:22px;margin-top:4px}'+
'.rf-st.g{border-color:rgba(230,180,80,.45);background:linear-gradient(160deg,rgba(230,180,80,.14),var(--card) 70%)}.rf-st.g b{color:var(--gold2)}'+
'.rf-steps{display:flex;flex-direction:column;gap:12px}'+
'.rf-step{display:flex;gap:14px;align-items:flex-start}'+
'.rf-n{flex:none;width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,var(--gold2),var(--gold));color:#0B1426;font-weight:800;font-family:"Space Grotesk",sans-serif;font-size:17px;display:flex;align-items:center;justify-content:center}'+
'.rf-step h4{margin:2px 0 3px;font-size:15px}.rf-step p{margin:0;font-size:13px;color:var(--mut2);line-height:1.5}'+
'.rf-calc label{display:flex;justify-content:space-between;font-size:13px;color:var(--mut2);margin-top:6px}.rf-calc label b{color:var(--tx)}'+
'.rf-calc input[type=range]{width:100%;accent-color:#E6B450;margin:8px 0 4px}'+
'.rf-out{margin-top:8px;border-radius:14px;padding:16px;text-align:center;background:linear-gradient(135deg,rgba(242,201,111,.18),rgba(230,180,80,.05));border:1px solid rgba(230,180,80,.4)}'+
'.rf-out div{font-size:12px;color:var(--mut2)}.rf-out b{display:block;font-family:"Space Grotesk",sans-serif;font-size:34px;color:var(--gold2);margin:4px 0}'+
'.rf-out small{font-size:11.5px;color:var(--mut)}'+
'.rf-ex{display:flex;flex-direction:column;gap:8px}.rf-ex .r{display:flex;justify-content:space-between;font-size:13.5px;padding:9px 0;border-bottom:1px solid var(--line2)}'+
'.rf-ex .r span{color:var(--mut2)}.rf-ex .r:last-child{border:0}.rf-ex .r.t b{color:var(--gold2);font-size:16px}'+
'.rf-faq details{border-bottom:1px solid var(--line2);padding:12px 0}.rf-faq details:last-child{border:0}'+
'.rf-faq summary{cursor:pointer;font-weight:600;font-size:14px;list-style:none}.rf-faq summary::-webkit-details-marker{display:none}'+
'.rf-faq summary:after{content:"+";float:right;color:var(--gold)}.rf-faq details[open] summary:after{content:"\\2212"}'+
'.rf-faq p{margin:8px 0 0;font-size:13px;color:var(--mut2);line-height:1.55}'+
'.rf-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line2);font-size:13.5px}.rf-row:last-child{border:0}'+
'.rf-row small{display:block;font-size:11.5px;color:var(--mut)}.rf-row b{color:var(--up)}'+
'.rf-cta{height:48px;border-radius:12px;border:0;font-weight:700;font-size:15px;background:linear-gradient(90deg,var(--gold),var(--gold2));color:#0B1426;cursor:pointer;width:100%}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var main=document.querySelector('.main');
var sec=document.createElement('section');sec.className='pg';sec.id='p-ref';main.appendChild(sec);

function hero(){return '<div class="rf-hero"><span class="rf-kick">REFER &amp; EARN</span>'+
'<div class="rf-big">Invite friends. Earn<b>'+pct()+'% for life</b>of every trading fee they pay.</div>'+
'<div class="rf-sub">Share your link. Every time your friend trades on Nexora Exchange, '+pct()+'% of their trading fee is paid to you in USDT, straight into your Spot wallet. No limit on friends. No end date.</div>'+
'<div class="rf-pills"><span class="rf-pill">Paid in USDT</span><span class="rf-pill">Lifetime earnings</span><span class="rf-pill">Unlimited friends</span><span class="rf-pill">Credited instantly</span></div></div>';}

function linkCard(){
if(!DATA)return '<div class="card" style="gap:10px"><div class="ct">Get your referral link</div><div style="font-size:13px;color:var(--mut2);line-height:1.5">'+
'Log in or create a free account to get your personal link and start earning.</div><button class="rf-cta" onclick="openAuth(\'up\')">Create free account</button>'+
'<button class="btn dark" style="height:42px" onclick="openAuth(\'in\')">Log in</button></div>';
var L=link5(DATA.uid),msg='Join me on Nexora Exchange and trade crypto with USDT. Sign up with my link: '+L;
return '<div class="card rf-link"><div class="ct">Your referral link</div>'+
'<div class="rf-box"><span id="rfL">'+e5(L)+'</span><button class="rf-cp" data-c="'+e5(L)+'">Copy</button></div>'+
'<div class="ct" style="font-size:13px;color:var(--mut2);font-weight:500">Your referral code</div>'+
'<div class="rf-box"><b>'+e5(DATA.uid)+'</b><button class="rf-cp" data-c="'+e5(DATA.uid)+'">Copy</button></div>'+
'<div class="rf-share">'+
'<a target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg)+'"><i style="background:#25D366">W</i>WhatsApp</a>'+
'<a target="_blank" rel="noopener" href="https://t.me/share/url?url='+encodeURIComponent(L)+'&text='+encodeURIComponent('Join me on Nexora Exchange and trade crypto with USDT.')+'"><i style="background:#2AABEE">T</i>Telegram</a>'+
'<a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text='+encodeURIComponent(msg)+'"><i style="background:#000;border:1px solid #333">X</i>X</a>'+
'<button id="rfMore"><i style="background:var(--gold);color:#0B1426">+</i>More</button></div></div>';}

function stats(){if(!DATA)return '';return '<div class="rf-stats">'+
'<div class="rf-st g"><div>Total earned</div><b>'+u5(DATA.total,4)+' <span style="font-size:13px">USDT</span></b></div>'+
'<div class="rf-st"><div>Earned today</div><b>'+u5(DATA.today,4)+' <span style="font-size:13px;color:var(--mut)">USDT</span></b></div>'+
'<div class="rf-st"><div>Friends invited</div><b>'+(+DATA.friends||0)+'</b></div>'+
'<div class="rf-st"><div>Friends trading</div><b>'+(+DATA.active||0)+'</b></div></div>';}

function steps(){return '<div class="sec">How it works</div><div class="card rf-steps">'+
'<div class="rf-step"><span class="rf-n">1</span><div><h4>Share your link</h4><p>Send your referral link or code to friends, family and your groups on WhatsApp, Telegram or social media.</p></div></div>'+
'<div class="rf-step"><span class="rf-n">2</span><div><h4>Friends sign up and trade</h4><p>Your friend creates a free Nexora Exchange account with your link or enters your code at sign-up, then trades.</p></div></div>'+
'<div class="rf-step"><span class="rf-n">3</span><div><h4>You earn '+pct()+'% in USDT</h4><p>On every trade they make, '+pct()+'% of their trading fee lands in your Spot wallet in USDT, for as long as they trade.</p></div></div></div>';}

function calc(){return '<div class="sec">Earnings calculator</div><div class="card rf-calc">'+
'<label>Friends who trade <b id="rcF">10</b></label><input type="range" id="rcFi" min="1" max="500" value="10">'+
'<label>Each friend trades per month <b id="rcV">$10K</b></label><input type="range" id="rcVi" min="0" max="100" value="50">'+
'<div class="rf-out"><div>You could earn per month</div><b id="rcO">$0</b><small id="rcY"></small></div>'+
'<div style="font-size:11.5px;color:var(--mut);line-height:1.45;margin-top:8px">Based on a '+(FEE*100).toFixed(2).replace(/0$/,'')+'% trading fee and '+pct()+'% referral share. Actual earnings depend on how much your friends trade.</div></div>';}

function example(){var vol=10000,fee=vol*FEE,me=fee*RATE;return '<div class="sec">Example</div><div class="card rf-ex">'+
'<div class="r"><span>Your friend trades</span><b>'+u5(vol,0)+' USDT</b></div>'+
'<div class="r"><span>Trading fee ('+(FEE*100).toFixed(2).replace(/0$/,'')+'%)</span><b>'+u5(fee,2)+' USDT</b></div>'+
'<div class="r t"><span>You earn ('+pct()+'%)</span><b>'+u5(me,2)+' USDT</b></div>'+
'<div style="font-size:12px;color:var(--mut2);line-height:1.5">With 10 such friends that is '+u5(me*10,2)+' USDT, every time they trade this much.</div></div>';}

function faq(){return '<div class="sec">Questions</div><div class="card rf-faq">'+
'<details><summary>How much do I earn?</summary><p>You earn '+pct()+'% of every trading fee paid by the friends you invite. It is paid in USDT.</p></details>'+
'<details><summary>How long will I keep earning?</summary><p>For life. As long as your friend keeps trading on Nexora Exchange, you keep earning.</p></details>'+
'<details><summary>When do I get paid?</summary><p>Instantly. Your share is added to your Spot wallet the moment your friend\'s trade is completed.</p></details>'+
'<details><summary>How many friends can I invite?</summary><p>There is no limit. The more friends trade, the more you earn.</p></details>'+
'<details><summary>How does my friend join under me?</summary><p>Your friend must sign up using your referral link, or enter your referral code in the "Referral code" box when creating the account.</p></details>'+
'<details><summary>Does my friend pay anything extra?</summary><p>No. Your friend pays the normal trading fee. Your '+pct()+'% comes out of the fee Nexora Exchange collects.</p></details>'+
'<details><summary>Can I withdraw my earnings?</summary><p>Yes. Your earnings are normal USDT in your Spot wallet. You can trade with them or withdraw them.</p></details></div>';}

function lists(){if(!DATA)return '';var L=DATA.list||[],R=DATA.recent||[];
return '<div class="sec">My friends ('+L.length+')</div><div class="card" style="gap:0">'+(L.length?L.map(function(f){
return '<div class="rf-row"><div>'+e5(f.uid)+'<small>Joined '+dt5(f.joined)+'</small></div><b>+'+u5(f.earned,4)+' USDT</b></div>';}).join(''):
'<div style="font-size:13px;color:var(--mut2);padding:6px 0">No friends yet. Share your link to start earning.</div>')+'</div>'+
(R.length?'<div class="sec">Recent earnings</div><div class="card" style="gap:0">'+R.map(function(x){
return '<div class="rf-row"><div>From '+e5(x.uid)+'<small>'+new Date(x.created_at).toLocaleString('en-GB')+'</small></div><b>+'+u5(x.amount,6)+'</b></div>';}).join('')+'</div>':'');}

function draw(){sec.innerHTML='<h1 class="h1">Refer &amp; Earn</h1>'+hero()+linkCard()+stats()+steps()+calc()+example()+faq()+lists()+
(DATA?'<button class="rf-cta" id="rfBot">Share my link now</button>':'');wire();}

function copy5(t){try{navigator.clipboard.writeText(t).then(function(){say('Copied');},function(){say(t);});}catch(e){say(t);}}
function share5(){if(!DATA)return;var L=link5(DATA.uid);if(navigator.share){navigator.share({title:'Nexora Exchange',text:'Join me on Nexora Exchange and trade crypto with USDT.',url:L}).catch(function(){});}else copy5(L);}
function vol(i){var v=Math.round(100*Math.pow(10,i/25));return v>=1000?Math.round(v/500)*500:Math.round(v/10)*10;}
function recalc(){var f=+q5('rcFi').value,v=vol(+q5('rcVi').value),m=f*v*FEE*RATE;
q5('rcF').textContent=f;q5('rcV').textContent=m5(v);q5('rcO').textContent='$'+u5(m,m<100?2:0);q5('rcY').textContent='about $'+u5(m*12,0)+' per year';}
function wire(){sec.querySelectorAll('.rf-cp').forEach(function(b){b.onclick=function(){copy5(b.dataset.c);};});
var mo=q5('rfMore');if(mo)mo.onclick=share5;var bt=q5('rfBot');if(bt)bt.onclick=share5;
['rcFi','rcVi'].forEach(function(id){q5(id).oninput=recalc;});recalc();}

function load(){if(typeof sb==='undefined'||!sb){DATA=null;draw();return;}
sb.from('nx_pro_settings').select('ref_rate').maybeSingle().then(function(r){if(r.data&&r.data.ref_rate!=null)RATE=+r.data.ref_rate;});
if(typeof SPOTFEE!=='undefined')FEE=+SPOTFEE||FEE;
if(!ME){DATA=null;draw();return;}
draw();sb.rpc('nx_ref_my').then(function(r){if(r.error){DATA=null;draw();return;}DATA=r.data;if(DATA&&DATA.rate!=null)RATE=+DATA.rate;draw();});}
function route(){if((location.hash||'').slice(1)==='ref')load();}
window.addEventListener('hashchange',function(){setTimeout(route,0);});
if(typeof sb!=='undefined'&&sb)sb.auth.onAuthStateChange(function(){setTimeout(route,600);});

/* point every "Refer & Earn" button to this page */
function hook(){document.querySelectorAll('#qa .q,#dmenu .di').forEach(function(b){if(b.textContent.trim()==='Refer & Earn')b.dataset.g='ref';});
var rb=document.querySelector('#p-account .ref');if(rb){var d=rb.querySelectorAll('div div');if(d[1])d[1].textContent='Earn '+pct()+'% of your friends\' trading fees, for life';
var b=rb.querySelector('button');if(b){b.onclick=function(){go('ref');};}}}
hook();setTimeout(hook,1500);
if((location.hash||'').slice(1)==='ref'){if(typeof show==='function')show();setTimeout(route,800);}
})();
