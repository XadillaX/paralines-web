import { Sprite, Container, Texture, Assets } from 'pixi.js';
import { Game } from './Game';

export class CustomCursor extends Container {
    private static instance: CustomCursor;
    private arrowCursor: Sprite;
    private pointCursor: Sprite;
    private currentCursor: Sprite;

    private constructor() {
        super();
        this.arrowCursor = new Sprite();
        this.pointCursor = new Sprite();
        this.addChild(this.arrowCursor);
        this.addChild(this.pointCursor);
        this.currentCursor = this.arrowCursor;
        this.pointCursor.visible = false;
    }

    public static async getInstance(): Promise<CustomCursor> {
        if (!CustomCursor.instance) {
            CustomCursor.instance = new CustomCursor();
            await CustomCursor.instance.loadTextures();
        }
        return CustomCursor.instance;
    }

    private async loadTextures(): Promise<void> {
        const game = Game.getInstance();
        
        // 直接加载箭头光标
        const arrowTexture = await Assets.load('media/cursor_arrow.png');
        this.arrowCursor.texture = arrowTexture;

        // 从资源管理器加载指针光标
        const pointTexture = await game.resourceManager.createTexture('Cursor', 'Pointer');
        if (pointTexture) this.pointCursor.texture = pointTexture;
    }

    public updatePosition(x: number, y: number): void {
        this.position.set(x, y);
    }

    public setArrowCursor(): void {
        this.currentCursor.visible = false;
        this.currentCursor = this.arrowCursor;
        this.currentCursor.visible = true;
    }

    public setPointCursor(): void {
        this.currentCursor.visible = false;
        this.currentCursor = this.pointCursor;
        this.currentCursor.visible = true;
    }
}
