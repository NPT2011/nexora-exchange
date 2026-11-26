/* Nexora Pro tools: Copy trading, Spot Grid bot, API keys. Loaded after app.js and app2.js. */
(function(){
var P3={copy:1,bot:1,api:1},CTAB='lead',SHARE=0.1;
function q3(id){return document.getElementById(id);}
function n3(v,d){v=+v||0;return v.toLocaleString('en-US',{maximumFractionDigits:d==null?2:d});}
function px3(c){return T[c]&&+T[c].lastPrice?+T[c].lastPrice:null;}
function err3(e){return (e&&e.message)||String(e||'Something went wrong');}
function rpc3(fn,a){return sb.rpc(fn,a||{}).then(function(r){if(r.error)throw r.error;return r.data;});}
function login3(el){el.innerHTML='<div class="card"><div class="ct">Please log in</div><div style="font-size:13px;color:var(--mut2)">'+
'Log in to use this tool.</div><button class="btn gold" onclick="openAuth(\'in\')">Log in</button></div>';}
function usdt3(cb){sb.from('nx_wallets').select('balance').eq('account','spot').eq('asset','USDT').maybeSingle()
.then(function(r){cb(r.data?+r.data.balance:0);});}

/* ---------- pages ---------- */
var main=document.querySelector('.main');
function sec3(id,html){var s=document.createElement('section');s.className='pg';s.id='p-'+id;s.innerHTML=html;main.appendChild(s);}
sec3('bot','<h1 class="h1">Spot Grid Bot</h1>'+
'<div class="card" style="gap:6px"><div class="ct">How it works</div><div style="font-size:13px;color:var(--mut2);line-height:1.55">'+
'Choose a price range. The bot puts buy orders on grid lines below the price. When a buy fills, it sells one grid higher. '+
'When that sells, it buys again. Each buy-sell round keeps the difference as profit. Works best when price moves up and down inside your range.</div></div>'+
'<div class="card" id="bForm" style="gap:10px"></div><div class="sec">My bots</div><div id="bList"></div>');
sec3('copy','<h1 class="h1">Copy Trading</h1><div class="tabs" id="cTabs"><button class="tab on" data-t="lead">Lead traders</button>'+
'<button class="tab" data-t="my">My copies</button><button class="tab" data-t="be">Be a lead trader</button></div><div id="cBody"></div>');
sec3('api','<h1 class="h1">API keys</h1><div class="card" style="gap:6px"><div style="font-size:13px;color:var(--mut2);line-height:1.55">'+
'Connect your own trading robot to Nexora. API keys can <b style="color:var(--tx)">only read and trade</b>. '+
'They can never withdraw money. Keep your secret private.</div></div><div class="card" id="kForm" style="gap:10px"></div>'+
'<div id="kNew"></div><div class="sec">My keys</div><div id="kList"></div><div class="sec">How to connect</div><div class="card" id="kDocs" style="gap:8px"></div>');

/* ---------- GRID BOT ---------- */
function botForm(){var f=q3('bForm'),cs=COINS.filter(function(c){return T[c];});if(!cs.length)cs=HOT;
f.innerHTML='<label class="fl">Coin<select class="in" id="bCoin">'+cs.map(function(c){return '<option value="'+c+'">'+c+'/USDT</option>';}).join('')+
'</select></label><div class="irow"><span style="color:var(--mut2)">Price now</span><b id="bPx">—</b></div>'+
'<div class="g2"><label class="fl">Lower price<input class="in" id="bLo" inputmode="decimal"></label>'+
'<label class="fl">Upper price<input class="in" id="bUp" inputmode="decimal"></label></div>'+
'<button class="btn dark" id="bAuto" style="height:36px;font-size:13px">Auto range (±8%)</button>'+
'<div class="g2"><label class="fl">Grids (2–50)<input class="in" id="bGr" inputmode="numeric" value="10"></label>'+
'<label class="fl">Investment (USDT)<input class="in" id="bInv" inputmode="decimal"></label></div>'+
'<div style="font-size:12px;color:var(--mut2)">Available: <b id="bAv">—</b> USDT</div>'+
'<div id="bPrev" style="font-size:13px;color:var(--soft);line-height:1.6"></div>'+
'<button class="btn gold" id="bGo">Start bot</button>';
function auto(){var p=px3(q3('bCoin').value);if(!p)return;q3('bLo').value=+(p*0.92).toPrecision(6);q3('bUp').value=+(p*1.08).toPrecision(6);prev();}
function prev(){var c=q3('bCoin').value,p=px3(c),lo=+q3('bLo').value,up=+q3('bUp').value,g=parseInt(q3('bGr').value,10),inv=+q3('bInv').value;
q3('bPx').textContent=p?fp(p)+' USDT':'—';var o=q3('bPrev');
if(!(lo>0&&up>lo&&g>=2)){o.innerHTML='';return;}var nb=0;for(var i=0;i<g;i++)if(lo+(up-lo)*i/g<p)nb++;
var step=(up-lo)/g,pr=(step/lo*100-0.2);
o.innerHTML='Buy orders now: <b>'+nb+'</b>'+(inv>0&&nb?' · per grid: <b>'+n3(inv/nb)+' USDT</b>':'')+
'<br>Profit per round: about <b>'+(pr>0?pr.toFixed(2):'0')+'%</b> of each grid (after 0.1% fee on buy and sell)'+
(p&&(p<=lo||p>=up)?'<br><span style="color:var(--dn)">Price now must be between lower and upper price</span>':'');}
q3('bCoin').onchange=auto;q3('bAuto').onclick=auto;['bLo','bUp','bGr','bInv'].forEach(function(i){q3(i).oninput=prev;});
auto();usdt3(function(b){q3('bAv').textContent=n3(b);});
q3('bGo').onclick=function(){var b=this,c=q3('bCoin').value,p=px3(c);if(!p){say('Price not loaded yet');return;}
b.disabled=true;b.textContent='Starting...';
rpc3('nx_bot_start',{p_symbol:c,p_lower:+q3('bLo').value,p_upper:+q3('bUp').value,p_grids:parseInt(q3('bGr').value,10),
p_invest:+q3('bInv').value,p_ref:p}).then(function(r){say('Bot started: '+r.orders+' buy orders placed');botList();
usdt3(function(x){q3('bAv').textContent=n3(x);});}).catch(function(e){say(err3(e));}).then(function(){b.disabled=false;b.textContent='Start bot';});};}
function botList(){var l=q3('bList');rpc3('nx_bot_my').then(function(d){d=d||[];
if(!d.length){l.innerHTML='<div class="card" style="font-size:13px;color:var(--mut2)">No bots yet.</div>';return;}
l.innerHTML=d.map(function(b){var on=b.status==='running';return '<div class="card" style="gap:4px"><div style="display:flex;justify-content:space-between">'+
'<b>'+esc(b.symbol)+'/USDT · Grid</b><span style="font-size:12px;color:'+(on?'var(--up)':'var(--mut)')+'">'+(on?'Running':'Stopped')+'</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">Range</span><span>'+fp(b.lower_p)+' – '+fp(b.upper_p)+' · '+b.grids+' grids</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">Investment</span><span>'+n3(b.invest)+' USDT</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">Grid profit</span><b style="color:'+(+b.profit>=0?'var(--up)':'var(--dn)')+'">'+
n3(b.profit,4)+' USDT</b></div><div class="irow"><span style="color:var(--mut2)">Rounds done</span><span>'+b.rounds+
'</span></div><div class="irow"><span style="color:var(--mut2)">Open orders</span><span>'+b.open_orders+'</span></div>'+
(b.note?'<div style="font-size:12px;color:var(--dn)">'+esc(b.note)+'</div>':'')+
(on?'<button class="btn dark" style="height:38px;margin-top:6px" onclick="nxBotStop('+b.id+')">Stop bot</button>':'')+'</div>';}).join('');})
.catch(function(e){l.innerHTML='<div class="card">'+esc(err3(e))+'</div>';});}
window.nxBotStop=function(id){if(!confirm('Stop this bot? Open orders will be cancelled. Coins already bought stay in your Spot wallet.'))return;
rpc3('nx_bot_stop',{p_id:id}).then(function(){say('Bot stopped');botList();}).catch(function(e){say(err3(e));});};

/* ---------- COPY TRADING ---------- */
function copyPage(){q3('cTabs').querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.t===CTAB);});
var b=q3('cBody');b.innerHTML='<div class="card" style="color:var(--mut2);font-size:13px">Loading...</div>';
if(CTAB==='lead')return copyLeaders(b);if(!ME)return login3(b);if(CTAB==='my')return copyMy(b);copyBe(b);}
function how3(){return '<div class="card" style="gap:6px"><div class="ct">How copy trading works</div><div style="font-size:13px;color:var(--mut2);line-height:1.55">'+
'When the lead trader buys a coin, we buy the same coin for you with your <b style="color:var(--tx)">amount per trade</b>. '+
'When they sell, we sell the same part of your copied coins. When a copied sell makes you a profit, '+
'<b style="color:var(--tx)">'+Math.round(SHARE*100)+'% of that profit</b> goes to the lead trader. Nothing is paid on a loss. '+
'Your coins always stay in your own Spot wallet and you can stop any time.</div></div>';}
function copyLeaders(b){rpc3('nx_copy_leaders_list').then(function(l){l=l||[];
b.innerHTML=how3()+(l.length?l.map(function(x,i){return '<div class="card" style="gap:4px"><div style="display:flex;justify-content:space-between;align-items:center">'+
'<b style="font-size:16px">'+esc(x.nick)+'</b><span style="font-size:12px;color:var(--mut2)">'+esc(x.uid)+'</span></div>'+
(x.bio?'<div style="font-size:13px;color:var(--soft)">'+esc(x.bio)+'</div>':'')+
'<div class="irow"><span style="color:var(--mut2)">Followers</span><span>'+x.followers+'</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">Followers\' total profit</span><b style="color:'+(+x.follower_profit>=0?'var(--up)':'var(--dn)')+'">'+
n3(x.follower_profit,4)+' USDT</b></div><div class="irow"><span style="color:var(--mut2)">Trades (30 days)</span><span>'+x.trades_30d+'</span></div>'+
'<div id="cf'+i+'"></div><button class="btn gold" style="height:40px;margin-top:6px" onclick="nxCopyOpen('+i+',\''+esc(x.uid)+'\')">Copy</button></div>';}).join('')
:'<div class="card" style="font-size:13px;color:var(--mut2)">No lead traders yet. Be the first: open "Be a lead trader".</div>');})
.catch(function(e){b.innerHTML='<div class="card">'+esc(err3(e))+'</div>';});}
window.nxCopyOpen=function(i,uid){if(!need())return;var d=q3('cf'+i);if(d.innerHTML){d.innerHTML='';return;}
d.innerHTML='<div class="g2" style="margin-top:6px"><label class="fl">Amount per trade (USDT)<input class="in" id="cp'+i+'" inputmode="decimal" value="10"></label>'+
'<label class="fl">Total budget (USDT)<input class="in" id="cb'+i+'" inputmode="decimal" value="100"></label></div>'+
'<div style="font-size:12px;color:var(--mut2);margin-top:4px">Budget = the most USDT this copy can have in coins at one time.</div>'+
'<button class="btn dark" style="height:38px;margin-top:6px" onclick="nxCopyGo('+i+',\''+uid+'\')">Start copying</button>';};
window.nxCopyGo=function(i,uid){rpc3('nx_copy_follow',{p_uid:uid,p_per_trade:+q3('cp'+i).value,p_budget:+q3('cb'+i).value})
.then(function(){say('Copy started');CTAB='my';copyPage();}).catch(function(e){say(err3(e));});};
function copyMy(b){rpc3('nx_copy_my').then(function(d){SHARE=+d.share||SHARE;var f=d.follows||[];
b.innerHTML=(f.length?f.map(function(x){var on=x.status==='active';return '<div class="card" style="gap:4px"><div style="display:flex;justify-content:space-between">'+
'<b>'+esc(x.nick)+' <span style="font-weight:400;font-size:12px;color:var(--mut2)">'+esc(x.uid)+'</span></b><span style="font-size:12px;color:'+
(on?'var(--up)':'var(--mut)')+'">'+(on?'Copying':'Stopped')+'</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">Per trade / budget</span><span>'+n3(x.per_trade)+' / '+n3(x.budget)+' USDT</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">My profit</span><b style="color:'+(+x.profit>=0?'var(--up)':'var(--dn)')+'">'+n3(x.profit,4)+' USDT</b></div>'+
'<div class="irow"><span style="color:var(--mut2)">Paid to lead trader</span><span>'+n3(x.shared,4)+' USDT</span></div>'+
((x.pos||[]).length?'<div style="font-size:12px;color:var(--mut2)">Holding: '+x.pos.map(function(p){return n3(p.qty,6)+' '+esc(p.symbol);}).join(', ')+'</div>':'')+
(on?'<button class="btn dark" style="height:38px;margin-top:6px" onclick="nxCopyStop('+x.id+')">Stop copying</button>':'')+'</div>';}).join('')
:'<div class="card" style="font-size:13px;color:var(--mut2)">You are not copying anyone yet. Open "Lead traders" and tap Copy.</div>')+
((d.log||[]).length?'<div class="sec">Activity</div><div class="card" style="gap:2px">'+d.log.map(function(g){
return '<div class="irow" style="font-size:12.5px"><span>'+esc(g.kind==='profit'?'Profit · '+g.note:g.kind==='copy'?'Copied · '+g.note:g.kind==='skip'?'Skipped · '+g.note:'Not copied · '+g.note)+
'</span><span style="color:var(--mut2)">'+(g.kind==='profit'?n3(g.profit,4)+' USDT':new Date(g.created_at).toLocaleString())+'</span></div>';}).join('')+'</div>':'');})
.catch(function(e){b.innerHTML='<div class="card">'+esc(err3(e))+'</div>';});}
window.nxCopyStop=function(id){if(!confirm('Stop copying? Waiting copy orders will be cancelled. Your coins stay in your wallet.'))return;
rpc3('nx_copy_stop',{p_id:id}).then(function(){say('Copy stopped');copyPage();}).catch(function(e){say(err3(e));});};
function copyBe(b){rpc3('nx_copy_my').then(function(d){SHARE=+d.share||SHARE;var m=d.me;
b.innerHTML='<div class="card" style="gap:6px"><div class="ct">Earn as a lead trader</div><div style="font-size:13px;color:var(--mut2);line-height:1.55">'+
'Anyone can be a lead trader. Your Spot trades (website and API) are copied by your followers. '+
'You get <b style="color:var(--tx)">'+Math.round(SHARE*100)+'%</b> of the profit your followers make from your trades. Bot trades are not copied.</div></div>'+
(m&&m.active?'<div class="card" style="gap:4px"><div class="irow"><span style="color:var(--mut2)">Nickname</span><b>'+esc(m.nick)+'</b></div>'+
'<div class="irow"><span style="color:var(--mut2)">Followers</span><span>'+m.followers+'</span></div>'+
'<div class="irow"><span style="color:var(--mut2)">Earned</span><b style="color:var(--up)">'+n3(m.earned,4)+' USDT</b></div>'+
'<button class="btn dark" style="height:38px;margin-top:6px" onclick="nxLeadStop()">Stop being a lead trader</button></div>':'')+
'<div class="card" style="gap:10px"><label class="fl">Nickname (3–24 letters)<input class="in" id="lNick" maxlength="24" value="'+esc(m?m.nick:'')+'"></label>'+
'<label class="fl">About you (optional)<input class="in" id="lBio" maxlength="200" value="'+esc(m?m.bio||'':'')+'"></label>'+
'<button class="btn gold" onclick="nxLeadGo()">'+(m&&m.active?'Save':'Become a lead trader')+'</button></div>';})
.catch(function(e){b.innerHTML='<div class="card">'+esc(err3(e))+'</div>';});}
window.nxLeadGo=function(){rpc3('nx_copy_become',{p_nick:q3('lNick').value,p_bio:q3('lBio').value})
.then(function(){say('You are a lead trader');copyPage();}).catch(function(e){say(err3(e));});};
window.nxLeadStop=function(){if(!confirm('Stop being a lead trader? New trades will not be copied.'))return;
rpc3('nx_copy_leave').then(function(){say('Stopped');copyPage();}).catch(function(e){say(err3(e));});};
q3('cTabs').onclick=function(e){var t=e.target.closest('.tab');if(t){CTAB=t.dataset.t;copyPage();}};

/* ---------- API KEYS ---------- */
function apiPage(){var f=q3('kForm');q3('kNew').innerHTML='';
f.innerHTML='<div class="ct">Create a new key</div><label class="fl">Name<input class="in" id="kLab" maxlength="30" placeholder="My bot"></label>'+
'<label class="fl">Allowed IPs (optional, comma separated)<input class="in" id="kIps" placeholder="e.g. 203.0.113.5"></label>'+
'<label style="display:flex;gap:8px;align-items:center;font-size:13px"><input type="checkbox" id="kTr" checked> Allow spot trading (no withdrawals ever)</label>'+
'<button class="btn gold" id="kGo">Create API key</button><div style="font-size:12px;color:var(--mut2)">Google Authenticator (2FA) must be on.</div>';
q3('kGo').onclick=function(){var b=this;b.disabled=true;rpc3('nx_api_key_create',{p_label:q3('kLab').value,p_trade:q3('kTr').checked,p_ips:q3('kIps').value})
.then(function(r){q3('kNew').innerHTML='<div class="card" style="gap:8px;border-color:var(--gold)"><div class="ct" style="color:var(--gold)">Save your secret now</div>'+
'<div style="font-size:12.5px;color:var(--mut2)">The secret is shown only once. If you lose it, delete the key and make a new one.</div>'+
'<label class="fl">API key<div style="display:flex;gap:6px"><input class="in" readonly value="'+esc(r.api_key)+'"><button class="btn dark" style="width:70px" onclick="cp(\''+esc(r.api_key)+'\')">Copy</button></div></label>'+
'<label class="fl">Secret<div style="display:flex;gap:6px"><input class="in" readonly value="'+esc(r.secret)+'"><button class="btn dark" style="width:70px" onclick="cp(\''+esc(r.secret)+'\')">Copy</button></div></label></div>';
q3('kLab').value='';q3('kIps').value='';keyList();}).catch(function(e){var m=err3(e);say(m);
if(/2FA|Authenticator/.test(m))q3('kNew').innerHTML='<div class="card"><div style="font-size:13px">'+esc(m)+'</div><button class="btn dark" onclick="go(\'2fa\')">Open 2FA settings</button></div>';})
.then(function(){b.disabled=false;});};
keyList();apiDocs();}
function keyList(){var l=q3('kList');rpc3('nx_api_key_list').then(function(d){d=d||[];
l.innerHTML=d.length?d.map(function(k){return '<div class="card" style="gap:4px"><div style="display:flex;justify-content:space-between"><b>'+esc(k.label)+'</b>'+
'<span style="font-size:12px;color:var(--mut2)">'+(k.can_trade?'Read + trade':'Read only')+'</span></div>'+
'<div style="font-size:12px;word-break:break-all;color:var(--soft)">'+esc(k.api_key)+'</div>'+
'<div style="font-size:12px;color:var(--mut2)">'+(k.ips?'IPs: '+esc(k.ips)+' · ':'')+'Last used: '+(k.last_used?new Date(k.last_used).toLocaleString():'never')+'</div>'+
'<button class="btn dark" style="height:36px;margin-top:4px" onclick="nxKeyDel('+k.id+')">Delete</button></div>';}).join('')
:'<div class="card" style="font-size:13px;color:var(--mut2)">No API keys yet.</div>';}).catch(function(e){l.innerHTML='<div class="card">'+esc(err3(e))+'</div>';});}
window.nxKeyDel=function(id){if(!confirm('Delete this API key? Robots using it will stop.'))return;
rpc3('nx_api_key_delete',{p_id:id}).then(function(){say('Key deleted');keyList();}).catch(function(e){say(err3(e));});};
function apiDocs(){var u=SB_URL+'/rest/v1/rpc/nx_api',pre='style="white-space:pre-wrap;word-break:break-all;font-size:11.5px;background:var(--bg);padding:10px;border-radius:10px;margin:0;color:var(--soft)"';
q3('kDocs').innerHTML='<div style="font-size:13px;color:var(--mut2);line-height:1.55">Send a POST request to:</div><pre '+pre+'>'+esc(u)+'</pre>'+
'<div style="font-size:13px;color:var(--mut2);line-height:1.55">Headers: <b style="color:var(--tx)">apikey</b> (below) and Content-Type: application/json. '+
'Body: api_key, ts (time in milliseconds), cmd, params, signature. '+
'signature = HMAC-SHA256 of <b style="color:var(--tx)">ts + cmd + params</b> with your secret (hex).</div><pre '+pre+'>apikey: '+esc(SB_KEY)+'</pre>'+
'<div style="font-size:13px;color:var(--mut2)">Commands: time, account, ticker, book, open_orders, order_status, order, cancel</div>'+
'<pre '+pre+'>order       symbol=BTC&amp;side=buy&amp;type=limit&amp;price=60000&amp;qty=0.001\norder       symbol=BTC&amp;side=buy&amp;type=market&amp;total=20\norder       symbol=BTC&amp;side=sell&amp;type=market&amp;qty=0.001\ncancel      id=123\norder_status id=123\nopen_orders symbol=BTC\nticker      symbol=BTC\nbook        symbol=BTC</pre>'+
'<div style="font-size:13px;color:var(--mut2)">Python example:</div><pre '+pre+'>'+esc('import time, hmac, hashlib, requests\n'+
'URL = "'+u+'"\nHEAD = {"apikey": "'+SB_KEY+'", "Content-Type": "application/json"}\nKEY = "nxk_..."\nSECRET = "..."\n\n'+
'def nexora(cmd, params=""):\n    ts = int(time.time() * 1000)\n    msg = (str(ts) + cmd + params).encode()\n'+
'    sig = hmac.new(SECRET.encode(), msg, hashlib.sha256).hexdigest()\n'+
'    body = {"api_key": KEY, "ts": ts, "cmd": cmd, "params": params, "signature": sig}\n'+
'    return requests.post(URL, json=body, headers=HEAD).json()\n\nprint(nexora("account"))\n'+
'print(nexora("order", "symbol=BTC&side=buy&type=limit&price=60000&qty=0.001"))')+'</pre>'+
'<div style="font-size:12px;color:var(--mut2)">Limits: 120 requests per minute per key. Each request needs a bigger ts than the last one and must be within 30 seconds of server time.</div>';}

/* ---------- routing + hooks ---------- */
function route(){var p=(location.hash||'').slice(1);if(!P3[p])return;
if(p==='copy'){copyPage();return;}var box=q3(p==='bot'?'bForm':'kForm');
if(!ME){login3(box);if(p==='bot')q3('bList').innerHTML='';else{q3('kList').innerHTML='';q3('kNew').innerHTML='';apiDocs();}return;}
if(p==='bot'){botForm();botList();}else apiPage();}
window.addEventListener('hashchange',function(){setTimeout(route,0);});
if(sb)sb.auth.onAuthStateChange(function(){setTimeout(route,600);});
function hook(){document.querySelectorAll('#p-trade .tabs .tab').forEach(function(b){var t=b.textContent.trim();
if(t==='Bot')b.onclick=function(){go('bot');};if(t==='Copy')b.onclick=function(){go('copy');};});
document.querySelectorAll('#p-account .li').forEach(function(b){var t=b.textContent.trim();
if(t.indexOf('API keys')===0)b.onclick=function(){go('api');};if(t==='Copy trading')b.onclick=function(){go('copy');};
if(t==='Trading bot')b.onclick=function(){go('bot');};});
document.querySelectorAll('#dmenu .di').forEach(function(b){var t=b.textContent.trim();
if(t==='Copy trading')b.dataset.g='copy';if(t==='Trading bot')b.dataset.g='bot';if(t==='API keys')b.dataset.g='api';});}
var sbx=q3('supBox');if(sbx){sbx.setAttribute('translate','no');sbx.classList.add('notranslate');}
hook();sb.from('nx_pro_settings').select('copy_share').maybeSingle().then(function(r){if(r.data)SHARE=+r.data.copy_share;});
if(P3[(location.hash||'').slice(1)]){show();setTimeout(route,800);}
})();
