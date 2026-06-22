// js/items.js - item and weapon definitions for Shop & Equipment
// Each item has: id, name, desc, rarity, cost, apply(player)
export const ITEMS = [
  { id:'i_dmg_1', name:'Power Cell', desc:'+10% Damage', rarity:'common', cost:60, apply: p => { p.damage *= 1.10; } },
  { id:'i_firerate_1', name:'Rapid Loader', desc:'+12% Fire Rate', rarity:'common', cost:70, apply: p => { p.fireRate *= 1.12; } },
  { id:'i_hp_1', name:'Vital Core', desc:'+20 Max HP', rarity:'common', cost:80, apply: p => { p.maxHp += 20; p.hp += 20; } },
  { id:'i_regen_1', name:'Nanite Repair', desc:'+0.8 HP/sec Regen', rarity:'common', cost:70, apply: p => { p.hpRegen += 0.8; } },
  { id:'i_speed_1', name:'Lightframe', desc:'+10% Move Speed', rarity:'common', cost:60, apply: p => { p.speed *= 1.10; } },
  { id:'i_crit_1', name:'Targeting Array', desc:'+5% Crit Chance', rarity:'common', cost:60, apply: p => { p.critChance += 0.05; } },

  { id:'i_pierce_1', name:'Penetrator Rounds', desc:'+1 Pierce', rarity:'rare', cost:140, apply: p => { p.pierce += 1; } },
  { id:'i_ricochet_1', name:'Bouncer Module', desc:'+1 Ricochet', rarity:'rare', cost:140, apply: p => { p.ricochet += 1; } },
  { id:'i_multishot_1', name:'Scatter Modification', desc:'+2 Multishot', rarity:'rare', cost:160, apply: p => { p.multishot += 2; } },
  { id:'i_lifesteal_1', name:'Vampiric Lens', desc:'+4% Lifesteal', rarity:'rare', cost:160, apply: p => { p.lifesteal += 0.04; } },
  { id:'i_orbital_1', name:'Orbital Blade', desc:'+1 Spinning Orbital', rarity:'rare', cost:220, apply: p => { p.orbitals += 1; } },
  { id:'i_drone_1', name:'Combat Drone', desc:'+1 Companion Drone', rarity:'rare', cost:220, apply: p => { p.drones += 1; p.droneTimers.push(0); } },

  { id:'i_shock_1', name:'Shockwave Core', desc:'Shockwave pulse (periodic)', rarity:'epic', cost:420, apply: p => { p.shockwaveLvl += 1; } },
  { id:'i_blackhole_1', name:'Black Hole Module', desc:'Create a black hole periodically', rarity:'epic', cost:480, apply: p => { p.blackholeLvl += 1; } },
  { id:'i_railgun_1', name:'Rail Overcharger', desc:'Rail-style piercing projectile (massive)', rarity:'legendary', cost:1200, apply: p => { p.railgun = true; p.damage *= 2.0; p.bulletSize *= 1.6; p.pierce += 999; p.fireRate *= 0.45; } },
  { id:'i_railgun_alt', name:'Rail Nano-core', desc:'Slower but enormous piercing beam', rarity:'legendary', cost:1400, apply: p => { p.railgun = true; p.damage *= 2.2; p.bulletSize *= 1.8; p.pierce += 999; p.fireRate *= 0.42; } },

  { id:'i_shotgun_1', name:'Shotgun Kit', desc:'+3 Spread Shots (short range)', rarity:'epic', cost:420, apply: p => { p.multishot += 3; p.damage *= 0.9; } },
  { id:'i_explode_1', name:'Explosive Payload', desc:'Bullets explode on impact', rarity:'epic', cost:420, apply: p => { p.explosive = true; } },
  { id:'i_homing_1', name:'Homing Auto-Matrix', desc:'Bullets home to nearby foes', rarity:'epic', cost:420, apply: p => { p.homing = true; } },
  { id:'i_boomerang_1', name:'Return Module', desc:'Bullets return to player', rarity:'epic', cost:420, apply: p => { p.boomerang = true; p.pierce += 1; } },

  // utility & defensive
  { id:'i_dash_1', name:'Dash Core', desc:'Reduces dash cooldown by 20%', rarity:'common', cost:90, apply: p => { p.dashCdMax *= 0.8; } },
  { id:'i_thick_1', name:'Reinforced Plating', desc:'-10% Damage Taken', rarity:'rare', cost:160, apply: p => { p.dmgTakenMult *= 0.9; } },
  { id:'i_hpbig_1', name:'Vital Surge', desc:'+30 Max HP', rarity:'rare', cost:200, apply: p => { p.maxHp += 30; p.hp += 30; } },
  { id:'i_regen2', name:'Cell Regeneration', desc:'+1.2 HP/sec Regeneration', rarity:'rare', cost:170, apply: p => { p.hpRegen += 1.2; } },

  // status & elemental
  { id:'i_freeze_1', name:'Cryo Rounds', desc:'+12% Freeze Chance', rarity:'rare', cost:160, apply: p => { p.freezeChance += 0.12; } },
  { id:'i_burn_1', name:'Incendiary Rounds', desc:'+18% Burn Chance', rarity:'rare', cost:160, apply: p => { p.burnChance += 0.18; } },

  // mines & explosives
  { id:'i_mines_1', name:'Mine Layer', desc:'Drop explosive mines periodically', rarity:'epic', cost:480, apply: p => { p.mineLevel = (p.mineLevel || 0) + 1; } },

  // movement
  { id:'i_speed2', name:'Momentum Thrusters', desc:'+12% Move Speed', rarity:'rare', cost:150, apply: p => { p.speed *= 1.12; } },

  // chance effects
  { id:'i_critdmg', name:'Killer Protocol', desc:'+25% Crit Damage', rarity:'rare', cost:170, apply: p => { p.critDamage += 0.25; } },
  { id:'i_critchance', name:'Precision Chip', desc:'+8% Crit Chance', rarity:'rare', cost:170, apply: p => { p.critChance += 0.08; } },

  // crowd control / utility
  { id:'i_magnet', name:'Magnetic Field', desc:'+50% XP Pickup Range', rarity:'rare', cost:160, apply: p => { p.magnet *= 1.5; } },
  { id:'i_orbital_dmg', name:'Charged Blades', desc:'+40% Orbital Damage', rarity:'rare', cost:200, apply: p => { p.orbitalDmg *= 1.4; } },

  // fun / unique
  { id:'i_phoenix', name:'Phoenix Feather', desc:'Revive once with 50% HP', rarity:'legendary', cost:900, apply: p => { p.hasPhoenix = true; } },
  { id:'i_glass', name:'Glass Cannon', desc:'+50% Damage, -30% Max HP', rarity:'legendary', cost:900, apply: p => { p.damage *= 1.5; p.maxHp *= 0.7; p.hp = Math.min(p.hp, p.maxHp); } }
];

// helper: exposure for shop UI
export function getItemById(id){ return ITEMS.find(i=>i.id===id); }
