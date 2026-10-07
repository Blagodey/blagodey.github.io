/* Hero test: particle-text title (BLAGODAY / PRODUCTION) that assembles, ripples, and reacts to touch. */
(function(){
var h=document.querySelector('.hero'),h1=h&&h.querySelector('h1');if(!h||!h1||document.getElementById('hAnim'))return;
var de=document.documentElement;de.classList.add('hero-anim');
var st=document.createElement('style');
st.textContent='.hero-anim .slides,.hero-anim .hero-shade,.hero-anim .now-top{display:none!important}'+
'.hero-anim .hero{align-items:center!important;background:transparent}'+
'.hero-anim .hero h1,.hero-anim .hero h1 *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;background:none!important}'+
'#hAnim{position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;pointer-events:none}';
document.head.appendChild(st);
var bg0=document.getElementById('fx3d');if(bg0)bg0.style.opacity='.12';
var cv=document.createElement('canvas');cv.id='hAnim';cv.setAttribute('aria-hidden','true');h.insertBefore(cv,h.firstChild);
var ctx=cv.getContext('2d'),W=0,H=0,D=1,P=[],t0=performance.now(),px=-999,py=-999,pdown=0,run=true,vis=true,
 calm=matchMedia('(prefers-reduced-motion:reduce)').matches,FONT="900 {s}px Montserrat,'Arial Black',Impact,sans-serif";
function col(u,a){var r=Math.round(255+(24-255)*u),g=Math.round(122+(176-122)*u),b=Math.round(24+(204-24)*u);return 'rgba('+r+','+g+','+b+','+a+')';}
function build(){
  var hr=h.getBoundingClientRect(),r=h1.getBoundingClientRect();
  W=hr.width;H=hr.height;D=Math.min(devicePixelRatio||1,2);cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0);
  var oc=document.createElement('canvas');oc.width=W;oc.height=H;var o=oc.getContext('2d');
  var A='BLAGODAY',B='PRODUCTION',bw=Math.min(r.width,W-32),m=document.createElement('canvas').getContext('2d');
  function fit(txt,w){m.font=FONT.replace('{s}',100);return 100*w/m.measureText(txt).width;}
  var f1=fit(A,bw),f2=fit(B,bw),gap=Math.round(f2*.28),hh=f1*.74+gap+f2*.74,k=Math.min(1,Math.max(r.height,W<700?150:240)*1.25/hh);
  f1*=k;f2*=k;bw*=k;
  var x0=r.left-hr.left+(r.width>W-40?0:0),y0=r.top-hr.top+Math.max(0,(r.height-(f1*.74+gap+f2*.74))/2);
  if(W<700)x0=(W-bw)/2;
  o.fillStyle='#fff';o.textBaseline='alphabetic';
  o.font=FONT.replace('{s}',f1);o.fillText(A,x0,y0+f1*.74);
  o.font=FONT.replace('{s}',f2);o.fillText(B,x0,y0+f1*.74+gap+f2*.74);
  var S=W<700?4:5,d=o.getImageData(0,0,W,H).data;P=[];
  for(var y=0;y<H;y+=S)for(var x=0;x<W;x+=S){if(d[((y|0)*(W|0)+(x|0))*4+3]>128){
    var ang=Math.random()*6.283,rad=Math.max(W,H)*(.4+Math.random()*.6);
    P.push({hx:x,hy:y,x:W/2+Math.cos(ang)*rad,y:H/2+Math.sin(ang)*rad,vx:0,vy:0,u:(x-x0)/bw,ox:(Math.random()-.5)*W*.9,oy:H*(.3+Math.random()*.9),dl:(x-x0)/bw*.9+Math.random()*.3,s:1.5+Math.random()*1.3});}}
  if(P.length>6500){P=P.filter(function(_,i){return i%2==0});}
  t0=performance.now();
}
function frame(now){if(!run)return;requestAnimationFrame(frame);if(!vis)return;
  var t=(now-t0)/1000;ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
  var cyc=(t%7)/7,front=(cyc*1.6-.3)*W; /* pulse sweeps left->right every 7s */
  var R=W<700?70:100,sc=Math.min(1,Math.max(0,(scrollY||0)/(innerHeight*.75))),se=sc*sc*(3-2*sc),bg=document.getElementById('fx3d');if(bg)bg.style.opacity=(.12+.88*se).toFixed(3);
  for(var i=0;i<P.length;i++){var p=P[i];
    var tt=t-p.dl;if(tt<0){continue;}
    var wy=calm?0:Math.sin(p.hx*.022-t*2.2)*2.2;
    var pu=Math.abs(p.hx-front),boost=pu<90?(1-pu/90):0;
    var tx=p.hx+p.ox*se,ty=p.hy+wy-boost*10+p.oy*se;
    var dx=p.x-px,dy=p.y-py,dd=dx*dx+dy*dy;
    if(dd<R*R&&dd>1){var dist=Math.sqrt(dd),f=(1-dist/R)*(pdown?9:2.4);p.vx+=dx/dist*f;p.vy+=dy/dist*f;}
    p.vx+=(tx-p.x)*.045;p.vy+=(ty-p.y)*.045;p.vx*=.86;p.vy*=.86;p.x+=p.vx;p.y+=p.vy;
    var sp=Math.min(1,Math.abs(p.vx)+Math.abs(p.vy)),a=.55+.35*Math.sin(t*1.5+p.hx*.05)*.5+boost*.5+sp*.2;
    ctx.fillStyle=col(Math.min(1,Math.max(0,p.u+boost*.0)),(Math.min(1,a)*(1-se)).toFixed(2));
    var s=p.s*(1+boost*.8);ctx.fillRect(p.x-s/2,p.y-s/2,s,s);}
  ctx.globalCompositeOperation='source-over';}
function setP(e){var r=h.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;}
addEventListener('pointermove',setP,{passive:true});
addEventListener('pointerdown',function(e){setP(e);pdown=1;setTimeout(function(){pdown=0},180);},{passive:true});
addEventListener('pointerup',function(e){if(e.pointerType!=='mouse'){setTimeout(function(){px=py=-999},350);}},{passive:true});
addEventListener('pointerleave',function(){px=py=-999});
if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(h);
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,200)});
document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)requestAnimationFrame(frame)});
Promise.race([document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve(),new Promise(function(r){setTimeout(r,1200)})]).then(function(){build();requestAnimationFrame(frame);});
})();
