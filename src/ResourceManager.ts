import { Assets, Texture, Sprite } from 'pixi.js';
import { Sound } from '@pixi/sound';

interface ResourceData {
    [key: string]: {
        [key: string]: string;
    };
}

export class ResourceManager {
    private resources: ResourceData = {};

    public async loadXML(xmlPath: string): Promise<void> {
        const xmlText = await Assets.load(xmlPath);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const informationNodes = xmlDoc.getElementsByTagName("SpriteInformation");
        for (let i = 0; i < informationNodes.length; i++) {
            const type = informationNodes[i].getAttribute("type") || "";
            const spriteNodes = informationNodes[i].getElementsByTagName("Sprite");
            this.resources[type] = {};
            for (let j = 0; j < spriteNodes.length; j++) {
                const name = spriteNodes[j].getAttribute("name") || "";
                const path = spriteNodes[j].textContent || "";
                this.resources[type][name] = path;
            }
        }

        const soundNodes = xmlDoc.getElementsByTagName("SoundInformation");
        for (let i = 0; i < soundNodes.length; i++) {
            const type = soundNodes[i].getAttribute("type") || "";
            const soundElements = soundNodes[i].getElementsByTagName("Sound");
            this.resources[type] = {};
            for (let j = 0; j < soundElements.length; j++) {
                const name = soundElements[j].getAttribute("name") || "";
                const path = soundElements[j].textContent || "";
                this.resources[type][name] = path;
            }
        }
    }

    public getSpritePath(type: string, name: string): string {
        return this.resources[type]?.[name] || "";
    }

    public getSoundPath(type: string, name: string): string {
        return this.resources[type]?.[name] || "";
    }

    public async createSprite(type: string, name: string): Promise<Sprite> {
        const path = this.getSpritePath(type, name);
        const texture = await Assets.load(path);
        return new Sprite(texture);
    }

    public async createSound(type: string, name: string): Promise<Sound> {
        const path = this.getSoundPath(type, name);
        return Sound.from(path);
    }

    public async createTexture(type: string, name: string): Promise<Texture> {
        const path = this.getSpritePath(type, name);
        return await Assets.load(path);
    }
}
