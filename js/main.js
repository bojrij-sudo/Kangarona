import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    scene: [Level1, Level2, Level3, Level4, Level5, Level6],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

new Phaser.Game(config);
