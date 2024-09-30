import { Container, Sprite, Text, Assets, Texture, Rectangle } from 'pixi.js';
import { Scene } from './Scene';
import { Game } from './Game';
import { Sound } from '@pixi/sound';
import { ResourceManager } from './ResourceManager';
import { Button } from './Button';
import { Emitter, EmitterConfigV3, upgradeConfig } from '@barvynkoa/particle-emitter';

export class WelcomeScene extends Scene {
    private resourceManager: ResourceManager;
    private background: Sprite | null = null;
    private logo: Sprite | null = null;
    private buttons: Button[] = [];
    private bgm: Sound | null = null;
    private audioPrompt: Text | null = null;
    private fireEmitter: Emitter | null = null;

    constructor(game: Game) {
        super(game);
        this.resourceManager = new ResourceManager();
        this.init();
    }

    private async init(): Promise<void> {
        await this.loadResources();
        await this.createSceneElements();
    }

    private async loadResources(): Promise<void> {
        await this.resourceManager.loadXML('media/loader/welcome.xml');
    }

    private async createSceneElements(): Promise<void> {
        await this.createBackground();
        await this.createLogo();
        await this.createButtons();
        await this.createBGM();
        this.createFireParticles();
        this.createAudioPrompt();
    }

    private async createBackground(): Promise<void> {
        this.background = await this.resourceManager.createSprite('BG', 'Underpainting');
        this.addChild(this.background as Container);

        const topBackground = await this.resourceManager.createSprite('BG', 'Background');
        this.addChild(topBackground as Container);
    }

    private async createLogo(): Promise<void> {
        this.logo = await this.resourceManager.createSprite('BG', 'Logo');
        this.logo.position.set(5, 15);
        this.addChild(this.logo);
    }

    private async createButtons(): Promise<void> {
        const buttonData = [
            { name: 'Start', y: 320 },
            { name: 'CG', y: 365 },
            { name: 'Settings', y: 410 },
            { name: 'Exit', y: 455 }
        ];

        for (const data of buttonData) {
            const normalTexture = await this.resourceManager.createTexture('GUI', `${data.name}0`);
            const hoverTexture = await this.resourceManager.createTexture('GUI', `${data.name}1`);
            const pressedTexture = await this.resourceManager.createTexture('GUI', `${data.name}2`);

            if (normalTexture && hoverTexture && pressedTexture) {
                const button = new Button(normalTexture, hoverTexture, pressedTexture);
                button.setPosition(50, data.y);
                button.on('pointerup', () => this.onButtonClick(data.name));
                this.buttons.push(button);
                this.addChild(button.getContainer() as any);
            } else {
                console.error(`Failed to load textures for button: ${data.name}`);
            }
        }
    }

    private async createBGM(): Promise<void> {
        this.bgm = await this.resourceManager.createSound('BGM', 'BGM');
        this.bgm.loop = true;
        const playResult = this.bgm.play();
        
        if (playResult === undefined) {
            console.log("音频自动播放被阻止。请点击页面任意位置来开始播放音乐。");
            document.addEventListener('click', () => {
                this.bgm?.play();
                if (this.audioPrompt) {
                    this.container.removeChild(this.audioPrompt);
                    this.audioPrompt = null;
                }
            }, { once: true });
        } else {
            if (this.audioPrompt) {
                this.container.removeChild(this.audioPrompt);
                this.audioPrompt = null;
            }
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

    private async createFireParticles(): Promise<void> {
        const particleContainer = new Container();
        particleContainer.position.set(510, 270);
        this.addChild(particleContainer);

        const particleTexture = await this.resourceManager.createTexture('Particle', 'Fire');

        // 计算单个粒子的尺寸
        const frameWidth = particleTexture.width / 4;
        const frameHeight = particleTexture.height / 4;

        // 创建一个新的纹理，只使用左上角的粒子
        const singleParticleTexture = new Texture({
            source: particleTexture.source,
            frame: new Rectangle(0, 0, frameWidth, frameHeight)
        });

        // 加载 fire.json 文件
        const fireConfigV1 = await Assets.load('media/particles/fire.json');

        // 将 V1 配置升级到 V3，使用新创建的单个粒子纹理
        const emitterConfig: EmitterConfigV3 = upgradeConfig(fireConfigV1, [singleParticleTexture]);
        this.fireEmitter = new Emitter(
            particleContainer,
            emitterConfig
        );

        // 启动发射器
        this.fireEmitter.emit = true;
    }

    private onButtonClick(buttonName: string): void {
        switch (buttonName) {
            case 'Start':
                console.log('Start game');
                // 实现开始游戏逻辑
                break;
            case 'CG':
                console.log('Open CG gallery');
                // 实现 CG 画廊逻辑
                break;
            case 'Settings':
                console.log('Open settings');
                // 实现设置逻辑
                break;
            case 'Exit':
                console.log('Exit game');
                // 实现退出游戏逻辑
                break;
        }
    }

    public update(deltaTime: number): void {
        if (this.fireEmitter) {
            this.fireEmitter.update(deltaTime * 0.001);
        }
    }
}
