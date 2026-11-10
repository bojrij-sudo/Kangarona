// Типы патронов: у каждого — цвет HUD и запас по умолчанию
const AMMO_TYPES = {
  luger:   { name: '9×19 мм',    color: '#cfcfcf', start: 60 },
  ae50:    { name: '.50 АЕ',     color: '#ffd34d', start: 21 },
  ak74:    { name: '5,45×39',    color: '#7fd45e', start: 90 },
  ar15:    { name: '5,56×45',    color: '#5ecfd4', start: 75 },
  svd:     { name: '7,62×54',    color: '#d45e5e', start: 30 },
  shell:   { name: '12-й калибр',color: '#ff8c42', start: 20 },
  grenade: { name: '40-мм гранаты', color: '#b04dff', start: 6 },
  rocket:  { name: 'ракеты ПГ-7В',  color: '#ff4444', start: 4 },
  nails:   { name: 'гвозди',     color: '#aaaaaa', start: 120 },
  fuel:    { name: 'топливо',    color: '#ff6600', start: 100 }
};

// Арсенал. melee:true — ближний бой, projectile — летящий снаряд
const WEAPONS = {
  bat:     { name: 'Дубинка',    ammo: null,     damage: 15, fireRate: 600,  melee: true, range: 60,  auto: false },
  knife:   { name: 'Нож',        ammo: null,     damage: 40, fireRate: 400,  melee: true, range: 45,  auto: false, crit: 3 },
  p99:     { name: 'Walter P99', ammo: 'luger',  damage: 12, fireRate: 200,  auto: false, mag: 15, bulletSpeed: 700, quiet: true },
  deagle:  { name: 'Desert Eagle', ammo: 'ae50', damage: 45, fireRate: 500,  auto: false, mag: 7,  bulletSpeed: 900, pierce: 1 },
  mp5:     { name: 'H&K MP5',    ammo: 'luger',  damage: 10, fireRate: 80,   auto: true,  mag: 30, bulletSpeed: 700, spread: 0.05 },
  ak74:    { name: 'АК-74',      ammo: 'ak74',   damage: 18, fireRate: 100,  auto: true,  mag: 30, bulletSpeed: 800, spread: 0.08 },
  rifle:   { name: 'Гроза-С',    ammo: 'ar15',   damage: 16, fireRate: 90,   auto: true,  mag: 25, bulletSpeed: 850, spread: 0.04 },
  rg6:     { name: 'РГ-6',       ammo: 'grenade',damage: 120, fireRate: 1200, auto: false, mag: 6,  bulletSpeed: 500, splash: 90, gravity: true },
  rpg7:    { name: 'РПГ-7',      ammo: 'rocket', damage: 250, fireRate: 3000, auto: false, mag: 1,  bulletSpeed: 450, splash: 120, gravity: true, selfDamage: true },
  svd:     { name: 'СВД',        ammo: 'svd',    damage: 90, fireRate: 1500, auto: false, mag: 10, bulletSpeed: 1200, pierce: 3 },
  shotgun: { name: 'Стингер-4',  ammo: 'shell',  damage: 8,  fireRate: 900,  auto: false, mag: 5,  bulletSpeed: 600, pellets: 6, spread: 0.25 },
  nailgun: { name: 'Гвоздомёт',  ammo: 'nails',  damage: 7,  fireRate: 150,  auto: true,  mag: 40, bulletSpeed: 750, spread: 0.1 },
  flamer:  { name: 'Факел',      ammo: 'fuel',   damage: 4,  fireRate: 50,   auto: true,  mag: 100, bulletSpeed: 300, burn: true, range: 140 }
};

// Порядок слотов (клавиши 1..9, 0)
const WEAPON_ORDER = ['bat', 'knife', 'p99', 'deagle', 'mp5', 'ak74', 'rifle', 'rg6', 'rpg7', 'svd', 'shotgun', 'nailgun', 'flamer'];

class Inventory {
  constructor() {
    this.ammo = {};            // { тип: количество }
    this.owned = new Set(['bat', 'knife']);
    this.current = 'p99';
    this.magazine = {};        // { оружие: патронов в магазине }
    for (const k in AMMO_TYPES) this.ammo[k] = AMMO_TYPES[k].start;
  }

  give(weaponId) {
    this.owned.add(weaponId);
    const w = WEAPONS[weaponId];
    if (w.mag && this.magazine[weaponId] === undefined) {
      this.magazine[weaponId] = Math.min(w.mag, this.ammo[w.ammo] || 0);
      this.ammo[w.ammo] -= this.magazine[weaponId];
    }
  }

  select(id) {
    if (this.owned.has(id)) this.current = id;
  }

  next() {
    const list = WEAPON_ORDER.filter(id => this.owned.has(id));
    this.current = list[(list.indexOf(this.current) + 1) % list.length];
  }

  // Вернёт true, если выстрел состоялся
  tryShoot() {
    const w = WEAPONS[this.current];
    if (w.melee) return true;
    let mag = this.magazine[this.current] || 0;
    if (mag <= 0) return false;
    this.magazine[this.current] = mag - 1;
    return true;
  }

  reload() {
    const w = WEAPONS[this.current];
    if (!w.mag) return;
    const need = w.mag - (this.magazine[this.current] || 0);
    const take = Math.min(need, this.ammo[w.ammo] || 0);
    if (take > 0) {
      this.magazine[this.current] = (this.magazine[this.current] || 0) + take;
      this.ammo[w.ammo] -= take;
    }
  }

  pickupAmmo(type, count) {
    if (this.ammo[type] !== undefined) this.ammo[type] += count;
  }
}
