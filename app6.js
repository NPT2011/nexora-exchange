/* Nexora P2P: Binance-style release flow. Loaded after app2.js and app4.js. */
(function(){
function q6(i){return document.getElementById(i);}
function n6(v,d){return (+v||0).toLocaleString('en-US',{minimumFractionDigits:d==null?2:0,maximumFractionDigits:d==null?2:d});}
function x6(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function c6(t){try{navigator.clipboard.writeText(String(t));say('Copied');}catch(e){say(String(t));}}
window.nx6cp=c6;

var css='.n6-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;'+
'background:var(--card2);border:1px solid var(--line)}.n6-bar small{display:block;font-size:12px;color:var(--mut2)}'+
'.n6-bar b{font-size:14px}.n6-yb{flex:none;height:36px;padding:0 14px;border:0;border-radius:9px;background:#F0C94A;color:#0B1426;'+
'font-weight:700;font-size:13.5px;cursor:pointer}'+
'.n6-st{display:flex;gap:12px}.n6-st .n{flex:none;width:28px;height:28px;border-radius:8px;background:#0B1426;border:1.5px solid var(--gold);'+
'color:var(--gold);font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center}.n6-st .b{flex:1;min-width:0}'+
'.n6-st h4{margin:3px 0 8px;font-size:15px}.n6-f{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;'+
'border-bottom:1px solid var(--line2)}.n6-f:last-child{border:0}.n6-f span{font-size:12px;color:var(--mut)}.n6-f b{display:block;'+
'font-size:15px;word-break:break-all;margin-top:2px}.n6-cp{flex:none;height:30px;padding:0 10px;border-radius:8px;border:1px solid var(--line);'+
'background:transparent;color:var(--gold);font-size:12px;cursor:pointer}'+
'.n6-r{display:flex;gap:10px;align-items:flex-start;padding:12px;border:1px solid var(--line);border-radius:12px;cursor:pointer;'+
'font-size:13.5px;line-height:1.5}.n6-r.on{border-color:var(--gold);background:rgba(230,180,80,.08)}.n6-r input{margin-top:3px;flex:none;'+
'accent-color:#E6B450}.n6-w{display:flex;gap:8px;font-size:12.5px;line-height:1.5;color:var(--soft);background:var(--card2);'+
'border-radius:10px;padding:10px 12px}'+
'.n6-qr{display:flex;gap:6px;overflow-x:auto;padding:6px 0 2px}.n6-qr button{flex:none;white-space:nowrap;font-size:12px;padding:7px 11px;'+
'border-radius:16px;border:1px solid var(--line);background:var(--card2);color:var(--soft);cursor:pointer;font-family:inherit}'+
'.n6-ok{text-align:center;padding:28px 14px 18px}.n6-ok .c{width:74px;height:74px;margin:0 auto;border-radius:50%;background:#2FBF85;'+
'box-shadow:0 0 0 8px rgba(47,191,133,.18);display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:800}'+
'.n6-ok .a{font-family:"Space Grotesk",sans-serif;font-size:30px;font-weight:700;margin-top:18px}.n6-ok .s{font-size:14px;color:var(--mut2);'+
'margin-top:6px}.n6-inv{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:18px;padding:12px 14px;'+
'border-radius:12px;background:var(--card2);text-align:left;font-size:13px}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

function D(){return window.PODATA||null;}
function myPay(o){var m=(o.pay_methods||[])[0];return m||null;}

/* ---------- release page ---------- */
window.relOpen=function(){var d=D();if(!d)return;var o=d.order,other=d.other_real||d.buyer_name,me=d.my_real||'',m=myPay(o);
RELOPEN=1;var amt=n6(o.fiat_amount)+' '+x6(o.fiat);
var h='<div class="wbox" style="display:flex;flex-direction:column;gap:14px">'+
'<div><div style="font-size:20px;font-weight:700">Pending your release</div><div style="font-size:13px;color:var(--mut2);padding-top:4px">'+
'Buyer has paid. Please verify the payment before releasing the crypto.</div></div>'+
'<div class="n6-st"><span class="n">1</span><div class="b"><h4>Confirm receipt of payment</h4>'+
'<div class="n6-f"><div><span>You receive</span><b>'+amt+'</b></div><button class="n6-cp" onclick="nx6cp(\''+n6(o.fiat_amount)+'\')">Copy</button></div>'+
(me?'<div class="n6-f"><div><span>Name</span><b>'+x6(me)+'</b></div></div>':'')+
(m?'<div class="n6-f"><div><span>'+x6(m.type)+'</span><b>'+x6(m.details)+'</b></div><button class="n6-cp" onclick="nx6cp(this.dataset.v)" data-v="'+
x6(m.details)+'">Copy</button></div>':'')+
'<div class="n6-f"><div><span>Counterparty name</span><b>'+x6(other)+'</b></div><button class="n6-cp" onclick="nx6cp(this.dataset.v)" data-v="'+
x6(other)+'">Copy</button></div></div></div>'+
'<div class="n6-st"><span class="n">2</span><div class="b"><h4>Have you received the payment?</h4>'+
'<label class="n6-r" id="r6y"><input type="radio" name="r6" value="y"><span>Yes, I\'ve verified the payment of <b>'+amt+
'</b> has been received from <b style="color:var(--gold)">'+x6(other)+'</b></span></label>'+
'<label class="n6-r" id="r6n" style="margin-top:8px"><input type="radio" name="r6" value="n"><span>No, I haven\'t received the payment.</span></label>'+
'<div class="n6-w" style="margin-top:10px"><span>\u24d8</span><span>Ensure the payment has been verified in your own account. If the account names '+
'don\'t match, do not release the crypto. Refund the payment immediately.</span></div>'+
'<div id="r6auth" style="display:none;flex-direction:column;gap:10px;margin-top:12px">'+
'<div style="font-size:13px;color:var(--mut2)">Security verification</div>'+
'<label class="fl">Your Nexora password<input class="in" id="relP" type="password" autocomplete="current-password"></label>'+
'<label class="fl">Google Authenticator code<input class="in" id="relT" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6-digit code"></label></div>'+
'<input type="checkbox" id="relChk" style="display:none">'+
'<div id="relMsg" style="display:none;font-size:13.5px;font-weight:600;padding:10px 12px;border-radius:10px;margin-top:10px"></div>'+
'<button class="btn gold" id="relGo" style="margin-top:12px;width:100%" disabled onclick="relGo()">Confirm release</button>'+
'<button class="btn dark" style="margin-top:8px;width:100%" onclick="RELOPEN=0;poFetch()">Back</button></div></div></div>';
q6('poBtns').innerHTML=h;
if(d.my_2fa===false){var g=q6('relGo');g.disabled=true;g.textContent='Turn on Google Authenticator to release';}
document.getElementsByName('r6').forEach(function(r){r.onchange=function(){var y=r.value==='y'&&r.checked;
q6('r6y').classList.toggle('on',y);q6('r6n').classList.toggle('on',r.value==='n'&&r.checked);q6('relChk').checked=y;
q6('r6auth').style.display=y?'flex':'none';var g=q6('relGo');if(d.my_2fa!==false)g.disabled=!y;
if(r.value==='n'&&r.checked){g.disabled=true;var mm=q6('relMsg');mm.style.display='block';mm.style.background='rgba(230,180,80,.12)';mm.style.color='var(--gold)';
mm.textContent='Do not release. Wait for the money, ask the buyer in the chat, or open an appeal if you were not paid.';}
else{q6('relMsg').style.display='none';if(y)setTimeout(function(){var p=q6('relP');if(p)p.focus();},50);}};});
q6('poBtns').scrollIntoView({behavior:'smooth',block:'start'});};

/* ---------- release (same security as before), Binance-style success ---------- */
function rm(t,ok){var m=q6('relMsg');m.style.display='block';m.textContent=t;m.style.background=ok?'rgba(14,138,95,.2)':'rgba(200,48,63,.2)';
m.style.color=ok?'#3FD39A':'#FF6B7A';}
window.relGo=function(){var d=D();if(!d)return;var p=q6('relP').value,t=q6('relT').value.trim(),b=q6('relGo');
if(!q6('relChk').checked){rm('Please confirm that you received the money.');return;}
if(!p){rm('Please enter your password.');q6('relP').focus();return;}
if(!/^\d{6}$/.test(t)){rm('Please enter the 6-digit Google Authenticator code.');q6('relT').focus();return;}
b.disabled=true;b.textContent='Verifying...';q6('relMsg').style.display='none';
sb.auth.signInWithPassword({email:ME.email,password:p}).then(function(r){if(r.error)throw {k:'pw'};return sb.auth.mfa.listFactors();})
.then(function(l){var f=((l.data||{}).totp||[]).filter(function(x){return x.status==='verified';})[0];
if(!f)throw {m:'Google Authenticator is not turned on. Turn it on in Account > 2FA first.'};
return sb.auth.mfa.challengeAndVerify({factorId:f.id,code:t});})
.then(function(r){if(r&&r.error)throw {k:'otp'};return sb.rpc('nx_p2p_action',{p_order:PO,p_action:'release'});})
.then(function(r){if(r.error)throw {m:errText(r.error)};var o=d.order;
q6('poBtns').innerHTML='<div class="wbox n6-ok"><div class="c">\u2713</div><div class="a">'+n6(o.fiat_amount)+' '+x6(o.fiat)+'</div>'+
'<div class="s">Successfully sold '+n6(o.qty,6)+' USDT</div>'+
'<div class="n6-inv"><span>Invite friends and earn <b style="color:var(--gold)">20% for life</b> of their trading fees</span>'+
'<button class="n6-cp" onclick="go(\'ref\')">Invite</button></div>'+
'<button class="btn gold" style="margin-top:16px;width:100%" onclick="go(\'wallet\')">View assets</button>'+
'<button class="btn dark" style="margin-top:8px;width:100%" onclick="RELOPEN=0;poFetch()">Order details</button></div>';})
.catch(function(er){b.disabled=false;b.textContent='Confirm release';
if(er&&er.k==='pw'){rm('Incorrect password. Please enter it again.');q6('relP').value='';q6('relP').focus();}
else if(er&&er.k==='otp'){rm('Incorrect or expired code. Enter the new code from Google Authenticator.');q6('relT').value='';q6('relT').focus();}
else rm((er&&(er.m||er.message))||'Something went wrong. Please try again.');});};

/* ---------- order header: fee, release quantity, completed trades ---------- */
function enh(){var h=q6('poHead'),d=D();if(!h||!d||h.querySelector('.n6h'))return;var o=d.order,buy=d.me==='buyer',fee=+d.fee||0;
var g=h.querySelector('div[style*="grid-template-columns"]');
if(g){var add='<span style="color:var(--mut)" class="n6h">'+(buy?'You receive':'Release quantity')+'</span><span>'+n6(o.qty-fee,6)+' USDT</span>'+
'<span style="color:var(--mut)">Fee</span><span>'+n6(fee,6)+' USDT</span>';g.insertAdjacentHTML('beforeend',add);}
else{var z=document.createElement('span');z.className='n6h';z.style.display='none';h.appendChild(z);}
var r=h.querySelector('.nx4r');if(r&&d.other_trades!=null){var s=document.createElement('div');s.style.cssText='font-size:12px;color:var(--mut2);padding-top:2px';
s.textContent='Completed '+d.other_trades+' \u00d7';r.parentNode.insertBefore(s,r.nextSibling);}}
var ph=q6('poHead');if(ph)new MutationObserver(function(){setTimeout(enh,30);}).observe(ph,{childList:true});

/* ---------- chat bar (Payee name + Payment received) and quick replies ---------- */
var ch=q6('poChat'),bar=document.createElement('div');bar.className='n6-bar';bar.style.display='none';
if(ch)ch.parentNode.insertBefore(bar,ch);
var mi=q6('poMsg'),qr=document.createElement('div');qr.className='n6-qr';
if(mi&&mi.parentNode)mi.parentNode.parentNode.insertBefore(qr,mi.parentNode.nextSibling);
var LAST='';
function chat(){var d=D();if(!d||location.hash!=='#p2porder')return;var o=d.order,buy=d.me==='buyer',s=o.status;
var key=o.id+s+d.me+RELOPEN;if(key===LAST)return;LAST=key;
if(!buy&&(s==='paid'||s==='appeal')&&!RELOPEN){bar.style.display='flex';bar.innerHTML='<div><b>Sell USDT with '+n6(o.fiat_amount)+' '+x6(o.fiat)+
'</b><small>Payee name: '+x6(d.other_real||d.buyer_name)+'</small></div><button class="n6-yb" onclick="relOpen()">Payment received</button>';}
else if(buy&&s==='pending'){bar.style.display='flex';bar.innerHTML='<div><b>Buy USDT with '+n6(o.fiat_amount)+' '+x6(o.fiat)+
'</b><small>Pay to: '+x6(d.other_real||d.seller_name)+'</small></div>';}
else bar.style.display='none';
var L=[];if(s==='pending'||s==='paid'||s==='appeal'){
if(buy)L=['I am paying now, please wait.','Payment done. Please check and release.','Please share your payment details.','I have uploaded the payment screenshot.'];
else L=['Glad to trade with you. Please inform me after you have made the payment, thanks.','I have not received your payment yet. Please wait.',
'Payment received, thank you. I will release in a few minutes.','Third-party payments are not accepted. Please pay from your own account.',
'Please upload the payment screenshot in the chat.'];}
qr.innerHTML=L.map(function(t,i){return '<button data-i="'+i+'">'+x6(t)+'</button>';}).join('');
qr.querySelectorAll('button').forEach(function(b){b.onclick=function(){var m=q6('poMsg');if(!m)return;m.value=L[+b.dataset.i];
if(typeof poSend==='function')poSend();};});}
setInterval(chat,1000);
})();
