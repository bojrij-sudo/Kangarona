import Engine from './engine';

export class Level1 extends Engine {
    create() {
        super.create();
        // Создание уровня 1
        this.add.sprite(0, 0, 'level1');
        // ... создание платформ и врагов
    }
}

export class Level2 extends Engine {
    create() {
        super.create();
        // Создание уровня 2
        this.add.sprite(0, 0, 'level2');
        // ... создание платформ и врагов
    }
}
// ... другие уровни
