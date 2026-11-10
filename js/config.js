export const GAME_CONSTANTS = {
  tileSize: 64,
  playerSpeed: 300,
  jumpForce: -400
};

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene:  // сюда добавится GameScene
};
