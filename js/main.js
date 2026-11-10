// js/main.js
import { gameConfig, GAME_CONSTANTS } from './config.js';

// Класс основной сцены игры
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Здесь будем загружать картинки. Пока используем генерацию цветов.
    // Если позже захочешь спрайты, раскомментируй:
    // this.load.image('player', 'assets/player.png');
    
    // Генерируем текстуру для платформ (серый квадрат)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(0, 0, GAME_CONSTANTS.tileSize, GAME_CONSTANTS.tileSize);
    graphics.generateTexture('platform', GAME_CONSTANTS.tileSize, GAME_CONSTANTS.tileSize);

    // Генерируем текстуру игрока (белый квадрат)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0xffffff, 1); // Белый цвет
    playerGraphics.fillRect(0, 0, 30, 40); // Чуть меньше тайла
    playerGraphics.generateTexture('player', 30, 40);
  }

  create() {
    this.cameras.main.setBackgroundColor('#121212');

    // 1. Создаем платформы (пол и пару блоков в воздухе)
    this.platforms = this.physics.add.staticGroup();
    
    // Пол (длинная линия)
    for (let i = 0; i < 25; i++) {
      this.platforms.create(i * GAME_CONSTANTS.tileSize, 550, 'platform').refreshBody();
    }
    
    // Пара блоков в воздухе для прыжков
    this.platforms.create(200, 400, 'platform').refreshBody();
    this.platforms.create(400, 300, 'platform').refreshBody();

    // 2. Создаем игрока
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.setCollideWorldBounds(true);

    // 3. Управление
    this.cursors = this.input.keyboard.createCursorKeys();

    // 4. Столкновения
    this.physics.add.collider(this.player, this.platforms);
  }

  update() {
    // Движение влево/вправо
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-GAME_CONSTANTS.playerSpeed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(GAME_CONSTANTS.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    // Прыжок
    // Проверяем, стоит ли игрок на платформе (касается ли чего-то снизу)
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(GAME_CONSTANTS.jumpForce);
    }
  }
}

// Добавляем сцену в конфиг и запускаем игру
gameConfig.scene.push(GameScene);
const game = new Phaser.Game(gameConfig);
