import { Container, Sprite, Text } from 'pixi.js';
import { Scene } from './Scene';
import { Game } from './Game';
import { Button } from './Button';
import { TextButton } from './TextButton';
import { WelcomeScene } from './WelcomeScene';

export class LoginScene extends Scene {
    private static readonly LOGIN_STAGE_GUI_START = 10;
    private static readonly STAGE_GUI_X = [220, 310, 400, 490, 140, 225, 310, 395, 480, 565, 175, 420, 330];
    private static readonly STAGE_GUI_Y = [95, 95, 95, 95, 250, 250, 250, 250, 250, 250, 310, 310, 455];

    private gui: Container;
    private stageButtons: Button[] = [];

    constructor() {
        super();
        this.gui = new Container();
        this.addChild(this.gui);
    }

    public async init(): Promise<void> {
        this.game.resourceManager.setCurrentSet('media/loader/login.xml');
        await this.createSceneElements();
    }

    private async createSceneElements(): Promise<void> {
        await this.createBackground();
        await this.createTitle();
        await this.createStageGUI();
        await this.createBackButton();
    }

    private async createBackground(): Promise<void> {
        const background = await this.game.resourceManager.createSprite('BG', 'Underpainting');
        if (background) {
            this.addChild(background);
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
        for (let i = 0; i <= saveData.stage; i++) {
            const normalTexture = await this.game.resourceManager.createTexture('StageSelect', `stage${i + 1}_0`);
            const hoverTexture = await this.game.resourceManager.createTexture('StageSelect', `stage${i + 1}_1`);
            const pressedTexture = await this.game.resourceManager.createTexture('StageSelect', `stage${i + 1}_2`);

            if (normalTexture && hoverTexture && pressedTexture) {
                const button = new Button(normalTexture, hoverTexture, pressedTexture);
                button.setPosition(LoginScene.STAGE_GUI_X[i], LoginScene.STAGE_GUI_Y[i]);
                button.on('buttonClicked', () => this.onStageSelect(i));
                this.stageButtons.push(button);
                this.gui.addChild(button.getContainer());
            } else {
                console.error(`Failed to load textures for stage ${i + 1}`);
            }
        }
    }

    private async createBackButton(): Promise<void> {
        const backButton = new TextButton(
            await this.game.resourceManager.createTexture('Button', 'Back0'),
            await this.game.resourceManager.createTexture('Button', 'Back1'),
            await this.game.resourceManager.createTexture('Button', 'Back2'),
            '返回',
            (800 - 103) / 2,
            520,
            16,
            0xFFFFFF
        );
        backButton.on('buttonClicked', this.onBackButtonClick.bind(this));
        this.gui.addChild(backButton.getContainer());
    }

    private onStageSelect(stageIndex: number): void {
        console.log(`Selected stage: ${stageIndex + 1}`);
        // TODO: Implement stage loading logic
        // For example:
        // const playScene = new PlayScene(stageIndex);
        // this.game.setScene(playScene);
    }

    private onBackButtonClick(): void {
        const welcomeScene = new WelcomeScene();
        this.game.setScene(welcomeScene);
    }

    public update(deltaTime: number): void {
        // Add any necessary update logic here
    }
}
