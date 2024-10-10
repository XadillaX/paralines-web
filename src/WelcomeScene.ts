import { Container, Sprite, Text, Assets, Texture, Rectangle } from 'pixi.js';
import { Scene } from './Scene';
import { Game } from './Game';
import { Sound } from '@pixi/sound';
import { Button } from './Button';
import { Emitter, EmitterConfigV3, upgradeConfig } from '@barvynkoa/particle-emitter';
import { TextButton } from './TextButton';
import { CustomCursor } from './CustomCursor';
import { LoginScene } from './LoginScene';

export class WelcomeScene extends Scene {
    private background: Sprite | null = null;
    private logo: Sprite | null = null;
    private buttons: Button[] = [];
    private bgm: Sound | null = null;
    private audioPrompt: Text | null = null;
    private fireEmitter: Emitter | null = null;
    private cgBoard: Container | null = null;
    private cgShowContainer: Container | null = null;
    private cgButtons: Button[] = [];
    private cgPage: number = 0;
    private readonly CG_PAGE_GUI_START_ID = 100;
    private backgroundContainer: Container;
    private cgBlackBackground: Sprite | null = null;
    private cgPages: Container[] = [];

    constructor() {
        super();
        this.backgroundContainer = new Container();
    }

    public async init(): Promise<void> {
        await this.createSceneElements();
        
        // Ensure the background container doesn't block event propagation
        this.backgroundContainer.eventMode = 'passive';
    }

    private async createSceneElements(): Promise<void> {
        console.log("Creating scene elements");
        
        this.backgroundContainer = new Container();
        this.addChild(this.backgroundContainer);

        await this.createBackground();
        await this.createLogo();
        await this.createButtons();
        await this.createBGM();
        this.createFireParticles();
        this.createAudioPrompt();
        await this.createCGBoard();

        console.log("Scene elements created");
    }

    private async createBackground(): Promise<void> {
        this.background = await this.game.resourceManager.createSprite('BG', 'Underpainting');
        if (this.background) {
            this.backgroundContainer.addChild(this.background);
            console.log("Background added");
        } else {
            console.error("Failed to create background sprite");
        }

        const topBackground = await this.game.resourceManager.createSprite('BG', 'Background');
        if (topBackground) {
            this.backgroundContainer.addChild(topBackground);
            console.log("Top background added");
        } else {
            console.error("Failed to create top background sprite");
        }
    }

    private async createLogo(): Promise<void> {
        this.logo = await this.game.resourceManager.createSprite('BG', 'Logo');
        if (this.logo) {
            this.logo.position.set(5, 15);
            this.backgroundContainer.addChild(this.logo);
        } else {
            console.error("Failed to create logo sprite");
        }
    }

    private async createButtons(): Promise<void> {
        const buttonData = [
            { name: 'Start', y: 320, label: '开始游戏' },
            { name: 'CG', y: 365, label: 'CG鉴赏' },
            { name: 'Settings', y: 410, label: '设置' },
            { name: 'Exit', y: 455, label: '退出' }
        ];

        for (const data of buttonData) {
            const normalTexture = await this.game.resourceManager.createTexture('GUI', `${data.name}0`);
            const hoverTexture = await this.game.resourceManager.createTexture('GUI', `${data.name}1`);
            const pressedTexture = await this.game.resourceManager.createTexture('GUI', `${data.name}2`);

            if (normalTexture && hoverTexture && pressedTexture) {
                const button = new Button(normalTexture, hoverTexture, pressedTexture, data.label);
                button.setPosition(50, data.y);
                button.on('buttonClicked', () => {
                    console.log(`WelcomeScene: ${data.label} 按钮被点击`);
                    this.onButtonClick(data.name);
                });
                this.buttons.push(button);
                this.backgroundContainer.addChild(button.getContainer() as any);
            } else {
                console.error(`加载按钮纹理失败: ${data.name}`);
            }
        }
    }

    private async createBGM(): Promise<void> {
        this.bgm = await this.game.resourceManager.createSound('BGM', 'BGM');
        this.bgm.loop = true;
        const playResult = this.bgm.play();
        
        if (playResult === undefined) {
            console.log("音频自动播放被阻止。请点击页面任意位置来开始播放音乐。");
            document.addEventListener('click', () => {
                this.bgm?.play();
                this.removeAudioPrompt();
            }, { once: true });
        } else {
            this.removeAudioPrompt();
        }
    }

    private createAudioPrompt(): void {
        this.audioPrompt = new Text('点击任意位置开始播放音乐', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff
        });
        this.audioPrompt.position.set(this.game.getApp().screen.width / 2, this.game.getApp().screen.height - 50);
        this.audioPrompt.anchor.set(0.5);
        this.container.addChild(this.audioPrompt as Container);
    }

    private removeAudioPrompt(): void {
        if (this.audioPrompt && this.audioPrompt.parent) {
            this.audioPrompt.parent.removeChild(this.audioPrompt);
            this.audioPrompt = null;
        }
    }

    private async createFireParticles(): Promise<void> {
        const particleContainer = new Container();
        particleContainer.position.set(510, 270);
        this.backgroundContainer.addChild(particleContainer);

        const particleTexture = await this.game.resourceManager.createTexture('Particle', 'Fire');

        // Calculate single particle size
        const frameWidth = particleTexture.width / 4;
        const frameHeight = particleTexture.height / 4;

        // Create a new texture using only the top-left particle
        const singleParticleTexture = new Texture({
            source: particleTexture.source,
            frame: new Rectangle(0, 0, frameWidth, frameHeight)
        });

        // Load fire.json file
        const fireConfigV1 = await Assets.load('media/particles/fire.json');

        // Upgrade V1 config to V3, using the newly created single particle texture
        const emitterConfig: EmitterConfigV3 = upgradeConfig(fireConfigV1, [singleParticleTexture]);
        this.fireEmitter = new Emitter(
            particleContainer,
            emitterConfig
        );

        // Start the emitter
        this.fireEmitter.emit = true;
    }

    private async createCGBoard(): Promise<void> {
        console.log('Creating CG Board');
        this.cgBoard = new Container();
        this.cgBoard.visible = false;

        const cgBoardBg = await this.game.resourceManager.createSprite('CGBoard', 'CGAlpha');
        if (cgBoardBg) {
            this.cgBoard.addChild(cgBoardBg);
        } else {
            console.error("Failed to create CGAlpha background");
        }

        const board = await this.game.resourceManager.createSprite('CGBoard', 'board');
        board.position.set((800 - 548) / 2, (600 - 383) / 2);
        this.cgBoard.addChild(board);

        const title = await this.game.resourceManager.createSprite('CGBoard', 'title');
        title.position.set((549 - 61) / 2, 10);
        board.addChild(title);

        const closeButton = new Button(
            await this.game.resourceManager.createTexture('CGBoard', 'close0'),
            await this.game.resourceManager.createTexture('CGBoard', 'close1'),
            await this.game.resourceManager.createTexture('CGBoard', 'close2'),
            'Close CG Board'
        );
        closeButton.setPosition(549 - 25, 6);
        closeButton.on('pointerup', this.closeCGBoard.bind(this));
        board.addChild(closeButton.getContainer());

        const prevButton = new TextButton(
            await this.game.resourceManager.createTexture('CGBoard', 'page0'),
            await this.game.resourceManager.createTexture('CGBoard', 'page1'),
            await this.game.resourceManager.createTexture('CGBoard', 'page2'),
            '上一页',
            30, 40, 12, 0xFFFFFF,
            'Previous Page'
        );
        prevButton.on('pointerup', () => this.changeCGPage(-1));
        board.addChild(prevButton.getContainer());

        const nextButton = new TextButton(
            await this.game.resourceManager.createTexture('CGBoard', 'page0'),
            await this.game.resourceManager.createTexture('CGBoard', 'page1'),
            await this.game.resourceManager.createTexture('CGBoard', 'page2'),
            '下一页',
            549 - 30 - 104, 40, 12, 0xFFFFFF,
            'Next Page'
        );
        nextButton.on('pointerup', () => this.changeCGPage(1));
        board.addChild(nextButton.getContainer());

        await this.createCGButtons(board);

        this.cgBlackBackground = await this.game.resourceManager.createSprite('CGBoard', 'Black');
        if (this.cgBlackBackground) {
            this.cgBlackBackground.visible = false;
            this.addChild(this.cgBlackBackground);
        } else {
            console.error("Failed to create Black background for CG display");
        }

        this.cgShowContainer = new Container();
        this.cgShowContainer.visible = false;
        await this.createCGShowImages();

        this.addChild(this.cgBoard);
        this.addChild(this.cgShowContainer);
        console.log('CG Board created and added to scene');
    }

    private async createCGButtons(board: Sprite): Promise<void> {
        const startx = 15;
        const starty = 80;
        const cgCount = 19; // 根据实际CG数量调整

        for (let i = 0; i < 2; i++) {
            const page = new Container();
            page.visible = i === 0;
            board.addChild(page);
            this.cgPages.push(page);

            for (let j = 0; j < 12 && i * 12 + j < cgCount; j++) {
                const row = Math.floor(j / 4);
                const col = j % 4;
                const x = startx + col * (10 + 122);
                const y = starty + row * (5 + 92);

                const id = i * 12 + j;
                const button = new Button(
                    await this.game.resourceManager.createTexture('CG', `btn${id}0`),
                    await this.game.resourceManager.createTexture('CG', `btn${id}1`),
                    await this.game.resourceManager.createTexture('CG', `btn${id}2`),
                    `CG Button ${id + 1}`,
                    true // 使用悬停遮罩效果
                );
                button.setPosition(x, y);
                button.on('pointerup', () => this.showCG(id));
                this.cgButtons.push(button);
                page.addChild(button.getContainer());
            }
        }
    }

    private async createCGShowImages(): Promise<void> {
        const cgCount = 19; // Adjust according to actual CG quantity
        this.cgShowContainer = new Container();
        this.cgShowContainer.visible = false;
        this.addChild(this.cgShowContainer);

        for (let i = 0; i < cgCount; i++) {
            const cg = await this.game.resourceManager.createSprite('CG', `CG${i}`);
            if (cg) {
                cg.position.set((800 - cg.width) / 2, (600 - cg.height) / 2);
                cg.visible = false;
                this.cgShowContainer.addChild(cg);
                console.log(`CG${i} loaded and added to container`);
            } else {
                console.error(`Failed to create CG sprite: CG${i}`);
            }
        }

        // Add close button
        const closeButton = new Button(
            await this.game.resourceManager.createTexture('CGBoard', 'close0'),
            await this.game.resourceManager.createTexture('CGBoard', 'close1'),
            await this.game.resourceManager.createTexture('CGBoard', 'close2'),
            'Close CG Show Button'  // 添加按钮名称
        );
        closeButton.setPosition(800 - 30, 10);
        closeButton.on('pointerup', this.closeCGShow.bind(this));
        this.cgShowContainer.addChild(closeButton.getContainer());
    }

    private showCGBoard(): void {
        console.log('showCGBoard called');
        if (this.cgBoard) {
            console.log('Setting cgBoard visible to true');
            this.cgBoard.visible = true;
            this.backgroundContainer.eventMode = 'none';
        } else {
            console.error('cgBoard is null');
        }
    }

    private closeCGBoard(): void {
        if (this.cgBoard) {
            this.cgBoard.visible = false;
            this.backgroundContainer.eventMode = 'auto';
        }
    }

    private changeCGPage(direction: number): void {
        const newPage = this.cgPage + direction;
        if (newPage >= 0 && newPage < this.cgPages.length) {
            this.cgPage = newPage;
            this.updateCGPageVisibility();
        }
    }

    private updateCGPageVisibility(): void {
        this.cgPages.forEach((page, index) => {
            page.visible = index === this.cgPage;
        });
    }

    private showCG(id: number): void {
        if (this.cgShowContainer && this.cgBoard && this.cgBlackBackground) {
            // Show black background
            this.cgBlackBackground.visible = true;

            // Show CG display container
            this.cgShowContainer.visible = true;
            
            // Hide CG gallery interface
            this.cgBoard.visible = false;

            // Show selected CG
            this.cgShowContainer.children.forEach((child, index) => {
                if (child instanceof Sprite) {
                    const isVisible = index === id;
                    child.visible = isVisible;
                    console.log(`CG${index} visibility set to ${isVisible}`);
                }
            });
        } else {
            console.error('cgShowContainer, cgBoard, or cgBlackBackground is null');
        }
        
        this.backgroundContainer.eventMode = 'none';
    }

    private onButtonClick(buttonName: string): void {
        console.log(`按钮点击: ${buttonName}`);
        switch (buttonName) {
            case 'Start':
                console.log('开始游戏');
                this.startGame();
                break;
            case 'CG':
                console.log('显示CG画廊');
                this.showCGBoard();
                break;
            case 'Settings':
                console.log('打开设置');
                // Implement settings logic
                break;
            case 'Exit':
                console.log('退出游戏');
                this.exitGame();
                break;
        }
    }

    private startGame(): void {
        // Stop BGM
        if (this.bgm) {
            this.bgm.stop();
        }

        // Hide welcome scene elements
        this.backgroundContainer.visible = false;
        this.buttons.forEach(button => button.getContainer().visible = false);
        if (this.logo) {
            this.logo.visible = false;
        }

        // Stop fire particle effect
        if (this.fireEmitter) {
            this.fireEmitter.emit = false;
        }

        // Remove audio prompt (if it still exists)
        this.removeAudioPrompt();

        // Switch to LoginScene
        const loginScene = new LoginScene();
        this.game.setScene(loginScene);
    }

    private exitGame(): void {
        // In a web environment, we can't directly exit the game
        // Instead, we can show a confirmation dialog
        if (confirm("确定要退出游戏吗？")) {
            // Close the window or redirect to a different page
            window.close();
            // If window.close() doesn't work (it often doesn't in modern browsers),
            // you could redirect to a "game over" or "thank you for playing" page
            // window.location.href = "exit.html";
        }
    }

    public update(deltaTime: number): void {
        if (this.fireEmitter) {
            this.fireEmitter.update(deltaTime * 0.001);
        }
        // Add other update logic here if needed
    }

    private closeCGShow(): void {
        if (this.cgShowContainer) {
            this.cgShowContainer.visible = false;
        }
        if (this.cgBoard) {
            this.cgBoard.visible = true;
        }
        if (this.cgBlackBackground) {
            this.cgBlackBackground.visible = false;
        }
        this.backgroundContainer.eventMode = 'auto';
    }
}
