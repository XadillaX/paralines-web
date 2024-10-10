import { Sprite, Container, Texture, Assets, FederatedPointerEvent } from 'pixi.js';
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

        // Set cursor anchor to top-left corner
        this.arrowCursor.anchor.set(0, 0);
        this.pointCursor.anchor.set(0, 0);

        // Set mouse cursor to not receive interaction events
        this.eventMode = 'none';
        this.arrowCursor.eventMode = 'none';
        this.pointCursor.eventMode = 'none';
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
        
        // Load arrow cursor directly
        const arrowTexture = await Assets.load('media/cursor_arrow.png');
        this.arrowCursor.texture = arrowTexture;

        // Load pointer cursor from resource manager
        const pointTexture = await game.resourceManager.createTexture('Cursor', 'Pointer');
        if (pointTexture) this.pointCursor.texture = pointTexture;
    }

    public updatePosition(event: FederatedPointerEvent): void {
        this.position.copyFrom(event.global);
    }

    public setArrowCursor(): void {
        this.currentCursor.visible = false;
        this.currentCursor = this.arrowCursor;
        this.currentCursor.visible = true;
        this.hideSystemCursor();
    }

    public setPointCursor(): void {
        this.currentCursor.visible = false;
        this.currentCursor = this.pointCursor;
        this.currentCursor.visible = true;
        this.hideSystemCursor();
    }

    private hideSystemCursor(): void {
        const game = Game.getInstance();
        game.getApp().renderer.events.cursorStyles.default = 'none';
        game.getApp().renderer.events.cursorStyles.pointer = 'none';
    }
}
