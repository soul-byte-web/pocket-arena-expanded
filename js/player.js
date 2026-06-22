// js/player.js - pixel-art style player rendering + firing handled elsewhere
import { Weapons } from './weapons.js';

export class Player{
  constructor(){
    this.x = 0; this.y = 0; this.radius = 8; // smaller radius for pixel look
    this.hp = 100; this.maxHp = 100; this.level = 1; this.score = 0;
    this.vx=0; this.vy=0; this.speed=220;
    this.damage = 9; this.fireRate = 2.6; this.fireTimer = 0; this.facing = 0;
    this.bulletSize = 4; this.bulletSpeed = 680; this.loadout = [];
    this.multishot = 0; this.hpRegen = 0; this.pierce = 0; this.ricochet = 0;
    this.weaponType = 'auto';
  }
  reset(){ this.hp = this.maxHp; this.level = 1; this.score = 0; this.fireTimer = 0; }
  update(dt){
    if(this.hpRegen>0 && this.hp < this.maxHp) this.hp = Math.min(this.maxHp, this.hp + this.hpRegen*dt);
    this.facing += dt*0.6;
    this.fireTimer -= dt;
    if(this.fireTimer <= 0){
      const aim = window.__PA_AIM_ANGLE || 0;
      const count = 1 + (this.multishot||0);
      for(let i=0;i<count;i++){
        const ang = count===1 ? aim : aim + (i - (count-1)/2) * 0.18;
        const w = Weapons[this.weaponType] || Weapons.auto;
        w(this, ang);
      }
      this.fireTimer = 1/Math.max(0.05, this.fireRate);
    }
  }
  render(ctx){
    // pixel-art block rendering
    ctx.save();
    ctx.translate(ctx.canvas.width/devicePixelRatio/2 + this.x, ctx.canvas.height/devicePixelRatio/2 + this.y);
    ctx.imageSmoothingEnabled = false;
    const scale = 2; const size = 8; // base pixel size
    // body (block)
    ctx.fillStyle = '#e0c78a'; ctx.fillRect(-size*scale/2, -size*scale/2, size*scale, size*scale);
    // armor overlay
    ctx.fillStyle = '#b06b2f'; ctx.fillRect(-size*scale/2, -size*scale/2, size*scale, Math.floor(size*scale*0.4));
    // eyes
    ctx.fillStyle = '#040404'; ctx.fillRect(2, -2, 2, 2); ctx.fillRect( -6, -2, 2, 2);
    // weapon muzzle indicator (small)
    ctx.fillStyle = '#f29e4c'; ctx.fillRect(size*scale/2 -2, -2, 2, 2);
    ctx.restore();
  }
}
