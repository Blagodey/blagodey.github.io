(function(){
var K='bp-theme',d=document.documentElement,t;
try{t=localStorage.getItem(K)}catch(e){}
if(t!=='light')t='dark';
d.setAttribute('data-theme',t);
var st=document.createElement('style');
st.textContent='html[data-theme=light]{filter:invert(1) hue-rotate(180deg);background:#080808}'+
'html[data-theme=light] img,html[data-theme=light] video,html[data-theme=light] iframe,html[data-theme=light] canvas,html[data-theme=light] .slides,html[data-theme=light] .hero,html[data-theme=light] .modal,html[data-theme=light] .scp,html[data-theme=light] .pl,html[data-theme=light] .chw:not(.open) .ch-fab,html[data-theme=light] .ch-send{filter:invert(1) hue-rotate(180deg)}'+
'html[data-theme=light] .hero img,html[data-theme=light] .hero video,html[data-theme=light] .hero canvas,html[data-theme=light] .hero .slides,html[data-theme=light] .modal img,html[data-theme=light] .modal iframe,html[data-theme=light] .modal video,html[data-theme=light] .scp img,html[data-theme=light] .scp iframe,html[data-theme=light] .pl img,html[data-theme=light] .pl iframe'+
'html[data-theme=light]{--bg:#1c1200;--card:#090400;--line:#392a0c;--txt:#ece7e2;--mut:#c3b9ab;--mag:#ff6e19}'+'html[data-theme=light] body{font-weight:600;-webkit-font-smoothing:auto}'+'html[data-theme=light] .sub,html[data-theme=light] p{color:#d8d0c4}'+'html[data-theme=light] header{background:rgba(28,18,0,.85)!important}'+'html[data-theme=light] .jc:nth-child(6n+1),html[data-theme=light] .v:nth-child(6n+1),html[data-theme=light] .al:nth-child(6n+1),html[data-theme=light] .gcard:nth-child(6n+1){background:#5a2403!important;border-color:#9f4614!important}'+'html[data-theme=light] .jc:nth-child(6n+2),html[data-theme=light] .v:nth-child(6n+2),html[data-theme=light] .al:nth-child(6n+2),html[data-theme=light] .gcard:nth-child(6n+2){background:#092d50!important;border-color:#1c5991!important}'+'html[data-theme=light] .jc:nth-child(6n+3),html[data-theme=light] .v:nth-child(6n+3),html[data-theme=light] .al:nth-child(6n+3),html[data-theme=light] .gcard:nth-child(6n+3){background:#002810!important;border-color:#00602f!important}'+'html[data-theme=light] .jc:nth-child(6n+4),html[data-theme=light] .v:nth-child(6n+4),html[data-theme=light] .al:nth-child(6n+4),html[data-theme=light] .gcard:nth-child(6n+4){background:#372960!important;border-color:#6b55b4!important}'+'html[data-theme=light] .jc:nth-child(6n+5),html[data-theme=light] .v:nth-child(6n+5),html[data-theme=light] .al:nth-child(6n+5),html[data-theme=light] .gcard:nth-child(6n+5){background:#5c1f39!important;border-color:#a6426e!important}'+'html[data-theme=light] .jc:nth-child(6n+6),html[data-theme=light] .v:nth-child(6n+6),html[data-theme=light] .al:nth-child(6n+6),html[data-theme=light] .gcard:nth-child(6n+6){background:#441d00!important;border-color:#7f3f00!important}'+'html[data-theme=light] .jc,html[data-theme=light] .v,html[data-theme=light] .al,html[data-theme=light] .gcard,html[data-theme=light] .mtabs button,html[data-theme=light] .plat a{box-shadow:0 2px 4px rgba(255,255,255,.10),0 10px 26px rgba(255,255,255,.10)}'+'html[data-theme=light] .jc:hover,html[data-theme=light] .v:hover,html[data-theme=light] .al:hover,html[data-theme=light] .gcard:hover{box-shadow:0 4px 8px rgba(255,255,255,.14),0 18px 40px rgba(255,255,255,.16)}'+'html[data-theme=light] .support{background:linear-gradient(135deg,#7e3209,#93325b 55%,#5a3f96)!important;border-color:transparent!important}'+'html[data-theme=light] .song,html[data-theme=light] .cr,html[data-theme=light] .mtabs button,html[data-theme=light] .plat a{background:#090400}'+'.thm{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.04);color:inherit;cursor:pointer;display:inline-grid;place-items:center;padding:0;flex:none;transition:transform .25s,border-color .2s}'+
'.thm:hover{border-color:#ff5500}.thm:active{transform:scale(.9)}.thm svg{width:18px;height:18px;transition:transform .5s}'+
'html[data-theme=light] .thm svg{transform:rotate(180deg)}'+
'.thm-fix{position:fixed;top:12px;right:12px;z-index:60}'+
'#totop{position:fixed;left:16px;bottom:16px;z-index:89;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(14,14,18,.85);backdrop-filter:blur(8px);color:#fff;cursor:pointer;display:grid;place-items:center;padding:0;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .25s,transform .25s,border-color .2s}'+
'#totop.on{opacity:1;transform:none;pointer-events:auto}#totop:hover{border-color:#ff5500}#totop svg{width:20px;height:20px}#qpill{left:68px!important}';
document.head.appendChild(st);
(function(){var x=document.createElement('script');x.src='/fx.js?v=3';x.defer=true;document.head.appendChild(x);})();
var SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>';
function paint(b){b.innerHTML=d.getAttribute('data-theme')==='light'?MOON:SUN;b.setAttribute('aria-label','Theme');
var m=document.querySelector('meta[name=theme-color]');if(m)m.content=d.getAttribute('data-theme')==='light'?'#ececec':'#080808'}
function init(){
if(document.getElementById('thm'))return;
var b=document.createElement('button');b.id='thm';b.className='thm';b.type='button';paint(b);
b.onclick=function(){var n=d.getAttribute('data-theme')==='light'?'dark':'light';d.setAttribute('data-theme',n);try{localStorage.setItem(K,n)}catch(e){}paint(b)};
var r=document.querySelector('header .right'),w=document.querySelector('header .wrap');
if(r)r.insertBefore(b,r.firstChild);
else if(w){var l=w.querySelector('.lng');l?l.parentNode.insertBefore(b,l.nextSibling):w.appendChild(b)}
else{b.classList.add('thm-fix');document.body.appendChild(b)}
}
function top(){if(document.getElementById('totop'))return;var u=document.createElement('button');u.id='totop';u.type='button';u.setAttribute('aria-label','Up');u.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';u.onclick=function(){scrollTo({top:0,behavior:'smooth'})};document.body.appendChild(u);function f(){u.classList.toggle('on',scrollY>600)}addEventListener('scroll',f,{passive:true});f()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',top);else top();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
