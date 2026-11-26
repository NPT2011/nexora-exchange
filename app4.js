/* Nexora P2P trust: trader stats, real (KYC) name, feedback, trader profile, block / report. Loaded after app3.js. */
(function(){
function q4(i){return document.getElementById(i);}
function n4(v,d){return (+v||0).toLocaleString('en-US',{maximumFractionDigits:d==null?2:d});}
function e4(e){return (e&&e.message)||String(e||'Something went wrong');}
function mins(v){if(v==null)return '\u2014';v=+v;return v<1?Math.round(v*60)+' s':v.toFixed(2)+' m';}
var TUID=null;

/* ---- trader profile page ---- */
var sec=document.createElement('section');sec.className='pg';sec.id='p-trader';
sec.innerHTML='<h1 class="h1">Trader</h1><div id="trBody"></div>';document.querySelector('.main').appendChild(sec);
window.nxTrader=function(uid){TUID=uid;go('trader');};
function stat(v,l){return '<div><div style="font-size:22px;font-weight:700">'+v+'</div><div style="font-size:12px;color:var(--mut2)">'+l+'</div></div>';}
function trDraw(){var b=q4('trBody');if(!TUID){go('p2p');return;}b.innerHTML='<div class="card" style="color:var(--mut2)">Loading...</div>';
sb.rpc('nx_p2p_trader',{p_uid:TUID}).then(function(r){if(r.error){b.innerHTML='<div class="card">'+esc(e4(r.error))+'</div>';return;}
var d=r.data,s=d.stats||{};
b.innerHTML='<div class="card" style="gap:4px"><div style="display:flex;align-items:center;gap:12px"><div style="width:52px;height:52px;border-radius:50%;'+
'background:var(--bg2,#1E2E52);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700">'+esc((d.name||'?').charAt(0).toUpperCase())+
'</div><div><b style="font-size:18px">'+esc(d.name)+'</b><div style="font-size:12px;color:var(--mut2)">'+esc(d.uid)+
(s.verified?' \u00b7 <span style="color:var(--up)">\u2713 Verified</span>':'')+'</div></div></div></div>'+
'<div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'+
stat(s.trades_30d||0,'30d Trades')+stat(s.rate_30d!=null?n4(s.rate_30d)+'%':'\u2014','30d Completion Rate')+
stat(mins(s.avg_release_min),'Avg. Release Time')+stat(mins(s.avg_pay_min),'Avg. Pay Time')+
stat(s.positive!=null?n4(s.positive)+'%':'\u2014','Positive feedback ('+(s.feedback_n||0)+')')+stat(s.trades_all||0,'All trades')+'</div>'+
((d.ads||[]).length?'<div class="sec">Ads</div>'+d.ads.map(function(a){return '<div class="card" style="gap:3px"><div style="display:flex;justify-content:space-between">'+
'<b style="color:'+(a.side==='sell'?'var(--up)':'var(--dn)')+'">'+(a.side==='sell'?'Sells':'Buys')+' USDT</b><b>'+n4(a.price)+' '+esc(a.fiat)+'</b></div>'+
'<div style="font-size:12px;color:var(--mut2)">Available '+n4(a.avail,4)+' USDT \u00b7 Limit '+n4(a.min)+' \u2013 '+n4(a.max)+' '+esc(a.fiat)+'</div>'+
'<div style="font-size:12px;color:var(--soft)">'+(a.pay||[]).map(esc).join(' \u00b7 ')+'</div></div>';}).join(''):'')+
'<div class="sec">Feedback</div>'+((d.feedback||[]).length?'<div class="card" style="gap:6px">'+d.feedback.map(function(f){
return '<div style="display:flex;gap:8px;font-size:13px"><span>'+(f.good?'\ud83d\udc4d':'\ud83d\udc4e')+'</span><span style="flex:1">'+esc(f.comment||(f.good?'Positive':'Negative'))+
'</span><span style="color:var(--mut);font-size:11px">'+new Date(f.created_at).toLocaleDateString()+'</span></div>';}).join('')+'</div>':
'<div class="card" style="font-size:13px;color:var(--mut2)">No feedback yet.</div>')+
(ME&&!d.me?'<div style="display:flex;gap:8px;margin-top:4px"><button class="btn dark" style="flex:1;height:40px" onclick="nxBlock('+(!d.blocked)+')">'+
(d.blocked?'Unblock user':'Block user')+'</button><button class="btn dark" style="flex:1;height:40px" onclick="nxReport()">Report</button></div>':'');});}
window.nxBlock=function(on){if(on&&!confirm('Block this user? You will not see their ads and cannot trade with them.'))return;
sb.rpc('nx_p2p_block',{p_uid:TUID,p_on:on}).then(function(r){if(r.error){say(e4(r.error));return;}say(on?'User blocked':'User unblocked');trDraw();});};
window.nxReport=function(o){var t=prompt('What happened? (our team will check)');if(!t)return;
sb.rpc('nx_p2p_report',{p_uid:TUID,p_reason:t,p_order:o||null}).then(function(r){if(r.error){say(e4(r.error));return;}say('Report sent. Thank you.');});};

/* ---- ad list: add Binance-style stats under each advertiser ---- */
function enhList(){var l=q4('pList');if(!l||!window._pads)return;
Array.prototype.forEach.call(l.children,function(box,i){var a=window._pads[i];if(!a||box.querySelector('.nx4s'))return;
var head=box.firstElementChild;if(!head)return;var nm=head.querySelector('b');
if(nm){nm.style.cursor='pointer';nm.onclick=function(){nxTrader(a.uid);};}
var sp=head.querySelector('span[style*="font-size:11px"]');if(sp&&sp.parentNode===head)sp.style.display='none';
var d=document.createElement('div');d.className='nx4s';d.style.cssText='font-size:11.5px;color:var(--mut2);margin-top:-2px';
d.innerHTML='Trades: '+(a.orders_30d||0)+(a.rate!=null?' ('+n4(a.rate)+'%)':'')+' \u00b7 \ud83d\udc4d '+(a.positive!=null?n4(a.positive)+'%':'\u2014')+
' \u00b7 \u23f1 '+(a.avg_release!=null?mins(a.avg_release):'\u2014')+' release';
head.parentNode.insertBefore(d,head.nextSibling);});}
var pl=q4('pList');if(pl)new MutationObserver(enhList).observe(pl,{childList:true});

/* ---- order page: real name, profile link, scam warning, feedback ---- */
function enhOrder(){var h=q4('poHead'),d=window.PODATA;if(!h||!d||h.querySelector('.nx4o'))return;var o=d.order,buy=d.me==='buyer';
var w=document.createElement('div');w.className='nx4o';w.style.cssText='font-size:12px;line-height:1.5;padding:8px 10px;margin-bottom:8px;border-radius:10px;'+
'background:rgba(230,180,80,.1);border:1px solid rgba(230,180,80,.35);color:var(--soft)';
w.textContent='\u26a0 Never release USDT before the money is in your own account. Requests to verify "Flash USDT" or to pay outside this order are scams.';
h.insertBefore(w,h.firstChild);
var r=document.createElement('div');r.className='nx4r';r.style.cssText='font-size:13px;padding-top:8px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap';
r.innerHTML='<span><span style="color:var(--mut)">Real name: </span><b>'+esc(d.other_real||'\u2014')+'</b>'+
(d.other_verified?' <span style="color:var(--up);font-size:11px">\u2713 KYC</span>':'')+'</span>'+
'<span style="color:var(--gold);cursor:pointer" onclick="nxTrader(\''+esc(d.other_uid||'')+'\')">View profile \u203a</span>';
h.appendChild(r);
if(o.status==='completed'){var f=document.createElement('div');f.className='nx4f';f.style.cssText='margin-top:10px;padding-top:10px;border-top:1px solid var(--line)';
var g=d.my_feedback;f.innerHTML='<div style="font-size:13px;margin-bottom:6px">'+(g?'Your feedback: '+(g.good?'\ud83d\udc4d Positive':'\ud83d\udc4e Negative')+
(g.comment?' \u00b7 '+esc(g.comment):''):'How was this trade with the '+(buy?'seller':'buyer')+'?')+'</div>'+(g?'':
'<input class="in" id="fbC" maxlength="200" placeholder="Comment (optional)" style="margin-bottom:6px"><div style="display:flex;gap:8px">'+
'<button class="btn" style="flex:1;height:38px;background:var(--upb);color:#fff" onclick="nxFb(true)">\ud83d\udc4d Positive</button>'+
'<button class="btn" style="flex:1;height:38px;background:var(--dnb);color:#fff" onclick="nxFb(false)">\ud83d\udc4e Negative</button></div>');
h.appendChild(f);}}
window.nxFb=function(good){var d=window.PODATA;if(!d)return;var c=q4('fbC')?q4('fbC').value:'';
sb.rpc('nx_p2p_feedback_give',{p_order:d.order.id,p_good:good,p_comment:c}).then(function(r){if(r.error){say(e4(r.error));return;}
say('Thank you for your feedback');d.my_feedback={good:good,comment:c};var x=q4('poHead').querySelector('.nx4f');if(x)x.remove();
var y=q4('poHead').querySelector('.nx4o');if(y)y.remove();var z=q4('poHead').querySelector('.nx4r');if(z)z.remove();enhOrder();});};
var ph=q4('poHead');if(ph)new MutationObserver(function(){setTimeout(enhOrder,0);}).observe(ph,{childList:true});

/* ---- routing ---- */
function route(){if((location.hash||'').slice(1)==='trader')trDraw();}
window.addEventListener('hashchange',function(){setTimeout(route,0);});
})();
