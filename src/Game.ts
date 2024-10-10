import { Application, Ticker, Container } from 'pixi.js';
import { Scene } from './Scene';
import { WelcomeScene } from './WelcomeScene';
import { ResourceManager } from './ResourceManager';
import { CustomCursor } from './CustomCursor';

interface SaveData {
    stage: number;
}

export class Game {
    private static instance: Game;
    private app: Application;
    private currentScene: Scene | null = null;
    public readonly resourceManager: ResourceManager;
    private saveData: SaveData = { stage: 13 }; // 设置为至少有一个关卡
    private customCursor: CustomCursor | null = null;

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
        
        // 加载所有需要的 XML 文件
        await this.resourceManager.loadXML('media/loader/welcome.xml');
        await this.resourceManager.loadXML('media/loader/login.xml');
        // 如果还有其他 XML 文件，也在这里加载
        
        document.body.appendChild(this.app.canvas);

        // 初始化自定义光标，但不立即加载
        this.customCursor = await CustomCursor.getInstance();
        this.app.stage.addChild(this.customCursor);

        // 添加鼠标移动事件监听器
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('pointermove', (event) => {
            if (this.customCursor) {
                this.customCursor.updatePosition(event);
            }
        });

        // 隐藏系统光标
        this.app.renderer.events.cursorStyles.default = 'none';
        
        this.setScene(new WelcomeScene());
        
        this.app.ticker.add(this.update);
    }

    private update = (ticker: Ticker): void => {
        const deltaTime = ticker.deltaTime;
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    public async setScene(scene: Scene): Promise<void> {
        console.log('Setting new scene');
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.getContainer());
        }
        this.currentScene = scene;
        await this.currentScene.init();
        this.app.stage.addChild(scene.getContainer());
        console.log('New scene added to stage');
        console.log('Stage children count:', this.app.stage.children.length);

        // 确保自定义光标始终在最上层，并重置为箭头状态
        if (this.customCursor) {
            this.app.stage.addChild(this.customCursor);
            this.customCursor.setArrowCursor();
        }
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

    public getCustomCursor(): CustomCursor | null {
        return this.customCursor;
    }

    public async initializeCustomCursor(): Promise<void> {
        if (this.customCursor) {
            await this.customCursor.loadTextures();
            this.customCursor.setArrowCursor();
        }
    }
}
