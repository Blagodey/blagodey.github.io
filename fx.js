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
'header nav a,.nav a:not(.logo):not(.btn){background-image:linear-gradient(90deg,#ff5500,#ff2bd6);background-size:0 2px;background-repeat:no-repeat;background-position:0 100%;transition:background-size .35s '+E+',color .25s;padding-bottom:3px}'+
'header nav a:hover,.nav a:not(.logo):not(.btn):hover{background-size:100% 2px}'+
'.logo .logo-ic{transition:transform .7s '+E+'}.logo:hover .logo-ic{transform:rotate(360deg) scale(1.1)}'+
/* keyboard focus */
':focus-visible{outline:2px solid #00e5ff!important;outline-offset:3px;border-radius:8px}'+
/* light theme: framed sections + heading accent (colors pre-inverted for the light filter) */
L+' main section[id]:not(.hero):not(#support)>.wrap,'+L+' body>section[id]:not(.hero):not(#support)>.wrap{background:rgba(9,4,0,.55);border:1px solid #392a0c;border-radius:28px;padding:34px clamp(16px,3vw,40px);box-shadow:0 2px 6px rgba(255,255,255,.06),0 24px 60px rgba(255,255,255,.07)}'+
L+' .sh h2{position:relative;display:inline-block}'+
L+' .sh h2::after{content:"";position:absolute;left:0;bottom:-8px;width:72px;height:5px;border-radius:5px;background:linear-gradient(90deg,#ff6e19,#93325b);transition:width .6s '+E+'}'+
L+' .sh:hover h2::after{width:100%}'+
L+' '+CARD.split(',').map(function(s){return s+':hover'}).join(','+L+' ')+'{box-shadow:0 22px 50px rgba(255,255,255,.18),0 0 0 2px rgba(255,110,25,.55)!important}'+
L+' .fx-spot{background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(0,0,0,.10),transparent 60%)}'+
L+' '+ROW.split(',').map(function(s){return s+':hover'}).join(','+L+' ')+'{box-shadow:inset 4px 0 0 #ff6e19,0 8px 22px rgba(255,255,255,.12)}'+
L+' '+BTN.split(',').map(function(s){return s+':hover'}).join(','+L+' ')+'{box-shadow:0 10px 24px rgba(255,255,255,.18)}'+
'@media(max-width:760px){'+L+' main section[id]:not(.hero):not(#support)>.wrap,'+L+' body>section[id]:not(.hero):not(#support)>.wrap{border-radius:20px;padding:22px 14px}}'+
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
function col(u,a,light){ /* orange -> magenta -> cyan along u in [0,1] */
  var r,g,b;if(u<.5){var k=u/.5;r=255;g=Math.round(85-42*k);b=Math.round(214*k);}else{var k2=(u-.5)/.5;r=Math.round(255-255*k2);g=Math.round(43+186*k2);b=Math.round(214+41*k2);}
  if(light){r=Math.round(r*.8);g=Math.round(g*.6);b=Math.round(b*.75);}
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
})();
