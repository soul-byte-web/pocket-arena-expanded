// js/ui.js - extend UI: events, settings persistence, shop scaffolding
const listeners = {};
export const UI = {
  init(ctx){
    this.player = ctx.player;
    document.getElementById('bestScore').textContent = localStorage.getItem('pocketarena_best')||'0';
    document.getElementById('playerSummary').textContent = 'Level 1 • Score: 0';
    document.getElementById('loadoutArea').textContent = 'Weapon: Basic Blaster\nSkin: Neon Default';
    // currency placeholder
    document.getElementById('currency').textContent = localStorage.getItem('pa_currency')||'0';
  },
  on(ev, cb){ listeners[ev] = listeners[ev]||[]; listeners[ev].push(cb); },
  emit(ev, data){ (listeners[ev]||[]).forEach(cb=>cb(data)); }
};
