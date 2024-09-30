import * as PIXI from 'pixi.js';

export class DialogueSystem extends PIXI.Container {
    private textBox: PIXI.Text;

    constructor() {
        super();
        this.textBox = new PIXI.Text('', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            wordWrap: true,
            wordWrapWidth: 760
        });
        this.textBox.position.set(20, 500);
        this.addChild(this.textBox);
    }

    public showDialogue(text: string): void {
        this.textBox.text = text;
    }
}
