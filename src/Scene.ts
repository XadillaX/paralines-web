import { Container } from 'pixi.js';
import { Game } from './Game';

export abstract class Scene {
    protected container: Container;
    protected game: Game;

    constructor(xmlPath: string) {
        this.container = new Container();
        this.game = Game.getInstance();
        this.game.resourceManager.setCurrentSet(xmlPath);
    }

    public abstract update(deltaTime: number): void;
    public abstract init(): Promise<void>;

    public getContainer(): Container {
        return this.container;
    }

    protected addChild(child: Container): void {
        this.container.addChild(child);
    }

    protected removeChild(child: Container): void {
        this.container.removeChild(child);
    }
}
