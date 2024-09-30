import * as PIXI from 'pixi.js';
import { Game } from './Game';

export abstract class Scene extends PIXI.Container {
    protected game: Game;

    constructor(game: Game) {
        super();
        this.game = game;
    }

    public abstract update(deltaTime: number): void;
}
