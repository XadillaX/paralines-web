import { Sprite, Container, Texture } from 'pixi.js';
import { Game } from './Game';

export class CustomCursor extends Container {
    private static instance: CustomCursor;
    private defaultCursor: Sprite;
    private buttonCursor: Sprite;
    private currentCursor: Sprite;

    private constructor() {
        super();
        this.defaultCursor = new Sprite();
        this.buttonCursor = new Sprite();
        this.addChild(this.defaultCursor);
        this.addChild(this.buttonCursor);
        this.currentCursor = this.defaultCursor;
        this.buttonCursor.visible = false;
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
        const defaultTexture = await game.resourceManager.createTexture('Cursor', 'Pointer');
        const buttonTexture = await game.resourceManager.createTexture('Cursor', 'Button');
        
        if (defaultTexture) this.defaultCursor.texture = defaultTexture;
        if (buttonTexture) this.buttonCursor.texture = buttonTexture;
    }

    public updatePosition(x: number, y: number): void {
        this.position.set(x, y);
    }

    public setDefaultCursor(): void {
        this.currentCursor.visible = false;
        this.currentCursor = this.defaultCursor;
        this.currentCursor.visible = true;
    }

    public setButtonCursor(): void {
        this.currentCursor.visible = false;
        this.currentCursor = this.buttonCursor;
        this.currentCursor.visible = true;
    }
}
