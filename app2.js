/* ---------- P2P ---------- */
var FIATS=['INR','USD','EUR','GBP','AED','SAR','QAR','KWD','OMR','BHD','NGN','KES','GHS','ZAR','UGX','TZS','EGP','MAD','TRY','RUB','UAH',
'KZT','BRL','MXN','ARS','COP','CLP','PEN','VES','PHP','IDR','VND','THB','MYR','SGD','NPR','LKR','CNY','HKD','JPY','KRW','AUD','NZD','CAD','CHF'];
var CFIAT={IN:'INR',US:'USD',GB:'GBP',AE:'AED',SA:'SAR',QA:'QAR',KW:'KWD',OM:'OMR',BH:'BHD',NG:'NGN',KE:'KES',GH:'GHS',ZA:'ZAR',UG:'UGX',
TZ:'TZS',EG:'EGP',MA:'MAD',TR:'TRY',RU:'RUB',UA:'UAH',KZ:'KZT',BR:'BRL',MX:'MXN',AR:'ARS',CO:'COP',CL:'CLP',PE:'PEN',VE:'VES',PH:'PHP',
ID:'IDR',VN:'VND',TH:'THB',MY:'MYR',SG:'SGD',NP:'NPR',LK:'LKR',CN:'CNY',HK:'HKD',JP:'JPY',KR:'KRW',AU:'AUD',NZ:'NZD',CA:'CAD',CH:'CHF'};
var PAYS=['UPI','IMPS','Bank Transfer','Paytm','PhonePe','Google Pay','Wise','Revolut','SEPA','Zelle','Cash App','PIX','Mercado Pago',
'M-Pesa','MTN Mobile Money','Airtel Money','GCash','Maya','DANA','GoPay','OVO','Payoneer','Skrill','Advcash','QIWI','Cash in person'];
var PSIDE='buy',PAD=null,PO=null,POT=null,ADSIDE='sell',PMT='open';
function pFiat(){try{var f=localStorage.getItem('nx_fiat');if(f)return f;}catch(e){}return CFIAT[(PROF||{}).country]||'INR';}
function opt(l,cur){return l.map(function(x){return '<option'+(x===cur?' selected':'')+'>'+esc(x)+'</option>';}).join('');}
$('pFiat').innerHTML=opt(FIATS,'INR');$('pPay').innerHTML='<option value="">All payment methods</option>'+opt(PAYS);
$('adFiat').innerHTML=opt(FIATS,'INR');$('pmType').innerHTML=opt(PAYS);
$('pFiat').onchange=function(){try{localStorage.setItem('nx_fiat',this.value);}catch(e){}p2pList();};$('pPay').onchange=p2pList;
$('pSeg').onclick=function(e){var b=e.target.closest('[data-s]');if(!b)return;PSIDE=b.dataset.s;segOn('pSeg',PSIDE);p2pList();};
$('adSeg').onclick=function(e){var b=e.target.closest('[data-s]');if(!b)return;ADSIDE=b.dataset.s;segOn('adSeg',ADSIDE);adAv();};
function segOn(id,v){document.querySelectorAll('#'+id+' button').forEach(function(b){var on=b.dataset.s===v;
b.style.background=on?(id==='pSeg'?(v==='sell'?'var(--dnb)':'var(--upb)'):'var(--gold)'):'transparent';b.style.color=on?(id==='pSeg'?'#fff':'var(--bg)'):'var(--mut)';});}
function p2pPage(p){if(!AREADY){setTimeout(function(){p2pPage(p);},300);return;}
if(p==='p2p'){if($('pFiat').dataset.set!=='1'){$('pFiat').value=pFiat();$('pFiat').dataset.set='1';}segOn('pSeg',PSIDE);p2pList();}
else if(!ME){openAuth('in');}
else if(p==='p2ptake')ptDraw();else if(p==='p2porder')poLoad();else if(p==='p2pmy')pmList();
else if(p==='p2pads'){segOn('adSeg',ADSIDE);$('adFiat').value=pFiat();loadMeth(function(){adPays();});loadWal(adAv);adList();}
else if(p==='p2ppay')loadMeth(drawMeth);}
function nf(v,d){return (+v||0).toLocaleString('en-US',{maximumFractionDigits:d==null?2:d});}
function p2pList(){if(!sb)return;$('pList').innerHTML='<div style="color:var(--mut);padding:10px 0">Loading…</div>';
sb.rpc('nx_p2p_list',{p_side:PSIDE,p_fiat:$('pFiat').value,p_pay:$('pPay').value||null}).then(function(r){var l=r.data||[];window._pads=l;
$('pList').innerHTML=l.map(function(a,i){return '<div class="wbox" style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;'+
'justify-content:space-between;align-items:center"><b>'+esc(a.name)+(a.verified?' <span style="color:var(--gold);font-size:11px">✓ Verified</span>':
'')+'</b><span style="font-size:11px;color:var(--mut)">'+a.orders_30d+' orders'+(a.rate!=null?' · '+a.rate+'%':'')+'</span></div>'+
'<div style="font-size:22px;font-weight:700">'+nf(a.price)+' <span style="font-size:12px;color:var(--mut)">'+esc(a.fiat)+'</span></div>'+
'<div style="font-size:12px;color:var(--mut2)">Available '+nf(a.avail_qty,4)+' USDT<br>Limit '+nf(a.min_fiat)+' – '+nf(a.max_fiat)+' '+
esc(a.fiat)+'</div><div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px"><div style="display:flex;flex-wrap:wrap;'+
'gap:4px">'+a.pay_types.map(function(p){return '<span style="font-size:11px;border-left:2px solid var(--gold);padding-left:5px;color:var(--soft)">'+
esc(p)+'</span>';}).join('')+'</div><button class="btn" style="height:36px;padding:0 18px;color:#fff;background:'+(PSIDE==='buy'?
'var(--upb)':'var(--dnb)')+'" onclick="ptOpen('+i+')">'+(PSIDE==='buy'?'Buy':'Sell')+'</button></div></div>';}).join('')||
'<div class="wbox" style="text-align:center;color:var(--mut)">No ads for '+esc($('pFiat').value)+' right now.<br><button class="btn gold" '+
'style="height:38px;margin-top:10px;padding:0 16px" onclick="need()&&go(\'p2pads\')">Post your own ad</button></div>';});}
function ptOpen(i){if(!need())return;PAD=window._pads[i];go('p2ptake');}
function ptDraw(){var a=PAD;if(!a){go('p2p');return;}var buy=PSIDE==='buy';$('ptT').textContent=(buy?'Buy':'Sell')+' USDT';
$('ptAd').innerHTML='<b>'+esc(a.name)+'</b><div style="font-size:20px;font-weight:700;padding-top:4px">'+nf(a.price)+' '+esc(a.fiat)+
' <span style="font-size:12px;color:var(--mut)">per USDT</span></div><div style="font-size:12px;color:var(--mut2);line-height:1.6">Limit '+
nf(a.min_fiat)+' – '+nf(a.max_fiat)+' '+esc(a.fiat)+' · Pay within '+a.time_limit+' min<br>Methods: '+esc(a.pay_types.join(', '))+'</div>'+
(a.terms?'<div style="font-size:12.5px;padding-top:6px;white-space:pre-line">'+esc(a.terms)+'</div>':'');
$('ptF1').textContent=a.fiat;$('ptFiat').value='';$('ptQty').value='';$('ptBtn').textContent=(buy?'Buy':'Sell')+' USDT';
$('ptBtn').style.background=buy?'var(--upb)':'var(--dnb)';$('ptBtn').style.color='#fff';
document.querySelector('#ptFiat').parentNode.firstChild.textContent=buy?'I want to pay (':'I will receive (';
document.querySelector('#ptQty').parentNode.firstChild.textContent=buy?'I will receive (USDT)':'I will sell (USDT)';
$('ptMW').style.display=buy?'none':'flex';$('ptInfo').textContent='';
if(!buy){loadMeth(function(){var ok=METH.filter(function(m){return a.pay_types.indexOf(m.type)>-1;});$('ptM').innerHTML=ok.map(function(m){
return '<option value="'+m.id+'">'+esc(m.type)+' – '+esc(m.details.slice(0,30))+'</option>';}).join('')||'<option value="">Add a '+
esc(a.pay_types.join(' / '))+' payment method first</option>';});loadWal(function(){$('ptInfo').textContent='Funding wallet: '+
fa(bal('funding','USDT'),'USDT')+' USDT';});}}
function ptCalc(w){var a=PAD;if(w==='f'){var f=+$('ptFiat').value||0;$('ptQty').value=f?String(Math.floor(f/a.price*1e6)/1e6):'';}
else{var q=+$('ptQty').value||0;$('ptFiat').value=q?String(Math.round(q*a.price*100)/100):'';}}
function ptGo(){var f=+$('ptFiat').value||0,b=$('ptBtn');if(!(f>0)){say('Enter the amount');return;}var mid=null;
if(PSIDE==='sell'){mid=+$('ptM').value||null;if(!mid){go('p2ppay');say('Add a payment method first');return;}}
b.disabled=true;sb.rpc('nx_p2p_take',{p_ad:PAD.id,p_fiat_amount:f,p_method:mid}).then(function(r){b.disabled=false;
if(r.error){say(errText(r.error));return;}PO=r.data;go('p2porder');});}
var STP={pending:'Waiting for payment',paid:'Paid – waiting for release',appeal:'Appeal – support is checking',completed:'Completed',
cancelled:'Cancelled'};
function poLoad(){clearInterval(POT);RELOPEN=0;if(!PO){go('p2pmy');return;}poFetch();POT=setInterval(function(){if(location.hash==='#p2porder'&&
document.visibilityState==='visible')poFetch();else if(location.hash!=='#p2porder')clearInterval(POT);},4000);}
var POL=0;
function poFetch(){sb.rpc('nx_p2p_order',{p_order:PO}).then(function(r){if(r.error){say(errText(r.error));return;}var d=r.data,o=d.order,
buy=d.me==='buyer',st=o.status,other=buy?d.seller_name:d.buyer_name;
var left=Math.max(0,Math.floor((new Date(o.expires_at)-new Date())/1000));
$('poHead').innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px;color:'+(buy?
'var(--up)':'var(--dn)')+'">'+(buy?'Buy':'Sell')+' USDT</b><span style="font-size:12px;color:var(--gold)">'+STP[st]+'</span></div>'+
(st==='pending'?'<div style="font-size:13px;color:var(--mut2);padding-top:4px">Time left to pay: <b style="color:var(--gold)">'+
Math.floor(left/60)+':'+('0'+left%60).slice(-2)+'</b></div>':'')+'<div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;'+
'font-size:13px;padding-top:8px"><span style="color:var(--mut)">Amount</span><b style="font-size:16px">'+nf(o.fiat_amount)+' '+esc(o.fiat)+
'</b><span style="color:var(--mut)">Price</span><span>'+nf(o.price)+' '+esc(o.fiat)+'</span><span style="color:var(--mut)">USDT</span><span>'+
nf(o.qty,6)+'</span><span style="color:var(--mut)">'+(buy?'Seller':'Buyer')+'</span><span>'+esc(other)+'</span><span style="color:var(--mut)">'+
'Order no.</span><span>'+o.id+'</span></div>';
$('poPay').style.display=(buy&&(st==='pending'||st==='paid'||st==='appeal'))||(!buy&&st!=='cancelled')?'':'none';
$('poPay').innerHTML=buy?'<div class="ct">Pay the seller here</div><div style="font-size:12px;color:var(--mut2);padding:4px 0 6px">Use your '+
'own account. Write nothing about crypto or USDT in the payment note.</div>'+(o.pay_methods||[]).map(function(m){return '<div style="border:1px '+
'solid var(--line);border-radius:10px;padding:10px;margin-top:6px"><b style="color:var(--gold)">'+esc(m.type)+'</b><div style="font-size:13px;'+
'padding-top:4px">'+esc(m.name)+'</div><div style="font-size:13.5px;white-space:pre-line;word-break:break-all">'+esc(m.details)+'</div>'+
'<button class="btn dark" style="height:30px;font-size:12px;padding:0 10px;margin-top:6px" onclick="cp(\''+esc(m.details).replace(/\n/g,' ')+
'\')">Copy</button></div>';}).join(''):'<div class="ct">Money will come to</div>'+(o.pay_methods||[]).map(function(m){return '<div '+
'style="font-size:13px;padding-top:6px"><b>'+esc(m.type)+'</b> · '+esc(m.name)+'<br>'+esc(m.details)+'</div>';}).join('')+
'<div style="font-size:12px;color:var(--dn);padding-top:8px;line-height:1.5">Release only after you see '+nf(o.fiat_amount)+' '+esc(o.fiat)+
' in your own account from the buyer\'s name. A screenshot is not proof.</div>';
var B='';function bt(t,c,f){B+='<button class="btn '+c+'" onclick="'+f+'">'+t+'</button>';}
if(buy&&st==='pending'){var hasF=d.messages.some(function(x){return x.mine&&x.file;});B+='<div class="wbox" style="font-size:13px;color:'+
(hasF?'var(--up)':'var(--gold)')+'">'+(hasF?'✓ Payment screenshot uploaded.':'Step 1: pay the seller. Step 2: upload the payment screenshot. '+
'Step 3: tap "I have paid".')+'</div>';bt('Upload payment screenshot','dark',"$('poFile').click()");
bt('I have paid, notify seller','gold',"poAct('paid')");bt('Cancel order','dark',"poAct('cancel')");}
if(buy&&st==='paid'){bt('Open appeal','dark',"poAct('appeal')");bt('Cancel order','dark',"poAct('cancel')");}
if(!buy&&(st==='paid'||st==='appeal')){B+='<div class="wbox" style="font-size:13.5px;color:var(--gold);line-height:1.6">The buyer says '+
'the payment of <b>'+nf(o.fiat_amount)+' '+esc(o.fiat)+'</b> is done. Open your bank / UPI app and check that the money has really '+
'arrived from <b>'+esc(other)+'</b>.</div>';bt('Payment received – Release USDT','gold',"relOpen()");}
if(!buy&&st==='paid')bt('Open appeal','dark',"poAct('appeal')");
if(!buy&&st==='pending')B+='<div class="wbox" style="font-size:13px;color:var(--mut2)">Waiting for the buyer to pay.</div>';
if(st==='appeal')B+='<div class="wbox" style="font-size:13px;color:var(--gold)">Appeal: '+esc(o.appeal_reason||'')+
'<br><span style="color:var(--mut2)">Nexora support will decide. Send payment screenshots in the chat.</span></div>';
if(st==='completed'||st==='cancelled')B+='<div class="wbox" style="font-size:13px">'+(st==='completed'?(buy?nf(o.qty,6)+
' USDT was added to your Funding wallet.':'Order completed.'):'Order cancelled'+(o.cancel_reason?': '+esc(o.cancel_reason):''))+'</div>';
if(!RELOPEN)$('poBtns').innerHTML=B;PODATA=d;
var ch=$('poChat'),atB=ch.scrollTop+ch.clientHeight>=ch.scrollHeight-20,n=d.messages.length;
ch.innerHTML=d.messages.map(function(m){var al=m.sys||m.admin?'center':m.mine?'flex-end':'flex-start',bg=m.sys?'transparent':m.admin?
'#2A2410':m.mine?'#1E2E52':'var(--card2)';return '<div style="align-self:'+al+';max-width:85%;background:'+bg+';border-radius:10px;'+
'padding:'+(m.sys?'2px 6px':'8px 10px')+';font-size:'+(m.sys?'11.5px':'13px')+';color:'+(m.sys?'var(--mut)':m.admin?'var(--gold)':'var(--tx)')+
';white-space:pre-line;text-align:'+(m.sys?'center':'left')+'">'+(m.body?esc(m.body):'')+(m.file?'<button class="btn dark" style="height:30px;'+
'font-size:12px;padding:0 10px;margin-top:4px" onclick="poImg(\''+esc(m.file)+'\')">Open photo</button>':'')+'<div style="font-size:10px;'+
'color:var(--mut);padding-top:2px">'+new Date(m.at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'</div></div>';}).join('');
if(atB||n!==POL)ch.scrollTop=ch.scrollHeight;POL=n;});}
var RELOPEN=0,PODATA=null;
function relOpen(){var o=PODATA.order,other=PODATA.buyer_name;RELOPEN=1;$('poBtns').innerHTML='<div class="wbox" style="display:flex;'+
'flex-direction:column;gap:10px"><div class="ct">Confirm payment received</div><label style="display:flex;gap:8px;align-items:flex-start;'+
'font-size:13px;line-height:1.5"><input type="checkbox" id="relChk" style="margin-top:3px;flex-shrink:0"><span>I confirm that I have received <b>'+
nf(o.fiat_amount)+' '+esc(o.fiat)+'</b> in my own account from <b>'+esc(other)+'</b>. I understand that released USDT cannot be returned.</span></label>'+
'<label class="fl">Your Nexora password<input class="in" id="relP" type="password" autocomplete="current-password"></label>'+
'<label class="fl">Google Authenticator code<input class="in" id="relT" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></label>'+
'<div id="relMsg" style="display:none;font-size:13.5px;font-weight:600;padding:10px 12px;border-radius:10px"></div>'+
'<div id="relMsg" style="display:none;font-size:13.5px;font-weight:600;padding:10px 12px;border-radius:10px"></div>'+
'<button class="btn gold" id="relGo" onclick="relGo()">Confirm and release '+nf(o.qty,6)+' USDT</button>'+'<button class="btn dark" onclick="RELOPEN=0;poFetch()">Back</button></div>';}
function relMsg(t,ok){var m=$('relMsg');m.style.display='block';m.textContent=t;m.style.background=ok?'rgba(14,138,95,.18)':'rgba(200,48,63,.18)';
m.style.color=ok?'#3FD39A':'#FF6B7A';}
function relMsg(t,ok){var m=$('relMsg');m.style.display='block';m.textContent=t;m.style.background=ok?'rgba(14,138,95,.2)':'rgba(200,48,63,.2)';
m.style.color=ok?'#3FD39A':'#FF6B7A';}
function relGo(){var p=$('relP').value,t=$('relT').value.trim(),b=$('relGo');
if(!$('relChk').checked){relMsg('Please tick the box to confirm you received the money.');return;}
if(!p){relMsg('Please enter your password.');$('relP').focus();return;}
if(!/^\d{6}$/.test(t)){relMsg('Please enter the 6-digit Google Authenticator code.');$('relT').focus();return;}
b.disabled=true;$('relMsg').style.display='none';
sb.auth.signInWithPassword({email:ME.email,password:p}).then(function(r){if(r.error)throw {k:'pw'};
return sb.auth.mfa.listFactors();}).then(function(l){var f=((l.data||{}).totp||[]).filter(function(x){return x.status==='verified';})[0];
if(!f)throw {m:'Google Authenticator is not turned on. Turn it on in Account > 2FA first.'};
return sb.auth.mfa.challengeAndVerify({factorId:f.id,code:t});})
.then(function(r){if(r&&r.error)throw {k:'otp'};return sb.rpc('nx_p2p_action',{p_order:PO,p_action:'release'});})
.then(function(r){if(r.error)throw {m:errText(r.error)};var o=PODATA.order;
$('poBtns').innerHTML='<div class="wbox" style="text-align:center;padding:22px 14px;border:1px solid #0E8A5F;background:rgba(14,138,95,.15)">'+
'<div style="font-size:40px;line-height:1;color:#3FD39A">✓</div><div style="font-size:22px;font-weight:700;color:#3FD39A;padding-top:8px">'+
'Successful</div><div style="font-size:13px;color:var(--soft);padding-top:6px">'+nf(o.qty,6)+' USDT has been sent to the buyer\'s wallet.</div></div>';
setTimeout(function(){RELOPEN=0;poFetch();},4000);}).catch(function(er){b.disabled=false;
if(er&&er.k==='pw'){relMsg('Incorrect password. Please enter it again.');$('relP').value='';$('relP').focus();}
else if(er&&er.k==='otp'){relMsg('Incorrect or invalid OTP. Please enter the new code from Google Authenticator.');$('relT').value='';$('relT').focus();}
else relMsg((er&&(er.m||er.message))||'Something went wrong. Please try again.');});}
function poAct(a){var why=null;
if(a==='paid'&&!confirm('Have you really sent the money? Marking as paid without paying can block your account.'))return;
if(a==='cancel'&&!confirm('Cancel this order? Do not cancel if you have already paid.'))return;
if(a==='appeal'){why=prompt('What is the problem?');if(!why)return;}
sb.rpc('nx_p2p_action',{p_order:PO,p_action:a,p_reason:why}).then(function(r){if(r.error){say(errText(r.error));return;}say('Done');poFetch();});}
function poSend(){var t=$('poMsg').value.trim();if(!t)return;$('poMsg').value='';sb.rpc('nx_p2p_send',{p_order:PO,p_body:t}).then(function(r){
if(r.error)say(errText(r.error));poFetch();});}
$('poMsg').onkeydown=function(e){if(e.key==='Enter')poSend();};
$('poFile').onchange=function(){var f=this.files[0];if(!f)return;if(f.size>5e6){say('Photo must be under 5 MB');return;}
var p=PO+'/'+Date.now()+'.'+((f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg');say('Uploading…');
sb.storage.from('p2p').upload(p,f,{contentType:f.type}).then(function(r){if(r.error){say(r.error.message);return;}
return sb.rpc('nx_p2p_send',{p_order:PO,p_body:'',p_file:p});}).then(function(){$('poFile').value='';poFetch();});};
function poImg(p){sb.storage.from('p2p').createSignedUrl(p,600).then(function(r){if(r.error){say(r.error.message);return;}window.open(r.data.signedUrl,'_blank');});}
$('pmTabs').onclick=function(e){var b=e.target.closest('.tab');if(!b)return;PMT=b.dataset.t;this.querySelectorAll('.tab').forEach(function(x){
x.classList.toggle('on',x===b);});pmList();};
function pmList(){var q=sb.from('nx_p2p_orders').select('*').order('id',{ascending:false}).limit(50);
if(PMT==='open')q=q.in('status',['pending','paid','appeal']);q.then(function(r){var l=r.data||[];$('pmList').innerHTML=l.map(function(o){
var buy=o.buyer===ME.id;return '<button class="li" style="display:flex;justify-content:space-between;width:100%" onclick="PO='+o.id+
';go(\'p2porder\')"><span style="text-align:left"><b style="color:'+(buy?'var(--up)':'var(--dn)')+'">'+(buy?'Buy':'Sell')+'</b> '+nf(o.qty,4)+
' USDT<br><span style="font-size:11px;color:var(--mut)">'+nf(o.fiat_amount)+' '+esc(o.fiat)+' · '+new Date(o.created_at).toLocaleString()+
'</span></span><span class="s" style="color:'+(o.status==='completed'?'var(--up)':o.status==='cancelled'?'var(--mut)':'var(--gold)')+'">'+
STP[o.status]+'</span></button>';}).join('')||'<div style="color:var(--mut);padding:14px 0">No orders</div>';});}
var METH=[];function loadMeth(cb){sb.from('nx_p2p_methods').select('*').order('id').then(function(r){METH=r.data||[];cb&&cb();});}
function drawMeth(){$('pmMeth').innerHTML=METH.map(function(m){return '<div class="wbox" style="display:flex;justify-content:space-between;'+
'gap:10px"><div><b style="color:var(--gold)">'+esc(m.type)+'</b><div style="font-size:13px">'+esc(m.name)+'</div><div style="font-size:12.5px;'+
'color:var(--mut2);white-space:pre-line;word-break:break-all">'+esc(m.details)+'</div></div><button class="btn dark" style="height:32px;'+
'font-size:12px;padding:0 10px" onclick="delMeth('+m.id+')">Delete</button></div>';}).join('')||'<div style="color:var(--mut)">No payment '+
'methods yet.</div>';}
function delMeth(id){if(!confirm('Delete this payment method?'))return;sb.rpc('nx_p2p_method_del',{p_id:id}).then(function(){loadMeth(drawMeth);});}
$('pmForm').onsubmit=function(e){e.preventDefault();var f=new FormData(this),form=this;sb.rpc('nx_p2p_method_add',{p_type:f.get('type'),
p_name:f.get('name'),p_details:f.get('det')}).then(function(r){if(r.error){say(errText(r.error));return;}form.reset();say('Saved');loadMeth(drawMeth);});};
function adPays(){$('adPays').innerHTML=PAYS.map(function(p){return '<label style="display:flex;gap:4px;align-items:center;font-size:12.5px;'+
'border:1px solid var(--line);border-radius:8px;padding:5px 8px"><input type="checkbox" value="'+esc(p)+'">'+esc(p)+'</label>';}).join('');}
function adAv(){$('adAv').textContent=ADSIDE==='sell'?'Funding wallet: '+fa(bal('funding','USDT'),'USDT')+' USDT (transfer from Spot if needed)':'';}
$('adForm').onsubmit=function(e){e.preventDefault();var f=new FormData(this),form=this,pays=Array.prototype.map.call(
document.querySelectorAll('#adPays input:checked'),function(x){return x.value;});if(!pays.length){say('Choose payment methods');return;}
sb.rpc('nx_p2p_ad_create',{p_side:ADSIDE,p_fiat:f.get('fiat'),p_price:+f.get('price'),p_qty:+f.get('qty'),p_min:+f.get('min'),
p_max:+f.get('max'),p_pay_types:pays,p_time:+f.get('time'),p_terms:f.get('terms')||null}).then(function(r){if(r.error){say(errText(r.error));
return;}form.reset();adPays();say('Ad posted');loadWal(adAv);adList();});};
function adList(){sb.from('nx_p2p_ads').select('*').neq('status','closed').order('id',{ascending:false}).then(function(r){var l=r.data||[];
$('adList').innerHTML=l.map(function(a){return '<div class="wbox" style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;'+
'justify-content:space-between"><b style="color:'+(a.side==='sell'?'var(--dn)':'var(--up)')+'">'+(a.side==='sell'?'Sell':'Buy')+' USDT · '+
nf(a.price)+' '+esc(a.fiat)+'</b><span style="font-size:12px;color:'+(a.status==='online'?'var(--up)':'var(--mut)')+'">'+a.status+'</span></div>'+
'<div style="font-size:12px;color:var(--mut2)">Left '+nf(a.avail_qty,4)+' / '+nf(a.total_qty,4)+' USDT · Limit '+nf(a.min_fiat)+' – '+
nf(a.max_fiat)+'<br>'+esc(a.pay_types.join(', '))+'</div><div style="display:flex;gap:6px"><button class="btn dark" style="height:32px;'+
'font-size:12px;padding:0 10px" onclick="adSet('+a.id+',\''+(a.status==='online'?'offline':'online')+'\')">'+(a.status==='online'?
'Go offline':'Go online')+'</button><button class="btn dark" style="height:32px;font-size:12px;padding:0 10px" onclick="adPrice('+a.id+
')">Change price</button><button class="btn dark" style="height:32px;font-size:12px;padding:0 10px;color:var(--dn)" onclick="adSet('+a.id+
',\'closed\')">Close</button></div></div>';}).join('');});}
function adSet(id,st){if(st==='closed'&&!confirm('Close this ad? Unsold USDT goes back to your Funding wallet.'))return;
sb.rpc('nx_p2p_ad_update',{p_id:id,p_status:st}).then(function(r){if(r.error){say(errText(r.error));return;}loadWal(adAv);adList();});}
function adPrice(id){var p=prompt('New price per USDT');if(!p)return;sb.rpc('nx_p2p_ad_update',{p_id:id,p_status:null,p_price:+p})
.then(function(r){if(r.error){say(errText(r.error));return;}adList();});}
/* ---------- Live chat support ---------- */
var SUPT=null,SUPL=0,SUPS='bot',SUPON=0,SUPTM=null,SUPBUSY=0,SUPSEEN={},SUPSENDING=0;
function supTok(){try{var t=localStorage.getItem('nx_sup');if(!t){t=(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'
.replace(/x/g,function(){return (Math.random()*16|0).toString(16);}));localStorage.setItem('nx_sup',t);}return t;}catch(e){
if(!SUPT)SUPT='xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,function(){return (Math.random()*16|0).toString(16);});return SUPT;}}
function supOpen(){if(!sb){say('Connection problem. Please refresh.');return;}menu(0);SUPON=1;$('supBox').style.display='flex';
$('supBtn').style.display='none';$('supDot').style.display='none';supChips();supPull();clearInterval(SUPTM);
SUPTM=setInterval(function(){if(document.visibilityState==='visible')supPull();},4000);setTimeout(function(){$('supIn').focus();},200);}
function supClose(){SUPON=0;$('supBox').style.display='none';$('supBtn').style.display='flex';clearInterval(SUPTM);
SUPTM=setInterval(function(){if(SUPS==='agent'&&document.visibilityState==='visible')supPull();},20000);}
function supChips(){var c=['Deposit','Withdraw','KYC','P2P','2FA','Fees'];
$('supChips').innerHTML=c.map(function(x){return '<button type="button" class="tf" style="flex-shrink:0;height:32px" onclick="supQ(\''+x+
'\')">'+x+'</button>';}).join('')+(SUPS==='bot'?'<button type="button" class="tf on" style="flex-shrink:0;height:32px" '+
'onclick="supAgent()">Talk to an agent</button>':'');}
function supQ(x){$('supIn').value=x==='Deposit'?'How to deposit':x==='Withdraw'?'How to withdraw':x==='KYC'?'How to do KYC':
x==='P2P'?'How does P2P work':x==='2FA'?'Google Authenticator 2FA':'What are the fees';supSend();}
function supPull(){if(SUPBUSY)return;SUPBUSY=1;sb.rpc('nx_sup_get',{p_token:supTok(),p_after:SUPL}).then(function(r){SUPBUSY=0;if(r.error){return;}var d=r.data;
var old=SUPS;SUPS=d.status;if(old!==SUPS)supChips();$('supSt').textContent={bot:'Assistant',waiting:'Waiting for an agent…',
agent:'Agent is online',closed:'Assistant'}[SUPS];var box=$('supMsgs'),n=0;(d.messages||[]).forEach(function(m){if(SUPSEEN[m.id])return;SUPSEEN[m.id]=1;n++;SUPL=Math.max(SUPL,m.id);
var me=m.from==='user',sys=m.from==='system',el=document.createElement('div');el.style.cssText='max-width:85%;border-radius:12px;padding:'+
(sys?'4px 8px':'9px 11px')+';font-size:'+(sys?'11.5px':'13.5px')+';line-height:1.5;white-space:pre-line;align-self:'+(sys?'center':me?
'flex-end':'flex-start')+';background:'+(sys?'transparent':me?'#1E2E52':m.from==='agent'?'#2A2410':'var(--card)')+';color:'+(sys?'var(--mut)':
'var(--tx)')+';text-align:'+(sys?'center':'left');el.innerHTML=(m.from==='agent'?'<b style="color:var(--gold);font-size:11px">Nexora agent</b><br>':
m.from==='bot'?'<b style="color:var(--mut2);font-size:11px">Assistant</b><br>':'')+esc(m.body);box.appendChild(el);});
if(n){box.scrollTop=box.scrollHeight;if(!SUPON&&(d.messages||[]).some(function(m){return m.from==='agent';}))$('supDot').style.display='block';}},function(){SUPBUSY=0;});}
function supSend(){var t=$('supIn').value.trim();if(!t||SUPSENDING)return;SUPSENDING=1;$('supIn').value='';
sb.rpc('nx_sup_send',{p_token:supTok(),p_body:t}).then(function(r){SUPSENDING=0;if(r.error){say(errText(r.error));return;}
var w=setInterval(function(){if(!SUPBUSY){clearInterval(w);supPull();}},150);},function(){SUPSENDING=0;});}
$('supIn').onkeydown=function(e){if(e.key==='Enter'&&!e.repeat&&!e.isComposing){e.preventDefault();supSend();}};
function supAgent(){var nm=ME?null:prompt('Your name (optional)');sb.rpc('nx_sup_agent',{p_token:supTok(),p_name:nm||null}).then(function(r){
if(r.error){say(errText(r.error));return;}supPull();});}
/* pair picker, chart view, more menu (trade page) */
var PTAB='all';function favs(){try{return JSON.parse(localStorage.getItem('nx_fav')||'[]');}catch(e){return [];}}
function setFavs(l){try{localStorage.setItem('nx_fav',JSON.stringify(l));}catch(e){}}
function pairOpen(){$('shPair').classList.add('on');$('shOv').classList.add('on');$('pq').value='';pairDraw();}
function pairClose(){$('shPair').classList.remove('on');if(!$('shMore').classList.contains('on')&&!$('shNet').classList.contains('on'))
$('shOv').classList.remove('on');}
$('pTabs').onclick=function(e){var b=e.target.closest('.tab');if(!b)return;PTAB=b.dataset.t;this.querySelectorAll('.tab').forEach(function(x){
x.classList.toggle('on',x===b);});pairDraw();};
function pairDraw(){var q=$('pq').value.trim().toUpperCase(),fv=favs(),l=(PTAB==='fav'?fv:COINS).filter(function(c){return T[c]&&c.indexOf(q)>-1;});
$('pList2').innerHTML=l.slice(0,200).map(function(c){var t=T[c],ch=+t.pct,on=fv.indexOf(c)>-1;return '<div class="crow" data-c="'+c+'" '+
'style="cursor:pointer"><button type="button" data-f="'+c+'" aria-label="Favorite" style="background:none;border:0;padding:0 8px 0 0;font-size:18px;'+
'color:'+(on?'var(--gold)':'var(--mut)')+'">'+(on?'★':'☆')+'</button><span class="nm"><b>'+c+'<span style="color:var(--mut);font-weight:400">'+
' /USDT</span></b><span>Vol '+fv2(t.quoteVolume)+'</span></span><span style="text-align:right"><b style="font-size:14px">'+fp(t.lastPrice)+
'</b><br><span style="font-size:12px;color:'+(ch>=0?'var(--up)':'var(--dn)')+'">'+(ch>=0?'+':'')+ch.toFixed(2)+'%</span></span></div>';}).join('')||
'<div style="color:var(--mut);padding:16px 4px;font-size:13px">'+(PTAB==='fav'?'No favorites yet. Tap ☆ to add.':'No coin found')+'</div>';}
function fv2(v){v=+v||0;return v>=1e9?(v/1e9).toFixed(2)+'B':v>=1e6?(v/1e6).toFixed(2)+'M':v>=1e3?(v/1e3).toFixed(1)+'K':v.toFixed(0);}
$('pList2').onclick=function(e){var f=e.target.closest('[data-f]');if(f){var l=favs(),c=f.dataset.f,i=l.indexOf(c);if(i>-1)l.splice(i,1);
else l.push(c);setFavs(l);pairDraw();return;}var r=e.target.closest('[data-c]');if(!r)return;cur=r.dataset.c;pairClose();
if(location.hash==='#trade')loadTrade();else go('trade');};
var CHO=0,CHT='book',PERF={};
function chOpen(){var o=$('chOv');$('chHost').appendChild($('tfs'));$('chHost').appendChild($('chart'));o.style.display='flex';CHO=1;
document.body.style.overflow='hidden';chHead();drawCandles();chBook();chPerf();}
function chClose(){var b=$('chBox');b.appendChild($('tfs'));b.appendChild($('chart'));$('chOv').style.display='none';CHO=0;document.body.style.overflow='';
$('chart').style.height='';drawCandles();}
function chHead(){var t=T[cur]||{},ch=+t.pct||0,f=favs().indexOf(cur)>-1;$('chOvT').textContent=cur+'/USDT';$('chFav').textContent=f?'★':'☆';
$('chFav').style.color=f?'var(--gold)':'var(--tx)';$('chBig').textContent=t.lastPrice?fp(t.lastPrice):'—';
$('chPct').textContent=(ch>=0?'+':'')+ch.toFixed(2)+'%';$('chPct').style.color=ch>=0?'var(--up)':'var(--dn)';
$('chStats').innerHTML=[['24h High',fp(t.highPrice)],['24h Low',fp(t.lowPrice)],['24h Vol('+cur+')',fv2(t.volume)],['24h Vol(USDT)',fv2(t.quoteVolume)]]
.map(function(r){return '<span>'+r[0]+'</span><b>'+(t.lastPrice?r[1]:'—')+'</b>';}).join('');}
function chPerf(){var s=cur;if(PERF[s]){drawPerf(PERF[s]);return;}$('chPerf').innerHTML='';fetch(API+'klines?symbol='+s+'USDT&interval=1d&limit=366')
.then(function(r){return r.json();}).then(function(k){if(!Array.isArray(k)||!k.length)return;PERF[s]=k.map(function(x){return +x[4];});
if(s===cur)drawPerf(PERF[s]);}).catch(function(){});}
function drawPerf(c){var last=+(T[cur]||{}).lastPrice||c[c.length-1];$('chPerf').innerHTML=[['Today',1],['7 Days',7],['30 Days',30],['90 Days',90],
['180 Days',180],['1 Year',365]].map(function(p){var i=c.length-1-p[1],b=i>=0?c[i]:null,v=b?(last-b)/b*100:null;return '<div><span>'+p[0]+
'</span><b style="color:'+(v==null?'var(--mut)':v>=0?'var(--up)':'var(--dn)')+'">'+(v==null?'—':(v>=0?'+':'')+v.toFixed(2)+'%')+'</b></div>';}).join('');}
function chTab(t){CHT=t;document.querySelectorAll('#chTabs button').forEach(function(b){var on=b.dataset.t===t;b.style.background=on?'var(--card2)':'transparent';
b.style.color=on?'var(--tx)':'var(--mut)';});chBook();}
function chBook(){var b=BOOK||{asks:[],bids:[],trades:[]},box=$('chBookBox');if(CHT==='trades'){var tr=b.trades||[];
box.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:11px;color:var(--mut);padding:4px 0"><span>Time</span>'+
'<span style="text-align:right">Price (USDT)</span><span style="text-align:right">Amount ('+esc(cur)+')</span></div>'+(tr.map(function(x){
return '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:12.5px;padding:3px 0"><span style="color:var(--mut2)">'+
new Date(x[3]).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})+'</span><span style="text-align:right;color:'+
(x[2]==='buy'?'var(--up)':'var(--dn)')+'">'+fp(x[0])+'</span><span style="text-align:right">'+(+x[1]).toFixed(4)+'</span></div>';}).join('')||
'<div style="color:var(--mut);padding:14px 0;font-size:13px">No trades on Nexora yet</div>');return;}
var bs=b.bids||[],as=b.asks||[],sb2=bs.reduce(function(s,x){return s+ +x[1];},0),sa=as.reduce(function(s,x){return s+ +x[1];},0),
pb=sb2+sa?Math.round(sb2/(sb2+sa)*1000)/10:50,mx=Math.max.apply(0,bs.concat(as).map(function(x){return +x[1];}))||1,n=Math.max(bs.length,as.length);
var rows='';for(var i=0;i<n;i++){var B=bs[i],A=as[i];rows+='<div style="display:grid;grid-template-columns:1fr 1fr;font-size:12.5px">'+
'<div data-pr="'+(B?B[0]:'')+'" data-s="sell" style="display:flex;justify-content:space-between;padding:4px 6px 4px 0;background:'+(B?
'linear-gradient(to left,rgba(46,189,133,.16) '+Math.round(B[1]/mx*100)+'%,transparent 0)':'none')+'">'+(B?'<span>'+(+B[1]).toFixed(3)+
'</span><span style="color:var(--up)">'+fp(B[0])+'</span>':'')+'</div><div data-pr="'+(A?A[0]:'')+'" data-s="buy" style="display:flex;'+
'justify-content:space-between;padding:4px 0 4px 6px;background:'+(A?'linear-gradient(to right,rgba(246,70,93,.16) '+Math.round(A[1]/mx*100)+
'%,transparent 0)':'none')+'">'+(A?'<span style="color:var(--dn)">'+fp(A[0])+'</span><span>'+(+A[1]).toFixed(3)+'</span>':'')+'</div></div>';}
box.innerHTML='<div style="display:flex;align-items:center;gap:6px;font-size:12px;padding:4px 0 8px"><span style="color:var(--up)">'+pb+
'%</span><div style="flex:1;height:5px;border-radius:3px;background:var(--dnb);overflow:hidden"><div style="height:100%;width:'+pb+
'%;background:var(--upb)"></div></div><span style="color:var(--dn)">'+(Math.round((100-pb)*10)/10)+'%</span></div><div style="display:grid;'+
'grid-template-columns:1fr 1fr;font-size:11px;color:var(--mut);padding-bottom:4px"><span>Bid</span><span style="padding-left:6px">Ask</span></div>'+
(rows||'<div style="color:var(--mut);padding:14px 0;font-size:13px">No orders on the Nexora order book yet</div>');}
$('chBookBox').onclick=function(e){var r=e.target.closest('[data-pr]');if(!r||!r.dataset.pr)return;chClose();setSide(r.dataset.s);
if(OT!=='limit')setOT('limit');$('tprice').value=String(+r.dataset.pr);calc('p');};
function chFavT(){var l=favs(),i=l.indexOf(cur);if(i>-1)l.splice(i,1);else l.push(cur);setFavs(l);chHead();}
var MORE=[['Preferences','M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',0],
['Demo Trading','M6 12h4M8 10v4M15 11h.01M18 13h.01M7 6h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z',0],
['History','M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5','hist'],['Trade Analysis','M21 12A9 9 0 1 1 12 3v9zM15 3.5A9 9 0 0 1 20.5 9H15z',0],
['Heatmap','M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',0],['Fee','M19 5L5 19M7 7h.01M17 17h.01','fee'],
['Trading Parameters','M4 5h7v14H4zM13 5h7v14h-7zM6 9h3M6 12h3M15 9h3M15 12h3','par'],['Announcement','M4 10v4h3l6 4V6L7 10zM17 9a4 4 0 0 1 0 6',0],
['Help Center','M12 3L2 8l10 5 10-5zM6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5','help'],['Add to favorites','M12 3l2.9 6 6.1.6-4.6 4.2 1.4 6.2L12 17l-5.8 3 1.4-6.2L3 9.6 9.1 9z','fav']];
function moreOpen(){$('moreInfo').style.display='none';$('moreGrid').innerHTML=MORE.map(function(m,i){var fav=m[2]==='fav'&&favs().indexOf(cur)>-1;
return '<button type="button" data-m="'+i+'" style="background:none;border:0;color:var(--tx);display:flex;flex-direction:column;align-items:center;'+
'gap:6px;font-size:11.5px;text-align:center"><span style="width:52px;height:52px;border-radius:16px;background:var(--card2);display:flex;'+
'align-items:center;justify-content:center;position:relative"><svg width="24" height="24" viewBox="0 0 24 24" fill="'+(fav?'var(--gold)':'none')+
'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+m[1]+'"/></svg>'+(m[2]?'':
'<span class="soon" style="position:absolute;top:-6px;right:-8px;font-size:9px">Soon</span>')+'</span>'+(m[2]==='fav'&&fav?'Remove favorite':m[0])+
'</button>';}).join('');$('shMore').classList.add('on');$('shOv').classList.add('on');}
function moreClose(){$('shMore').classList.remove('on');if(!$('shPair').classList.contains('on')&&!$('shNet').classList.contains('on'))
$('shOv').classList.remove('on');}
$('moreGrid').onclick=function(e){var b=e.target.closest('[data-m]');if(!b)return;var m=MORE[+b.dataset.m],a=m[2],inf=$('moreInfo');
if(!a){say(m[0]+' – coming soon');return;}
if(a==='hist'){moreClose();OTAB='hist';document.querySelectorAll('#toTabs .tab').forEach(function(x){x.classList.toggle('on',x.dataset.o==='hist');});
loadOrders();$('toTabs').scrollIntoView({behavior:'smooth'});return;}
if(a==='help'){moreClose();supOpen();return;}
if(a==='fav'){var l=favs(),i=l.indexOf(cur);if(i>-1){l.splice(i,1);say(cur+' removed from favorites');}else{l.push(cur);say(cur+'/USDT added to favorites');}
setFavs(l);moreClose();return;}
inf.style.display='block';if(a==='fee')inf.innerHTML='<b style="color:var(--tx)">Spot trading fee</b><br>Maker (your order waits on the book): '+
(SPOTFEE*100).toFixed(2)+'%<br>Taker (your order fills at once): '+(SPOTFEE*100).toFixed(2)+'%<br>The fee is taken from what you receive.';
else inf.innerHTML='<b style="color:var(--tx)">'+cur+'/USDT trading parameters</b><br>Minimum order: 5 USDT<br>Amount precision: 8 decimals<br>'+
'Order types: Limit, Market<br>Up to 100 open orders per account<br>Fee: '+(SPOTFEE*100).toFixed(2)+'%';};
/* P2P: tell the seller when a buyer has paid */
function p2pNotice(){if(!ME||!sb)return;sb.from('nx_p2p_orders').select('id,fiat_amount,fiat,qty').eq('seller',ME.id).eq('status','paid')
.order('id').then(function(r){var l=r.data||[],b=$('p2pBan'),o=l.filter(function(x){return !(location.hash==='#p2porder'&&PO===x.id);})[0];
if(!o){b.style.display='none';return;}b.style.display='flex';b.innerHTML='<span style="flex:1">Buyer paid <b>'+nf(o.fiat_amount)+' '+esc(o.fiat)+
'</b> for P2P order #'+o.id+'. Check your account and release.</span><button class="btn gold" style="height:34px;padding:0 12px;font-size:12.5px" '+
'onclick="PO='+o.id+';go(\'p2porder\')">Open</button>';});}
setInterval(function(){if(document.visibilityState==='visible')p2pNotice();},20000);setTimeout(p2pNotice,3000);
drawHome();show();loadTickers();setInterval(loadTickers,60000);liveTick();
