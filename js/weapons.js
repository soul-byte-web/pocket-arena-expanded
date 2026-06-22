// js/weapons.js - weapon system: weapon templates, bullets pool, update & render
import { shop } from './shop.js';

export const bullets = [];

function makeBullet(x,y,angle,speed,size,dmg,opts={}){
  return Object.assign({ x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, size, dmg, life:2.6, color:opts.color||'#bdfcff', pierce:opts.pierce||0, homing:!!opts.homing, boomerang:!!opts.boomerang, id:Date.now()+Math.random() }, opts);
}

export const Weapons = {
  auto: function(player, aimAngle){
    const dmg = player.damage; const size = player.bulletSize; const speed = player.bulletSpeed; bullets.push(makeBullet(player.x, player.y, aimAngle, speed, size, dmg));
  },
  shotgun: function(player, aimAngle){
    const base = 5; const count = 6; const spread = 0.8;
    for(let i=0;i<count;i++){ const t = (i/(count-1)-0.5); const a = aimAngle + t*spread; bullets.push(makeBullet(player.x, player.y, a, player.bulletSpeed*0.8, player.bulletSize*1.2, player.damage*0.9)); }
  },
  rocket: function(player, aimAngle){ bullets.push(makeBullet(player.x, player.y, aimAngle, 420, player.bulletSize*1.6, player.damage*1.8, { color:'#ff8a3d' })); },
  laser: function(player, aimAngle){ bullets.push(makeBullet(player.x, player.y, aimAngle, 1400, player.bulletSize*2.2, player.damage*1.4, { color:'#5ef7ff', life:0.4 })); },
  flame: function(player, aimAngle){ // short-lived fast slow-moving
    for(let i=0;i<3;i++){ const a = aimAngle + (Math.random()-0.5)*0.35; bullets.push(makeBullet(player.x + Math.cos(a)*8, player.y + Math.sin(a)*8, a, 320, player.bulletSize*1.2, player.damage*0.45, { color:'#ff9b4a', life:0.36 })); }
  },
  mine: function(player){ // drop mine at player
    bullets.push({ x:player.x, y:player.y, mine:true, life:8, trigger:55, explodeRadius:95, dmg:player.damage*2.4, size:14, color:'#ff4d6a' });
  },
  boomerang: function(player, aimAngle){ bullets.push(makeBullet(player.x, player.y, aimAngle, 760, player.bulletSize*1.2, player.damage, { boomerang:true, life:3 })); },
  homing: function(player, aimAngle){ bullets.push(makeBullet(player.x, player.y, aimAngle, player.bulletSpeed*0.9, player.bulletSize, player.damage, { homing:true, color:'#c98cff' })); }
};

export function updateBullets(dt, enemies){
  for(let i=bullets.length-1;i>=0;i--){
    const b = bullets[i];
    // homing
    if(b.homing){
      let best=null; let bestD=1e9;
      for(const e of enemies){ const d=(e.x-b.x)*(e.x-b.x)+(e.y-b.y)*(e.y-b.y); if(d<bestD){ bestD=d; best=e; } }
      if(best){ const ang = Math.atan2(best.y-b.y, best.x-b.x); const sp = Math.hypot(b.vx,b.vy); b.vx = Math.cos(ang)*sp; b.vy = Math.sin(ang)*sp; }
    }
    if(b.mine){ b.life -= dt; if(b.life <= 0){ bullets.splice(i,1); continue; } }
    b.x += b.vx*dt; b.y += b.vy*dt; b.life -= dt;
    if(b.life <= 0 || Math.hypot(b.x,b.y) > 4000){ bullets.splice(i,1); continue; }
    // collisions with enemies
    for(let j=enemies.length-1;j>=0;j--){ const e = enemies[j]; const rr = (e.r + (b.size||b.r||6)); const dx=e.x-b.x, dy=e.y-b.y; if(dx*dx+dy*dy < rr*rr){ // hit
        e.hp -= b.dmg; if(e.hp <= 0){ const val = (e.value||10); shop.addCurrency(val); enemies.splice(j,1); }
        // spawn small hit sfx
        bullets.splice(i,1); break;
    }}
  }
}

export function renderBullets(ctx){
  ctx.save(); ctx.translate(ctx.canvas.width/devicePixelRatio/2, ctx.canvas.height/devicePixelRatio/2);
  for(const b of bullets){ ctx.save(); ctx.fillStyle = b.color || '#bdfcff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.size||6, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
