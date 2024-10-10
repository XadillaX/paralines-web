import { Assets, Texture, Sprite } from 'pixi.js';
import { Sound } from '@pixi/sound';

interface ResourceSet {
    [type: string]: {
        [name: string]: string;
    };
}

export class ResourceManager {
    private resources: { [xmlPath: string]: ResourceSet } = {};
    private currentSet: string | null = null;

    public async loadXML(xmlPath: string): Promise<void> {
        if (this.resources[xmlPath]) {
            console.log(`Resource set ${xmlPath} already loaded.`);
            return;
        }

        try {
            const xmlText = await Assets.load(xmlPath);
            console.log(`XML loaded: ${xmlPath}`);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            this.resources[xmlPath] = {};
            this.parseInformationNodes(xmlDoc, "SpriteInformation", xmlPath);
            this.parseInformationNodes(xmlDoc, "SoundInformation", xmlPath);

            console.log("Resources loaded from XML:", xmlPath);
        } catch (error) {
            console.error(`Error loading XML: ${xmlPath}`, error);
        }
    }

    public setCurrentSet(xmlPath: string): void {
        if (!this.resources[xmlPath]) {
            console.error(`Resource set ${xmlPath} not loaded.`);
            return;
        }
        this.currentSet = xmlPath;
        console.log(`Current resource set set to: ${xmlPath}`);
    }

    private parseInformationNodes(xmlDoc: Document, nodeName: string, xmlPath: string): void {
        const nodes = xmlDoc.getElementsByTagName(nodeName);
        for (let i = 0; i < nodes.length; i++) {
            const type = nodes[i].getAttribute("type") || "";
            const elements = nodes[i].children;
            if (!this.resources[xmlPath][type]) {
                this.resources[xmlPath][type] = {};
            }
            for (let j = 0; j < elements.length; j++) {
                const name = elements[j].getAttribute("name") || "";
                const path = elements[j].textContent || "";
                this.resources[xmlPath][type][name] = path;
                console.log(`Loaded resource: ${xmlPath} -> ${type}/${name} -> ${path}`);
            }
        }
    }

    private getSpritePath(type: string, name: string): string {
        if (!this.currentSet) {
            console.error("No resource set currently active.");
            return "";
        }
        const path = this.resources[this.currentSet][type]?.[name] || "";
        if (!path) {
            console.error(`Resource not found: ${this.currentSet} -> ${type}/${name}`);
            console.log("Available resources:", this.resources[this.currentSet]);
        }
        return path;
    }

    public async createSprite(type: string, name: string): Promise<Sprite | null> {
        try {
            const path = this.getSpritePath(type, name);
            if (!path) return null;
            const texture = await Assets.load(path);
            return new Sprite(texture);
        } catch (error) {
            console.error(`Error creating sprite ${type}/${name}:`, error);
            return null;
        }
    }

    public async createSound(type: string, name: string): Promise<Sound | null> {
        try {
            const path = this.getSpritePath(type, name);
            if (!path) return null;
            return Sound.from(path);
        } catch (error) {
            console.error(`Error creating sound ${type}/${name}:`, error);
            return null;
        }
    }

    public async createTexture(type: string, name: string): Promise<Texture | null> {
        try {
            const path = this.getSpritePath(type, name);
            console.log(`Attempting to load texture: ${type}/${name} from path: ${path}`);
            if (!path) return null;
            const texture = await Assets.load(path);
            console.log(`Texture loaded successfully: ${type}/${name}`);
            return texture;
        } catch (error) {
            console.error(`Error creating texture ${type}/${name}:`, error);
            return null;
        }
    }
}
