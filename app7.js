/* Nexora P2P: India only (INR) + payment method form with separate boxes. Loaded after app2.js. */
(function(){
function q7(i){return document.getElementById(i);}
function x7(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

/* ---- India only ---- */
window.PAYS=['UPI','IMPS','Bank Transfer','Paytm','PhonePe','Google Pay'];
window.FIATS=['INR'];
window.pFiat=function(){return 'INR';};
try{localStorage.setItem('nx_fiat','INR');}catch(e){}
function fill(id,list,first){var s=q7(id);if(!s)return;var v=s.value;s.innerHTML=(first||'')+list.map(function(x){return '<option>'+x7(x)+'</option>';}).join('');
if(list.indexOf(v)>=0)s.value=v;}
function india(){fill('pFiat',FIATS);fill('adFiat',FIATS);fill('pPay',PAYS,'<option value="">All payment methods</option>');
['pFiat','adFiat'].forEach(function(id){var s=q7(id);if(s){s.value='INR';var l=s.closest('label');if(l)l.style.display='none';else s.style.display='none';}});
if(typeof adPays==='function'&&q7('adPays')&&q7('adPays').children.length)adPays();}
india();

/* ---- payment method form ---- */
var F={
 'UPI':[['upi','UPI ID','e.g. name@okaxis',1]],
 'IMPS':[['acc','Account number','Bank account number',1],['acc2','Confirm account number','Enter the account number again',1],
         ['ifsc','IFSC code','e.g. KKBK0005678',1],['bank','Bank name','e.g. Kotak Mahindra Bank',1]],
 'Bank Transfer':[['acc','Account number','Bank account number',1],['acc2','Confirm account number','Enter the account number again',1],
         ['ifsc','IFSC code','e.g. KKBK0005678',1],['bank','Bank name','e.g. Kotak Mahindra Bank',1]],
 'Paytm':[['phone','Paytm mobile number','10-digit mobile number',1],['upi','Paytm UPI ID (optional)','e.g. 98xxxxxxxx@paytm',0]],
 'PhonePe':[['phone','PhonePe mobile number','10-digit mobile number',1],['upi','PhonePe UPI ID (optional)','e.g. 98xxxxxxxx@ybl',0]],
 'Google Pay':[['phone','Google Pay mobile number','10-digit mobile number',1],['upi','Google Pay UPI ID (optional)','e.g. name@okicici',0]]};
var LBL={upi:'UPI ID',acc:'Account number',ifsc:'IFSC',bank:'Bank',phone:'Mobile'};

var form=q7('pmForm');
if(form){
form.innerHTML='<div class="ct">Add a payment method</div>'+
'<label class="fl">Type<select class="in" name="type" id="pmType">'+PAYS.map(function(p){return '<option>'+x7(p)+'</option>';}).join('')+'</select></label>'+
'<label class="fl">Account holder name (same as your KYC name)<input class="in" name="name" id="pmName" required autocomplete="name"></label>'+
'<div id="pmBox" style="display:flex;flex-direction:column;gap:10px"></div>'+
'<div id="pmErr" style="display:none;font-size:13px;font-weight:600;color:#FF6B7A"></div>'+
'<div style="font-size:12px;color:var(--mut2);line-height:1.5">The name must match your KYC name. Buyers will pay only to these details.</div>'+
'<button class="btn gold" type="submit">Save</button>';
function draw(){var t=q7('pmType').value;q7('pmBox').innerHTML=(F[t]||[]).map(function(f){
return '<label class="fl">'+x7(f[1])+'<input class="in" id="pm_'+f[0]+'" placeholder="'+x7(f[2])+'"'+(f[0]==='acc'||f[0]==='acc2'||f[0]==='phone'?
' inputmode="numeric"':'')+(f[0]==='ifsc'?' style="text-transform:uppercase"':'')+(f[0]==='acc2'?' autocomplete="off"':'')+'></label>'+(f[0]==='ifsc'?'<div id="pmIfscOk" style="display:none;font-size:12.5px;margin-top:-4px"></div>':'');}).join('');
q7('pmErr').style.display='none';var i=q7('pm_ifsc');if(i){var tm=null;i.oninput=function(){var v=this.value.toUpperCase().replace(/\s/g,'');clearTimeout(tm);
var m=q7('pmIfscOk');m.style.display='none';if(v.length>=6)tm=setTimeout(function(){look(v);},500);};}}
function look(v){var m=q7('pmIfscOk');try{fetch('https://ifsc.razorpay.com/'+encodeURIComponent(v)).then(function(r){return r.ok?r.json():null;}).then(function(j){
if(!m)return;if(!j){m.style.display='none';return;}var b=q7('pm_bank');if(b&&!b.value)b.value=j.BANK||'';
m.style.display='block';m.style.color='#3FD39A';m.textContent='\u2713 IFSC verified: '+(j.BANK||'')+(j.BRANCH?', '+j.BRANCH:'');}).catch(function(){});}catch(e){}}
q7('pmType').onchange=draw;draw();
function setName(){var n=q7('pmName');if(n&&!n.value&&window.PROF&&PROF.full_name)n.value=PROF.full_name;}
setName();setTimeout(setName,1500);
function err(t){var e=q7('pmErr');e.textContent=t;e.style.display='block';}
function val(k){var e=q7('pm_'+k);return e?e.value.trim():'';}
form.onsubmit=function(ev){ev.preventDefault();q7('pmErr').style.display='none';var t=q7('pmType').value,name=q7('pmName').value.trim();
if(name.length<3){err('Enter the account holder name.');return;}
var lines=[];
if(t==='UPI'){var u=val('upi');if(!/^[A-Za-z0-9.\-_]{2,}@[A-Za-z]{2,}$/.test(u)){err('Enter a valid UPI ID, like name@okaxis');return;}lines.push('UPI ID: '+u);}
else if(t==='IMPS'||t==='Bank Transfer'){var a=val('acc').replace(/\s/g,''),a2=val('acc2').replace(/\s/g,''),f=val('ifsc').toUpperCase(),b=val('bank');
if(!/^\d{9,18}$/.test(a)){err('Enter a valid account number (9 to 18 digits).');return;}
if(a!==a2){err('The two account numbers do not match.');return;}
f=f.replace(/\s/g,'');if(!/^[A-Z0-9]{4,20}$/.test(f)){err('Enter the IFSC code (letters and numbers only).');return;}
if(b.length<3){err('Enter the bank name.');return;}
lines.push('Account number: '+a,'IFSC: '+f,'Bank: '+b);}
else{var p=val('phone').replace(/\D/g,'').replace(/^91(?=\d{10}$)/,''),u2=val('upi');
if(!/^[6-9]\d{9}$/.test(p)){err('Enter a valid 10-digit mobile number.');return;}
if(u2&&!/^[A-Za-z0-9.\-_]{2,}@[A-Za-z]{2,}$/.test(u2)){err('The UPI ID is not valid.');return;}
lines.push('Mobile: '+p);if(u2)lines.push('UPI ID: '+u2);}
var btn=form.querySelector('button[type=submit]');btn.disabled=true;
sb.rpc('nx_p2p_method_add',{p_type:t,p_name:name,p_details:lines.join('\n')}).then(function(r){btn.disabled=false;
if(r.error){err(errText(r.error));return;}draw();say('Saved');if(typeof loadMeth==='function')loadMeth(drawMeth);});};
}

/* keep India settings when P2P pages open */
window.addEventListener('hashchange',function(){var h=(location.hash||'').slice(1);if(/^p2p/.test(h))setTimeout(india,50);});
})();
