/* Nexora admin: Market maker + fee account. Loaded after the main admin script. */
(function(){
var tabs=$('tabs');if(!tabs)return;
var b=document.createElement('button');b.className='tab';b.dataset.t='mm';b.textContent='Market maker';tabs.appendChild(b);
tabs.addEventListener('click',function(e){var t=e.target.closest('.tab');if(!t||t.dataset.t!=='mm')return;
e.stopImmediatePropagation();TAB='mm';tabs.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===t);});
clearInterval(SUPTM);vMM();},true);
function pc(v){return (+v*100).toFixed(2);}
window.vMM=function(){$('view').innerHTML='<div class="k">Loading\u2026</div>';rpc('nx_admin_mm').then(function(d){var s=d.settings||{},f=d.fee||{};
var coins=d.coins||[],tot=0;coins.forEach(function(c){tot+=+c.pos_usdt||0;});
$('view').innerHTML=
'<div class="card"><div class="bn" style="font-size:15px">Fee account (all trading fees, USDT)</div>'+
'<div class="row" style="justify-content:space-between;margin-top:6px"><span class="k">Account</span><b>'+esc(f.uid||'not set')+'</b></div>'+
'<div class="row" style="justify-content:space-between"><span class="k">USDT now in this account</span><b style="color:var(--up)">'+num(f.balance)+'</b></div>'+
'<div class="row" style="justify-content:space-between"><span class="k">All USDT fees so far</span><b>'+num(f.total)+'</b></div>'+
'<div class="k" style="margin:6px 0">Fees land in this account\'s Spot wallet. Log in to it and withdraw USDT (BEP20) to your own fee wallet.</div>'+
'<div class="row"><input class="in" id="feeUid" placeholder="Change to UID (e.g. NX006706)" style="flex:1"><button class="btn dark" onclick="mmFee()">Change</button></div></div>'+
'<div class="card"><div class="row" style="justify-content:space-between"><div class="bn" style="font-size:15px">Market maker</div>'+
(s.enabled?'<span class="pill g1">ON</span>':'<span class="pill r1">OFF</span>')+'</div>'+
'<div class="k" style="margin:6px 0">Puts real buy and sell orders near the Binance price on the top coins, so users can trade at once. '+
'It pays no fee. It never makes fake trades. It stops buying or selling a coin when it reaches the limit below.</div>'+
'<div class="row" style="justify-content:space-between"><span class="k">Last run</span><span>'+(s.last_run?dt(s.last_run):'\u2014')+'</span></div>'+
(s.last_error?'<div class="k" style="color:var(--dn)">'+esc(s.last_error)+'</div>':'')+
'<div class="row" style="justify-content:space-between"><span class="k">Open orders \u00b7 trades 24h</span><span>'+d.open_orders+' \u00b7 '+d.trades_24h+'</span></div>'+
'<div class="row" style="justify-content:space-between"><span class="k">USDT earned / spent by market maker</span><b>'+num(d.usdt_real)+'</b></div>'+
'<div class="row" style="justify-content:space-between"><span class="k">Coins held (+) or owed (\u2212), in USDT</span><b style="color:'+(tot<0?'var(--dn)':'var(--up)')+'">'+tot.toFixed(2)+'</b></div>'+
'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">'+
'<label class="fl">Spread % (each side)<input class="in" id="mSp" value="'+pc(s.spread)+'"></label>'+
'<label class="fl">Limit per coin (USDT)<input class="in" id="mCap" value="'+(+s.cap_usdt)+'"></label>'+
'<label class="fl">Orders each side (1\u20135)<input class="in" id="mLv" value="'+s.levels+'"></label>'+
'<label class="fl">Top coins (1\u2013300)<input class="in" id="mN" value="'+s.coins_n+'"></label>'+
'<label class="fl">Min daily volume on Binance (USDT)<input class="in" id="mVol" value="'+(+s.min_vol)+'"></label>'+
'<label class="fl" style="justify-content:flex-end"><span><input type="checkbox" id="mOn"'+(s.enabled?' checked':'')+'> Market maker ON</span>'+
'<span><input type="checkbox" id="mRef"> Reload coin list now</span></label></div>'+
'<button class="btn gold" style="margin-top:10px;width:100%" onclick="mmSave()">Save</button></div>'+
'<div class="card"><div class="bn" style="font-size:15px">Record a hedge (after you buy or sell on Binance)</div>'+
'<div class="k" style="margin:6px 0">If the market maker owes a coin (\u2212), buy that coin on Binance and enter it here: coin amount and USDT paid. '+
'If it holds extra coin (+) and you sold it on Binance, enter minus numbers (e.g. -0.01 and -600).</div>'+
'<div class="row"><input class="in" id="hA" placeholder="Coin (BTC)" style="width:90px"><input class="in" id="hQ" placeholder="Coin amount" style="flex:1">'+
'<input class="in" id="hU" placeholder="USDT" style="flex:1"><button class="btn dark" onclick="mmHedge()">Save</button></div></div>'+
'<div class="card"><div class="bn" style="font-size:15px">Coins ('+coins.length+')</div>'+coins.map(function(c){
return '<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line)"><span><b>'+esc(c.symbol)+'</b> '+
(c.enabled&&c.listed?'':'<span class="pill r1">off</span>')+'<span class="k"> '+(c.last_mid?num(c.last_mid):'\u2014')+' \u00b7 '+c.placed+' orders</span>'+
(c.note?'<br><span class="k" style="color:var(--dn)">'+esc(c.note)+'</span>':'')+'</span><span style="text-align:right"><b style="color:'+
(+c.pos_usdt<0?'var(--dn)':+c.pos_usdt>0?'var(--up)':'var(--tx)')+'">'+(+c.pos_usdt).toFixed(2)+'</b> <span class="k">USDT</span><br>'+
'<button class="btn dark" style="height:28px;font-size:12px;margin-top:3px" onclick="mmCoin(\''+esc(c.symbol)+'\','+(!c.enabled)+')">'+(c.enabled?'Turn off':'Turn on')+'</button></span></div>';}).join('')+'</div>';});};
window.mmSave=function(){rpc('nx_admin_mm_set',{p:{enabled:$('mOn').checked,spread:(+$('mSp').value)/100,cap_usdt:+$('mCap').value,
levels:parseInt($('mLv').value,10),coins_n:parseInt($('mN').value,10),min_vol:+$('mVol').value,refresh:$('mRef').checked}})
.then(function(){say('Saved. Changes start within 30 seconds.');vMM();});};
window.mmCoin=function(s,on){rpc('nx_admin_mm_coin',{p_symbol:s,p_enabled:on,p_cap:null}).then(function(){say('Saved');vMM();});};
window.mmHedge=function(){var a=$('hA').value,q=+$('hQ').value,u=+$('hU').value;if(!confirm('Record hedge: '+q+' '+a+' for '+u+' USDT?'))return;
rpc('nx_admin_mm_hedge',{p_asset:a,p_qty:q,p_usdt:u}).then(function(){say('Hedge saved');vMM();});};
window.mmFee=function(){var u=$('feeUid').value.trim();if(!u)return;if(!confirm('Send all future trading fees to '+u+'?'))return;
rpc('nx_admin_fee_account',{p_uid:u}).then(function(){say('Fee account changed');vMM();});};
})();
