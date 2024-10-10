import { Application, Ticker } from 'pixi.js';
import { Scene } from './Scene';
import { WelcomeScene } from './WelcomeScene';
import { ResourceManager } from './ResourceManager';

interface SaveData {
    stage: number;
}

export class Game {
    private static instance: Game;
    private app: Application;
    private currentScene: Scene | null = null;
    public readonly resourceManager: ResourceManager;
    private saveData: SaveData = { stage: 1 }; // 设置为至少有一个关卡

    private constructor() {
        this.app = new Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000,
            antialias: true
        });
        this.resourceManager = new ResourceManager();
    }

    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    public async start(): Promise<void> {
        await this.app.init();
        await this.resourceManager.loadXML('media/loader/welcome.xml');
        await this.resourceManager.loadXML('media/loader/login.xml');
        this.resourceManager.setCurrentSet('media/loader/welcome.xml');
        
        document.body.appendChild(this.app.canvas);
        this.setScene(new WelcomeScene());
        
        // Hide system cursor
        this.app.renderer.events.cursorStyles.default = 'none';
        
        this.app.ticker.add(this.update);
    }

    private update = (ticker: Ticker): void => {
        const deltaTime = ticker.deltaTime;
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    public async setScene(scene: Scene): Promise<void> {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.getContainer());
        }
        this.currentScene = scene;
        await this.currentScene.init();
        this.app.stage.addChild(scene.getContainer());
    }

    public getApp(): Application {
        return this.app;
    }

    public getSaveData(): SaveData {
        return this.saveData;
    }

    public setSaveData(data: SaveData): void {
        this.saveData = data;
    }
}
