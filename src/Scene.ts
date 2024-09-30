import { Container } from 'pixi.js';
import { Game } from './Game';

export abstract class Scene {
    protected container: Container;
    protected game: Game;

    constructor(game: Game) {
        this.container = new Container();
        this.game = game;
    }

    public abstract update(deltaTime: number): void;

    public getContainer(): Container {
        return this.container;
    }

    protected addChild(child: Container): void {
        this.container.addChild(child);
    }
}
