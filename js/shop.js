// js/shop.js - shop & equipment system
import { ITEMS, getItemById } from './items.js';
import { AudioManager } from './audio.js';

function rarityWeight(r){
  switch(r){ case 'common': return 60; case 'rare': return 28; case 'epic': return 9; case 'legendary': return 3; default: return 1; }
}

export class Shop{
  constructor(){
    this.currency = parseInt(localStorage.getItem('pa_currency')||'0',10);
    this.loadout = JSON.parse(localStorage.getItem('pa_loadout')||'[]'); // array of item ids
    this.shopPool = [];
    this.poolSize = 4;
    this.rerollCost = 120;
    this.listeners = [];
    this.initUI();
  }
  initUI(){
    this.gridEl = document.getElementById('shopGrid');
    this.currencyEl = document.getElementById('currency');
    if(this.currencyEl) this.currencyEl.textContent = String(this.currency);
    this.gridEl && (this.gridEl.innerHTML='');
    // delegate buy clicks
    document.addEventListener('click', e=>{
      const card = e.target.closest('.shop-card');
      if(!card) return;
      const id = card.dataset.id;
      if(e.target.matches('.buy-btn')){ this.buy(id); }
    });
    // reroll button (create if missing)
    if(!document.getElementById('rerollBtn')){
      const btn = document.createElement('button'); btn.id='rerollBtn'; btn.className='btn'; btn.textContent='Reroll ('+this.rerollCost+')';
      btn.style.position='absolute'; btn.style.right='32px'; btn.style.bottom='32px';
      document.body.appendChild(btn);
      btn.addEventListener('click', ()=>{ this.reroll(); });
    }
  }
  save(){ localStorage.setItem('pa_currency', String(this.currency)); localStorage.setItem('pa_loadout', JSON.stringify(this.loadout)); }
  setCurrency(v){ this.currency = v; if(this.currencyEl) this.currencyEl.textContent = String(this.currency); this.save(); }
  addCurrency(v){ this.setCurrency(this.currency + Math.floor(v)); }
  removeCurrency(v){ this.setCurrency(Math.max(0, this.currency - Math.floor(v))); }
  pickRandomByRarity(){
    // build weighted array indexes
    const pool = [];
    for(const it of ITEMS){ const w = rarityWeight(it.rarity); for(let i=0;i<w;i++) pool.push(it.id); }
    const pick = pool[Math.floor(Math.random()*pool.length)];
    return getItemById(pick);
  }
  generatePool(){
    this.shopPool = [];
    const tries = Math.max(this.poolSize, 4);
    for(let i=0;i<tries;i++){
      const it = this.pickRandomByRarity();
      this.shopPool.push(it);
    }
    this.renderPool();
  }
  renderPool(){
    if(!this.gridEl) return;
    this.gridEl.innerHTML = '';
    for(const it of this.shopPool){
      const d = document.createElement('div'); d.className='card shop-card'; d.dataset.id = it.id;
      d.innerHTML = `<div style="font-weight:800">${it.name}</div><div style="font-size:12px;color:#9fdcff;margin-top:6px">${it.desc}</div><div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center"><div style="font-weight:900">${it.cost}</div><button class='btn buy-btn'>Buy</button></div>`;
      this.gridEl.appendChild(d);
    }
  }
  buy(itemId){
    const it = getItemById(itemId);
    if(!it){ console.warn('item not found', itemId); return; }
    if(this.currency < it.cost){ alert('Not enough gold'); AudioManager.playHit(); return; }
    this.removeCurrency(it.cost);
    // equip into first free slot if available
    if(this.loadout.length < 6){ this.loadout.push(it.id); }
    // apply immediately for demo; in final game items should be applied per-run instance
    const appTarget = window.__PA_PLAYER_INSTANCE;
    if(appTarget && typeof it.apply === 'function'){
      try{ it.apply(appTarget); } catch(e){ console.warn('apply error', e); }
    }
    this.save();
    this.renderPool();
    AudioManager.playClick();
  }
  reroll(){ if(this.currency < this.rerollCost){ alert('Not enough gold for reroll'); return; } this.removeCurrency(this.rerollCost); this.generatePool(); AudioManager.playClick(); }
  open(){ this.generatePool(); document.getElementById('shopModal').classList.add('show'); document.getElementById('shopModal').setAttribute('aria-hidden','false'); }
  close(){ document.getElementById('shopModal').classList.remove('show'); document.getElementById('shopModal').setAttribute('aria-hidden','true'); }
}

export const shop = new Shop();
