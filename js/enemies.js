// js/enemies.js
console.log('Enemies module loaded');

export const ENEMIES = {
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

/**
 * Менеджер врагов. Создаётся в сцене (GameScene).
 * Управляет спавном, обновлением логики ИИ и коллизиями.
 */
export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = this.scene.physics.add.group();
    this.bullets = this.scene.physics.add.group();
    
    // Таймеры для стрельбы врагов (чтобы не спамить каждый кадр)
    this.shootTimers = new Map(); 
  }

  spawn(type, x, y) {
    const data = ENEMIES[type];
    if (!data) {
      console.warn(`Неизвестный тип врага: ${type}`);
      return null;
    }

    // Генерируем текстуру врага (цвет из конфига)
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(data.color, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture(type + '_enemy', 32, 32);

    const enemy = this.enemies.create(x, y, type + '_enemy');
    enemy.setData('type', type);
    enemy.setData('hp', data.hp);
    enemy.setData('maxHp', data.hp);
    enemy.setData('damage', data.damage);
    enemy.setData('ai', data.ai);
    enemy.setData('armored', !!data.armored);
    
    // Для боссов и статичных врагов
    if (data.speed === 0 || data.boss) {
      enemy.setStatic(true);
    } else {
      enemy.setCollideWorldBounds(true);
    }

    return enemy;
  }

  update(delta) {
    this.enemies.children.iterate(enemy => {
      const type = enemy.getData('type');
      const data = ENEMIES[type];
      const ai = enemy.getData('ai');
      
      if (!data || enemy.getData('hp') <= 0) return;

      // Логика ИИ
      if (ai === 'rush') {
        this.moveTowardsPlayer(enemy, data.speed);
      } else if (ai === 'leaper') {
        // Простая механика прыжка: если близко — прыгаем
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.scene.player.x, this.scene.player.y);
        if (dist < 200 && enemy.body.touching.down) {
          enemy.setVelocityY(-400);
          enemy.setVelocityX(Phaser.Math.Between(-150, 150));
        }
      } else if (ai === 'sniper') {
        // Снайпер стреляет только если игрок в зоне видимости (упрощенно: дистанция)
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.scene.player.x, this.scene.player.y);
        if (dist < 400) this.tryShoot(enemy, delta);
      } else if (ai === 'spawner') {
        // Матка спавнит ползунов
        this.spawnTimer(enemy, 'crawler', data.spawnRate);
      }
      
      // Для ranged-врагов (дроны, плевуны)
      if (['ranged', 'sniper'].includes(ai)) {
        this.tryShoot(enemy, delta);
      }
    });

    this.bullets.children.iterate(bullet => {
      // Пули исчезают через время
      if (bullet.getData('ttl') <= 0) bullet.destroy();
      else bullet.setData('ttl', bullet.getData('ttl') - delta);
    });
  }

  tryShoot(enemy, delta) {
    const type = enemy.getData('type');
    const data = ENEMIES[type];
    const lastShot = this.shootTimers.get(enemy) || 0;
    
    if (this.scene.time.now - lastShot >= data.shootRate) {
      this.shoot(enemy);
      this.shootTimers.set(enemy, this.scene.time.now);
    }
  }

  shoot(enemy) {
    const player = this.scene.player;
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    const bullet = this.bullets.create(enemy.x, enemy.y, 'bullet_placeholder');
    
    // Если текстуры нет, рисуем временную
    if (!bullet.texture.key) {
       const gfx = this.scene.make.graphics({x:0,y:0,add:false});
       gfx.fillStyle(0xff0000, 1); gfx.fillRect(0,0,10,10);
       gfx.generateTexture('bullet_placeholder', 10, 10);
       // Пересоздаем пулю с новой текстурой (хак для простоты)
       bullet.destroy();
       const b = this.bullets.create(enemy.x, enemy.y, 'bullet_placeholder');
       b.setVelocity(Math.cos(angle) * ENEMIES[enemy.getData('type')].bulletSpeed, Math.sin(angle) * ENEMIES[enemy.getData('type')].bulletSpeed);
       b.setData('ttl', 2000); // Время жизни 2 сек
       b.setData('damage', ENEMIES[enemy.getData('type')].bulletDamage);
       return;
    }

    bullet.setVelocity(Math.cos(angle) * data.bulletSpeed, Math.sin(angle) * data.bulletSpeed);
    bullet.setData('ttl', 2000); // Время жизни 2 сек
    bullet.setData('damage', data.bulletDamage);
  }

  moveTowardsPlayer(enemy, speed) {
    const vx = this.scene.player.x - enemy.x;
    const vy = this.scene.player.y - enemy.y;
    const len = Math.sqrt(vx*vx + vy*vy);
    if (len > 0) {
      enemy.setVelocity(vx / len * speed, vy / len * speed);
    }
  }

  spawnTimer(enemy, type, rate) {
    // Упрощенная логика: спавним каждые N мс. В реальном проекте лучше использовать scene.time.addEvent
    if (!enemy.getData('nextSpawn') || this.scene.time.now - enemy.getData('nextSpawn') >= rate) {
      const offsetX = Phaser.Math.Between(-50, 50);
      const offsetY = Phaser.Math.Between(-50, 50);
      this.spawn(type, enemy.x + offsetX, enemy.y + offsetY);
      enemy.setData('nextSpawn', this.scene.time.now);
    }
  }
}
