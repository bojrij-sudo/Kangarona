const ENEMIES = {
  crawler: {
    name: 'Ползун',  hp: 20,  speed: 120, damage: 8,  color: 0x8b4513,
    drop: { scrap: [3, 5] },
    ai: 'rush'   // бежит в ближний бой
  },
  spitter: {
    name: 'Плевун', hp: 35, speed: 60, damage: 12, color: 0x5aa02c,
    drop: { scrap: [5, 8], ammo: { fuel: [4, 8] } },
    ai: 'ranged', shootRate: 2000, bulletSpeed: 300, bulletDamage: 10
  },
  droneLight: {
    name: 'Дрон-патруль', hp: 30, speed: 100, damage: 8, color: 0x888888,
    drop: { scrap: [6, 10], ammo: { luger: [5, 12] } },
    ai: 'ranged', shootRate: 1500, bulletSpeed: 500, bulletDamage: 8
  },
  droneHeavy: {
    name: 'Дрон-штурмовик', hp: 60, speed: 90, damage: 12, color: 0x556677,
    drop: { scrap: [10, 16], ammo: { ak74: [8, 15] } },
    ai: 'ranged', shootRate: 1200, bulletSpeed: 600, bulletDamage: 12
  },
  sniper: {
    name: 'Снайпер-гнездо', hp: 50, speed: 0, damage: 35, color: 0x7a1f1f,
    drop: { scrap: [15, 25], ammo: { svd: [3, 6] } },
    ai: 'sniper', shootRate: 3000, bulletSpeed: 900, bulletDamage: 35
  },
  beetle: {
    name: 'Бронежук', hp: 200, speed: 80, damage: 25, color: 0x4a3728,
    drop: { scrap: [30, 45], ammo: { grenade: [1, 2] } },
    ai: 'rush', armored: true   // обычные пули наносят 25% урона
  },
  hunter: {
    name: 'Охотник', hp: 90, speed: 220, damage: 20, color: 0x9b111e,
    drop: { scrap: [20, 30], ammo: { shell: [3, 5] } },
    ai: 'leaper'  // прыгает на игрока
  },
  queen: {
    name: 'Матка-улей', hp: 500, speed: 20, damage: 30, color: 0x6a0dad,
    drop: { scrap: [60, 80], ammo: { ak74: [20, 30], grenade: [2, 3] } },
    ai: 'spawner', spawnType: 'crawler', spawnRate: 4000, boss: true
  }
};
