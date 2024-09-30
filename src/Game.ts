import * as PIXI from 'pixi.js';
import { Scene } from './Scene';

export class Game {
    private app: PIXI.Application;
    private currentScene: Scene | null = null;

    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000
        });
    }

    public start(): void {
        document.body.appendChild(this.app.view);
        // 在这里初始化你的第一个场景
        // this.setScene(new YourFirstScene(this));
    }

    public setScene(scene: Scene): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }
        this.currentScene = scene;
        this.app.stage.addChild(this.currentScene);
    }

    public getApp(): PIXI.Application {
        return this.app;
    }
}
