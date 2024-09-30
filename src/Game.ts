import { Application, Ticker, Container } from 'pixi.js';
import { Scene } from './Scene';
import { WelcomeScene } from './WelcomeScene';

export class Game {
    private app: Application;
    private currentScene: Scene | null = null;

    constructor() {
        this.app = new Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000,
            antialias: true
        });
    }

    public async start(): Promise<void> {
        await this.app.init();
        
        document.body.appendChild(this.app.canvas);
        this.setScene(new WelcomeScene(this));
        
        // 设置游戏循环
        this.app.ticker.add(this.update);
    }

    private update = (ticker: Ticker): void => {
        const deltaTime = ticker.deltaTime;
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    public setScene(scene: Scene): void {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.getContainer());
        }
        this.currentScene = scene;
        this.app.stage.addChild(scene.getContainer());
    }

    public getApp(): Application {
        return this.app;
    }
}
