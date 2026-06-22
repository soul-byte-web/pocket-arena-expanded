// js/audio.js - expose volume controls and improved synth handling
export const AudioManager = (function(){
  let ctx = null;
  let master = null; let musicGain = null; let sfxGain = null;
  let musicVol = 0.6, sfxVol = 0.9;
  function init(){
    try{
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.connect(master);
      sfxGain = ctx.createGain(); sfxGain.connect(master);
      master.gain.value = 1; musicGain.gain.value = musicVol; sfxGain.gain.value = sfxVol;
      startMusicLoop();
      // load stored volumes
      const mv = localStorage.getItem('pa_music_vol'); if(mv) setMusicVolume(parseFloat(mv));
      const sv = localStorage.getItem('pa_sfx_vol'); if(sv) setSfxVolume(parseFloat(sv));
    }catch(e){ console.warn('Audio not available', e); }
  }
  function setMusicVolume(v){ musicVol = v; if(musicGain) musicGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02); localStorage.setItem('pa_music_vol', String(v)); }
  function setSfxVolume(v){ sfxVol = v; if(sfxGain) sfxGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02); localStorage.setItem('pa_sfx_vol', String(v)); }
  function playClick(){ if(ctx){ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='square'; o.frequency.value=880; g.gain.value=0.06; o.connect(g); g.connect(sfxGain); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.08); o.stop(ctx.currentTime+0.1); } }
  function playHit(){ if(ctx){ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sawtooth'; o.frequency.value=520; g.gain.value=0.08; o.connect(g); g.connect(sfxGain); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.12); o.stop(ctx.currentTime+0.14); } }
  function startMusicLoop(){ if(!ctx) return; const base = 110; function playNote(freq, dur, when=0){ const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='sawtooth'; o.frequency.value = freq; g.gain.value = 0.02; o.connect(g); g.connect(musicGain); o.start(ctx.currentTime + when); g.gain.setValueAtTime(0.02, ctx.currentTime+when); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+when+dur); o.stop(ctx.currentTime+when+dur+0.02); }
    let t0 = ctx.currentTime;
    function schedule(){ const now = ctx.currentTime; t0 = Math.max(t0, now); for(let i=0;i<8;i++){ const n = [0,3,7,10,14,17,21,24][i]; playNote(base * Math.pow(2, n/12), 0.5, t0 - now + i*0.25); } t0 += 8*0.25; setTimeout(schedule, 8*0.25*1000 - 50); }
    schedule(); }
  return { init, playClick, playHit, setMusicVolume, setSfxVolume };
})();
