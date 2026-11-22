var SB_URL='https://cttfcljydiluvccgivto.supabase.co';
var SB_KEY='sb_publishable_JEp-0dxsA6_PZF6Hcb5fSQ_LWAevHDL';
var sb=window.supabase?window.supabase.createClient(SB_URL,SB_KEY):null;
var ME=null,PROF=null,aMode='up',mfaFactor=null;
function say(t){var x=document.getElementById('toast');x.textContent=t;x.classList.add('on');clearTimeout(x._h);
x._h=setTimeout(function(){x.classList.remove('on');x.textContent='Launching soon on Nexora Exchange';},3500);}
function aMsg(t,ok){var m=document.getElementById('aMsg');if(!t){m.style.display='none';return;}m.style.display='block';
m.textContent=t;m.style.background=ok?'rgba(14,138,95,.18)':'rgba(200,48,63,.18)';
m.style.color=ok?'#7FE3BA':'#FF9AA5';}
function need(){if(ME)return true;openAuth('in');return false;}
function openAuth(m){setMode(m);location.hash='auth';}
function setMode(m){aMode=m;var up=m==='up',fp=m==='forgot',code=m==='code';aMsg('');
document.getElementById('aTitle').textContent=up?'Create account':fp?'Reset password':code?'Two-factor check':'Log in';
document.querySelectorAll('#aSeg button').forEach(function(b){var on=b.dataset.m===m;
b.style.background=on?'var(--gold)':'transparent';b.style.color=on?'var(--bg)':'var(--mut)';});
document.getElementById('aSeg').style.display=code?'none':'grid';
document.getElementById('fName').style.display=up?'flex':'none';
document.getElementById('fRef').style.display=up?'flex':'none';
document.getElementById('fCountry').style.display=up?'flex':'none';if(up)loadCountries();
document.getElementById('fPass').style.display=(fp||code)?'none':'flex';
document.getElementById('fCode').style.display=code?'flex':'none';
document.querySelector('#aForm [name=email]').parentNode.style.display=code?'none':'flex';
document.getElementById('aForgot').style.display=m==='in'?'block':'none';
document.getElementById('aBtn').textContent=up?'Create account':fp?'Send reset link':code?'Verify':'Log in';
try{var r=localStorage.getItem('nx_ref');if(r&&up)document.querySelector('#aForm [name=ref]').value=r;}catch(e){}}
var HOT=['BTC','ETH','BNB','SOL','XRP','DOGE','TON','ADA','TRX','AVAX'];
var COINS=HOT.slice();
var STABLE=/^(USDC|FDUSD|TUSD|BUSD|DAI|USDP|EUR|AEUR|EURI|USDE|USD1|PAXG|XUSD|BFUSD)$/;
var API='https://data-api.binance.vision/api/v3/';
var DEX='https://api.dexscreener.com/';
var WSS='wss://data-stream.binance.vision/';
var T={},cur='BTC',side='buy',htab='hot',mtab='spot',dexRows=[],dexT=null;
var IC={dep:'M12 3v12M7 10l5 5 5-5M4 21h16',wd:'M12 21V9M7 14l5-5 5 5M4 3h16',
p2p:'M8 7a3 3 0 1 0 0-.1M16 17a3 3 0 1 0 0-.1M4 21a4 4 0 0 1 8 0M12 11a4 4 0 0 1 8 0',
cv:'M4 8h13l-3-3M20 16H7l3 3',cp:'M8 8h11v11H8zM5 16V5h11',
bot:'M5 9h14v10H5zM12 5v4M9 14h.01M15 14h.01M2 13v3M22 13v3',
ref:'M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0',
por:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',mk:'M4 20V10M10 20V4M16 20v-7M22 20H2',
tr:'M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4',wl:'M3 6h18v14H3zM3 10h18M16 15h2',
ac:'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21a8 8 0 0 1 16 0'};
function svg(p,s){return '<svg width="'+(s||22)+'" height="'+(s||22)+'" viewBox="0 0 24 24" fill="none" '+
'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+
'<path d="'+p+'"/></svg>';}
function $(i){return document.getElementById(i);}
function soon(){var t=$('toast');t.classList.add('on');clearTimeout(t._h);
t._h=setTimeout(function(){t.classList.remove('on');},1800);}
function fp(v){v=+v;if(v>=1000)return v.toLocaleString('en-US',{maximumFractionDigits:2});
if(v>=1)return v.toFixed(3);if(v>=0.01)return v.toFixed(4);return v.toPrecision(4);}
function fv(v){v=+v;if(v>=1e9)return (v/1e9).toFixed(2)+'B';if(v>=1e6)return (v/1e6).toFixed(1)+'M';
if(v>=1e3)return (v/1e3).toFixed(1)+'K';return v.toFixed(0);}

var QA=[['Deposit','dep','addfunds'],['Withdraw','wd','withdraw'],['P2P','p2p','p2p'],['Convert','cv'],
['Copy Trade','cp'],['Trading Bot','bot'],['Refer & Earn','ref','account'],['Proof of Reserves','por']];
$('qa').innerHTML=QA.map(function(q){return '<button class="q" data-g="'+(q[2]||'')+'"><span class="qi">'+
svg(IC[q[1]])+'</span>'+q[0]+'</button>';}).join('');
$('qa').onclick=function(e){var b=e.target.closest('.q');if(!b)return;b.dataset.g?go(b.dataset.g):soon();};

var NAV=[['home','Home','home'],['markets','Markets','mk'],['trade','Trade','tr'],['wallet','Wallet','wl'],
['account','Account','ac']];
$('nav').innerHTML=NAV.map(function(n){return '<button class="nb" data-p="'+n[0]+'">'+svg(IC[n[2]])+n[1]+
'</button>';}).join('');
$('nav').onclick=function(e){var b=e.target.closest('.nb');if(b)go(b.dataset.p);};

function go(p){location.hash=p;}
var MENU=[['Trade',[['Markets','mk','markets'],['Spot trading','tr','trade'],['Convert','cv'],['P2P trading','p2p','p2p'],
['Futures (soon)','fut']]],
['Earn & Tools',[['Copy trading','cp'],['Trading bot','bot'],['API keys','key'],['Refer & Earn','ref','account']]],
['Assets',[['Wallet','wl','wallet'],['Deposit','dep','addfunds'],['Withdraw','wd','withdraw'],['Transfer','cv','transfer'],['Transaction history','his','history']]],
['Nexora',[['List your token','lst','listing'],['Proof of Reserves','por'],['Fee rates','fee'],
['Security & 2FA','sec','account'],['Help & support','hlp','chat']]],
['Community',[['Telegram','tgm','tg'],['X (Twitter)','x','x']]]];
IC.fut='M3 17l6-6 4 4 8-8M15 7h6v6';IC.key='M15 7a4 4 0 1 1-3.9 5H3v3h3v3h3v-3h2.1A4 4 0 0 1 15 7z';
IC.his='M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5';IC.lst='M12 5v14M5 12h14';
IC.fee='M19 5L5 19M7 7h.01M17 17h.01';IC.sec='M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4';
IC.hlp='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01';
IC.tgm='M21 4L3 11l6 2 2 6 3-4 5 4z';IC.x='M4 4l16 16M20 4L4 20';
$('dmenu').innerHTML=MENU.map(function(g){return '<div class="dg"><div class="dt">'+g[0]+'</div>'+g[1].map(function(i){
return '<button class="di" data-g="'+(i[2]||'')+'">'+svg(IC[i[1]],20)+i[0]+'</button>';}).join('')+'</div>';}).join('');
$('dmenu').onclick=function(e){var b=e.target.closest('.di');if(!b)return;var g=b.dataset.g;menu(0);
if(g==='chat')supOpen();else if(g==='tg')window.open('https://t.me/MineXoraOfficial','_blank');else if(g==='x')window.open('https://x.com/MineXoraAsia','_blank');
else if(g)go(g);else soon();};
function menu(o){$('dr').classList.toggle('on',!!o);$('ov').classList.toggle('on',!!o);}
function show(){var p=(location.hash||'#home').slice(1);if(!$('p-'+p))p='home';
document.querySelectorAll('.pg').forEach(function(s){s.classList.toggle('on',s.id==='p-'+p);});
document.querySelectorAll('.nb').forEach(function(b){b.classList.toggle('on',b.dataset.p===p);});
window.scrollTo(0,0);if(p==='docs')drawDocs();if(p.indexOf('p2p')===0)p2pPage(p);if(p==='kyc')drawKyc();if(p==='trade')loadTrade();if(p==='2fa')load2fa();if(WPAGES.indexOf(p)>-1)walletPage(p);
if(p==='auth'&&!document.getElementById('aTitle').dataset.i){document.getElementById('aTitle').dataset.i=1;setMode(aMode);}}
window.onhashchange=show;

function rowHtml(c,big){var t=T[c];if(!t)return '';var ch=+t.pct,up=ch>=0;
return '<button class="row" data-c="'+c+'"><span class="av">'+c[0]+'</span><span class="nm"><b>'+c+
'<i>/USDT</i></b><span>Vol '+fv(t.quoteVolume)+'</span></span><span class="pr" data-p="'+c+'">'+fp(t.lastPrice)+
'</span>'+(big?'<span class="chg" data-cb="'+c+'" style="background:'+(up?'var(--upb)':'var(--dnb)')+'">':
'<span data-ct="'+c+'" style="width:86px;text-align:right;font-weight:600;font-size:14px;color:'+
(up?'var(--up)':'var(--dn)')+'">')+
(up?'+':'')+ch.toFixed(2)+'%</span></button>';}
function drawHome(){var l=(htab==='hot'?HOT:COINS).filter(function(c){return T[c];});
if(htab==='up')l.sort(function(a,b){return T[b].pct-T[a].pct;});
if(htab==='dn')l.sort(function(a,b){return T[a].pct-T[b].pct;});
if(htab==='vol')l.sort(function(a,b){return T[b].quoteVolume-T[a].quoteVolume;});
$('hlist').innerHTML=l.slice(0,6).map(function(c){return rowHtml(c,1);}).join('')||
'<div style="padding:16px 0;color:var(--mut);font-size:13px">Loading prices…</div>';}
function drawMk(){if(mtab!=='spot')return;var q=$('q').value.trim().toUpperCase();
var l=COINS.filter(function(c){return T[c]&&c.indexOf(q)>-1;});
$('minfo').textContent=COINS.length+' USDT pairs · live prices'+(l.length>150?' · showing top 150, search for more':'');
$('mlist').innerHTML=l.slice(0,150).map(function(c){return rowHtml(c,0);}).join('');}

/* DEX tokens: BSC + Solana (DexScreener) */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return '&#'+c.charCodeAt(0)+';';});}
function bestPairs(pairs,chain){var m={};(pairs||[]).forEach(function(p){if(p.chainId!==chain||!p.baseToken)return;
var a=p.baseToken.address,l=(p.liquidity&&p.liquidity.usd)||0;if(!m[a]||l>m[a].l)m[a]={p:p,l:l};});
return Object.keys(m).map(function(k){return m[k].p;}).sort(function(a,b){
return ((b.liquidity||{}).usd||0)-((a.liquidity||{}).usd||0);});}
function drawDex(){var ex=mtab==='bsc'?'https://bscscan.com/token/':'https://solscan.io/token/';
$('minfo').textContent=(mtab==='bsc'?'BSC':'Solana')+' tokens · live DEX prices (not yet listed on Nexora)';
$('mlist').innerHTML=dexRows.length?dexRows.slice(0,60).map(function(p){var b=p.baseToken,
ch=+((p.priceChange||{}).h24||0),up=ch>=0;return '<a class="row" target="_blank" rel="noopener" href="'+
esc(ex+b.address)+'"><span class="av">'+esc((b.symbol||'?')[0])+'</span><span class="nm"><b>'+esc(b.symbol)+
'<i> '+esc((p.quoteToken||{}).symbol||'')+'</i></b><span>Liq $'+fv((p.liquidity||{}).usd||0)+' · '+
esc(b.address.slice(0,4)+'…'+b.address.slice(-4))+'</span></span><span class="pr">$'+fp(p.priceUsd||0)+
'</span><span style="width:86px;text-align:right;font-weight:600;font-size:14px;color:'+
(up?'var(--up)':'var(--dn)')+'">'+(up?'+':'')+ch.toFixed(2)+'%</span></a>';}).join(''):
'<div style="padding:16px 0;color:var(--mut);font-size:13px">Loading…</div>';}
function loadDex(){var chain=mtab,q=$('q').value.trim();dexRows=[];drawDex();
if(q){fetch(DEX+'latest/dex/search?q='+encodeURIComponent(q)).then(function(r){return r.json();})
.then(function(d){if(mtab!==chain)return;dexRows=bestPairs(d.pairs,chain);drawDex();}).catch(function(){});return;}
fetch(DEX+'token-boosts/top/v1').then(function(r){return r.json();}).then(function(a){
var ad=(a||[]).filter(function(x){return x.chainId===chain;}).map(function(x){return x.tokenAddress;}).slice(0,30);
var base=chain==='bsc'?['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c','0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82']
:['So11111111111111111111111111111111111111112','JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'];
ad=base.concat(ad).slice(0,30);return fetch(DEX+'tokens/v1/'+chain+'/'+ad.join(','));})
.then(function(r){return r.json();}).then(function(p){if(mtab!==chain)return;dexRows=bestPairs(p,chain);drawDex();})
.catch(function(){});}
$('mtabs').onclick=function(e){var b=e.target.closest('.tab');if(!b)return;if(b.dataset.m==='fut'){soon();return;}
mtab=b.dataset.m;this.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b);});
$('mh1').textContent=mtab==='spot'?'Pair / Vol':'Token / Liquidity';
$('q').placeholder=mtab==='spot'?'Search coin (BTC, ETH…)':'Search token name or contract address';
if(mtab==='spot')drawMk();else loadDex();};

/* Listing application */
$('lform').onsubmit=function(e){e.preventDefault();var f=new FormData(this),form=this,
row={project:f.get('Project'),symbol:f.get('Symbol'),chain:f.get('Chain'),contract:f.get('Contract'),
website:f.get('Website'),community:f.get('Community'),email:f.get('Email'),about:f.get('About'),details:{}};
['supply','launch','logo','pool','audit','whitepaper','twitter','other','team','company','ccountry','caddress','cname','crole',
'cphone'].forEach(function(k){var v=(f.get(k)||'').trim();if(v)row.details[k]=v;});
if(!sb){say('Connection problem. Please refresh.');return;}sb.from('listing_applications').insert(row).then(function(r){if(r.error){say('Could not submit: '+r.error.message);return;}
form.reset();say('Thank you! Your application will be checked and reviewed by our team.');});};
function drawAssets(){$('alist').innerHTML=['USDT','BTC','ETH','SOL'].map(function(c){
return '<div class="row"><span class="av">'+c[0]+'</span><span class="nm"><b>'+c+'</b></span>'+
'<span class="pr">0.00<br><span style="font-size:12px;color:var(--mut);font-weight:400">≈ $0.00</span></span></div>';
}).join('');}
$('htabs').onclick=function(e){var b=e.target.closest('.tab');if(!b)return;htab=b.dataset.k;
this.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b);});drawHome();};
$('q').oninput=function(){if(mtab==='spot'){drawMk();return;}clearTimeout(dexT);dexT=setTimeout(loadDex,500);};
document.addEventListener('click',function(e){var r=e.target.closest('.row[data-c]');
if(r){cur=r.dataset.c;go('trade');if(location.hash==='#trade')loadTrade();}});

function loadTickers(){fetch(API+'ticker/24hr?type=MINI').then(function(r){return r.json();}).then(function(a){
if(!Array.isArray(a))return;var l=[];a.forEach(function(t){var s=t.symbol;if(s.slice(-4)!=='USDT')return;
var c=s.slice(0,-4);if(!c||STABLE.test(c)||/(UP|DOWN|BULL|BEAR)$/.test(c)||!(+t.quoteVolume>0))return;
t.pct=+t.openPrice?(t.lastPrice-t.openPrice)/t.openPrice*100:0;T[c]=t;l.push(c);});
l.sort(function(x,y){return T[y].quoteVolume-T[x].quoteVolume;});COINS=l;drawHome();drawMk();
if(location.hash==='#trade')head();}).catch(function(){});}

function setSide(s){side=s;var b=s==='buy';$('bBuy').style.background=b?'var(--upb)':'transparent';
$('bBuy').style.color=b?'#fff':'var(--mut)';$('bSell').style.background=b?'transparent':'var(--dnb)';
$('bSell').style.color=b?'var(--mut)':'#fff';$('bGo').style.background=b?'var(--upb)':'var(--dnb)';
$('bGo').textContent=(b?'Buy ':'Sell ')+cur;setOT(OT);}

$('bBuy').onclick=function(){setSide('buy');};$('bSell').onclick=function(){setSide('sell');};
function head(){var t=T[cur];$('tpair').textContent=cur+'/USDT';$('chName').textContent=cur+'/USDT';if(!t)return;var ch=+t.pct;
$('tpx').textContent=fp(t.lastPrice)+' · '+(ch>=0?'+':'')+ch.toFixed(2)+'%';
$('tpx').style.color=ch>=0?'var(--up)':'var(--dn)';$('thi').textContent=fp(t.highPrice);
$('tlo').textContent=fp(t.lowPrice);}
var TF='15m',KL=[],tws=null;
function drawCandles(){var k=KL.slice(-70);if(!k.length)return;var W=400,H=260,pad=46,top=10,bot=22;
var hi=Math.max.apply(0,k.map(function(x){return x[2];})),lo=Math.min.apply(0,k.map(function(x){return x[3];}));
var rg=(hi-lo)||1,cw=(W-pad)/k.length,y=function(v){return top+(hi-v)/rg*(H-top-bot);},o='';
for(var g=0;g<=4;g++){var v=hi-rg*g/4,yy=y(v).toFixed(1);o+='<line x1="0" x2="'+(W-pad)+'" y1="'+yy+'" y2="'+yy+
'" stroke="#1A2846" stroke-width="1"/><text x="'+(W-pad+4)+'" y="'+(+yy+3)+'" fill="#8A9BB8" font-size="9">'+
fp(v)+'</text>';}
k.forEach(function(x,i){var up=x[4]>=x[1],col=up?'#3FD39A':'#FF6B7A',cx=i*cw+cw/2,
b1=y(Math.max(x[1],x[4])),b2=y(Math.min(x[1],x[4]));o+='<line x1="'+cx.toFixed(1)+'" x2="'+cx.toFixed(1)+'" y1="'+
y(x[2]).toFixed(1)+'" y2="'+y(x[3]).toFixed(1)+'" stroke="'+col+'" stroke-width="1"/><rect x="'+
(cx-cw*0.35).toFixed(1)+'" width="'+(cw*0.7).toFixed(1)+'" y="'+b1.toFixed(1)+'" height="'+
Math.max(1,b2-b1).toFixed(1)+'" fill="'+col+'"/>';});
var L=k[k.length-1],ly=y(L[4]).toFixed(1),lc=L[4]>=L[1]?'#0E8A5F':'#C8303F';
o+='<line x1="0" x2="'+(W-pad)+'" y1="'+ly+'" y2="'+ly+'" stroke="'+lc+'" stroke-dasharray="3 3"/><rect x="'+
(W-pad)+'" y="'+(ly-7)+'" width="'+pad+'" height="14" fill="'+lc+'"/><text x="'+(W-pad+3)+'" y="'+(+ly+3)+
'" fill="#fff" font-size="9" font-weight="700">'+fp(L[4])+'</text>';
$('chart').innerHTML='<svg viewBox="0 0 400 260" preserveAspectRatio="none" width="100%" height="100%">'+o+'</svg>';}
function obRows(a,col,rgb){var m=Math.max.apply(0,a.map(function(x){return +x[1];}))||1;
return a.map(function(x){var p=Math.round(+x[1]/m*100);return '<div class="ob" data-pr="'+x[0]+'" data-am="'+x[1]+'" style="cursor:pointer;background:linear-gradient'+
'(to left,rgba('+rgb+',.16) '+p+'%,transparent '+p+'%)"><span style="color:'+col+'">'+fp(x[0])+
'</span><span style="color:var(--soft)">'+(+x[1]).toFixed(3)+'</span></div>';}).join('');}
function drawBook(o){if(!o||!o.asks)return;var e='<div class="ob" style="color:var(--mut)"><span>No orders</span><span></span></div>';
$('asks').innerHTML=o.asks.length?obRows(o.asks.slice(0,7).reverse(),'var(--dn)','246,70,93'):e;
$('bids').innerHTML=o.bids.length?obRows(o.bids.slice(0,7),'var(--up)','46,189,133'):e;
var m=$('tmid');m.textContent=o.last!=null?fp(o.last):'—';m.style.color='var(--tx)';BOOK=o;}
function loadTrade(){$('tprice').value='';$('tqty').value='';head();setSide(side);tUser();var sym=cur+'USDT';
document.querySelectorAll('#tfs .tf').forEach(function(b){b.classList.toggle('on',b.dataset.i===TF);});
fetch(API+'klines?symbol='+sym+'&interval='+TF+'&limit=70').then(function(r){return r.json();}).then(function(k){
if(!Array.isArray(k))return;KL=k.map(function(x){return [x[0],+x[1],+x[2],+x[3],+x[4]];});drawCandles();})
.catch(function(){});
loadBook();
if(tws){tws.onclose=null;tws.close();}var s=sym.toLowerCase();
try{tws=new WebSocket(WSS+'stream?streams='+s+'@kline_'+TF);}catch(e){return;}
tws.onmessage=function(ev){var m=JSON.parse(ev.data),d=m.data;if(!d)return;
if(d.k){var q=d.k,c=[q.t,+q.o,+q.h,+q.l,+q.c];if(KL.length&&KL[KL.length-1][0]===q.t)KL[KL.length-1]=c;
else KL.push(c);drawCandles();}else if(d.asks)drawBook(d);};
tws.onclose=function(){setTimeout(function(){if(location.hash==='#trade')loadTrade();},3000);};}
$('tfs').onclick=function(e){var b=e.target.closest('.tf');if(!b)return;TF=b.dataset.i;loadTrade();};

/* Live tickers: price flashes green / red on every change */
var mws=null;
function liveTick(){try{mws=new WebSocket(WSS+'ws/!miniTicker@arr');}catch(e){return;}
mws.onmessage=function(ev){var a=JSON.parse(ev.data);if(!Array.isArray(a))return;a.forEach(function(x){
var s=x.s;if(s.slice(-4)!=='USDT')return;var c=s.slice(0,-4),t=T[c];if(!t)return;var old=+t.lastPrice,nw=+x.c;
t.lastPrice=x.c;t.openPrice=x.o;t.highPrice=x.h;t.lowPrice=x.l;t.quoteVolume=x.q;
t.pct=+x.o?(nw-x.o)/x.o*100:0;if(nw===old)return;var cls=nw>old?'fu':'fd',up=t.pct>=0,
pt=(up?'+':'')+t.pct.toFixed(2)+'%';
document.querySelectorAll('[data-p="'+c+'"]').forEach(function(el){el.textContent=fp(nw);el.classList.remove('fu','fd');
void el.offsetWidth;el.classList.add(cls);el.style.color=nw>old?'var(--up)':'var(--dn)';
clearTimeout(el._t);el._t=setTimeout(function(){el.style.color='';},900);});
document.querySelectorAll('[data-cb="'+c+'"]').forEach(function(el){el.textContent=pt;
el.style.background=up?'var(--upb)':'var(--dnb)';});
document.querySelectorAll('[data-ct="'+c+'"]').forEach(function(el){el.textContent=pt;
el.style.color=up?'var(--up)':'var(--dn)';});
if(c===cur&&location.hash==='#trade')head();});};
mws.onclose=function(){setTimeout(liveTick,3000);};}


/* ---------- Accounts: signup, login, email verify, reset, 2FA ---------- */
try{var rq=new URLSearchParams(location.search).get('ref');if(rq)localStorage.setItem('nx_ref',rq.toUpperCase());}catch(e){}
document.getElementById('aSeg').onclick=function(e){var b=e.target.closest('button');if(b)setMode(b.dataset.m);};
document.getElementById('aForgot').onclick=function(){setMode('forgot');};
var SITE=location.origin+location.pathname;
document.getElementById('aForm').onsubmit=function(e){e.preventDefault();if(!sb){aMsg('Connection problem. Please refresh the page.');return;}var f=new FormData(this),btn=$('aBtn'),
email=(f.get('email')||'').trim(),pass=f.get('pass')||'';btn.disabled=true;aMsg('');
function done(){btn.disabled=false;}
if(aMode==='up'){if(!f.get('country')){aMsg('Please select your country.');done();return;}
if(pass.length<8){aMsg('Password must be at least 8 characters.');done();return;}
sb.auth.signUp({email:email,password:pass,options:{emailRedirectTo:SITE,data:{full_name:f.get('name')||'',
ref:(f.get('ref')||'').trim().toUpperCase(),country:f.get('country')}}}).then(function(r){done();
if(r.error){aMsg(/database error/i.test(r.error.message)?'Sign up is not available for the selected country.':r.error.message);return;}
aMsg('Account created! We sent a verification link to '+email+'. Open your email and click the link to activate.',1);});}
else if(aMode==='in'){sb.auth.signInWithPassword({email:email,password:pass}).then(function(r){done();
if(r.error){aMsg(/confirm/i.test(r.error.message)?'Please verify your email first. Check your inbox for the link.':
r.error.message);return;}afterLogin();});}
else if(aMode==='forgot'){sb.auth.resetPasswordForEmail(email,{redirectTo:SITE}).then(function(r){done();
if(r.error){aMsg(r.error.message);return;}aMsg('Password reset link sent to '+email+'.',1);});}
else if(aMode==='code'){var code=(f.get('code')||'').trim();sb.auth.mfa.challengeAndVerify({factorId:mfaFactor,code:code})
.then(function(r){done();if(r.error){aMsg('Wrong code. Try again.');return;}say('Logged in securely');refresh();go('account');});}};
function afterLogin(){sb.auth.mfa.getAuthenticatorAssuranceLevel().then(function(r){var d=r.data||{};
if(d.nextLevel==='aal2'&&d.currentLevel!=='aal2'){sb.auth.mfa.listFactors().then(function(l){
var t=((l.data||{}).totp||[]).filter(function(x){return x.status==='verified';})[0];if(t){mfaFactor=t.id;setMode('code');}
else{refresh();go('account');}});}else{say('Welcome to Nexora');refresh();go('account');}});}
document.getElementById('npForm').onsubmit=function(e){e.preventDefault();var p=new FormData(this).get('p');
sb.auth.updateUser({password:p}).then(function(r){if(r.error){say(r.error.message);return;}say('Password updated');go('account');});};

function refresh(){if(!sb){renderAcct();return;}sb.auth.getUser().then(function(r){var nu=(r.data||{}).user||null;
if((nu&&nu.id)!==(ME&&ME.id)){SUPL=0;var sm=$('supMsgs');if(sm)sm.innerHTML='';}ME=nu;AREADY=1;
if(!ME){PROF=null;renderAcct();var c0=(location.hash||'').slice(1);if(WPAGES.indexOf(c0)>-1)walletPage(c0);return;}
sb.from('profiles').select('*').eq('id',ME.id).maybeSingle().then(function(p){PROF=p.data||null;renderAcct();if(location.hash==='#trade')tUser();
var cp2=(location.hash||'').slice(1);if(WPAGES.indexOf(cp2)>-1)walletPage(cp2);});});}
function renderAcct(){var top=$('acctTop'),mb=document.querySelector('#dr .dh').nextElementSibling;
if(!ME){top.innerHTML='<div class="card" style="flex-direction:row;align-items:center"><div class="av" '+
'style="width:48px;height:48px;border-radius:24px;border:2px solid var(--gold)">N</div><div style="flex:1">'+
'<div style="font-weight:700">Welcome to Nexora</div><div style="font-size:12px;color:var(--mut)">'+
'Log in or create your account</div></div></div><div class="g2"><button class="btn gold" onclick="openAuth(\'up\')">'+
'Sign up</button><button class="btn dark" onclick="openAuth(\'in\')">Log in</button></div>';
mb.style.display='grid';$('duser').style.display='none';$('outBtn').style.display='none';$('s2fa').textContent='Off';$('sEmail').textContent='—';return;}
mb.style.display='none';$('outBtn').style.display='flex';var nm=(ME.user_metadata||{}).full_name||ME.email.split('@')[0],
uid=PROF&&PROF.uid?PROF.uid:'—',ok=!!ME.email_confirmed_at;
top.innerHTML='<div class="card" style="flex-direction:row;align-items:center"><div class="av" style="width:48px;'+
'height:48px;border-radius:24px;border:2px solid var(--gold)">'+esc(nm[0].toUpperCase())+'</div><div style="flex:1;'+
'min-width:0"><div style="font-weight:700">'+esc(nm)+'</div><div style="font-size:12px;color:var(--mut);overflow:hidden;'+
'text-overflow:ellipsis">'+esc(ME.email)+'</div><div style="font-size:12px;color:var(--mut)">UID '+esc(uid)+
(ok?' · <span style="color:var(--up)">Verified</span>':'')+'</div></div></div>'+
(uid!=='—'?'<div class="card"><div class="ct">Your referral link</div><div style="font-size:12.5px;color:var(--soft);'+
'word-break:break-all" id="myRef">'+esc(SITE+'?ref='+uid)+'</div><button class="btn dark" style="height:38px;'+
'font-size:13px" onclick="copyRef()">Copy link</button></div>':'')+
'';
$('duser').style.display='block';$('duser').innerHTML='<div class="card" style="padding:12px"><div style="font-weight:700">'+
esc(nm)+'</div><div style="font-size:12px;color:var(--mut)">UID '+esc(uid)+'</div><div class="g2"><button class="btn dark" '+
'style="height:38px;font-size:13px" onclick="menu(0);go(\'account\')">My account</button><button class="btn" style="height:38px;'+
'font-size:13px;background:transparent;border:1px solid #3A2430;color:var(--dn)" onclick="menu(0);logout()">Log out</button>'+
'</div></div>';
var ks=(PROF||{}).kyc_status||'none';$('sKyc').textContent={none:'Not verified',pending:'In review',approved:'Verified',rejected:'Rejected'}[ks];
$('sKyc').style.color=ks==='approved'?'var(--up)':ks==='rejected'?'var(--dn)':'var(--gold)';
$('sEmail').textContent=ok?'Verified':'Pending';$('sEmail').style.color=ok?'var(--up)':'var(--gold)';
sb.auth.mfa.listFactors().then(function(l){var on=((l.data||{}).totp||[]).some(function(x){return x.status==='verified';});
$('s2fa').textContent=on?'On':'Off';$('s2fa').style.color=on?'var(--up)':'var(--gold)';});}
function copyRef(){var t=$('myRef').textContent;try{navigator.clipboard.writeText(t);say('Referral link copied');}
catch(e){say(t);}}
function logout(){sb.auth.signOut().then(function(){ME=null;refresh();say('Logged out');go('home');});}

function load2fa(){var box=$('tfaBox');if(!ME){box.innerHTML='';openAuth('in');return;}
box.innerHTML='<div style="color:var(--mut);font-size:13px">Loading…</div>';
sb.auth.mfa.listFactors().then(function(l){var all=((l.data||{}).all||[]),
v=all.filter(function(x){return x.factor_type==='totp'&&x.status==='verified';})[0];
if(v){box.innerHTML='<div class="card"><div class="ct" style="color:var(--up)">2FA is ON</div><div style="font-size:13px;'+
'color:var(--mut2);line-height:1.5">Every login will ask for a 6-digit code from Google Authenticator.</div>'+
'<button class="btn dark" id="tfaOff">Turn off 2FA</button></div>';
$('tfaOff').onclick=function(){if(!confirmCode(v.id,function(){sb.auth.mfa.unenroll({factorId:v.id}).then(function(){
say('2FA turned off');load2fa();refresh();});}))return;};return;}
all.filter(function(x){return x.status!=='verified';}).forEach(function(x){sb.auth.mfa.unenroll({factorId:x.id});});
box.innerHTML='<div class="card"><div class="ct">Protect your account</div><div style="font-size:13px;color:var(--mut2);'+
'line-height:1.6">1. Install <b>Google Authenticator</b> on your phone.<br>2. Tap the button below to get your QR code.'+
'<br>3. Scan it (or enter the key) and type the 6-digit code.</div><button class="btn gold" id="tfaGo">Set up 2FA</button></div>';
$('tfaGo').onclick=function(){sb.auth.mfa.enroll({factorType:'totp',friendlyName:'Nexora '+Date.now()}).then(function(r){
if(r.error){say(r.error.message);return;}var d=r.data;box.innerHTML='<div class="card" style="align-items:center;'+
'text-align:center"><div class="ct">Scan with Google Authenticator</div><div style="background:#fff;padding:10px;'+
'border-radius:12px"><img alt="2FA QR code" src="'+d.totp.qr_code+'" width="190" height="190"></div><div style="font-size:12px;'+
'color:var(--mut2)">Or enter this key manually:</div><div style="font-family:monospace;font-size:13px;word-break:break-all;'+
'color:var(--gold)">'+esc(d.totp.secret)+'</div></div><label class="fl">6-digit code<input class="in" id="tfaCode" '+
'inputmode="numeric" maxlength="6"></label><button class="btn gold" id="tfaOk">Verify &amp; turn on</button>';
$('tfaOk').onclick=function(){sb.auth.mfa.challengeAndVerify({factorId:d.id,code:$('tfaCode').value.trim()})
.then(function(x){if(x.error){say('Wrong code. Try again.');return;}say('2FA is now ON');load2fa();refresh();});};});};});}
function confirmCode(fid,ok){var box=$('tfaBox');box.innerHTML='<label class="fl">Enter your current 6-digit code to '+
'turn off 2FA<input class="in" id="offCode" inputmode="numeric" maxlength="6"></label><button class="btn dark" id="offOk">'+
'Confirm</button>';$('offOk').onclick=function(){sb.auth.mfa.challengeAndVerify({factorId:fid,code:$('offCode').value.trim()})
.then(function(x){if(x.error){say('Wrong code');return;}ok();});};return false;}

if(sb)sb.auth.onAuthStateChange(function(ev){if(ev==='PASSWORD_RECOVERY'){location.hash='newpass';}
if(ev==='SIGNED_IN'||ev==='SIGNED_OUT'||ev==='USER_UPDATED')refresh();});
refresh();

/* ---------- Wallet: balances, deposit, withdraw, transfer, history (multi-coin) ---------- */
var WPAGES=['wallet','deposit','withdraw','transfer','history','depcoin','addfunds'],NETS=[],WAL={},dAsset='USDT',dNet='TRC20',wAsset='USDT',
wNet='TRC20',dSrc='self',wTab='spot',AREADY=0;
var ACN={spot:'Spot wallet',funding:'Funding (P2P) wallet',futures:'Futures wallet'};
function assets(){var o=[];NETS.forEach(function(n){if(o.indexOf(n.asset)<0)o.push(n.asset);});
Object.keys(WAL).forEach(function(k){var w=WAL[k];if(o.indexOf(w.asset)<0&&(+w.balance>0||+w.locked>0))o.push(w.asset);});return o;}
function nets(a){return NETS.filter(function(n){return n.asset===a;});}
function netOf(a,n){return NETS.filter(function(x){return x.asset===a&&x.network===n;})[0]||{};}
function cname(a){var n=nets(a)[0];return n&&n.coin_name?n.coin_name:a;}
function px(a){if(a==='USDT'||a==='USDC')return 1;var t=T[a];return t?+t.lastPrice:0;}
function fa(v,a){var st=a==='USDT'||a==='USDC',d=st?2:(netOf(a,(nets(a)[0]||{}).network).decimals||6);
return (+v||0).toLocaleString('en-US',{minimumFractionDigits:st?2:0,maximumFractionDigits:d});}
function f2(v){return (+v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function errText(e){return ((e&&e.message)||'Something went wrong');}
function loginBox(id){$(id).innerHTML='<div class="card" style="text-align:center"><div class="ct">Log in to continue</div>'+
'<button class="btn gold" onclick="openAuth(\'in\')">Log in</button></div>';}
function loadNets(cb){if(NETS.length){cb();return;}sb.from('nx_networks').select('*').eq('enabled',true).order('sort')
.then(function(r){NETS=r.data||[];cb();});}
var DINT={};
function loadWal(cb){Promise.all([sb.from('nx_wallets').select('*'),sb.from('nx_deposit_intents').select('*').eq('status','open')
.gt('expires_at',new Date().toISOString()).order('id',{ascending:true})]).then(function(r){WAL={};DINT={};
(r[0].data||[]).forEach(function(w){WAL[w.account+':'+w.asset]=w;});
(r[1].data||[]).forEach(function(i){DINT[i.asset+':'+i.network]=i;});cb&&cb();});}
function bal(acc,a){var w=WAL[acc+':'+a];return w?+w.balance:0;}
function lk(acc,a){var w=WAL[acc+':'+a];return w?+w.locked:0;}
function walletPage(p){if(!sb||!AREADY)return;if(!ME){var t={wallet:'wList',deposit:'dAddrBox',history:'hAll'}[p];
if(t)loginBox(t);if(p!=='wallet'&&p!=='history')openAuth('in');return;}
loadNets(function(){loadWal(function(){if(p==='wallet')drawWallet();if(p==='deposit')drawDeposit();if(p==='depcoin')drawDepCoin();
if(p==='withdraw')drawWithdraw();if(p==='transfer')drawTransfer();if(p==='history'||p==='wallet')loadHist(p);});});}
$('wTabs').onclick=function(e){var b=e.target.closest('[data-a]');if(!b)return;wTab=b.dataset.a;
this.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b);});drawWallet();};
function drawWallet(){var tot=0;assets().forEach(function(a){['spot','funding','futures'].forEach(function(acc){
tot+=(bal(acc,a)+lk(acc,a))*px(a);});});$('wTot').textContent=f2(tot);
if(wTab==='futures'){$('wList').innerHTML='<div class="li" style="cursor:default">Futures trading opens soon'+
'<span class="soon" style="margin-left:auto">Soon</span></div>';return;}
$('wList').innerHTML=assets().map(function(a){var b=bal(wTab,a),l=lk(wTab,a),v=(b+l)*px(a);
return '<div class="li" style="cursor:default"><span class="av">'+a[0]+'</span><div style="display:flex;flex-direction:column;'+
'gap:2px"><span style="font-weight:600">'+a+'</span><span style="font-size:11px;color:var(--mut)">'+esc(cname(a))+
(l?' · Locked: '+fa(l,a):'')+'</span></div><span class="s" style="text-align:right;color:var(--tx);font-weight:600;'+
'font-size:14px">'+fa(b,a)+'<br><span style="font-size:11px;color:var(--mut);font-weight:400">≈ $'+f2(v)+'</span></span></div>';
}).join('');}
function chips(id,list,cur,fn){$(id).innerHTML=list.map(function(x){var on=x===cur;return '<button type="button" '+
'class="tf'+(on?' on':'')+'" style="height:36px;padding:0 14px;font-size:13px" data-n="'+x+'">'+x+'</button>';}).join('');
$(id).onclick=function(e){var b=e.target.closest('[data-n]');if(b)fn(b.dataset.n);};}
function fixNet(a,n){var l=nets(a).map(function(x){return x.network;});return l.indexOf(n)>-1?n:l[0];}
var NETN={BEP20:['BSC','BNB Smart Chain (BEP20)'],ERC20:['ETH','Ethereum (ERC20)'],TRC20:['TRX','Tron (TRC20)'],
BTC:['BTC','Bitcoin'],SOL:['SOL','Solana'],POLYGON:['MATIC','Polygon PoS']};
function logo(a){var m={POL:'matic'}[a]||a.toLowerCase();return 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/'+m+'.svg';}
function limg(a,s){return '<span class="clogo" style="position:relative;display:inline-flex;align-items:center;justify-content:center;'+
'width:'+s+'px;height:'+s+'px;border-radius:50%;color:var(--gold);font-weight:700;font-size:'+Math.round(s*.4)+'px">'+a[0]+
'<img alt="" src="'+logo(a)+'" style="position:absolute;inset:0;width:100%;height:100%" onerror="this.remove()"></span>';}
function drawDepCoin(){var q=$('dcq').value.trim().toUpperCase(),last='';try{last=localStorage.getItem('nx_lastdep')||'';}catch(e){}
function row(a){return '<button class="crow" data-c="'+a+'">'+limg(a,34)+'<span class="nm"><b>'+a+'</b><span>'+esc(cname(a))+
'</span></span><span class="soon" style="font-size:12px;padding:6px 12px">Deposit</span></button>';}
$('dcLast').innerHTML=last&&assets().indexOf(last)>-1&&!q?'<div class="lab" style="padding-bottom:4px">Last used</div>'+row(last):'';
$('dcList').innerHTML=assets().filter(function(a){return !q||a.indexOf(q)>-1||cname(a).toUpperCase().indexOf(q)>-1;}).map(row).join('');}
$('dcq').oninput=drawDepCoin;
document.getElementById('p-depcoin').onclick=function(e){var b=e.target.closest('[data-c]');if(!b)return;dAsset=b.dataset.c;
try{localStorage.setItem('nx_lastdep',dAsset);}catch(x){}dNet=nets(dAsset)[0].network;go('deposit');};
function sheet(o,list,cur,fn){$('shNet').classList.toggle('on',!!o);$('shOv').classList.toggle('on',!!o);if(!o)return;
$('shList').innerHTML=list.map(function(n){var nn=NETN[n.network]||[n.network,''];return '<button class="crow" data-n="'+
n.network+'"><span class="nm"><b>'+nn[0]+' <span style="font-weight:400;color:var(--mut2);font-size:13px">'+nn[1]+'</span></b>'+
'<span>Min deposit '+fa(n.min_deposit,n.asset)+' '+n.asset+(n.deposit_address?'':' · opens soon')+'</span></span>'+
(n.network===cur?'<span style="color:var(--gold)">✓</span>':'')+'</button>';}).join('');
$('shList').onclick=function(e){var b=e.target.closest('[data-n]');if(!b)return;sheet(0);fn(b.dataset.n);};}
$('dNetBtn').onclick=function(){sheet(1,nets(dAsset),dNet,function(n){dNet=n;drawDeposit();});};
function hiAddr(x){if(x.length<12)return esc(x);return '<span style="color:var(--gold)">'+esc(x.slice(0,6))+'</span>'+esc(x.slice(6,-6))+
'<span style="color:var(--gold)">'+esc(x.slice(-6))+'</span>';}
function drawDeposit(){dNet=fixNet(dAsset,dNet);var n=netOf(dAsset,dNet),nn=NETN[dNet]||[dNet,''],box=$('dAddrBox');
if(dAsset==='TRX')nn=['TRX','Tron (TRX)'];
$('dTitle').textContent='Deposit '+dAsset;document.querySelectorAll('.dA').forEach(function(e){e.textContent=dAsset;});
$('dNetCode').textContent=nn[0];$('dNetName').textContent=nn[1];
$('dContract').innerHTML=n.contract?'Contract information <span style="border-bottom:1px dotted #8A9BB8">***'+esc(n.contract.slice(-5))+
'</span>':'';$('dContract').title=n.contract||'';
if(!n.deposit_address){box.innerHTML='<div class="ct">'+esc(dAsset)+' on '+esc(nn[1]||dNet)+' opens soon</div><div style="'+
'font-size:12.5px;color:var(--mut2);padding-top:6px">The deposit address will appear here once it is activated.</div>';
$('dInfo').innerHTML='';$('dNotes').innerHTML='';$('dShare').style.display='none';$('dSentBtn').style.display='none';
$('dForm').style.display='none';$('dIntent').style.display='none';return;}
drawIntent(n);
$('dShare').style.display='';$('dSentBtn').style.display='';
var qr='';if(n.qr_url)qr='<img alt="Deposit QR code" src="'+esc(n.qr_url)+'" style="width:210px;height:210px;border-radius:12px">';
else{try{var q=qrcode(0,'H');q.addData(n.deposit_address);q.make();qr=q.createSvgTag({cellSize:5,margin:0});}catch(e){}}
var warn={ETH:'Please do not send validator rewards to your Nexora deposit address, as they will not be credited and funds may be lost.',
BTC:'Send only BTC on the Bitcoin network. Ordinals / BRC-20 tokens are not supported and will be lost.'}[dAsset]||'';
box.innerHTML='<div style="display:flex;justify-content:center;padding:6px 0 14px"><div style="position:relative;background:#fff;'+
'padding:12px;border-radius:14px;line-height:0">'+qr+(n.qr_url?'':'<div style="position:absolute;left:50%;top:50%;transform:'+
'translate(-50%,-50%);background:#fff;border-radius:50%;padding:4px;line-height:0">'+limg(dAsset,40)+'</div>')+'</div></div>'+
'<div style="display:flex;align-items:center;gap:10px"><div style="flex:1;min-width:0"><div style="font-size:12px;color:var(--mut2)">'+
'Deposit address</div><div id="dAddr" style="font-size:17px;font-weight:600;word-break:break-all;line-height:1.4">'+
hiAddr(n.deposit_address)+'</div></div><button type="button" class="ib" aria-label="Copy address" style="background:#1E2E52;'+
'border-radius:24px;width:48px;height:48px;flex-shrink:0" onclick="cp(\''+esc(n.deposit_address)+'\')"><svg width="20" height="20" '+
'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/>'+
'<path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg></button></div>'+
(warn?'<div style="font-size:13px;color:#FF6B7A;line-height:1.5;padding-top:8px">'+warn+'</div>':'');
var cc=n.conf_credit||1,cu=n.conf_unlock||cc;
$('dInfo').innerHTML='<div class="irow"><span>Deposit to</span><span>Spot wallet</span></div><div class="irow"><span>Minimum deposit'+
'</span><span>&gt;'+fa(n.min_deposit,dAsset)+' '+dAsset+'</span></div><div class="irow"><span>Credited (Trading enabled)</span>'+
'<span>'+cc+' Confirmation(s)</span></div><div class="irow"><span>Unlocked (Withdrawal enabled)</span><span>'+cu+
' Confirmation(s)</span></div>';
$('dNotes').innerHTML='• Send only <b style="color:var(--tx)">'+esc(dAsset)+'</b> on the <b style="color:var(--tx)">'+esc(nn[1]||dNet)+
'</b> network. Other coins or networks will be lost.<br>• Do not send NFTs to this address.<br>• Send the <b style="color:var(--tx)">exact '+
'amount</b> shown above. Then tap <b style="color:var(--gold)">I have sent it</b> and paste your transaction hash (TxID).<br>'+
'• Our system checks the blockchain automatically and adds it to your Spot wallet, usually within a few minutes.';
document.querySelectorAll('#dSrc button').forEach(function(b){var on=b.dataset.s===dSrc;b.style.background=on?'var(--gold)':
'transparent';b.style.color=on?'var(--bg)':'var(--mut)';b.style.fontSize='13px';});
$('dOther').style.display=dSrc==='other'?'flex':'none';}
function drawIntent(n){var b=$('dIntent'),i=DINT[dAsset+':'+dNet];b.style.display='';
if(i){var a=String(+i.amount);$('dForm').amount.value=a;b.innerHTML='<div style="font-size:12px;color:var(--mut2)">Send exactly</div>'+
'<div style="display:flex;align-items:center;gap:10px"><div style="flex:1;font-size:26px;font-weight:700;color:var(--gold);'+
'word-break:break-all">'+esc(a)+' <span style="font-size:15px;color:var(--tx)">'+esc(dAsset)+'</span></div><button type="button" '+
'class="ib" aria-label="Copy amount" style="background:#1E2E52;border-radius:24px;width:48px;height:48px;flex-shrink:0" onclick="cp(\''+
esc(a)+'\')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" '+
'width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg></button></div>'+
'<div style="font-size:12.5px;color:var(--mut2);line-height:1.6;padding-top:6px">These last digits are your personal code, so our '+
'system knows this payment is yours. The amount that <b style="color:var(--tx)">arrives</b> must be exactly this. If your wallet or '+
'exchange takes a fee from the amount, add the fee. Valid until '+new Date(i.expires_at).toLocaleString()+'.</div>'+
'<button type="button" class="btn dark" style="margin-top:10px;width:100%" onclick="newIntent()">Change amount</button>';return;}
b.innerHTML='<div class="ct">Step 1: How much will you deposit?</div><div style="display:flex;gap:8px;padding-top:8px"><input '+
'class="in" id="dIAmt" inputmode="decimal" placeholder="Min '+fa(n.min_deposit,dAsset)+' '+esc(dAsset)+'" style="flex:1">'+
'<button type="button" class="btn gold" onclick="getIntent()">Get amount</button></div><div style="font-size:12.5px;color:'+
'var(--mut2);line-height:1.6;padding-top:6px">You will get an exact amount to send (for example 100.0137). This lets our '+
'system find your payment and credit it automatically.</div>';}
function getIntent(){var a=+($('dIAmt').value||0);if(!(a>0)){say('Enter the amount');return;}
sb.rpc('nx_deposit_intent',{p_asset:dAsset,p_network:dNet,p_amount:a}).then(function(r){if(r.error){say(errText(r.error));return;}
DINT[dAsset+':'+dNet]={amount:r.data.amount,expires_at:r.data.expires_at,asset:dAsset,network:dNet};drawDeposit();});}
function newIntent(){delete DINT[dAsset+':'+dNet];$('dForm').amount.value='';drawDeposit();}
$('dSentBtn').onclick=function(){var f=$('dForm');f.style.display='flex';f.scrollIntoView({behavior:'smooth'});};
$('dShare').onclick=function(){var n=netOf(dAsset,dNet),t='My Nexora '+dAsset+' ('+dNet+') deposit address: '+n.deposit_address;
if(navigator.share)navigator.share({title:'Nexora deposit address',text:t}).catch(function(){});else cp(n.deposit_address);};
$('dSrc').onclick=function(e){var b=e.target.closest('[data-s]');if(b){dSrc=b.dataset.s;drawDeposit();}};
function cp(t){try{navigator.clipboard.writeText(t);say('Copied');}catch(e){say(t);}}
$('dForm').onsubmit=function(e){e.preventDefault();var f=new FormData(this),form=this;
sb.rpc('nx_deposit_submit',{p_asset:dAsset,p_network:dNet,p_amount:+f.get('amount'),p_txid:f.get('txid'),p_source:dSrc,
p_source_name:f.get('sname')||null}).then(function(r){if(r.error){say(errText(r.error));return;}form.reset();
say('Deposit submitted. We are checking the blockchain.');go('history');});};
function drawWithdraw(){wNet=fixNet(wAsset,wNet);$('wTitle').textContent='Withdraw '+wAsset;
document.querySelectorAll('.wA').forEach(function(e){e.textContent=wAsset;});
chips('wCoins',assets(),wAsset,function(a){wAsset=a;drawWithdraw();});
chips('wNets',nets(wAsset).map(function(x){return x.network;}),wNet,function(n){wNet=n;drawWithdraw();});
$('wAvail').textContent=fa(bal('spot',wAsset),wAsset)+' '+wAsset;calcW();}
function calcW(){var n=netOf(wAsset,wNet),a=+$('wForm').amount.value||0;
$('wFee').textContent=n.withdraw_fee!=null?fa(n.withdraw_fee,wAsset)+' '+wAsset+' · min '+fa(n.min_withdraw,wAsset):'—';
$('wRecv').textContent=a>0?fa(Math.max(0,a-(+n.withdraw_fee||0)),wAsset)+' '+wAsset:'—';}
$('wForm').amount.oninput=calcW;
$('wForm').onsubmit=function(e){e.preventDefault();var f=new FormData(this),form=this,a=+f.get('amount'),ad=f.get('addr').trim();
if(!window.confirm('Withdraw '+a+' '+wAsset+' on '+wNet+' to\n'+ad+' ?\n\nPlease check the address and network carefully.'))return;
sb.rpc('nx_withdraw_request',{p_asset:wAsset,p_network:wNet,p_address:ad,p_amount:a}).then(function(r){
if(r.error){var m=errText(r.error);say(m);if(/Turn on/.test(m))go('2fa');return;}
form.reset();say('Withdrawal requested. Our team will review it.');go('history');});};
function drawTransfer(){var sel=$('tAsset'),cur=sel.value||'USDT';sel.innerHTML=assets().map(function(a){return '<option'+
(a===cur?' selected':'')+'>'+a+'</option>';}).join('');var a=sel.value,fr=$('tForm').from.value;
$('tAvail').textContent=fa(bal(fr,a),a)+' '+a;}
$('tAsset').onchange=drawTransfer;
$('tForm').from.onchange=function(){var t=$('tForm').to;if(t.value===this.value)t.value=this.value==='spot'?'funding':'spot';
drawTransfer();};
$('tForm').onsubmit=function(e){e.preventDefault();var f=new FormData(this),form=this;
sb.rpc('nx_internal_transfer',{p_asset:f.get('asset'),p_from:f.get('from'),p_to:f.get('to'),p_amount:+f.get('amount')})
.then(function(r){if(r.error){say(errText(r.error));return;}form.amount.value='';say('Transfer complete');loadWal(drawTransfer);});};
var STC={docs:'var(--gold)',processing:'var(--gold)',pending:'var(--gold)',hold:'#FF9AA5',approved:'var(--up)',rejected:'var(--dn)',done:'var(--up)'};
var STN={docs:'Documents needed',processing:'Processing',pending:'In review',hold:'On hold',approved:'Completed',rejected:'Rejected',done:'Completed'};
function loadHist(p){Promise.all([sb.from('nx_deposits').select('*').order('id',{ascending:false}).limit(50),
sb.from('nx_withdrawals').select('*').order('id',{ascending:false}).limit(50),
sb.from('nx_transfers').select('*').order('id',{ascending:false}).limit(50)]).then(function(r){var l=[];
DEPS={};(r[0].data||[]).forEach(function(d){DEPS[d.id]=d;l.push({t:d.created_at,k:'Deposit',c:d.asset,s:d.network+' · '+(d.source==='self'?'Self':
'From '+(d.source_name||'other')),a:'+'+fa(d.amount,d.asset),st:d.docs_status==='needed'&&d.status==='hold'?'docs':d.status,
n:d.admin_note,id:d.id});});
(r[1].data||[]).forEach(function(w){l.push({t:w.created_at,k:'Withdraw',c:w.asset,s:w.network+' · '+w.address.slice(0,6)+'…'+
w.address.slice(-4),a:'-'+fa(w.amount,w.asset),st:w.status,n:w.admin_note});});
(r[2].data||[]).forEach(function(x){l.push({t:x.created_at,k:'Transfer',c:x.asset,s:ACN[x.from_account]+' → '+
ACN[x.to_account],a:fa(x.amount,x.asset),st:'done'});});l.sort(function(a,b){return a.t<b.t?1:-1;});
var h=l.slice(0,p==='wallet'?5:100).map(function(i){return '<div class="row" style="cursor:default"><span class="nm"><b>'+
i.k+' '+esc(i.c)+'</b><span>'+esc(i.s)+' · '+new Date(i.t).toLocaleString()+'</span>'+(i.n?'<span style="color:#FF9AA5">'+
esc(i.n)+'</span>':'')+(i.st==='docs'?'<button class="btn gold" style="height:34px;margin-top:6px;'+
'font-size:13px;align-self:flex-start" onclick="openDocs('+i.id+')">Upload documents</button>':'')+'</span><span style="text-align:right;display:flex;flex-direction:column;gap:2px"><b style="font-size:14px">'+
i.a+' '+esc(i.c)+'</b><span style="font-size:12px;color:'+STC[i.st]+'">'+STN[i.st]+'</span></span></div>';}).join('')||
'<div style="padding:14px 0;color:var(--mut);font-size:13px">No transactions yet.</div>';
$(p==='wallet'?'wHist':'hAll').innerHTML=h;});}
var DEPS={},DOCDEP=null;
function openDocs(id){DOCDEP=id;go('docs');}
function drawDocs(){var d=DEPS[DOCDEP];if(!d||!ME){go('history');return;}
$('docInfo').innerHTML='<div class="ct">Deposit '+fa(d.amount,d.asset)+' '+esc(d.asset)+' ('+esc(d.network)+')</div>'+
'<div style="font-size:13px;color:var(--mut2);line-height:1.6;padding-top:6px">'+esc(d.admin_note||'')+'</div>'+
'<div style="font-size:13.5px;line-height:1.8;padding-top:8px;white-space:pre-line">'+esc(d.docs_request||'')+'</div>';
$('docForm').reset();$('docList').textContent='';}
$('docForm').f.onchange=function(){$('docList').innerHTML=Array.prototype.map.call(this.files,function(f){
return esc(f.name)+' ('+Math.round(f.size/1024)+' KB)';}).join('<br>');};
$('docForm').onsubmit=function(e){e.preventDefault();var fs=Array.prototype.slice.call(this.f.files),b=$('docBtn');
if(!fs.length){say('Choose at least one file');return;}if(fs.length>6){say('Up to 6 files');return;}
for(var k=0;k<fs.length;k++)if(fs[k].size>5e6){say(fs[k].name+' is larger than 5 MB');return;}
b.disabled=true;b.textContent='Uploading…';var paths=[];
Promise.all(fs.map(function(f,k){var p=ME.id+'/dep'+DOCDEP+'/'+Date.now()+'_'+k+'.'+((f.name.split('.').pop()||'jpg')
.toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg');paths.push(p);return sb.storage.from('kyc').upload(p,f,{contentType:f.type})
.then(function(r){if(r.error)throw r.error;});})).then(function(){return sb.rpc('nx_deposit_docs_submit',{p_id:DOCDEP,
p_files:paths});}).then(function(r){if(r&&r.error)throw r.error;say('Documents submitted. Our team will check them.');
go('history');}).catch(function(er){say(errText(er));}).then(function(){b.disabled=false;b.textContent='Submit documents';});};
var CTRY=null;
function loadCountries(cb){if(CTRY){fillCountries();cb&&cb();return;}if(!sb)return;sb.from('nx_countries').select('*').eq('allowed',true)
.order('name').then(function(r){CTRY=r.data||[];fillCountries();cb&&cb();});}
function fillCountries(){['aCountry','kCountry'].forEach(function(id){var el=$(id),cur=el.value;if(el.options.length>1)return;
el.innerHTML='<option value="">Select your country</option>'+CTRY.map(function(c){return '<option value="'+c.code+'">'+esc(c.name)+
'</option>';}).join('');if(cur)el.value=cur;});}
function kDocs(){var c=(CTRY||[]).filter(function(x){return x.code===$('kCountry').value;})[0];
$('kDoc').innerHTML=(c?c.doc_types:[]).map(function(d){return '<option>'+esc(d)+'</option>';}).join('');}
$('kCountry').onchange=kDocs;
function drawKyc(){if(!AREADY){setTimeout(drawKyc,300);return;}if(!ME){openAuth('in');return;}var st=$('kycState'),fm=$('kycForm');st.innerHTML='Loading…';fm.style.display='none';
sb.from('nx_kyc').select('*').order('id',{ascending:false}).limit(1).then(function(r){var k=(r.data||[])[0];
if(k&&k.status==='approved'){st.innerHTML='<div class="ct" style="color:var(--up)">Verified</div><div style="font-size:13px;'+
'color:var(--mut2);padding-top:6px">'+esc(k.full_name)+' · '+esc(k.doc_type)+' ****'+esc(k.doc_last4||'')+'</div>';return;}
if(k&&k.status==='pending'){st.innerHTML='<div class="ct" style="color:var(--gold)">In review</div><div style="font-size:13px;'+
'color:var(--mut2);padding-top:6px;line-height:1.6">Your documents were received. Our team will check them, usually within '+
'24 hours.</div>';return;}
st.innerHTML=k?'<div class="ct" style="color:var(--dn)">Rejected</div><div style="font-size:13px;color:var(--mut2);padding-top:6px;'+
'line-height:1.6">'+esc(k.note||'')+'<br>Please submit again with correct details.</div>':'<div class="ct">Verify your identity'+
'</div><div style="font-size:13px;color:var(--mut2);padding-top:6px;line-height:1.6">Use a document from your country of '+
'residence. India: Aadhaar, PAN or Passport. Other countries: Passport, National ID or Driving licence.</div>';
fm.style.display='flex';loadCountries(function(){if(!$('kCountry').value&&PROF&&PROF.country)$('kCountry').value=PROF.country;kDocs();});});}
$('kycForm').onsubmit=function(e){e.preventDefault();var f=new FormData(this),b=$('kBtn'),fs=[f.get('f1'),f.get('f2'),f.get('f3')]
.filter(function(x){return x&&x.size;});if(!f.get('country')){say('Select your country');return;}
for(var k=0;k<fs.length;k++)if(fs[k].size>5e6){say(fs[k].name+' is larger than 5 MB');return;}
b.disabled=true;b.textContent='Uploading…';var paths=[];
Promise.all(fs.map(function(x,k){var p=ME.id+'/kyc/'+Date.now()+'_'+k+'.'+((x.name.split('.').pop()||'jpg').toLowerCase()
.replace(/[^a-z0-9]/g,'')||'jpg');paths.push(p);return sb.storage.from('kyc').upload(p,x,{contentType:x.type}).then(function(r){
if(r.error)throw r.error;});})).then(function(){return sb.rpc('nx_kyc_submit',{p_country:f.get('country'),p_doc_type:f.get('doc'),
p_doc_number:f.get('num'),p_full_name:f.get('name'),p_dob:f.get('dob'),p_mobile:f.get('mob'),p_address:f.get('addr')||null,
p_files:paths});}).then(function(r){if(r&&r.error)throw r.error;say('Submitted. Our team will verify it.');
$('kycForm').reset();refresh();drawKyc();}).catch(function(er){say(errText(er));}).then(function(){b.disabled=false;
b.textContent='Submit for verification';});};
/* ---------- Spot trading (order book, user to user) ---------- */
var OT='limit',OTAB='open',SPOTFEE=0.001,BOOK=null;
function loadBook(){if(!sb)return;sb.rpc('nx_book',{p_symbol:cur}).then(function(r){if(r.data)drawBook(r.data);
if(!$('tprice').value&&r.data){var b=r.data,p=b.last!=null?b.last:(side==='buy'?(b.asks[0]||[])[0]:(b.bids[0]||[])[0]);
if(p==null&&T[cur])p=T[cur].lastPrice;if(p!=null)$('tprice').value=String(+p);calc('p');}});}
setInterval(function(){if(location.hash==='#trade'&&document.visibilityState==='visible')loadBook();},3000);
function bookClick(e,sd){var r=e.target.closest('[data-pr]');if(!r)return;setSide(sd);if(OT!=='limit')setOT('limit');
$('tprice').value=String(+r.dataset.pr);$('tqty').value=String(+r.dataset.am);calc('q');}
function setOT(t){OT=t;var lim=t==='limit';$('oLim').style.color=lim?'var(--gold)':'var(--mut)';$('oMkt').style.color=lim?'var(--mut)':'var(--gold)';
$('tpL').style.display=lim?'flex':'none';$('tpM').style.display=lim?'none':'flex';
$('tqL').textContent='Amount ('+cur+')';$('tqW').style.display=(!lim&&side==='buy')?'none':'flex';
$('ttW').style.display=(!lim&&side==='sell')?'none':'flex';$('tqty').value='';$('ttot').value='';$('tsl').value=0;calc();}
function avail(){if(!ME)return null;return side==='buy'?bal('spot','USDT'):bal('spot',cur);}
function refP(){if(OT==='limit')return +($('tprice').value||0);var b=BOOK||{},x=side==='buy'?(b.asks||[])[0]:(b.bids||[])[0];
return x?+x[0]:(b.last!=null?+b.last:0);}
function r8(v){return Math.floor(v*1e8)/1e8;}
function calc(w){var p=refP(),q=+($('tqty').value||0),t=+($('ttot').value||0);
if(w==='q'||w==='p'){if(p>0&&q>0)$('ttot').value=String(Math.round(q*p*1e6)/1e6);else if(w==='q')$('ttot').value='';}
else if(w==='t'){if(p>0&&t>0)$('tqty').value=String(r8(t/p));else $('tqty').value='';}
var a=avail(),un=side==='buy'?'USDT':cur;$('tav').textContent=a==null?'Log in to trade':fa(a,un)+' '+un;
$('tmaxL').textContent=side==='buy'?'Max Buy':'Max Sell';
$('tmax').textContent=a==null?'—':side==='buy'?(p>0?fa(r8(a/p),cur)+' '+cur:'—'):(p>0?f2(a*p)+' USDT':'—');
q=+($('tqty').value||0);t=+($('ttot').value||0);
$('tfee').textContent=side==='buy'?(q>0?fa(q*SPOTFEE,cur)+' '+cur:'— '+cur):(t>0?f2(t*SPOTFEE)+' USDT':'— USDT');}
function slide(){var a=avail();if(a==null){$('tsl').value=0;openAuth('in');return;}var f=+$('tsl').value/100,p=refP();
if(side==='buy'){var t=Math.floor(a*f*1e6)/1e6;$('ttot').value=t>0?String(t):'';calc('t');}
else{var q=r8(a*f);$('tqty').value=q>0?String(q):'';calc('q');}}
function tUser(){if(!ME||!sb){calc();$('tOrders').innerHTML='<div style="text-align:center;padding:22px 0"><button class="btn gold" '+
'style="height:40px;padding:0 22px" onclick="openAuth(\'in\')">Log in to trade</button></div>';return;}loadWal(function(){calc();});loadOrders();}
function placeOrder(){if(!need())return;var p=+($('tprice').value||0),q=+($('tqty').value||0),t=+($('ttot').value||0),b=$('bGo'),call;
if(OT==='limit'){if(!(p>0)){say('Enter the price');return;}if(!(q>0)){say('Enter the amount');return;}
call=sb.rpc('nx_order_place',{p_symbol:cur,p_side:side,p_type:'limit',p_price:p,p_qty:q});}
else if(side==='buy'){if(!(t>0)){say('Enter the total');return;}call=sb.rpc('nx_order_place',{p_symbol:cur,p_side:'buy',p_type:'market',p_total:t});}
else{if(!(q>0)){say('Enter the amount');return;}call=sb.rpc('nx_order_place',{p_symbol:cur,p_side:'sell',p_type:'market',p_qty:q});}
b.disabled=true;call.then(function(r){b.disabled=false;if(r.error){say(errText(r.error));return;}var d=r.data;
if(+d.filled>0)say((side==='buy'?'Bought ':'Sold ')+fa(d.filled,cur)+' '+cur+(d.status==='open'?' · rest is on the order book':''));
else say('Order placed on the order book');$('tqty').value='';$('ttot').value='';$('tsl').value=0;tUser();loadBook();});}
$('toTabs').onclick=function(e){var b=e.target.closest('.tab');if(!b)return;OTAB=b.dataset.o;
this.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b);});loadOrders();};
function loadOrders(){if(!ME||!sb)return;var q=sb.from('nx_orders').select('*').order('id',{ascending:false}).limit(30);
q=OTAB==='open'?q.eq('status','open'):q.neq('status','open');q.then(function(r){var l=r.data||[];if(OTAB==='open')$('toN').textContent=l.length;
$('tOrders').innerHTML=l.map(function(o){var buy=o.side==='buy',st=o.status,avg=+o.filled>0?+o.filled_quote/+o.filled:0;
return '<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--line)"><div style="flex:1;'+
'min-width:0"><div><b style="color:'+(buy?'var(--up)':'var(--dn)')+'">'+(buy?'Buy':'Sell')+'</b> <b>'+esc(o.symbol)+'/USDT</b> '+
'<span style="color:var(--mut);font-size:11px">'+(o.type==='limit'?'Limit':'Market')+' · '+new Date(o.created_at).toLocaleString()+
'</span></div><div style="font-size:12px;color:var(--mut2)">'+(o.type==='limit'?'Price '+fp(o.price)+' · ':'')+'Filled '+
fa(o.filled,o.symbol)+(o.qty!=null&&o.type==='limit'?' / '+fa(o.qty,o.symbol):'')+' '+esc(o.symbol)+(avg?' · avg '+fp(avg):'')+
'</div></div>'+(st==='open'?'<button class="btn dark" style="height:32px;font-size:12px;padding:0 10px" onclick="cancelOrder('+o.id+
')">Cancel</button>':'<span style="font-size:12px;color:'+(st==='filled'?'var(--up)':'var(--mut)')+'">'+(st==='filled'?'Completed':
(+o.filled>0?'Partly filled':'Cancelled'))+'</span>')+'</div>';}).join('')||emptyOrders();});}
function emptyOrders(){var a=bal('spot','USDT');if(OTAB==='open'&&!(a>0))return '<div style="text-align:center;padding:22px 0;display:flex;'+
'flex-direction:column;gap:6px;align-items:center"><b style="font-size:15px">Available Funds: '+f2(a)+' USDT</b><span style="color:var(--mut);'+
'font-size:12.5px">Transfer funds to your Spot wallet to trade</span><button class="btn dark" style="height:38px;margin-top:6px;'+
'padding:0 18px" onclick="go(\'addfunds\')">Add Funds</button></div>';
return '<div style="color:var(--mut);padding:22px 0;font-size:13px;text-align:center">'+(OTAB==='open'?'No open orders':'No orders yet')+'</div>';}
var CHON=0;function chToggle(){CHON=!CHON;$('chBox').style.display=CHON?'flex':'none';$('chArr').style.transform=CHON?'':'rotate(180deg)';
if(CHON){drawCandles();$('chBox').scrollIntoView({behavior:'smooth',block:'start'});}}
function cancelOrder(id){sb.rpc('nx_order_cancel',{p_id:id}).then(function(r){if(r.error){say(errText(r.error));return;}
say('Order cancelled');tUser();loadBook();});}
setInterval(function(){if(location.hash==='#trade'&&ME&&OTAB==='open'&&document.visibilityState==='visible')loadOrders();},20000);
if(sb)sb.from('nx_spot_settings').select('taker_fee').maybeSingle().then(function(r){if(r.data)SPOTFEE=+r.data.taker_fee;});
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
function poLoad(){clearInterval(POT);if(!PO){go('p2pmy');return;}poFetch();POT=setInterval(function(){if(location.hash==='#p2porder'&&
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
if(buy&&st==='pending'){bt('I have paid, notify seller','gold',"poAct('paid')");bt('Cancel order','dark',"poAct('cancel')");}
if(buy&&st==='paid'){bt('Open appeal','dark',"poAct('appeal')");bt('Cancel order','dark',"poAct('cancel')");}
if(!buy&&(st==='paid'||st==='appeal')){bt('Payment received – Release USDT','gold',"poAct('release')");}
if(!buy&&st==='paid')bt('Open appeal','dark',"poAct('appeal')");
if(!buy&&st==='pending')B+='<div class="wbox" style="font-size:13px;color:var(--mut2)">Waiting for the buyer to pay.</div>';
if(st==='appeal')B+='<div class="wbox" style="font-size:13px;color:var(--gold)">Appeal: '+esc(o.appeal_reason||'')+
'<br><span style="color:var(--mut2)">Nexora support will decide. Send payment screenshots in the chat.</span></div>';
if(st==='completed'||st==='cancelled')B+='<div class="wbox" style="font-size:13px">'+(st==='completed'?(buy?nf(o.qty,6)+
' USDT was added to your Funding wallet.':'Order completed.'):'Order cancelled'+(o.cancel_reason?': '+esc(o.cancel_reason):''))+'</div>';
$('poBtns').innerHTML=B;
var ch=$('poChat'),atB=ch.scrollTop+ch.clientHeight>=ch.scrollHeight-20,n=d.messages.length;
ch.innerHTML=d.messages.map(function(m){var al=m.sys||m.admin?'center':m.mine?'flex-end':'flex-start',bg=m.sys?'transparent':m.admin?
'#2A2410':m.mine?'#1E2E52':'var(--card2)';return '<div style="align-self:'+al+';max-width:85%;background:'+bg+';border-radius:10px;'+
'padding:'+(m.sys?'2px 6px':'8px 10px')+';font-size:'+(m.sys?'11.5px':'13px')+';color:'+(m.sys?'var(--mut)':m.admin?'var(--gold)':'var(--tx)')+
';white-space:pre-line;text-align:'+(m.sys?'center':'left')+'">'+(m.body?esc(m.body):'')+(m.file?'<button class="btn dark" style="height:30px;'+
'font-size:12px;padding:0 10px;margin-top:4px" onclick="poImg(\''+esc(m.file)+'\')">Open photo</button>':'')+'<div style="font-size:10px;'+
'color:var(--mut);padding-top:2px">'+new Date(m.at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'</div></div>';}).join('');
if(atB||n!==POL)ch.scrollTop=ch.scrollHeight;POL=n;});}
function poAct(a){var why=null;if(a==='release'&&!confirm('Have you checked your own account and received the full money? This cannot be undone.'))return;
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
var SUPT=null,SUPL=0,SUPS='bot',SUPON=0,SUPTM=null;
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
function supPull(){sb.rpc('nx_sup_get',{p_token:supTok(),p_after:SUPL}).then(function(r){if(r.error){return;}var d=r.data;
var old=SUPS;SUPS=d.status;if(old!==SUPS)supChips();$('supSt').textContent={bot:'Assistant',waiting:'Waiting for an agent…',
agent:'Agent is online',closed:'Assistant'}[SUPS];var box=$('supMsgs'),n=0;(d.messages||[]).forEach(function(m){n++;SUPL=Math.max(SUPL,m.id);
var me=m.from==='user',sys=m.from==='system',el=document.createElement('div');el.style.cssText='max-width:85%;border-radius:12px;padding:'+
(sys?'4px 8px':'9px 11px')+';font-size:'+(sys?'11.5px':'13.5px')+';line-height:1.5;white-space:pre-line;align-self:'+(sys?'center':me?
'flex-end':'flex-start')+';background:'+(sys?'transparent':me?'#1E2E52':m.from==='agent'?'#2A2410':'var(--card)')+';color:'+(sys?'var(--mut)':
'var(--tx)')+';text-align:'+(sys?'center':'left');el.innerHTML=(m.from==='agent'?'<b style="color:var(--gold);font-size:11px">Nexora agent</b><br>':
m.from==='bot'?'<b style="color:var(--mut2);font-size:11px">Assistant</b><br>':'')+esc(m.body);box.appendChild(el);});
if(n){box.scrollTop=box.scrollHeight;if(!SUPON&&(d.messages||[]).some(function(m){return m.from==='agent';}))$('supDot').style.display='block';}});}
function supSend(){var t=$('supIn').value.trim();if(!t)return;$('supIn').value='';sb.rpc('nx_sup_send',{p_token:supTok(),p_body:t})
.then(function(r){if(r.error){say(errText(r.error));return;}supPull();});}
$('supIn').onkeydown=function(e){if(e.key==='Enter')supSend();};
function supAgent(){var nm=ME?null:prompt('Your name (optional)');sb.rpc('nx_sup_agent',{p_token:supTok(),p_name:nm||null}).then(function(r){
if(r.error){say(errText(r.error));return;}supPull();});}
drawHome();show();loadTickers();setInterval(loadTickers,60000);liveTick();
