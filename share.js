/* Blagoday chat: share a post (link -> Open Graph card -> site chat) */
(function(){
const WK="https://blagoday-sc.blagodaymusic.workers.dev";
const TX={uk:{sh:"Поділитися",cp:"Копіювати посилання",ok:"Посилання скопійовано",t:"Допис у чаті Blagoday",miss:"Допис більше недоступний"},
en:{sh:"Share",cp:"Copy link",ok:"Link copied",t:"Blagoday chat post",miss:"This post is no longer available"},
es:{sh:"Compartir",cp:"Copiar enlace",ok:"Enlace copiado",t:"Publicación del chat Blagoday",miss:"Esta publicación ya no está disponible"},
pt:{sh:"Compartilhar",cp:"Copiar link",ok:"Link copiado",t:"Post do chat Blagoday",miss:"Este post não está mais disponível"},
de:{sh:"Teilen",cp:"Link kopieren",ok:"Link kopiert",t:"Beitrag im Blagoday-Chat",miss:"Dieser Beitrag ist nicht mehr verfügbar"},
fr:{sh:"Partager",cp:"Copier le lien",ok:"Lien copié",t:"Message du chat Blagoday",miss:"Ce message n’est plus disponible"}};
const lang=()=>{let l="en";try{l=document.documentElement.lang||localStorage.getItem("bl_lang")||"en"}catch(e){}l=String(l).slice(0,2);return TX[l]?l:"en"};
const tt=k=>TX[lang()][k];
const css=document.createElement("style");
css.textContent=".ch-sh{display:inline-flex;align-items:center;gap:6px;margin-top:8px;background:rgba(255,85,0,.14);border:1px solid #ff5500;color:#ff8a4d;cursor:pointer;font:inherit;font-size:14px;font-weight:600;padding:7px 14px;border-radius:999px}.ch-sh span{font-size:16px;line-height:1}.ch-sh:hover{background:#ff5500;color:#fff}.ch-m.ch-hl>.ch-b{outline:2px solid #ff5500;border-radius:12px;animation:chhl 2.4s ease-out 1}@keyframes chhl{from{background:rgba(255,85,0,.25)}to{background:transparent}}.ch-shm{position:fixed;z-index:99999;background:#12121a;border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:6px;display:flex;flex-direction:column;min-width:200px;box-shadow:0 10px 30px rgba(0,0,0,.5)}.ch-shm a,.ch-shm button{display:block;text-align:left;background:none;border:0;color:#fff;font:inherit;font-size:15px;padding:10px 12px;border-radius:10px;cursor:pointer;text-decoration:none}.ch-shm a:hover,.ch-shm button:hover{background:rgba(255,255,255,.08)}.ch-shtoast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#ff5500;color:#fff;padding:10px 16px;border-radius:999px;z-index:99999;font-size:14px}";
document.head.appendChild(css);
const link=id=>WK+"/p/"+id;
function toast(s){const d=document.createElement("div");d.className="ch-shtoast";d.textContent=s;document.body.appendChild(d);setTimeout(()=>d.remove(),2000)}
function closeMenu(){document.querySelectorAll(".ch-shm").forEach(e=>e.remove())}
async function copy(u){try{await navigator.clipboard.writeText(u)}catch(e){const i=document.createElement("input");i.value=u;document.body.appendChild(i);i.select();try{document.execCommand("copy")}catch(_){}i.remove()}toast(tt("ok"))}
function openMenu(btn,id){closeMenu();const u=link(id),eu=encodeURIComponent(u),et=encodeURIComponent(tt("t"));
 const m=document.createElement("div");m.className="ch-shm";
 m.innerHTML=`<a target="_blank" rel="noopener" href="https://t.me/share/url?url=${eu}&text=${et}">Telegram</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${eu}">Facebook</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${eu}&text=${et}">X</a><a target="_blank" rel="noopener" href="https://wa.me/?text=${et}%20${eu}">WhatsApp</a><button type="button">${tt("cp")}</button>`;
 document.body.appendChild(m);
 const r=btn.getBoundingClientRect();m.style.top=Math.min(window.innerHeight-m.offsetHeight-10,r.bottom+4)+"px";m.style.left=Math.max(8,Math.min(window.innerWidth-m.offsetWidth-8,r.left-120))+"px";
 m.querySelector("button").onclick=()=>{copy(u);closeMenu()};
 m.querySelectorAll("a").forEach(a=>a.onclick=()=>setTimeout(closeMenu,50));}
document.addEventListener("click",e=>{
 const b=e.target.closest(".ch-sh");
 if(b){e.preventDefault();e.stopPropagation();const id=b.dataset.id;if(navigator.share&&/Mobi|Android|iPhone/i.test(navigator.userAgent)){navigator.share({title:tt("t"),url:link(id)}).catch(()=>{});}else openMenu(b,id);return}
 if(!e.target.closest(".ch-shm"))closeMenu();
},true);
function decorate(){document.querySelectorAll("#chList .ch-m").forEach(m=>{const t=m.querySelector("[data-chtr]");const bx=m.querySelector(".ch-b");if(!t||!bx||bx.querySelector(".ch-sh"))return;const b=document.createElement("button");b.type="button";b.className="ch-sh";b.dataset.id=t.dataset.chtr;b.setAttribute("aria-label",tt("sh"));b.innerHTML="<span>↗</span> "+tt("sh");bx.appendChild(b)})}
setInterval(()=>{if(document.getElementById("chList"))decorate()},700);
// landing from a shared link: ?post=ID
const pid=(new URLSearchParams(location.search).get("post")||"").replace(/\D/g,"");
if(pid){let tries=0,fetched=null,done=false;
 const iv=setInterval(async()=>{tries++;if(done||tries>40){clearInterval(iv);return}
  if(typeof window.chOpen==="function"&&document.getElementById("chPanel")?.hidden===true)try{window.chOpen()}catch(e){}
  if(typeof CH==="undefined"||!CH.msgs||!document.getElementById("chList"))return;
  if(!CH.msgs.length&&tries<6)return;
  if(!CH.msgs.some(m=>String(m.id)===pid)){
   if(fetched===null){fetched=false;try{const r=await fetch(WK+"/chat/msg?id="+pid);if(r.ok){const d=await r.json();if(d&&d.m)fetched=d.m}}catch(e){}
    if(!fetched){toast(tt("miss"));done=true;return}}
   if(fetched&&!CH.msgs.some(m=>String(m.id)===pid)){CH.msgs.push(fetched);CH.msgs.sort((a,b)=>a.id-b.id);try{chRender(false)}catch(e){}}
  }
  decorate();
  const b=document.querySelector('#chList [data-chtr="'+pid+'"]');const el=b&&b.closest(".ch-m");
  if(el){el.classList.add("ch-hl");el.scrollIntoView({block:"center"});done=true}
 },500);}
})();
