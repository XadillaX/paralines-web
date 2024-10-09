import { Container, Sprite, Texture, FederatedPointerEvent } from 'pixi.js';

export class Button {
    private container: Container;
    private normalState: Sprite;
    private hoverState: Sprite;
    private pressedState: Sprite;
    private isPressed: boolean = false;

    constructor(normalTexture: Texture, hoverTexture: Texture, pressedTexture: Texture) {
        this.container = new Container();

        this.normalState = new Sprite(normalTexture);
        this.hoverState = new Sprite(hoverTexture);
        this.pressedState = new Sprite(pressedTexture);

        this.container.addChild(this.normalState, this.hoverState, this.pressedState);

        this.hoverState.visible = false;
        this.pressedState.visible = false;

        this.container.eventMode = 'static';
        this.container.cursor = 'pointer';

        this.container.on('pointerover', this.onPointerOver.bind(this));
        this.container.on('pointerout', this.onPointerOut.bind(this));
        this.container.on('pointerdown', this.onPointerDown.bind(this));
        this.container.on('pointerup', this.onPointerUp.bind(this));
        this.container.on('pointerupoutside', this.onPointerUpOutside.bind(this));
    }

    private onPointerOver(): void {
        console.log('Button: onPointerOver');
        if (!this.isPressed) {
            this.normalState.visible = false;
            this.hoverState.visible = true;
        }
    }

    private onPointerOut(): void {
        console.log('Button: onPointerOut');
        if (!this.isPressed) {
            this.normalState.visible = true;
            this.hoverState.visible = false;
            this.pressedState.visible = false;
        }
    }

    private onPointerDown(event: FederatedPointerEvent): void {
        console.log('Button: onPointerDown');
        this.isPressed = true;
        this.hoverState.visible = false;
        this.pressedState.visible = true;
        event.stopPropagation();
    }

    private onPointerUp(event: FederatedPointerEvent): void {
        console.log('Button: onPointerUp');
        if (this.isPressed) {
            this.isPressed = false;
            this.pressedState.visible = false;
            this.hoverState.visible = true;
            console.log('Button clicked');
            this.container.emit('buttonClicked');
            event.stopPropagation();
        }
    }

    private onPointerUpOutside(): void {
        console.log('Button: onPointerUpOutside');
        this.isPressed = false;
        this.normalState.visible = true;
        this.hoverState.visible = false;
        this.pressedState.visible = false;
    }

    public getContainer(): Container {
        return this.container;
    }

    public setPosition(x: number, y: number): void {
        this.container.position.set(x, y);
    }

    public on(event: string, listener: (...args: any[]) => void): void {
        if (event === 'buttonClicked') {
            this.container.on(event, listener);
        } else {
            this.container.on(event, listener);
        }
    }
}
