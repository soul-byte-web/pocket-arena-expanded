// js/waves.js - wave manager: spawn waves, control progression and between-wave shop
import { shop } from './shop.js';

export class WaveManager{
  constructor(enemies){
    this.enemies = enemies; this.wave = 0; this.waveTimer = 0; this.waveActive = false; this.spawnTimer = 0; this.waveDuration = 18; this.onWaveStart = null; this.onWaveEnd = null; this.inShop = false;
  }
  startNext(){
    this.wave++;
    this.waveActive = true; this.waveTimer = 0; this.spawnTimer = 0; this.waveDuration = 12 + this.wave*0.9;
    if(this.onWaveStart) this.onWaveStart(this.wave);
  }
  update(dt){
    if(!this.waveActive) return;
    this.waveTimer += dt; this.spawnTimer -= dt;
    // spawn enemies in increasing numbers
    if(this.spawnTimer <= 0){ this.spawnTimer = Math.max(0.25, 0.9 - Math.min(0.7, this.wave*0.03)); const count = 1 + Math.floor(this.wave*0.12); for(let i=0;i<count;i++){ const a = Math.random()*Math.PI*2; const r = 260 + Math.random()*260; const x = Math.cos(a)*r; const y = Math.sin(a)*r; const e = { x,y,r:12 + Math.random()*8, hp:40 + this.wave*8 + Math.random()*20, color:'#ff8a3d', value: 6 + Math.round(this.wave*1.2) }; this.enemies.push(e); }
    }
    if(this.waveTimer >= this.waveDuration){ this.endWave(); }
  }
  endWave(){ this.waveActive = false; this.inShop = true; if(this.onWaveEnd) this.onWaveEnd(this.wave); // open shop after short delay
    setTimeout(()=>{ shop.open(); }, 350);
  }
}
