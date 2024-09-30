import { Container, Text, Texture } from 'pixi.js';
import { Button } from './Button';

export class TextButton extends Button {
    private text: Text;

    constructor(
        normalTexture: Texture,
        hoverTexture: Texture,
        pressedTexture: Texture,
        label: string,
        x: number,
        y: number,
        fontSize: number = 16,
        fontColor: number = 0xFFFFFF
    ) {
        super(normalTexture, hoverTexture, pressedTexture);

        this.setPosition(x, y);

        this.text = new Text(label, {
            fontFamily: 'Arial',
            fontSize: fontSize,
            fill: fontColor,
            align: 'center'
        });

        this.text.anchor.set(0.5);
        this.text.position.set(this.getContainer().width / 2, this.getContainer().height / 2);
        this.getContainer().addChild(this.text);
    }

    public setTextStyle(style: Partial<Text['style']>): void {
        Object.assign(this.text.style, style);
    }
}
