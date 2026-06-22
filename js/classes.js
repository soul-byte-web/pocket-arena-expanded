// js/classes.js - hero classes and their base stats/loadouts
export const CLASSES = [
  { id:'default', name:'Rookie', desc:'Balanced starter', stats:{ hp:100, speed:230, damage:9, fireRate:2.6 }, startingLoadout:['i_dmg_1'] },
  { id:'tank', name:'Jugger', desc:'High HP tank', stats:{ hp:170, speed:160, damage:11, fireRate:2.0 }, startingLoadout:['i_hpbig_1','i_thick_1'] },
  { id:'speed', name:'Sprinter', desc:'Fast mover, glassy', stats:{ hp:80, speed:320, damage:8, fireRate:3.0 }, startingLoadout:['i_speed_1','i_firerate_1'] },
  { id:'tech', name:'Tactician', desc:'Tech support & drones', stats:{ hp:95, speed:210, damage:9, fireRate:2.4 }, startingLoadout:['i_drone_1','i_orbital_1'] },
  { id:'sniper', name:'Sniper', desc:'High damage, long range', stats:{ hp:85, speed:200, damage:14, fireRate:1.6 }, startingLoadout:['i_crit_1','i_critdmg'] },
  { id:'demo', name:'Demolisher', desc:'Explosive specialist', stats:{ hp:110, speed:190, damage:12, fireRate:1.8 }, startingLoadout:['i_explode_1','i_mines_1'] }
];

export function getClassById(id){ return CLASSES.find(c=>c.id===id); }
