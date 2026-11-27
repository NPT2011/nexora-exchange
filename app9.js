/* Nexora - small add-ons: KYC notice on the Withdraw page, official site line in the footer. */
(function(){
function $(i){return document.getElementById(i);}
function prof(){try{return (typeof PROF!=='undefined'&&PROF)?PROF:null;}catch(e){return null;}}
function me(){try{return (typeof ME!=='undefined'&&ME)?ME:null;}catch(e){return null;}}
function kycBox(){var pg=$('p-withdraw'),t=$('wTitle');if(!pg||!t)return;var b=$('kycWdBan');
 var u=me(),p=prof(),st=p?(p.kyc_status||'none'):null;
 if(!u||!p||st==='approved'){if(b)b.style.display='none';return;}
 if(!b){b=document.createElement('div');b.id='kycWdBan';t.parentNode.insertBefore(b,t.nextSibling);}
 b.style.cssText='display:flex;align-items:center;gap:12px;padding:13px 14px;margin:4px 0 12px;border-radius:14px;background:rgba(230,180,80,.1);border:1px solid rgba(230,180,80,.45)';
 var h;
 if(st==='pending')h='<div style="flex:1"><b style="color:var(--gold)">KYC under review</b><div style="font-size:12.5px;color:var(--mut2);margin-top:3px;line-height:1.5">You can withdraw after your KYC is approved. This usually takes up to 24 hours.</div></div>';
 else h='<div style="flex:1"><b style="color:var(--gold)">'+(st==='rejected'?'KYC rejected':'Complete KYC to withdraw')+'</b><div style="font-size:12.5px;color:var(--mut2);margin-top:3px;line-height:1.5">'+
  (st==='rejected'?'Please submit your KYC again to enable withdrawals.':'Verify your identity once to enable withdrawals. It takes only a few minutes.')+'</div></div>'+
  '<button type="button" class="btn gold" style="height:36px;padding:0 14px;font-size:13px;flex:none" onclick="go(\'kyc\')">Verify now</button>';
 if(b._h!==h){b.innerHTML=h;b._h=h;}}
function footer(){if($('nxOff'))return;var t=document.querySelector('a[href="risk.html"]');if(!t)return;var row=t.parentNode;
 var d=document.createElement('div');d.id='nxOff';d.style.cssText='text-align:center;font-size:12.5px;color:var(--mut);padding:2px 0 6px';
 d.innerHTML='Official site: <a href="https://www.nexorax.io" style="color:var(--gold)">www.nexorax.io</a>';row.parentNode.insertBefore(d,row.nextSibling);}
function run(){try{kycBox();}catch(e){}try{footer();}catch(e){}}
run();setInterval(run,1500);window.addEventListener('hashchange',function(){setTimeout(run,100);});
})();
