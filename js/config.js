// js/config.js
const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#121212', // Тёмный фон, чтобы было видно белые платформы
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 }, // Чуть сильнее гравитации для ощущения веса
      debug: false // Поставь true, если нужно видеть красные рамки хитбоксов
    }
  },
  scene: [] // Сюда мы добавим сцены из main.js
};

// Глобальные константы (чтобы не менять цифры в 10 местах сразу)
const GAME_CONSTANTS = {
  playerSpeed: 320,
  jumpForce: -800,
  tileSize: 32,
  enemySpeed: 150
};

export { gameConfig, GAME_CONSTANTS };
