// js/core.js - wire waves, particles and bullets rendering into main loop
import { AudioManager } from './audio.js';
import { Player } from './player.js';
import { UI } from './ui.js';
import { EnemyController } from './enemies.js';
import { shop } from './shop.js';
import { Weapons, updateBullets, renderBullets } from './weapons.js';
import { CLASSES, getClassById } from './classes.js';
import { WaveManager } from './waves.js';
import { spawnParticle, updateParticles, renderParticles } from './particles.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W = 800, H = 600;
function resize(){ W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = Math.floor(W*devicePixelRatio); canvas.height = Math.floor(H*devicePixelRatio); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
window.addEventListener('resize', resize);
resize();

// Game state
let state = 'home';
const player = new Player();
window.__PA_PLAYER_INSTANCE = player; // for shop apply
const enemiesCtrl = new EnemyController();

const waveManager = new WaveManager(enemiesCtrl.enemies);
waveManager.onWaveStart = (w)=>{ const el = document.getElementById('waveBanner'); if(el) el.textContent='WAVE '+w; };
waveManager.onWaveEnd = (w)=>{ const el = document.getElementById('waveBanner'); if(el) el.textContent='WAVE '+w+' CLEAR - SHOP'; };

// class selection default
let selectedClass = CLASSES[0];

// Audio
AudioManager.init();

// UI wiring
UI.init({ player });
UI.on('play', ()=>{ startMission(); });
UI.on('openShop', ()=>{ openShop(); });

// class selector
function buildClassSelector(){
  const container = document.createElement('div'); container.style.marginTop='12px'; container.style.display='flex'; container.style.gap='8px';
  CLASSES.forEach(c=>{ const b = document.createElement('button'); b.className='btn'; b.textContent=c.name; b.title=c.desc; b.addEventListener('click', ()=>{ selectClass(c.id); }); container.appendChild(b); });
  const homeCard = document.querySelector('.homeCard'); if(homeCard) homeCard.appendChild(container);
}
function selectClass(id){ selectedClass = getClassById(id); player.maxHp = selectedClass.stats.hp; player.hp = player.maxHp; player.speed = selectedClass.stats.speed; player.damage = selectedClass.stats.damage; player.fireRate = selectedClass.stats.fireRate; player.level = 1; player.loadout = (selectedClass.startingLoadout||[]).slice(); }
buildClassSelector();
selectClass('default');

// DOM bindings for modals
const settingsModal = document.getElementById('settingsModal');
const shopModal = document.getElementById('shopModal');

const playBtn = document.getElementById('playBtn');
const campaignBtn = document.getElementById('campaignBtn');

if(playBtn) playBtn.addEventListener('click', ()=>{ AudioManager.playClick(); UI.emit('play'); });
if(campaignBtn) campaignBtn.addEventListener('click', ()=>{ AudioManager.playClick(); alert('Campaign coming soon'); });

const settingsBtn = document.getElementById('settingsBtn');
const openShopBtn = document.getElementById('openShop');
const closeSettingsBtn = document.getElementById('closeSettings');
const closeShopBtn = document.getElementById('closeShop');

if(settingsBtn) settingsBtn.addEventListener('click', ()=>{ showSettings(); });
if(closeSettingsBtn) closeSettingsBtn.addEventListener('click', ()=>{ hideSettings(); });
if(openShopBtn) openShopBtn.addEventListener('click', ()=>{ showShop(); });
if(closeShopBtn) closeShopBtn.addEventListener('click', ()=>{ hideShop(); });

const musicSlider = document.getElementById('musicSlider');
const sfxSlider = document.getElementById('sfxSlider');
if(musicSlider) musicSlider.addEventListener('input', e=>{ AudioManager.setMusicVolume(parseFloat(e.target.value)); });
if(sfxSlider) sfxSlider.addEventListener('input', e=>{ AudioManager.setSfxVolume(parseFloat(e.target.value)); });

function showSettings(){ if(settingsModal){ settingsModal.classList.add('show'); settingsModal.setAttribute('aria-hidden','false'); } }
function hideSettings(){ if(settingsModal){ settingsModal.classList.remove('show'); settingsModal.setAttribute('aria-hidden','true'); } }
function showShop(){ shop.open(); }
function hideShop(){ shop.close(); }

function startMission(){ state = 'playing'; const hs = document.getElementById('homeScreen'); if(hs) hs.style.display = 'none'; player.reset(); selectClass(selectedClass.id); enemiesCtrl.reset(); waveManager.startNext(); last = performance.now(); }

let last = performance.now();
function loop(now){ const dt = Math.min(0.05, (now-last)/1000); last = now; update(dt); render(); requestAnimationFrame(loop); }

function update(dt){ if(state === 'playing'){ player.update(dt); enemiesCtrl.update(dt, player); updateBullets(dt, enemiesCtrl.enemies); updateParticles(dt); waveManager.update(dt); if(!waveManager.waveActive && !waveManager.inShop){ waveManager.endWave(); } } }

function render(){ ctx.clearRect(0,0,W,H); ctx.fillStyle = '#0b0b0f'; ctx.fillRect(0,0,W,H); ctx.fillStyle = 'var(--muted)'; ctx.font = '12px "Press Start 2P", monospace'; ctx.fillText('State: '+state, 12, 24); ctx.fillText('Gold: ' + (shop.currency||0), 12, 44); if(state === 'playing'){ player.render(ctx); enemiesCtrl.render(ctx); renderBullets(ctx); renderParticles(ctx); } }

requestAnimationFrame(loop);

// firing aim
let aimX = 0, aimY = 0; window.__PA_AIM_ANGLE = 0;
canvas.addEventListener('pointermove', e=>{ aimX = e.clientX; aimY = e.clientY; const r = canvas.getBoundingClientRect(); const cx = aimX - r.left; const cy = aimY - r.top; const wx = cx - canvas.clientWidth/2; const wy = cy - canvas.clientHeight/2; window.__PA_AIM_ANGLE = Math.atan2(wy - player.y, wx - player.x); });

// clickable enemy kill to award gold (keeps working)
canvas.addEventListener('pointerdown', e=>{ if(state !== 'playing') return; const idx = enemiesCtrl.findAtScreen(e.clientX, e.clientY, canvas); if(idx >= 0){ const killed = enemiesCtrl.enemies.splice(idx,1)[0]; const val = killed.value || 8; shop.addCurrency(val); AudioManager.playHit(); spawnParticle(killed.x, killed.y, (Math.random()-0.5)*80, (Math.random()-0.5)*80, 0.8, 4, '#ffd35e'); } });
