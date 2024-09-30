import { Container, Sprite, Texture, FederatedEventHandler } from 'pixi.js';

export class Button {
    private container: Container;
    private normalState: Sprite;
    private hoverState: Sprite;
    private pressedState: Sprite;

    constructor(normalTexture: Texture, hoverTexture: Texture, pressedTexture: Texture) {
        this.container = new Container();

        this.normalState = Sprite.from(normalTexture);
        this.hoverState = Sprite.from(hoverTexture);
        this.pressedState = Sprite.from(pressedTexture);

        this.container.addChild(this.normalState);
        this.container.addChild(this.hoverState);
        this.container.addChild(this.pressedState);

        this.hoverState.visible = false;
        this.pressedState.visible = false;

        this.container.eventMode = 'static';
        this.container.cursor = 'pointer';

        this.container.on('pointerover', this.onPointerOver.bind(this));
        this.container.on('pointerout', this.onPointerOut.bind(this));
        this.container.on('pointerdown', this.onPointerDown.bind(this));
        this.container.on('pointerup', this.onPointerUp.bind(this));
    }

    private onPointerOver(): void {
        if (!this.pressedState.visible) {
            this.normalState.visible = false;
            this.hoverState.visible = true;
        }
    }

    private onPointerOut(): void {
        this.normalState.visible = true;
        this.hoverState.visible = false;
        this.pressedState.visible = false;
    }

    private onPointerDown(): void {
        this.hoverState.visible = false;
        this.pressedState.visible = true;
    }

    private onPointerUp(): void {
        if (this.pressedState.visible) {
            this.pressedState.visible = false;
            this.hoverState.visible = true;
        }
    }

    public getContainer(): Container {
        return this.container;
    }

    public setPosition(x: number, y: number): void {
        this.container.position.set(x, y);
    }

    public on(event: string, listener: FederatedEventHandler): void {
        this.container.on(event, listener);
    }
}
