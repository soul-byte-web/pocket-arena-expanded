// js/particles.js - particle system with pooling for performance
const POOL = [];
const ACTIVE = [];

function createParticle(){ return { x:0,y:0,vx:0,vy:0,life:0,maxLife:0,size:2,color:'#fff',type:'spark' }; }

export function spawnParticle(x,y,vx,vy,life,size,color,type){
  let p = POOL.pop();
  if(!p) p = createParticle();
  p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = life; p.maxLife = life; p.size = size; p.color = color||'#fff'; p.type = type||'spark';
  ACTIVE.push(p);
}

export function updateParticles(dt){
  for(let i=ACTIVE.length-1;i>=0;i--){
    const p = ACTIVE[i];
    p.life -= dt;
    if(p.life <= 0){ POOL.push(p); ACTIVE.splice(i,1); continue; }
    p.x += p.vx*dt; p.y += p.vy*dt;
    // simple drag
    p.vx *= 0.99; p.vy *= 0.99;
  }
}

export function renderParticles(ctx){
  if(ACTIVE.length===0) return;
  ctx.save(); ctx.translate(ctx.canvas.width/devicePixelRatio/2, ctx.canvas.height/devicePixelRatio/2);
  ctx.globalCompositeOperation = 'lighter';
  for(const p of ACTIVE){
    const t = p.life / p.maxLife;
    ctx.globalAlpha = Math.max(0, Math.min(1, t));
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.6, p.size * t), 0, Math.PI*2); ctx.fill();
  }
  ctx.restore(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
