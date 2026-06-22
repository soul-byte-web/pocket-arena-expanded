// js/core.js - updated: wire UI controls and settings modal
import { AudioManager } from './js/audio.js';
import { Player } from './js/player.js';
import { UI } from './js/ui.js';
import { EnemyController } from './js/enemies.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W = 800, H = 600;
function resize(){ W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = Math.floor(W*devicePixelRatio); canvas.height = Math.floor(H*devicePixelRatio); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
window.addEventListener('resize', resize);
resize();

// Game state
let state = 'home'; // home | playing | shop | settings
const player = new Player();
const enemies = new EnemyController();

// Audio
AudioManager.init();

// UI wiring
UI.init({ player });
UI.on('play', ()=>{ startMission(); });
UI.on('openShop', ()=>{ openShop(); });

// DOM bindings for modals
const settingsModal = document.getElementById('settingsModal');
const shopModal = document.getElementById('shopModal');

document.getElementById('settingsBtn').addEventListener('click', ()=>{ showSettings(); });
document.getElementById('closeSettings').addEventListener('click', ()=>{ hideSettings(); });

document.getElementById('openShop').addEventListener('click', ()=>{ showShop(); });
document.getElementById('closeShop').addEventListener('click', ()=>{ hideShop(); });

document.getElementById('musicSlider').addEventListener('input', e=>{ AudioManager.setMusicVolume(parseFloat(e.target.value)); });
document.getElementById('sfxSlider').addEventListener('input', e=>{ AudioManager.setSfxVolume(parseFloat(e.target.value)); });

function showSettings(){ settingsModal.classList.add('show'); settingsModal.setAttribute('aria-hidden','false'); }
function hideSettings(){ settingsModal.classList.remove('show'); settingsModal.setAttribute('aria-hidden','true'); }
function showShop(){ shopModal.classList.add('show'); shopModal.setAttribute('aria-hidden','false'); }
function hideShop(){ shopModal.classList.remove('show'); shopModal.setAttribute('aria-hidden','true'); }

function startMission(){
  state = 'playing';
  document.getElementById('homeScreen').style.display = 'none';
  player.reset();
  enemies.reset();
  last = performance.now();
}

function openShop(){ showShop(); }

let last = performance.now();
function loop(now){
  const dt = Math.min(0.05, (now-last)/1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function update(dt){
  if(state === 'playing'){
    player.update(dt);
    enemies.update(dt, player);
  }
}

function render(){
  ctx.clearRect(0,0,W,H);
  // background
  ctx.fillStyle = '#04040a'; ctx.fillRect(0,0,W,H);
  // simple HUD
  ctx.fillStyle = '#fff';
  ctx.font = '14px Inter, sans-serif';
  ctx.fillText('State: '+state, 12, 24);
  if(state === 'playing'){
    player.render(ctx);
    enemies.render(ctx);
  }
}

requestAnimationFrame(loop);

// basic controls binding
document.getElementById('playBtn').addEventListener('click', ()=>{ AudioManager.playClick(); UI.emit('play'); });

