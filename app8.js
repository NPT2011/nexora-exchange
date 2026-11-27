/* Nexora - Notification bell (add-on). Shows updates for KYC, deposits, withdrawals,
   P2P orders, spot orders, referral earnings and support replies. Read-only. */
(function(){
var css='.nb-dot{position:absolute;top:4px;right:4px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#FF4D5E;color:#fff;font-size:10.5px;font-weight:700;display:none;align-items:center;justify-content:center;line-height:1;border:2px solid #0B1224}'+
'#nbPanel{position:fixed;inset:0;z-index:9999;display:none;background:rgba(3,8,20,.6)}#nbPanel.on{display:block}'+
'#nbBox{position:absolute;top:0;right:0;width:100%;max-width:440px;height:100%;background:#0E1830;display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,0,0,.5)}'+
'#nbHd{display:flex;align-items:center;gap:8px;padding:16px;border-bottom:1px solid #1E3354}#nbHd b{flex:1;font-size:18px;color:#E8EDF7}'+
'#nbHd button{background:#1A2A4A;color:#E6B450;border:0;border-radius:10px;height:34px;padding:0 12px;font-size:12.5px;font-weight:600}'+
'#nbHd .x{background:transparent;color:#9AA9C4;font-size:24px;padding:0 6px}'+
'#nbTabs{display:flex;gap:6px;padding:10px 16px;overflow-x:auto;border-bottom:1px solid #1E3354}#nbTabs button{flex:none;background:#14223F;color:#9AA9C4;border:0;border-radius:16px;height:30px;padding:0 12px;font-size:12.5px}'+
'#nbTabs button.on{background:#E6B450;color:#0B1224;font-weight:700}'+
'#nbList{flex:1;overflow-y:auto;padding:4px 0}.nb-i{display:flex;gap:12px;padding:13px 16px;border-bottom:1px solid #16264A;cursor:pointer}'+
'.nb-i.new{background:rgba(230,180,80,.06)}.nb-ic{flex:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;background:#14223F}'+
'.nb-t{flex:1;min-width:0}.nb-t b{display:block;font-size:14px;color:#E8EDF7}.nb-t span{display:block;font-size:12.5px;color:#9AA9C4;margin-top:3px;line-height:1.45;word-break:break-word}'+
'.nb-t small{display:block;font-size:11px;color:#6B7A99;margin-top:4px}.nb-i.new .nb-t b:after{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#E6B450;margin-left:7px;vertical-align:middle}'+
'.nb-e{padding:40px 20px;text-align:center;color:#9AA9C4;font-size:13.5px}';
var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);

function E(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function N(v,d){return Number(v||0).toLocaleString('en-US',{maximumFractionDigits:d==null?4:d});}
function client(){try{return (typeof sb!=='undefined'&&sb)?sb:null;}catch(e){return null;}}
function me(){try{return (typeof ME!=='undefined'&&ME)?ME:null;}catch(e){return null;}}
function nav(p){try{if(typeof go==='function')go(p);else location.hash=p;}catch(e){}}
var ITEMS=[],TAB='all',UID=null,BUSY=0;
function seenKey(){return 'nx_nb_seen_'+(UID||'x');}
function getSeen(){try{return JSON.parse(localStorage.getItem(seenKey())||'null');}catch(e){return null;}}
function setSeen(o){try{localStorage.setItem(seenKey(),JSON.stringify(o));}catch(e){}}

/* ---------- collect ---------- */
function add(L,key,cat,ic,title,text,t,page){L.push({k:key,c:cat,ic:ic,ti:title,tx:text,t:t?new Date(t).getTime():0,p:page});}
function collect(){var c=client(),u=me();if(!c||!u)return Promise.resolve([]);var id=u.id,L=[];
var q=function(p){return p.then(function(r){return r&&!r.error?(r.data||[]):[];},function(){return [];});};
return Promise.all([
 q(c.from('nx_kyc').select('id,status,note,created_at,reviewed_at').order('id',{ascending:false}).limit(10)),
 q(c.from('nx_deposits').select('id,asset,network,amount,status,admin_note,created_at,decided_at').order('id',{ascending:false}).limit(30)),
 q(c.from('nx_withdrawals').select('id,asset,network,amount,receive,status,admin_note,created_at,decided_at').order('id',{ascending:false}).limit(30)),
 q(c.from('nx_p2p_orders').select('id,buyer,seller,asset,fiat,qty,fiat_amount,status,cancel_reason,created_at,paid_at,done_at').or('buyer.eq.'+id+',seller.eq.'+id).order('id',{ascending:false}).limit(30)),
 q(c.from('nx_orders').select('id,symbol,side,filled,filled_quote,status,updated_at').eq('status','filled').order('id',{ascending:false}).limit(20)),
 q(c.from('nx_ref_earn').select('id,amount,created_at').order('id',{ascending:false}).limit(30)),
 supMsgs()
]).then(function(r){
 r[0].forEach(function(k){
  if(k.status==='approved')add(L,'kyc'+k.id+'a','acc','✅','KYC approved','Your identity is verified. You can now withdraw and use all features.',k.reviewed_at||k.created_at,'kyc');
  else if(k.status==='rejected')add(L,'kyc'+k.id+'r','acc','❌','KYC rejected',(k.note?E(k.note)+' ':'')+'Please submit again with correct details.',k.reviewed_at||k.created_at,'kyc');
  else add(L,'kyc'+k.id+'p','acc','🕒','KYC submitted','Your documents were received. Our team will check them, usually within 24 hours.',k.created_at,'kyc');});
 r[1].forEach(function(d){var a=N(d.amount)+' '+E(d.asset)+' ('+E(d.network)+')';
  if(d.status==='approved')add(L,'dep'+d.id+'a','fund','💰','Deposit credited',a+' was added to your wallet.',d.decided_at||d.created_at,'history');
  else if(d.status==='rejected')add(L,'dep'+d.id+'r','fund','❌','Deposit rejected',a+(d.admin_note?' · '+E(d.admin_note):''),d.decided_at||d.created_at,'history');
  else if(d.status==='hold')add(L,'dep'+d.id+'h','fund','⚠️','Deposit on hold',a+(d.admin_note?' · '+E(d.admin_note):' · Please check your history.'),d.decided_at||d.created_at,'history');
  else add(L,'dep'+d.id+'p','fund','📥','Deposit received',a+' is being checked.',d.created_at,'history');});
 r[2].forEach(function(w){var a=N(w.amount)+' '+E(w.asset)+' ('+E(w.network)+')';
  if(w.status==='approved')add(L,'wd'+w.id+'a','fund','📤','Withdrawal sent',N(w.receive)+' '+E(w.asset)+' was sent to your address.',w.decided_at||w.created_at,'history');
  else if(w.status==='rejected')add(L,'wd'+w.id+'r','fund','❌','Withdrawal rejected',a+' was returned to your wallet.'+(w.admin_note?' '+E(w.admin_note):''),w.decided_at||w.created_at,'history');
  else if(w.status==='hold')add(L,'wd'+w.id+'h','fund','⚠️','Withdrawal on hold',a+(w.admin_note?' · '+E(w.admin_note):''),w.decided_at||w.created_at,'history');
  else add(L,'wd'+w.id+'p','fund','🕒','Withdrawal requested',a+' is being processed.',w.created_at,'history');});
 r[3].forEach(function(o){var buy=o.buyer===id,a=N(o.qty)+' '+E(o.asset)+' · '+N(o.fiat_amount,2)+' '+E(o.fiat),t='P2P order #'+o.id;
  add(L,'p2p'+o.id+'n','p2p','🤝',buy?'P2P buy order created':'New P2P order',a+(buy?' · Please pay the seller.':' · Wait for the buyer to pay.'),o.created_at,'p2pmy');
  if(o.paid_at)add(L,'p2p'+o.id+'p','p2p','💸',buy?'You marked as paid':'Buyer marked as paid',t+' · '+a+(buy?'':' · Check your account and release.'),o.paid_at,'p2pmy');
  if(o.status==='completed')add(L,'p2p'+o.id+'c','p2p','✅',t+' completed',buy?a+' added to your wallet.':a+' released.',o.done_at||o.paid_at||o.created_at,'p2pmy');
  else if(o.status==='cancelled')add(L,'p2p'+o.id+'x','p2p','❌',t+' cancelled',a+(o.cancel_reason?' · '+E(o.cancel_reason):''),o.done_at||o.created_at,'p2pmy');
  else if(o.status==='appeal')add(L,'p2p'+o.id+'ap','p2p','⚖️',t+' in appeal','Support is checking this order.',o.done_at||o.paid_at||o.created_at,'p2pmy');});
 r[4].forEach(function(o){add(L,'ord'+o.id+'f','trade','📈',(o.side==='buy'?'Buy':'Sell')+' order filled',N(o.filled)+' '+E(o.symbol)+' · '+N(o.filled_quote,2)+' USDT',o.updated_at,'trade');});
 r[5].forEach(function(x){add(L,'ref'+x.id,'ref','🎁','Referral reward','+'+N(x.amount,6)+' USDT from your friend\'s trade.',x.created_at,'ref');});
 r[6].forEach(function(m){add(L,'sup'+m.id,'acc','💬','Support replied',E(String(m.body||'').slice(0,140)),m.at,'chat');});
 L.sort(function(a,b){return b.t-a.t;});return L.slice(0,120);});}
function supMsgs(){var c=client(),t=null;try{t=localStorage.getItem('nx_sup');}catch(e){}
 if(!c||!t)return Promise.resolve([]);/* only for a chat the user already opened */
 return c.rpc('nx_sup_get',{p_token:t,p_after:0}).then(function(r){var d=r&&!r.error?r.data:null;
  return d&&d.messages?d.messages.filter(function(m){return m.from==='agent';}):[];},function(){return [];});}

/* ---------- bell ---------- */
function bell(){return document.querySelector('button[aria-label="Notifications"]');}
function badge(){var b=bell();if(!b)return;b.style.position='relative';var d=b.querySelector('.nb-dot');
 if(!d){d=document.createElement('span');d.className='nb-dot';b.appendChild(d);}
 var seen=getSeen()||{},n=ITEMS.filter(function(i){return !seen[i.k];}).length;d.textContent=n>99?'99+':n;d.style.display=n?'flex':'none';}
function refresh(){var u=me();if(!u){ITEMS=[];UID=null;badge();return;}if(BUSY)return;BUSY=1;UID=u.id;
 collect().then(function(L){BUSY=0;ITEMS=L;var seen=getSeen();
  if(!seen){seen={};var old=Date.now()-3*86400000;L.forEach(function(i){if(i.t<old)seen[i.k]=1;});setSeen(seen);}
  badge();if(panel().classList.contains('on'))draw();},function(){BUSY=0;});}

/* ---------- panel ---------- */
function panel(){var p=document.getElementById('nbPanel');if(p)return p;p=document.createElement('div');p.id='nbPanel';
 p.innerHTML='<div id="nbBox" role="dialog" aria-label="Notifications"><div id="nbHd"><b>Notifications</b><button type="button" id="nbAll">Mark all as read</button><button type="button" class="x" id="nbX" aria-label="Close">&times;</button></div>'+
 '<div id="nbTabs"></div><div id="nbList"></div></div>';document.body.appendChild(p);
 p.addEventListener('click',function(e){if(e.target===p)close();});
 p.querySelector('#nbX').onclick=close;
 p.querySelector('#nbAll').onclick=function(){var s=getSeen()||{};ITEMS.forEach(function(i){s[i.k]=1;});setSeen(s);badge();draw();};
 return p;}
var CATS=[['all','All'],['fund','Deposit & Withdraw'],['p2p','P2P'],['trade','Trades'],['ref','Referral'],['acc','Account']];
function draw(){var p=panel(),seen=getSeen()||{};
 p.querySelector('#nbTabs').innerHTML=CATS.map(function(c){return '<button type="button" data-c="'+c[0]+'" class="'+(TAB===c[0]?'on':'')+'">'+c[1]+'</button>';}).join('');
 p.querySelector('#nbTabs').onclick=function(e){var b=e.target.closest('[data-c]');if(!b)return;TAB=b.dataset.c;draw();};
 var l=ITEMS.filter(function(i){return TAB==='all'||i.c===TAB;}),box=p.querySelector('#nbList');
 if(!me()){box.innerHTML='<div class="nb-e">Log in to see your notifications.</div>';return;}
 box.innerHTML=l.length?l.map(function(i,n){return '<div class="nb-i'+(seen[i.k]?'':' new')+'" data-n="'+ITEMS.indexOf(i)+'"><div class="nb-ic">'+i.ic+'</div><div class="nb-t"><b>'+E(i.ti)+'</b><span>'+i.tx+'</span><small>'+(i.t?new Date(i.t).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'')+'</small></div></div>';}).join(''):
  '<div class="nb-e">No notifications yet.</div>';
 box.onclick=function(e){var r=e.target.closest('[data-n]');if(!r)return;var i=ITEMS[+r.dataset.n];if(!i)return;var s=getSeen()||{};s[i.k]=1;setSeen(s);badge();close();
  if(i.p==='chat'){try{if(typeof supOpen==='function')supOpen();}catch(x){}}else if(i.p==='ref'){nav('ref');}else nav(i.p);};}
function open(){if(!me()){try{if(typeof openAuth==='function'){openAuth('in');return;}}catch(e){}}panel().classList.add('on');draw();refresh();}
function close(){panel().classList.remove('on');}

function hook(){var b=bell();if(b&&!b._nb){b._nb=1;b.removeAttribute('onclick');b.onclick=function(e){e.preventDefault();e.stopPropagation();open();};}badge();}
hook();setInterval(hook,1500);
setTimeout(refresh,2500);setInterval(function(){if(document.visibilityState==='visible')refresh();},30000);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')refresh();});
var lastU=null;setInterval(function(){var u=me(),k=u?u.id:null;if(k!==lastU){lastU=k;refresh();}},2000);
})();
