/* Hero test: particle-text title (BLAGODAY / PRODUCTION) that assembles, ripples, and reacts to touch. */
(function(){
var h=document.querySelector('.hero'),h1=h&&h.querySelector('h1');if(!h||!h1||document.getElementById('hAnim'))return;
var de=document.documentElement;de.classList.add('hero-anim');
var st=document.createElement('style');
st.textContent='.hero-anim .hero .wrap{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);opacity:0}.hero-anim .hero{padding:0!important;min-height:100svh}.hero-cta{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;padding:34px 16px 6px;position:relative;z-index:2}.hero-cta .btn{flex:0 1 auto}@media(max-width:600px){.hero-cta .btn{flex:1 1 100%;justify-content:center;text-align:center}}.hero-anim .hero .kicker,.hero-anim .hero .lead,.hero-anim .hero .stats{display:none!important}.hero-anim .hero::after,.hero-anim .hero::before,.hero-anim .hero-bg,.hero-anim .slides,.hero-anim .hero-shade,.hero-anim .now-top{display:none!important}'+
'.hero-anim .hero{align-items:center!important;background:transparent}'+
'.hero-anim .hero h1,.hero-anim .hero h1 *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;background:none!important}'+
'#hAnim{position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;pointer-events:none}';
document.head.appendChild(st);
var bg0=document.getElementById('fx3d');if(bg0)bg0.style.opacity='.12';
var bt=h.querySelector('.btns');if(bt){var cta=document.createElement('div');cta.className='hero-cta';while(bt.firstChild)cta.appendChild(bt.firstChild);h.parentNode.insertBefore(cta,h.nextSibling);}
var cv=document.createElement('canvas');cv.id='hAnim';cv.setAttribute('aria-hidden','true');h.insertBefore(cv,h.firstChild);
var TY=300,ctx=cv.getContext('2d'),W=0,H=0,D=1,P=[],t0=performance.now(),px=-999,py=-999,pdown=0,run=true,vis=true,
 calm=matchMedia('(prefers-reduced-motion:reduce)').matches,FONT="900 {s}px Montserrat,'Arial Black',Impact,sans-serif";
function col(u,a){var r=Math.round(255+(24-255)*u),g=Math.round(122+(176-122)*u),b=Math.round(24+(204-24)*u);return 'rgba('+r+','+g+','+b+','+a+')';}
function build(){
  var hr=h.getBoundingClientRect(),r=h1.getBoundingClientRect();
  W=hr.width;H=hr.height;D=Math.min(devicePixelRatio||1,2);cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0);
  var oc=document.createElement('canvas');oc.width=W;oc.height=H;var o=oc.getContext('2d');
  var A='BLAGODAY',B='PRODUCTION',bw=W-(W<700?28:60),m=document.createElement('canvas').getContext('2d');
  function fit(txt,w){m.font=FONT.replace('{s}',100);return 100*w/m.measureText(txt).width;}
  var f1=fit(A,bw),f2=fit(B,bw),gap=Math.round(f2*.3),hh=f1*.74+gap+f2*.74,k=Math.min(1,H*.62/hh);
  f1*=k;f2*=k;bw*=k;TY=H*.47;
  var x0=(W-bw)/2,y0=H*.47-(f1*.74+gap+f2*.74)/2;
  o.fillStyle='#fff';o.textBaseline='alphabetic';
  o.font=FONT.replace('{s}',f1);o.fillText(A,x0,y0+f1*.74);
  o.font=FONT.replace('{s}',f2);o.fillText(B,x0,y0+f1*.74+gap+f2*.74);
  var S=Math.max(W<700?4:5,Math.round(Math.sqrt(bw*(f1+f2)*.74*.45/5500))),d=o.getImageData(0,0,W,H).data;P=[];
  for(var y=0;y<H;y+=S)for(var x=0;x<W;x+=S){if(d[((y|0)*(W|0)+(x|0))*4+3]>128){
    var ang=Math.random()*6.283,rad=Math.max(W,H)*(.4+Math.random()*.6);
    P.push({hx:x,hy:y,x:W/2+Math.cos(ang)*rad,y:H/2+Math.sin(ang)*rad,vx:0,vy:0,u:(x-x0)/bw,ox:(Math.random()-.5)*W*.9,oy:H*(.3+Math.random()*.9),dl:(x-x0)/bw*.9+Math.random()*.3,s:1.9+Math.random()*1.5});}}
  if(P.length>6500){P=P.filter(function(_,i){return i%2==0});}
  t0=performance.now();
}

function extras(t,se,ex){
  var ie=Math.min(1,t/2.2)*(1-se);if(ie<=0.01)return;
  var cx=W*(W<700?.5:.5),cy=Math.min(H*.5,TY),i,k,u,n;
  /* wide ribbons crossing the whole screen */
  for(k=0;k<3;k++){n=W<700?90:170;for(i=0;i<n;i++){u=i/n;
    var x=u*W,y=H*(.2+.27*k)+Math.sin(u*(5+k)+t*(.7+.25*k)+k*2)*H*.075+Math.sin(u*13-t*1.3+k)*H*.025;
    var a=(.25+.35*Math.abs(Math.sin(u*9-t*1.6+k)))*ie,sz=1.2+1.6*Math.abs(Math.sin(u*7+t+k));
    ctx.fillStyle=col((u+k*.15)%1,a.toFixed(2));ctx.fillRect(x-sz/2,y-sz/2,sz,sz);}}
  /* orbit rings around the title */
  for(k=0;k<3;k++){n=W<700?110:220;var rx=W*(.26+.11*k),ry=rx*(.2+.05*k),tilt=(k-1)*.32,ct=Math.cos(tilt),stt=Math.sin(tilt),sp=t*(.28+.1*k)*(k%2?-1:1);
    for(i=0;i<n;i++){var th=i/n*6.283+sp,ex0=Math.cos(th)*rx,ey0=Math.sin(th)*ry,z=Math.sin(th);
      var x=cx+ex0*ct-ey0*stt,y=cy+ex0*stt+ey0*ct,a=(.18+.5*(z+1)/2)*ie,sz=1+1.8*(z+1)/2;
      ctx.fillStyle=col(i/n,a.toFixed(2));ctx.fillRect(x-sz/2,y-sz/2,sz,sz);}}
  /* equalizer along the bottom */
  var bars=Math.floor(W/(W<700?11:14)),bw=W/bars,beat=1+.25*Math.max(0,Math.sin(t*3.1));
  for(i=0;i<bars;i++){var hgt=H*.2*(.3+.7*Math.abs(Math.sin(i*.33+t*2.1)*Math.sin(i*.11-t*1.2)))*beat,xx=i*bw+bw/2;
    for(var yy=0;yy<hgt;yy+=8){var a=(.4*(1-yy/hgt)+.08)*ie;ctx.fillStyle=col(i/bars,a.toFixed(2));ctx.fillRect(xx-1.2,H-24-yy,2.4,2.4);}}
  /* comets */
  for(k=0;k<4;k++){var per=4.5+k*1.3,pp=((t+k*1.7)%per)/per,hx=W*(1.15-1.4*pp)+k*40,hy=H*(-.05+.95*pp)*(.5+.18*k)+H*.05*k;
    for(i=0;i<22;i++){var q=i/22,x=hx+q*70,y=hy-q*34,a=(1-q)*.8*ie*(pp<.05?pp/.05:1);ctx.fillStyle=col(k/4,a.toFixed(2));var sz=3.2*(1-q)+.6;ctx.fillRect(x-sz/2,y-sz/2,sz,sz);}}
}
function frame(now){if(!run)return;requestAnimationFrame(frame);if(!vis)return;
  var t=(now-t0)/1000;ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';var sc=Math.min(1,Math.max(0,(scrollY||0)/(innerHeight*.75))),se=sc*sc*(3-2*sc),se0=se;
  ctx.save();ctx.translate(-gx*26,-gy*16);extras(t,se0,0);
  if(shk>=0&&shk<2.6){var fa=(1-shk/2.6)*(1-se)*.9,nn=W<700?120:200;for(var q=0;q<nn;q++){var an=q/nn*6.283,rx2=W/2+Math.cos(an)*sr,ry2=TY+Math.sin(an)*sr*.62;ctx.fillStyle=col(q/nn,fa.toFixed(2));ctx.fillRect(rx2-1.5,ry2-1.5,3,3);}}
  ctx.restore();var shk=t>2.4?(t-2.4)%11:-1,sr=shk*Math.max(W,H)*.42;gx+=(gtx-gx)*.05;gy+=(gty-gy)*.05;
  var cyc=(t%7)/7,front=(cyc*1.6-.3)*W; /* pulse sweeps left->right every 7s */
  var R=W<700?70:100,bg=document.getElementById('fx3d');if(bg)bg.style.opacity=(.12+.88*se).toFixed(3);
  for(var i=0;i<P.length;i++){var p=P[i];
    var tt=t-p.dl;if(tt<0){continue;}
    var wy=calm?0:Math.sin(p.hx*.022-t*2.2)*2.2;
    var pu=Math.abs(p.hx-front),boost=pu<90?(1-pu/90):0;
    var tx=p.hx+p.ox*se,ty=p.hy+wy-boost*10+p.oy*se;
    var dx=p.x-px,dy=p.y-py,dd=dx*dx+dy*dy;
    if(dd<R*R&&dd>1){var dist=Math.sqrt(dd),f=(1-dist/R)*(pdown?9:2.4);p.vx+=dx/dist*f;p.vy+=dy/dist*f;}
    if(shk>=0&&shk<2.6){var sx=p.x-W/2,sy=p.y-TY,sd=Math.sqrt(sx*sx+sy*sy)||1,gp=Math.abs(sd-sr);if(gp<70){var kf=(1-gp/70)*2.4*(1-shk/2.6);p.vx+=sx/sd*kf;p.vy+=sy/sd*kf;}}
    p.vx+=(tx-p.x)*.045;p.vy+=(ty-p.y)*.045;p.vx*=.86;p.vy*=.86;p.x+=p.vx;p.y+=p.vy;
    var sp=Math.min(1,Math.abs(p.vx)+Math.abs(p.vy)),a=.8+.2*Math.sin(t*1.5+p.hx*.05)+boost*.5+sp*.2;
    ctx.fillStyle=col(Math.min(1,Math.max(0,p.u+boost*.0)),(Math.min(1,a)*(1-se)).toFixed(2));
    var s=p.s*(1+boost*.8);ctx.fillRect(p.x-s/2,p.y-s/2,s,s);}
  ctx.globalCompositeOperation='source-over';}
var gx=0,gy=0,gtx=0,gty=0;
function setP(e){gtx=e.clientX/innerWidth-.5;gty=e.clientY/innerHeight-.5;var r=h.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;}
addEventListener('pointermove',setP,{passive:true});
addEventListener('pointerdown',function(e){setP(e);pdown=1;setTimeout(function(){pdown=0},180);},{passive:true});
addEventListener('pointerup',function(e){if(e.pointerType!=='mouse'){setTimeout(function(){px=py=-999},350);}},{passive:true});
addEventListener('pointerleave',function(){px=py=-999});
if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(h);
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,200)});
document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)requestAnimationFrame(frame)});
Promise.race([document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve(),new Promise(function(r){setTimeout(r,1200)})]).then(function(){build();requestAnimationFrame(frame);});
})();
