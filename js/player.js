// js/player.js
export class Player{
  constructor(){
    this.x = 0; this.y = 0; this.radius = 18; this.hp = 100; this.maxHp = 100; this.level = 1; this.score = 0;
    this.vx=0; this.vy=0; this.speed=220; this.color='#bdfcff';
  }
  reset(){ this.x=0; this.y=0; this.hp=this.maxHp; this.score=0; this.level=1; }
  update(dt){
    // simple idle movement for demo
    this.x += Math.sin(performance.now()*0.001)*8*dt;
  }
  render(ctx){
    ctx.save();
    ctx.translate(ctx.canvas.width/devicePixelRatio/2 + this.x, ctx.canvas.height/devicePixelRatio/2 + this.y);
    ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(0,0,this.radius,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}
