import { Container, Sprite, Text, Graphics } from 'pixi.js';
import { Scene } from './Scene';
import { Game } from './Game';
import { Button } from './Button';
import { WelcomeScene } from './WelcomeScene';
import { CustomCursor } from './CustomCursor';

// 删除 TextButton 的导入

export class LoginScene extends Scene {
    private static readonly LOGIN_STAGE_GUI_START = 10;
    private static readonly STAGE_GUI_X = [220, 310, 400, 490, 140, 225, 310, 395, 480, 565, 175, 420, 330];
    private static readonly STAGE_GUI_Y = [95, 95, 95, 95, 250, 250, 250, 250, 250, 250, 310, 310, 455];

    private gui: Container;
    private stageButtons: Button[] = [];
    private backButton: Button; // 改为 Button 类型

    constructor() {
        super();
        this.gui = new Container();
        this.addChild(this.gui);
        console.log('LoginScene constructor called, GUI container created and added to scene');
    }

    public async init(): Promise<void> {
        console.log('LoginScene init started');
        this.game.resourceManager.setCurrentSet('media/loader/login.xml');
        await this.createSceneElements();
        console.log('LoginScene init completed');
        console.log('GUI container children count:', this.gui.children.length);
        console.log('Scene container children count:', this.container.children.length);
        console.log('GUI container position:', this.gui.position);
        console.log('GUI container world transform:', this.gui.worldTransform);
        
        // 添加这些行
        this.stageButtons.forEach(button => button.logState());
        if (this.backButton) {
            this.backButton.logState();
        }
    }

    private async createSceneElements(): Promise<void> {
        await this.createBackground();
        await this.createTitle();
        await this.createStageGUI();
        await this.createBackButton();
        
        // 确保 GUI 容器在最上层
        this.removeChild(this.gui);
        this.addChild(this.gui);

        console.log('All scene elements created');
        console.log('GUI container position:', this.gui.position);
        console.log('GUI container visible:', this.gui.visible);
        console.log('GUI container scale:', this.gui.scale);
        console.log('GUI container alpha:', this.gui.alpha);
    }

    private async createBackground(): Promise<void> {
        const background = await this.game.resourceManager.createSprite('BG', 'Underpainting');
        if (background) {
            this.addChild(background);
            console.log('Background added to scene');
        } else {
            console.error("Failed to create background sprite");
        }
    }

    private async createTitle(): Promise<void> {
        const title1 = await this.game.resourceManager.createSprite('Title', '1');
        if (title1) {
            title1.position.set((800 - 100) / 2, 30);
            this.addChild(title1);
        }

        if (Game.getInstance().getSaveData().stage > 3) {
            const title2 = await this.game.resourceManager.createSprite('Title', '2');
            if (title2) {
                title2.position.set((800 - 100) / 2, 190);
                this.addChild(title2);
            }
        }

        if (Game.getInstance().getSaveData().stage > 11) {
            const title3 = await this.game.resourceManager.createSprite('Title', '3');
            if (title3) {
                title3.position.set((800 - 100) / 2, 405);
                this.addChild(title3);
            }
        }

        // Add separator lines
        if (Game.getInstance().getSaveData().stage > 3) {
            const line1 = await this.game.resourceManager.createSprite('Title', 'Line');
            if (line1) {
                line1.position.set((800 - 575) / 2, 145);
                this.addChild(line1);
            }
        }

        if (Game.getInstance().getSaveData().stage > 11) {
            const line2 = await this.game.resourceManager.createSprite('Title', 'Line');
            if (line2) {
                line2.position.set((800 - 575) / 2, 350);
                this.addChild(line2);
            }
        }

        const line3 = await this.game.resourceManager.createSprite('Title', 'Line');
        if (line3) {
            line3.position.set((800 - 575) / 2, 500);
            this.addChild(line3);
        }
    }

    private async createStageGUI(): Promise<void> {
        const saveData = Game.getInstance().getSaveData();
        for (let i = 0; i < saveData.stage; i++) {
            const normalTexture = await this.game.resourceManager.createTexture('StageSelect', `stage${i + 1}_0`);
            const hoverTexture = await this.game.resourceManager.createTexture('StageSelect', `stage${i + 1}_1`);
            const pressedTexture = await this.game.resourceManager.createTexture('StageSelect', `stage${i + 1}_2`);

            if (normalTexture && hoverTexture && pressedTexture) {
                const button = new Button(normalTexture, hoverTexture, pressedTexture, `Stage ${i + 1}`);
                button.setPosition(LoginScene.STAGE_GUI_X[i], LoginScene.STAGE_GUI_Y[i]);
                button.on('buttonClicked', (name) => this.onStageSelect(i, name));
                this.stageButtons.push(button);
                this.gui.addChild(button.getContainer());
                console.log(`Stage button ${i + 1} created at position (${LoginScene.STAGE_GUI_X[i]}, ${LoginScene.STAGE_GUI_Y[i]})`);
                console.log(`Stage button ${i + 1} visible:`, button.getContainer().visible);
                console.log(`Stage button ${i + 1} dimensions:`, button.getContainer().width, button.getContainer().height);
                console.log(`Stage button ${i + 1} scale:`, button.getContainer().scale);
            } else {
                console.error(`Failed to load textures for stage ${i + 1}`);
            }
        }
    }

    private async createBackButton(): Promise<void> {
        const backButton = new Button(
            await this.game.resourceManager.createTexture('Button', 'Back0'),
            await this.game.resourceManager.createTexture('Button', 'Back1'),
            await this.game.resourceManager.createTexture('Button', 'Back2'),
            'Back Button'
        );
        backButton.setPosition((800 - 103) / 2, 520);
        backButton.on('buttonClicked', (name) => this.onBackButtonClick(name));
        this.gui.addChild(backButton.getContainer());
        console.log(`Back button created at position (${(800 - 103) / 2}, 520)`);
        console.log(`Back button visible:`, backButton.getContainer().visible);
        console.log(`Back button dimensions:`, backButton.getContainer().width, backButton.getContainer().height);
        console.log(`Back button scale:`, backButton.getContainer().scale);
    }

    private onStageSelect(stageIndex: number, buttonName: string): void {
        console.log(`Selected stage: ${stageIndex + 1}, Button: ${buttonName}`);
        // TODO: Implement stage loading logic
        // For example:
        // const playScene = new PlayScene(stageIndex);
        // this.game.setScene(playScene);
    }

    private onBackButtonClick(buttonName: string): void {
        console.log(`Back button clicked: ${buttonName}`);
        const welcomeScene = new WelcomeScene();
        this.game.setScene(welcomeScene);
    }

    public update(deltaTime: number): void {
        // Add any necessary update logic here
    }
}
