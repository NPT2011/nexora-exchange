/* Nexora admin: Staff tab (owner only) + hide the liquidity account in Users. Loaded after admin3.js. */
(function(){
var tabs=$('tabs');if(!tabs)return;
var b=document.createElement('button');b.className='tab';b.dataset.t='staff';b.textContent='Staff';b.style.display='none';tabs.appendChild(b);
setInterval(function(){b.style.display=(typeof ROLE!=='undefined'&&ROLE==='owner')?'':'none';},1000);
tabs.addEventListener('click',function(e){var t=e.target.closest('.tab');if(!t||t.dataset.t!=='staff')return;
e.stopImmediatePropagation();TAB='staff';tabs.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===t);});
clearInterval(SUPTM);vStaff();},true);
var RN={owner:'Owner (full access)',finance:'Finance: deposits, withdrawals, fund transfer',kyc:'KYC: check and approve KYC',support:'Support: live chat'};
window.vStaff=function(){$('view').innerHTML='<div class="k">Loading…</div>';rpc('nx_admin_staff_list').then(function(l){
$('view').innerHTML='<div class="card"><div class="bn" style="font-size:15px">Add staff</div>'+
'<div class="k" style="margin:6px 0 10px;line-height:1.6">1. The person makes a normal Nexora account and turns on Google Authenticator (2FA).<br>'+
'2. Enter their UID or email here and choose a role.<br>3. They log in at this same admin page with their own email, password and 2FA code. They only see what their role allows.</div>'+
'<input class="in" id="stU" placeholder="UID (e.g. NX123456) or email" style="width:100%;margin-bottom:8px">'+
'<select class="in" id="stR" style="width:100%;margin-bottom:10px"><option value="support">'+RN.support+'</option><option value="kyc">'+RN.kyc+'</option><option value="finance">'+RN.finance+'</option></select>'+
'<button class="btn gold" onclick="stAdd()">Add / change role</button></div>'+
'<div class="sec" style="margin:14px 0 8px;font-weight:600">Admin team ('+l.length+')</div>'+
l.map(function(s){return '<div class="card"><div class="row" style="justify-content:space-between"><b>'+esc(s.uid||'—')+' · '+esc(s.full_name||'—')+(s.is_me?' (you)':'')+'</b>'+
'<span class="pill">'+esc(s.role)+'</span></div><div class="k" style="margin-top:4px">'+esc(s.email||'')+'</div><div class="k">'+esc(RN[s.role]||s.role)+'</div>'+
'<div class="k" style="color:'+(s.has_2fa?'var(--up)':'var(--dn)')+'">'+(s.has_2fa?'2FA on':'2FA not on yet – cannot log in to admin until 2FA is on')+'</div>'+
(s.role!=='owner'&&!s.is_me?'<button class="btn" style="margin-top:8px;border:1px solid #3A2430;color:var(--dn);background:transparent" onclick="stDel(\''+s.user_id+'\')">Remove</button>':'')+
'</div>';}).join('');});};
window.stAdd=function(){var u=$('stU').value.trim(),r=$('stR').value;if(!u){say('Enter UID or email');return;}
if(!confirm('Give "'+r+'" access to '+u+'?'))return;rpc('nx_admin_staff_set',{p_user:u,p_role:r}).then(function(){say('Done');vStaff();});};
window.stDel=function(id){if(!confirm('Remove this staff member?'))return;rpc('nx_admin_staff_remove',{p_user:id}).then(function(){say('Removed');vStaff();});};
/* hide the market-maker liquidity account from the Users list (search NXLIQ01 to see it) */
setInterval(function(){try{if(TAB!=='users')return;var q=(typeof UQ!=='undefined'?UQ:'')||'';if(/NXLIQ/i.test(q))return;
document.querySelectorAll('#view .card').forEach(function(c){var h=c.querySelector('b');if(h&&/^NXLIQ01\b/.test(h.textContent))c.style.display='none';});}catch(e){}},400);
})();
