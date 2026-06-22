// js/enemies.js - updated: basic enemy instances with clickable kill to test shop
export class EnemyController{
  constructor(){ this.enemies = []; this.spawnTimer = 0; }
  reset(){ this.enemies.length = 0; this.spawnTimer = 0; }
  update(dt, player){
    // spawn demo enemies around the player
    this.spawnTimer -= dt;
    if(this.spawnTimer <= 0){ this.spawnTimer = 0.9; const e = { x: (Math.random()-0.5)*600, y:(Math.random()-0.5)*400, r:12, color:'#ff8a3d', value: Math.round(8+Math.random()*6) }; this.enemies.push(e); }
    for(const e of this.enemies){ e.x += Math.cos(performance.now()*0.001+e.x*0.01)*10*dt; }
  }
  render(ctx){
    ctx.save();
    ctx.translate(ctx.canvas.width/devicePixelRatio/2, ctx.canvas.height/devicePixelRatio/2);
    for(const e of this.enemies){ ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
  // helper: find enemy at screen coords
  findAtScreen(sx, sy, canvas){
    const rect = canvas.getBoundingClientRect();
    const cx = sx - rect.left; const cy = sy - rect.top;
    const wx = cx - canvas.clientWidth/2; const wy = cy - canvas.clientHeight/2;
    for(let i=0;i<this.enemies.length;i++){ const e = this.enemies[i]; const d2 = (wx-e.x)*(wx-e.x)+(wy-e.y)*(wy-e.y); if(d2 < e.r*e.r) return i; }
    return -1;
  }
}
