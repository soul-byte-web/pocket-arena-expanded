// js/core.js - integrate weapons & classes, firing loop, bullets rendering
import { AudioManager } from './js/audio.js';
import { Player } from './js/player.js';
import { UI } from './js/ui.js';
import { EnemyController } from './js/enemies.js';
import { shop } from './js/shop.js';
import { Weapons, updateBullets, renderBullets } from './js/weapons.js';
import { CLASSES, getClassById } from './js/classes.js';

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
const enemies = new EnemyController();

// class selection default
let selectedClass = CLASSES[0];

// Audio
AudioManager.init();

// UI wiring
UI.init({ player });
UI.on('play', ()=>{ startMission(); });
UI.on('openShop', ()=>{ openShop(); });

// add class selector to home screen dynamically
function buildClassSelector(){
  const container = document.createElement('div'); container.style.marginTop='12px'; container.style.display='flex'; container.style.gap='8px';
  CLASSES.forEach(c=>{
    const b = document.createElement('button'); b.className='btn'; b.textContent=c.name; b.title=c.desc; b.addEventListener('click', ()=>{ selectClass(c.id); }); container.appendChild(b);
  });
  const homeCard = document.querySelector('.homeCard'); homeCard.appendChild(container);
}
function selectClass(id){ selectedClass = getClassById(id); // apply base stats
  player.maxHp = selectedClass.stats.hp; player.hp = player.maxHp; player.speed = selectedClass.stats.speed; player.damage = selectedClass.stats.damage; player.fireRate = selectedClass.stats.fireRate; player.level = 1; player.loadout = selectedClass.startingLoadout.slice(); }
buildClassSelector();
selectClass('default');

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
function showShop(){ shop.open(); }
function hideShop(){ shop.close(); }

function startMission(){
  state = 'playing';
  document.getElementById('homeScreen').style.display = 'none';
  player.reset();
  // apply selectedClass again to player
  selectClass(selectedClass.id);
  // apply loadout items to player for run
  for(const itId of player.loadout){ const it = window.__PA_SHOP_ITEM_LOOKUP && window.__PA_SHOP_ITEM_LOOKUP[itId]; if(it && it.apply) try{ it.apply(player); }catch(e){console.warn(e);} }
  enemies.reset();
  last = performance.now();
}

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
    updateBullets(dt, enemies.enemies);
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
  ctx.fillText('Gold: ' + (shop.currency||0), 12, 44);
  if(state === 'playing'){
    player.render(ctx);
    enemies.render(ctx);
    renderBullets(ctx);
  }
}

requestAnimationFrame(loop);

// firing: auto-fire loop based on player.fireRate; manual aim via pointer
let aimX = 0, aimY = 0, hasManualAim = false;
canvas.addEventListener('pointermove', e=>{ aimX = e.clientX; aimY = e.clientY; hasManualAim = true; });
canvas.addEventListener('pointerdown', e=>{ aimX = e.clientX; aimY = e.clientY; hasManualAim = true; });

function getAimAngle(){ if(hasManualAim){ const rect = canvas.getBoundingClientRect(); const cx = aimX - rect.left; const cy = aimY - rect.top; const wx = cx - canvas.clientWidth/2; const wy = cy - canvas.clientHeight/2; return Math.atan2(wy - player.y, wx - player.x); } // fallback auto target
  if(enemies.enemies.length>0){ const e = enemies.enemies[0]; return Math.atan2(e.y - player.y, e.x - player.x); }
  return player.facing;
}

// player firing handled in player.update by checking fireTimer

// expose item lookup to core for applying on start
import * as ItemsModule from './items.js';
window.__PA_SHOP_ITEM_LOOKUP = Object.fromEntries(ItemsModule.ITEMS.map(i=>[i.id,i]));

