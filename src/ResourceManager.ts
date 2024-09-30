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
        try {
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
                    console.log(`Loaded resource: ${type}/${name} -> ${path}`);
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

            console.log("All resources loaded:", this.resources);
        } catch (error) {
            console.error("Error loading XML:", error);
        }
    }

    public getSpritePath(type: string, name: string): string {
        const path = this.resources[type]?.[name] || "";
        if (!path) {
            console.error(`Resource not found: ${type}/${name}`);
            console.log("Available resources:", this.resources);
        }
        return path;
    }

    public async createSprite(type: string, name: string): Promise<Sprite | null> {
        try {
            const path = this.getSpritePath(type, name);
            if (!path) {
                console.error(`Resource not found: ${type}/${name}`);
                return null;
            }
            const texture = await Assets.load(path);
            if (!texture) {
                console.error(`Failed to load texture: ${path}`);
                return null;
            }
            return new Sprite(texture);
        } catch (error) {
            console.error(`Error creating sprite ${type}/${name}:`, error);
            return null;
        }
    }

    public async createSound(type: string, name: string): Promise<Sound | null> {
        try {
            const path = this.getSpritePath(type, name);
            if (!path) {
                console.error(`Resource not found: ${type}/${name}`);
                return null;
            }
            return Sound.from(path);
        } catch (error) {
            console.error(`Error creating sound ${type}/${name}:`, error);
            return null;
        }
    }

    public async createTexture(type: string, name: string): Promise<Texture | null> {
        try {
            const path = this.getSpritePath(type, name);
            if (!path) {
                console.error(`Resource not found: ${type}/${name}`);
                return null;
            }
            return await Assets.load(path);
        } catch (error) {
            console.error(`Error creating texture ${type}/${name}:`, error);
            return null;
        }
    }
}
