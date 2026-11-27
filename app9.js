/* Nexora - small add-ons: KYC notice on Withdraw, official site line in the footer, network badge on the deposit QR. */
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
function qrBadge(){var box=$('dAddrBox');if(!box)return;var c=box.querySelector('div[style*="translate(-50%,-50%)"]');if(!c)return;
 var a='',n='';try{a=dAsset;n=dNet;}catch(e){return;}
 var nc={BEP20:'BNB',ERC20:'ETH',TRC20:'TRX',SOL:'SOL',POLYGON:'POL',BTC:'BTC'}[n];var k=a+'|'+n,old=c.querySelector('.nxNb');
 if(old&&old.dataset.k===k)return;if(old)old.remove();if(!nc||nc===a||typeof limg!=='function')return;
 var b=document.createElement('span');b.className='nxNb';b.dataset.k=k;
 b.style.cssText='position:absolute;right:-3px;bottom:-3px;background:#fff;border-radius:50%;padding:2px;line-height:0;box-shadow:0 0 0 1px rgba(0,0,0,.08)';
 b.innerHTML=limg(nc,18);c.style.position='absolute';c.appendChild(b);}
function run(){try{qrBadge();}catch(e){}try{kycBox();}catch(e){}try{footer();}catch(e){}}
run();setInterval(run,700);window.addEventListener('hashchange',function(){setTimeout(run,100);});
})();
