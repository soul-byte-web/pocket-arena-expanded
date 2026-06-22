// js/enemies.js
export class EnemyController{
  constructor(){ this.enemies = []; }
  reset(){ this.enemies.length = 0; }
  update(dt, player){
    // spawn a demo enemy occasionally
    if(Math.random() < 0.01) this.enemies.push({x: Math.random()*800-400, y: Math.random()*600-300, r:10, color:'#ff8a3d'});
    // simple approach
    for(const e of this.enemies){ e.x += Math.cos(performance.now()*0.001+e.x*0.01)*10*dt; }
  }
  render(ctx){
    ctx.save();
    ctx.translate(ctx.canvas.width/devicePixelRatio/2, ctx.canvas.height/devicePixelRatio/2);
    for(const e of this.enemies){ ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
}
