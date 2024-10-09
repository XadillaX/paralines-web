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
            console.log("XML loaded:", xmlText);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            this.parseInformationNodes(xmlDoc, "SpriteInformation");
            this.parseInformationNodes(xmlDoc, "SoundInformation");

            console.log("All resources loaded:", this.resources);
        } catch (error) {
            console.error("Error loading XML:", error);
        }
    }

    private parseInformationNodes(xmlDoc: Document, nodeName: string): void {
        const nodes = xmlDoc.getElementsByTagName(nodeName);
        for (let i = 0; i < nodes.length; i++) {
            const type = nodes[i].getAttribute("type") || "";
            const elements = nodes[i].children;
            if (!this.resources[type]) {
                this.resources[type] = {};
            }
            for (let j = 0; j < elements.length; j++) {
                const name = elements[j].getAttribute("name") || "";
                const path = elements[j].textContent || "";
                if (!this.resources[type][name]) {
                    this.resources[type][name] = path;
                    console.log(`Loaded resource: ${type}/${name} -> ${path}`);
                } else {
                    console.warn(`Resource ${type}/${name} already exists, skipping.`);
                }
            }
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
