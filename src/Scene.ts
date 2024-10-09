import { Container } from 'pixi.js';
import { Game } from './Game';

export abstract class Scene {
    protected container: Container;
    protected game: Game;

    constructor() {
        this.container = new Container();
        this.game = Game.getInstance();
    }

    public abstract update(deltaTime: number): void;
    public abstract init(): Promise<void>;

    public getContainer(): Container {
        return this.container;
    }

    protected addChild(child: Container): void {
        this.container.addChild(child);
    }
}
