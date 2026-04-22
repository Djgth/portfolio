/* ── CURSOR ── */
const cur = document.getElementById('cur');
let mx=window.innerWidth/2, my=window.innerHeight/2;
let cx=mx, cy=my;
document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY });
function animCur(){
  cx+=(mx-cx)*0.18; cy+=(my-cy)*0.18;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  requestAnimationFrame(animCur);
}
animCur();
document.querySelectorAll('a,button,.svc,.work-item,.brand,.skill-pill,.stat-block,.btn-main').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});

/* ── LOADER ── */
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('gone'), 2000);
});

/* ── PROGRESS BAR ── */
const prog = document.getElementById('progress');
window.addEventListener('scroll',()=>{
  const pct = window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  prog.style.width = pct+'%';
});

/* ── CANVAS PARTICLE BG ── */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight }
resize(); window.addEventListener('resize',resize);

class Particle{
  constructor(){this.reset()}
  reset(){
    this.x=Math.random()*W;
    this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*0.3;
    this.vy=(Math.random()-.5)*0.3;
    this.size=Math.random()*1.5+.3;
    this.alpha=Math.random()*.4+.05;
    this.color=Math.random()>.7?'212,168,67':'245,240,232';
  }
  update(){
    this.x+=this.vx; this.y+=this.vy;
    if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}
for(let i=0;i<120;i++) particles.push(new Particle());

// Connect nearby particles with thin lines
function connectParticles(){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;
      const dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(212,168,67,${.08*(1-dist/120)})`;
        ctx.lineWidth=.4;
        ctx.stroke();
      }
    }
  }
}

function animCanvas(){
  ctx.clearRect(0,0,W,H);
  // Subtle grid
  ctx.strokeStyle='rgba(245,240,232,0.025)';
  ctx.lineWidth=.5;
  for(let x=0;x<W;x+=80){
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }
  for(let y=0;y<H;y+=80){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
  }
  connectParticles();
  particles.forEach(p=>{p.update();p.draw()});
  requestAnimationFrame(animCanvas);
}
animCanvas();

/* ── SCROLL REVEAL ── */
const revEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-scale');
const revObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('vis'); revObs.unobserve(e.target); }
  });
},{threshold:0.1});
revEls.forEach(el=>revObs.observe(el));

/* ── COUNTER ANIMATION ── */
const countEls = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const target=+e.target.dataset.count, dur=2000, start=performance.now();
      function tick(now){
        const t=Math.min((now-start)/dur,1);
        const ease=1-Math.pow(1-t,4);
        e.target.textContent=Math.round(ease*target)+(e.target.dataset.suffix||'');
        if(t<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObs.unobserve(e.target);
    }
  });
},{threshold:.5});
countEls.forEach(el=>countObs.observe(el));

/* ── TESTIMONIALS ── */
const testis=document.querySelectorAll('.testi');
let ti=0;
function goT(n){
  testis[ti].classList.remove('active');
  ti=(n+testis.length)%testis.length;
  testis[ti].classList.add('active');
}
document.getElementById('tPrev').addEventListener('click',()=>goT(ti-1));
document.getElementById('tNext').addEventListener('click',()=>goT(ti+1));
setInterval(()=>goT(ti+1),6000);

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-main,.testi-btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.3;
    const y=(e.clientY-r.top-r.height/2)*.3;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transform='';
    btn.style.transition='transform .6s cubic-bezier(.16,1,.3,1)';
  });
  btn.addEventListener('mouseenter',()=>btn.style.transition='transform .1s');
});

/* ── NAV ACTIVE STATE ── */
const navLinks=document.querySelectorAll('.nav-links a');
const sections=document.querySelectorAll('section[id]');
const secObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(a=>{
        a.style.color=a.getAttribute('href')==='#'+e.target.id?'rgba(245,240,232,.9)':'rgba(245,240,232,.4)';
      });
    }
  });
},{threshold:.4});
sections.forEach(s=>secObs.observe(s));

/* ── WORK ITEM TILT ── */
document.querySelectorAll('.work-item').forEach(item=>{
  item.addEventListener('mousemove',e=>{
    const r=item.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*10;
    const y=((e.clientY-r.top)/r.height-.5)*-10;
    item.style.transform=`perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave',()=>{
    item.style.transform='';
    item.style.transition='transform .6s cubic-bezier(.16,1,.3,1)';
  });
  item.addEventListener('mouseenter',()=>item.style.transition='transform .1s');
});

/* ── PARALLAX HERO TEXT ON SCROLL ── */
const heroName = document.querySelector('.hero-name');
window.addEventListener('scroll',()=>{
  const sy=window.scrollY;
  if(heroName) heroName.style.transform=`translateY(${sy*.15}px)`;
});

/* ── HORIZONTAL SCROLL HINT FOR WORK GRID ── */
// Subtle parallax on work items
document.querySelectorAll('.work-placeholder').forEach((el,i)=>{
  const speed = [0.05,0.08,0.03,0.06,0.04][i]||0.05;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const handler=()=>{
          const rect=el.closest('.work-item').getBoundingClientRect();
          const offset=(window.innerHeight/2 - rect.top - rect.height/2)*speed;
          el.style.transform=`scale(1.1) translateY(${offset}px)`;
        };
        window.addEventListener('scroll',handler,{passive:true});
      }
    });
  },{threshold:0});
  obs.observe(el);
});

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksMenu.classList.remove('active');
  });
});

/* ── BACK TO TOP BUTTON ── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ── LOGO UPLOAD FUNCTIONALITY ── */
const navLogoImg = document.getElementById('navLogo');
const navLogoText = document.querySelector('.nav-logo');

// Allow users to set logo via URL (you can customize this)
window.setLogoUrl = function(url) {
  navLogoImg.src = url;
  navLogoImg.style.display = 'block';
  navLogoText.style.display = 'none';
};

// Example: Uncomment to test
// window.setLogoUrl('https://via.placeholder.com/60x40');
