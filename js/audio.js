// js/audio.js - upgraded synth to a chunkier chiptune / retro style
export const AudioManager = (function(){
  let ctx = null; let master = null; let musicGain = null; let sfxGain = null; let musicVol = 0.6, sfxVol = 0.9;
  function init(){
    try{ ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.connect(ctx.destination); musicGain = ctx.createGain(); musicGain.connect(master); sfxGain = ctx.createGain(); sfxGain.connect(master); master.gain.value = 1; musicGain.gain.value = musicVol; sfxGain.gain.value = sfxVol; startMusicLoop(); const mv = localStorage.getItem('pa_music_vol'); if(mv) setMusicVolume(parseFloat(mv)); const sv = localStorage.getItem('pa_sfx_vol'); if(sv) setSfxVolume(parseFloat(sv)); }catch(e){ console.warn('Audio not available', e); }
  }
  function setMusicVolume(v){ musicVol = v; if(musicGain) musicGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02); localStorage.setItem('pa_music_vol', String(v)); }
  function setSfxVolume(v){ sfxVol = v; if(sfxGain) sfxGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02); localStorage.setItem('pa_sfx_vol', String(v)); }
  function playClick(){ if(ctx){ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='square'; o.frequency.value=980; g.gain.value=0.06; o.connect(g); g.connect(sfxGain); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.06); o.stop(ctx.currentTime+0.08); } }
  function playHit(){ if(ctx){ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sawtooth'; o.frequency.value=520; g.gain.value=0.08; o.connect(g); g.connect(sfxGain); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.12); o.stop(ctx.currentTime+0.14); } }
  function startMusicLoop(){ if(!ctx) return; // simple chiptune loop: bass + arpeggio
    const base = 110; function playNote(freq, dur, when=0, type='square', gain=0.06){ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=gain; o.connect(g); g.connect(musicGain); o.start(ctx.currentTime+when); g.gain.setValueAtTime(gain, ctx.currentTime+when); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+when+dur); o.stop(ctx.currentTime+when+dur+0.02); }
    let t0 = ctx.currentTime;
    function schedule(){ const now=ctx.currentTime; t0=Math.max(t0,now); // bassline
      for(let i=0;i<4;i++){ const f = base*Math.pow(2,(i%4)*3/12); playNote(f,0.45, t0-now + i*0.45,'square',0.06); }
      // arpeggio
      for(let i=0;i<8;i++){ const n=[0,3,7,10,14,17,21,24][i]; playNote(base*Math.pow(2,n/12),0.18,t0-now + i*0.22,'triangle',0.04); }
      t0 += 4*0.45; setTimeout(schedule, Math.max(200, (4*0.45*1000)-80)); }
    schedule(); }
  return { init, playClick, playHit, setMusicVolume, setSfxVolume };
})();
