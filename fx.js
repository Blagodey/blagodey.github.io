/* Blagoday FX: hover animations for cards, rows, buttons and section frames (all pages) */
(function(){
if(window.__bfx)return;window.__bfx=1;
var CARD='.jc,.v,.al,.gcard,.song,.sc-embed,.empty,.support';
var ROW='.cr,.scp-row';
var BTN='.btn,.more,.mtabs button,.scp-login,.cm-b,.plat a,.id-b,.ch-send,.ch-fab,.thm,#totop,.lsw button,.scp-btns button,.scp-btns a';
var L='html[data-theme=light]';
var E='cubic-bezier(.2,.8,.2,1)';
var css='main,footer{position:relative;z-index:1}'+
/* cards: lift, 3D tilt, spotlight, image zoom */
CARD.split(',').map(function(s){return s}).join(',')+'{position:relative;isolation:isolate;transform-style:preserve-3d;transition:transform .5s '+E+',box-shadow .5s '+E+',border-color .3s!important;will-change:transform}'+
CARD.split(',').map(function(s){return s+':hover'}).join(',')+'{transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(-8px)!important;box-shadow:0 22px 50px rgba(0,0,0,.45),0 0 0 1px rgba(255,85,0,.35)!important}'+
'.fx-spot{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;opacity:0;transition:opacity .35s;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.16),rgba(0,229,255,.06) 35%,transparent 60%)}'+
CARD.split(',').map(function(s){return s+':hover>.fx-spot'}).join(',')+'{opacity:1}'+
'.jc img,.v img,.al img,.gcard img,.song img{transition:transform .9s '+E+'}'+
'.jc:hover img,.v:hover img,.al:hover img,.gcard:hover img,.song:hover img{transform:scale(1.08)!important}'+
'.jc h3,.v h3,.al h3,.jc b,.al b{transition:color .3s}'+
/* rows: slide + accent bar */
ROW+'{transition:transform .35s '+E+',box-shadow .35s,background .3s!important}'+
ROW.split(',').map(function(s){return s+':hover'}).join(',')+'{transform:translateX(6px);box-shadow:inset 4px 0 0 #ff5500,0 8px 22px rgba(0,0,0,.25)}'+
/* buttons: lift, glow, sheen sweep, press */
BTN+'{position:relative;overflow:hidden;transition:transform .3s '+E+',box-shadow .3s,border-color .25s,background-color .25s,color .25s!important}'+
BTN.split(',').map(function(s){return s+':hover'}).join(',')+'{transform:translateY(-3px) scale(1.03)!important;box-shadow:0 10px 26px rgba(255,85,0,.35)}'+
BTN.split(',').map(function(s){return s+':active'}).join(',')+'{transform:scale(.95)!important;transition-duration:.1s!important}'+
'.fx-sh{position:absolute;top:0;bottom:0;left:-60%;width:45%;pointer-events:none;z-index:2;background:linear-gradient(105deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg);opacity:0}'+
BTN.split(',').map(function(s){return s+':hover>.fx-sh'}).join(',')+'{animation:fxsh .75s '+E+'}'+
'@keyframes fxsh{0%{left:-60%;opacity:1}100%{left:130%;opacity:1}}'+
'.ch-fab:hover span{display:inline-block;animation:fxwig .6s}@keyframes fxwig{25%{transform:rotate(-14deg)}50%{transform:rotate(10deg)}75%{transform:rotate(-6deg)}}'+
/* header links: animated underline */
'header nav a,.nav a:not(.logo):not(.btn){background-image:linear-gradient(90deg,#ff5500,#00b8d4);background-size:0 2px;background-repeat:no-repeat;background-position:0 100%;transition:background-size .35s '+E+',color .25s;padding-bottom:3px}'+
'header nav a:hover,.nav a:not(.logo):not(.btn):hover{background-size:100% 2px}'+
'.logo .logo-ic{transition:transform .7s '+E+'}.logo:hover .logo-ic{transform:rotate(360deg) scale(1.1)}'+
/* keyboard focus */
'@media(max-width:520px){header:has(.lng) .logo{font-size:0!important;letter-spacing:0}header:has(.lng) .logo .logo-ic{margin:0!important;width:32px!important;height:32px!important}}'+'#vmore,#cmore{background:#ff5500!important;border-color:#ff5500!important;color:#fff!important;font-weight:700;padding:12px 28px!important;border-radius:999px!important}'+':focus-visible{outline:2px solid #00e5ff!important;outline-offset:3px;border-radius:8px}'+
/* light theme: framed sections + heading accent (colors pre-inverted for the light filter) */
L+' .sh h2{position:relative;display:inline-block}'+
L+' .sh h2::after{content:"";position:absolute;left:0;bottom:-8px;width:72px;height:5px;border-radius:5px;background:linear-gradient(90deg,#ff6e19,#00889e);transition:width .6s '+E+'}'+
L+' .sh:hover h2::after{width:100%}'+
L+' '+CARD.split(',').map(function(s){return s+':hover'}).join(','+L+' ')+'{box-shadow:0 22px 50px rgba(255,255,255,.18),0 0 0 2px rgba(255,110,25,.55)!important}'+
L+' .fx-spot{background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(0,0,0,.10),transparent 60%)}'+
L+' '+ROW.split(',').map(function(s){return s+':hover'}).join(','+L+' ')+'{box-shadow:inset 4px 0 0 #ff6e19,0 8px 22px rgba(255,255,255,.12)}'+
L+' '+BTN.split(',').map(function(s){return s+':hover'}).join(','+L+' ')+'{box-shadow:0 10px 24px rgba(255,255,255,.18)}'+
/* no hover devices / reduced motion */
'@media(hover:none){'+CARD.split(',').map(function(s){return s+':hover'}).join(',')+'{transform:none!important}}'+
'@media(prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation:none!important}}';
var st=document.createElement('style');st.id='bfx';st.textContent=css;document.head.appendChild(st);
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches,calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function add(el,cls){if(!el.querySelector(':scope>.'+cls)){var s=document.createElement('i');s.className=cls;s.setAttribute('aria-hidden','true');el.appendChild(s);}}
document.addEventListener('pointerover',function(e){var t=e.target;if(!t.closest)return;
  var b=t.closest(BTN);if(b)add(b,'fx-sh');
  var c=t.closest(CARD);if(c)add(c,'fx-spot');},{passive:true});
if(fine&&!calm)document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest(CARD);if(!c)return;
  var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
  if(!c.classList.contains('support')){c.style.setProperty('--ry',((x/r.width-.5)*7).toFixed(2)+'deg');c.style.setProperty('--rx',((.5-y/r.height)*7).toFixed(2)+'deg');}},{passive:true});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest(CARD);if(c&&!c.contains(e.relatedTarget)){c.style.removeProperty('--rx');c.style.removeProperty('--ry');}},{passive:true});

/* ---- 3D background: rotating sound-wave terrain of glowing dots ---- */
(function(){
if(document.getElementById('fx3d'))return;
var cv=document.createElement('canvas');cv.id='fx3d';cv.setAttribute('aria-hidden','true');
cv.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0';
function mount(){document.body.insertBefore(cv,document.body.firstChild);start();}
if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);
var ctx,W,H,D,mx=0,my=0,tx=0,ty=0,t0=performance.now(),run=true;
var COLS=64,ROWS=40,SP=1;
function size(){D=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;ctx=cv.getContext('2d');ctx.setTransform(D,0,0,D,0,0);}
addEventListener('resize',size);
addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;},{passive:true});
document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)requestAnimationFrame(frame);});
var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function col(u,a,light){ /* orange -> turquoise along u in [0,1] */
  var r=Math.round(255+(24-255)*u),g=Math.round(122+(176-122)*u),b=Math.round(24+(204-24)*u);
  if(light){r=Math.round(r*.85);g=Math.round(g*.75);b=Math.round(b*.8);}
  return 'rgba('+r+','+g+','+b+','+a.toFixed(3)+')';}
function frame(now){if(!run)return;
  var t=(now-t0)/1000;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
  var light=document.documentElement.getAttribute('data-theme')==='light';
  ctx.clearRect(0,0,W,H);
  var rotY=t*.05+mx*.6,rotX=.95+my*.25,cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);
  var f=Math.min(W,H)*0.9,camZ=7.5,scroll=(scrollY||0)*0.0015;
  for(var j=0;j<ROWS;j++){for(var i=0;i<COLS;i++){
    var x=(i/(COLS-1)-.5)*14,z=(j/(ROWS-1)-.5)*9;
    var d=Math.sqrt(x*x+z*z);
    var y=Math.sin(d*1.1-t*1.2)*0.45+Math.sin(x*.7+t*.8+scroll)*0.35+Math.cos(z*1.3-t*.6)*0.25;
    /* rotate around Y then X */
    var X=x*cy-z*sy,Z=x*sy+z*cy,Y=y*cx-Z*sx;Z=y*sx+Z*cx;
    var zz=Z+camZ;if(zz<.5)continue;
    var px=W/2+X*f/zz,py=H*0.58+Y*f/zz;
    if(px<-10||px>W+10||py<-10||py>H+10)continue;
    var depth=Math.max(0,Math.min(1,1-(zz-3)/9));
    var a=(light?.95:.7)*depth*(.45+.55*(y+1)/2);
    var rr=(light?2:1.4)+depth*2.4;
    ctx.fillStyle=col(i/(COLS-1),a,light);
    ctx.beginPath();ctx.arc(px,py,rr,0,6.283);ctx.fill();
  }}
  if(!calm)requestAnimationFrame(frame);}
function start(){size();requestAnimationFrame(frame);}
})();

/* ---- section backgrounds: Blagoday artwork with parallax, frosted panels on top ---- */
(function(){
var small=innerWidth<760;
var IMG=['/bg/room-1','/bg/room-2','/bg/room-3'].map(function(p){return p+(small?'-m':'')+'.jpg'});
var L='html[data-theme=light]';
var st=document.createElement('style');st.textContent=
'.fx-sec{position:relative;isolation:isolate;overflow:clip}'+
'.fx-sbw{position:absolute;inset:0;z-index:-1;overflow:clip;pointer-events:none}'+
'.fx-sbg{position:absolute;left:0;right:0;top:-22%;bottom:-22%;background-size:cover;background-position:center;pointer-events:none;opacity:0;transition:opacity 1s;will-change:transform}'+
'.fx-sbg.on{opacity:1}'+'.fx-sbg.tall{position:sticky;top:0;left:auto;right:auto;bottom:auto;display:block;width:100%;height:100vh;margin-bottom:-100vh}'+
'.fx-sbg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,10,.55),rgba(8,8,10,.25) 45%,rgba(8,8,10,.6))}'+
L+' .fx-sbg{filter:invert(1) hue-rotate(180deg)}'+
L+' .fx-sbg::after{background:linear-gradient(180deg,rgba(246,236,216,.45),rgba(246,236,216,.10) 45%,rgba(246,236,216,.5))}'+
'.fx-sec>.wrap{background:rgba(10,10,14,.62);-webkit-backdrop-filter:blur(16px) saturate(1.2);backdrop-filter:blur(16px) saturate(1.2);border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:34px clamp(16px,3vw,40px);box-shadow:0 30px 80px rgba(0,0,0,.45);transform:translateY(var(--py,0px));transition:transform .2s linear}'+
L+' .fx-sec>.wrap{background:rgba(9,4,0,.62)!important;border-color:rgba(57,42,12,.9)!important}'+
'#support.fx-sec>.wrap{background:transparent!important;border:0!important;box-shadow:none!important;-webkit-backdrop-filter:none;backdrop-filter:none;padding:0}'+
'.fx-sec{padding-top:90px!important;padding-bottom:90px!important}'+
'@media(max-width:760px){.fx-sec>.wrap{border-radius:20px;padding:22px 14px}.fx-sec{padding-top:56px!important;padding-bottom:56px!important}}';
document.head.appendChild(st);
var layers=[];
function go(){
  if(!/^\/(index\.html)?$|kapitan-german/.test(location.pathname))return;
  var secs=[].slice.call(document.querySelectorAll('main section:not(.hero),body>section:not(.hero)')).filter(function(s){return s.offsetHeight>120&&!s.hidden;});
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var b=e.target;var im=new Image();im.onload=function(){b.style.backgroundImage='url('+b.dataset.src+')';b.classList.add('on')};im.src=b.dataset.src;io.unobserve(b);}})},{rootMargin:'600px'}):null;
  secs.forEach(function(s,i){if(s.querySelector(':scope>.fx-sbw'))return;s.classList.add('fx-sec');var b=document.createElement('div');b.className='fx-sbg'+(s.offsetHeight>innerHeight*1.6?' tall':'');b.setAttribute('aria-hidden','true');b.dataset.src=IMG[i%IMG.length];var w=document.createElement('div');w.className='fx-sbw';w.setAttribute('aria-hidden','true');w.appendChild(b);s.insertBefore(w,s.firstChild);layers.push(b);if(io)io.observe(b);else{b.style.backgroundImage='url('+b.dataset.src+')';b.classList.add('on');}});
  tick();
}
var calm=matchMedia('(prefers-reduced-motion:reduce)').matches,pend=false;
function tick(){pend=false;if(calm)return;var vh=innerHeight;
  for(var i=0;i<layers.length;i++){var b=layers[i],r=b.parentNode.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)continue;
    var k=b.classList.contains('tall')?Math.max(-1,Math.min(1,r.top/vh*-0.15)):(r.top+r.height/2-vh/2)/vh; /* -1..1 around viewport centre */
    b.style.transform='translate3d(0,'+(k*-18).toFixed(2)+'%,0) scale('+(1.06+Math.abs(k)*0.06).toFixed(3)+')';
    var w=b.closest('.fx-sec').querySelector(':scope>.wrap');if(w)w.style.setProperty('--py',(k*14).toFixed(1)+'px');}}
addEventListener('scroll',function(){if(!pend){pend=true;requestAnimationFrame(tick);}},{passive:true});
addEventListener('resize',tick);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* ---- chat panel design ---- */
(function(){var st=document.createElement('style');st.id='bfx-chat';st.textContent='.ch-panel{background:linear-gradient(180deg,rgba(9,14,26,.80),rgba(9,14,26,.90)),url(/bg/room-2-m.jpg) center/cover!important;border:1px solid rgba(247,147,30,.35)!important;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1px rgba(34,174,196,.15)!important}.ch-panel .ch-head{background:linear-gradient(120deg,#f7931e,#ec6b1f 45%,#1f9fb8);border-bottom:0!important}.ch-panel .ch-head b,.ch-panel .ch-head .ch-on,.ch-panel .ch-head span{color:#fff!important}.ch-panel .ch-head .ch-on{background:rgba(0,0,0,.18);border-radius:999px;padding:2px 10px;display:inline-flex;margin-top:4px}.ch-panel .ch-close{border-color:rgba(255,255,255,.6)!important;color:#fff!important;background:rgba(255,255,255,.12)!important;transition:transform .3s}.ch-panel .ch-close:hover{transform:rotate(90deg)}.ch-panel .ch-bar{background:rgba(255,255,255,.04)}.ch-panel .ch-m{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:16px;margin:4px 2px;padding:10px 10px;transition:transform .25s,background .25s}.ch-panel .ch-m:hover{background:rgba(255,255,255,.10);transform:translateX(3px)}.ch-panel .ch-m.au{background:linear-gradient(135deg,rgba(247,147,30,.22),rgba(31,159,184,.18))!important;border:1px solid rgba(247,147,30,.55)!important}.ch-panel .ch-av{background:linear-gradient(135deg,#f7931e,#1f9fb8)!important}.ch-panel .ch-in{background:rgba(9,14,26,.6);border-top:1px solid rgba(255,255,255,.08)!important}.ch-panel .ch-lk{color:#f7931e!important}.ch-panel .ch-send{background:linear-gradient(135deg,#f7931e,#ec6b1f)!important}.ch-panel .ch-list{scrollbar-color:#f7931e transparent}html[data-theme=light] .ch-panel{background:linear-gradient(180deg,rgba(255,250,242,.86),rgba(255,250,242,.94)),url(/bg/room-3-m.jpg) center/cover!important;border:1px solid rgba(20,33,61,.14)!important;box-shadow:0 30px 70px rgba(20,33,61,.28)!important}html[data-theme=light] .ch-panel .ch-bar{background:rgba(255,255,255,.6);border-bottom:1px solid rgba(20,33,61,.08)!important}html[data-theme=light] .ch-panel .ch-auto,html[data-theme=light] .ch-panel .ch-auto span{color:#14213d!important}html[data-theme=light] .ch-panel .ch-st{color:#b45309!important}html[data-theme=light] .ch-panel .ch-m{background:#fff;border:1px solid rgba(20,33,61,.07);box-shadow:0 2px 8px rgba(20,33,61,.06)}html[data-theme=light] .ch-panel .ch-m:hover{background:#fff}html[data-theme=light] .ch-panel .ch-m.au{background:linear-gradient(135deg,#fff1e2,#e3f6f9)!important;border:1px solid #f7931e!important}html[data-theme=light] .ch-panel .ch-h b{color:#14213d!important}html[data-theme=light] .ch-panel .ch-b p,html[data-theme=light] .ch-panel .ch-empty,html[data-theme=light] .ch-panel .ch-list>p,html[data-theme=light] .ch-panel .ch-list{color:#1d2333!important}html[data-theme=light] .ch-panel .ch-h .mono,html[data-theme=light] .ch-panel .ch-x,html[data-theme=light] .ch-panel .ch-cc,html[data-theme=light] .ch-panel .ch-hint{color:#5a6478!important}html[data-theme=light] .ch-panel .ch-x:hover{color:#1f9fb8!important}html[data-theme=light] .ch-panel .ch-in{background:rgba(255,255,255,.75);border-top:1px solid rgba(20,33,61,.08)!important}html[data-theme=light] .ch-panel .ch-need{color:#14213d!important}html[data-theme=light] .ch-panel .ch-lk{color:#ec6b1f!important}html[data-theme=light] .ch-panel textarea,html[data-theme=light] .ch-panel .ch-pk input{background:#fff!important;color:#14213d!important;border-color:rgba(20,33,61,.18)!important}html[data-theme=light] .ch-panel textarea::placeholder{color:#8a93a6}html[data-theme=light] .ch-panel select,html[data-theme=light] .ch-panel .cm-b,html[data-theme=light] .ch-panel .ch-clip{background:#fff!important;color:#14213d!important;border-color:rgba(20,33,61,.18)!important}html[data-theme=light] .ch-panel select option{background:#fff;color:#14213d}html[data-theme=light] .ch-panel .ch-card,html[data-theme=light] .ch-panel .ch-rq,html[data-theme=light] .ch-panel .ch-rb,html[data-theme=light] .ch-panel .ch-att,html[data-theme=light] .ch-panel .ch-pk{background:#f4f7fb!important;color:#1d2333!important;border-color:rgba(20,33,61,.1)!important}html[data-theme=light] .ch-panel .ch-card *,html[data-theme=light] .ch-panel .ch-rq *,html[data-theme=light] .ch-panel .ch-pk *{color:#1d2333}html[data-theme=light] .ch-panel .ch-badge{background:#ec6b1f!important;color:#fff!important}';document.head.appendChild(st);})();

/* ---- header sign-in (shared by all pages) ---- */
(function(){
var SCB="https://blagoday-sc.blagodaymusic.workers.dev";
var TX={uk:["Увійти","Вийти","Увійти через","Ви увійшли через"],en:["Sign in","Sign out","Sign in with","Signed in with"],es:["Entrar","Salir","Entrar con","Sesión con"],pt:["Entrar","Sair","Entrar com","Conectado com"],de:["Anmelden","Abmelden","Anmelden mit","Angemeldet mit"],fr:["Se connecter","Se déconnecter","Se connecter avec","Connecté avec"]};
function lang(){var l="";try{l=localStorage.getItem("bl_lang")||""}catch(e){}if(!TX[l])l=(document.documentElement.lang||"en").slice(0,2);return TX[l]?l:"en";}
function tx(i){return TX[lang()][i];}
var css='.hlg{position:relative;flex:none}'+
'.hl-btn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 16px;border-radius:999px;border:0;background:linear-gradient(135deg,#ff7a1a,#ff5500);color:#fff;font:inherit;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 6px 18px rgba(255,85,0,.35)}'+
'.hl-btn svg{width:16px;height:16px}'+
'.hl-me{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px 0 4px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:inherit;font:inherit;font-size:14px;font-weight:600;cursor:pointer;max-width:200px}'+
'.hl-me img,.hl-me i{width:28px;height:28px;border-radius:50%;object-fit:cover;flex:none;display:grid;place-items:center;font-style:normal;font-weight:700;color:#fff;background:linear-gradient(135deg,#f7931e,#1f9fb8)}'+
'.hl-me span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.hl-menu{position:absolute;right:0;top:calc(100% + 10px);z-index:200;min-width:250px;display:flex;flex-direction:column;gap:8px;padding:14px;border-radius:16px;background:#fff;color:#14213d;box-shadow:0 20px 50px rgba(0,0,0,.35);animation:hlIn .25s cubic-bezier(.2,.8,.2,1)}'+
'.hl-menu[hidden]{display:none}@keyframes hlIn{from{opacity:0;transform:translateY(-6px)}}'+
'.hl-menu small{font-size:12px;color:#5a6478;font-weight:600}'+
'.hl-p{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;height:42px;border-radius:999px;border:1px solid rgba(20,33,61,.15);font:inherit;font-size:15px;font-weight:700;cursor:pointer}'+
'.hl-p.g{background:#fff;color:#1f1f1f}.hl-p.f{background:#1877f2;color:#fff;border-color:#1877f2}.hl-p.s{background:#ff5500;color:#fff;border-color:#ff5500}.hl-p.o{background:#f1f3f7;color:#14213d}'+
'html[data-theme=light] .hl-menu,html[data-theme=light] .hl-btn,html[data-theme=light] .hl-me img{filter:invert(1) hue-rotate(180deg)}'+
'@media(max-width:760px){.hl-menu{position:fixed;left:12px;right:12px;top:72px;min-width:0}.hl-btn span{display:none}.hl-btn{padding:0 10px}.hl-me span{display:none}.hl-me{padding:0 4px}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var ICON={google:'<svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>',facebook:'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>',soundcloud:'<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M1 15.5a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-1 0zm2 1.2a.5.5 0 0 0 1 0v-5.4a.5.5 0 0 0-1 0zm2 .3a.5.5 0 0 0 1 0v-6a.5.5 0 0 0-1 0zm2 0a.5.5 0 0 0 1 0V9.6a.5.5 0 0 0-1 0zm2 0a.5.5 0 0 0 1 0V8.3a.5.5 0 0 0-1 0zm2 0V7.6a6.3 6.3 0 0 1 7.6 4.5 3.6 3.6 0 1 1 1.3 7H11.5a.5.5 0 0 1-.5-.5z"/></svg>'};
var USER='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
(function(){var h=location.hash;if(h.indexOf("bl_id=")>=0){try{localStorage.setItem("bl_id",new URLSearchParams(h.slice(1)).get("bl_id"))}catch(e){}}if(h.indexOf("sc_at=")>=0){try{var q=new URLSearchParams(h.slice(1));if(!localStorage.getItem("bl_sc"))localStorage.setItem("bl_sc",JSON.stringify({at:q.get("sc_at"),rt:q.get("sc_rt")||"",exp:+q.get("sc_exp")||0,u:""}))}catch(e){}}})();
function who(){var id=null,sc=null;try{id=localStorage.getItem("bl_id");sc=JSON.parse(localStorage.getItem("bl_sc")||"null")}catch(e){}
  if(id){try{var b=id.split(".")[0].replace(/-/g,"+").replace(/_/g,"/");while(b.length%4)b+="=";var d=JSON.parse(decodeURIComponent(escape(atob(b))));if(d.exp>Date.now())return{p:d.p,n:d.n,a:d.a};}catch(e){}}
  if(sc&&sc.at)return{p:"soundcloud",n:sc.u||"SoundCloud",a:sc.av||""};return null;}
var PROV=null;fetch(SCB+"/auth/providers").then(function(r){return r.json()}).then(function(a){PROV=Array.isArray(a)?a:[];render();}).catch(function(){PROV=[];render();});
function ret(){return encodeURIComponent(location.origin+location.pathname);}
function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var box;
function render(){if(!box)return;var u=who(),h;
  if(u){h='<button class="hl-me" type="button" aria-haspopup="true">'+(u.a?'<img src="'+esc(u.a)+'" alt="">':'<i>'+esc((u.n||"?").charAt(0).toUpperCase())+'</i>')+'<span>'+esc(u.n)+'</span></button>'+
     '<div class="hl-menu" hidden><small>'+esc(tx(3))+' '+(u.p==="google"?"Google":u.p==="facebook"?"Facebook":"SoundCloud")+'</small><button class="hl-p o" data-out>'+esc(tx(1))+'</button></div>';}
  else{var ps=(PROV||[]).filter(function(p){return p==="google"||p==="facebook"});ps.push("soundcloud");
     h='<button class="hl-btn" type="button" aria-haspopup="true">'+USER+'<span>'+esc(tx(0))+'</span></button><div class="hl-menu" hidden><small>'+esc(tx(2))+'</small>'+
       ps.map(function(p){return '<button class="hl-p '+(p==="google"?"g":p==="facebook"?"f":"s")+'" data-p="'+p+'">'+ICON[p]+(p==="google"?"Google":p==="facebook"?"Facebook":"SoundCloud")+'</button>'}).join("")+'</div>';}
  box.innerHTML=h;
  var m=box.querySelector(".hl-menu");box.firstChild.onclick=function(e){e.stopPropagation();m.hidden=!m.hidden;};
  [].forEach.call(box.querySelectorAll("[data-p]"),function(b){b.onclick=function(){var p=b.dataset.p;location.href=p==="soundcloud"?SCB+"/login?return="+ret():SCB+"/auth/"+p+"/login?return="+ret();};});
  var o=box.querySelector("[data-out]");if(o)o.onclick=function(){try{localStorage.removeItem("bl_id");localStorage.removeItem("bl_sc")}catch(e){}location.reload();};}
document.addEventListener("click",function(e){if(box&&!box.contains(e.target)){var m=box.querySelector(".hl-menu");if(m)m.hidden=true;}});
addEventListener("storage",render);
window.BLHeaderLogin={open:function(){if(!box)return;var m=box.querySelector(".hl-menu");if(m){m.hidden=false;scrollTo({top:0,behavior:"smooth"});}},refresh:render};
function mount(){var t=document.getElementById("thm");if(!t){return setTimeout(mount,150);}if(document.querySelector(".hlg"))return;box=document.createElement("div");box.className="hlg";t.parentNode.insertBefore(box,t);render();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();

/* ---- privacy link in every footer ---- */
(function(){var N={uk:"Конфіденційність",en:"Privacy",es:"Privacidad",pt:"Privacidade",de:"Datenschutz",fr:"Confidentialité"};
function go(){var f=document.querySelector("footer");if(!f||f.querySelector(".pv-l")||/privacy\.html/.test(location.pathname))return;var l="en";try{l=localStorage.getItem("bl_lang")||""}catch(e){}if(!N[l])l=(document.documentElement.lang||"en").slice(0,2);if(!N[l])l="en";
var t=f.querySelector(".fgrid>div,.wrap>div")||f;var a=document.createElement("a");a.className="pv-l";a.href="/privacy.html";a.textContent=N[l];a.style.cssText="color:inherit;opacity:.85;margin-left:6px";t.appendChild(document.createTextNode(" · "));t.appendChild(a);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();
})();
