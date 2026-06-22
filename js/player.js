// js/player.js - update: firing, weapons selection, basic stats + rendering improvements
import { Weapons } from './weapons.js';

export class Player{
  constructor(){
    this.x = 0; this.y = 0; this.radius = 18; this.hp = 100; this.maxHp = 100; this.level = 1; this.score = 0; this.vx=0; this.vy=0; this.speed=220;
    this.damage = 9; this.fireRate = 2.6; this.fireTimer = 0; this.facing = 0; this.bulletSize = 5; this.bulletSpeed = 680;
    this.loadout = []; // item ids
    this.weaponType = 'auto';
    this.hpRegen = 0; this.pierce = 0; this.ricochet = 0; this.multishot = 0; this.orbitals = 0; this.droneTimers = [];
  }
  reset(){ this.x=0; this.y=0; this.hp=this.maxHp; this.level=1; this.score=0; this.vx=0; this.vy=0; this.fireTimer=0; }
  update(dt){
    // regen
    if(this.hpRegen>0 && this.hp < this.maxHp) this.hp = Math.min(this.maxHp, this.hp + this.hpRegen*dt);
    // simple idle movement placeholder
    this.facing += dt*0.6;
    // firing
    this.fireTimer -= dt;
    if(this.fireTimer <= 0){
      const aim = getAimAngle();
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
    ctx.save(); ctx.translate(ctx.canvas.width/devicePixelRatio/2 + this.x, ctx.canvas.height/devicePixelRatio/2 + this.y);
    // body
    ctx.shadowColor = '#5ef7ff'; ctx.shadowBlur = 18; ctx.fillStyle = '#bdfcff'; ctx.beginPath(); ctx.arc(0,0,this.radius,0,Math.PI*2); ctx.fill();
    // face direction indicator
    ctx.save(); ctx.rotate(this.facing); ctx.fillStyle = '#04040a'; ctx.beginPath(); ctx.moveTo(this.radius+6,0); ctx.lineTo(this.radius-4,-6); ctx.lineTo(this.radius-4,6); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.restore();
  }
}

// aim helper (fallback) - uses global canvas pointer if available
function getAimAngle(){ const g = window.__PA_AIM_ANGLE; if(g !== undefined) return g; return 0; }
