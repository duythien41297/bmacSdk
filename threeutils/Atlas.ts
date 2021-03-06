
import { ThreeManager } from "./";

export class Atlas
{
	public isAtlas: boolean = true;
	public url: string;
	public width: number;
	public height: number;
	
	public sprites: any[];
	public texture: THREE.Texture;
	public material: THREE.Material;

	/**
	 * Creates a new atlas.
	 * @class
	 * @param {string} url The url of the atlas image.
	 * @param {number} width The pixel width of the image. //TODO: don't require this
	 * @param {number} height The pixel height of the image. //TODO: don't require this
	 * @param {Object} sprites The atlas key data.
	 * @param {boolean} suppressTextureLoad If set, does not automatically load the texture.
	 */
	constructor(private threeMananger : ThreeManager, data, suppressTextureLoad?: boolean)
	{
		this.url = data.url;
		this.width = data.width;
		this.height = data.height;
		this.sprites = data.sprites;
		if (!suppressTextureLoad)
		{
			this.texture = this.threeMananger.loadTexture(this.url);
			//this.texture.minFilter = this.texture.magFilter = data.filter;
			this.threeMananger.setTextureNpot(this.texture);
		}
	}

	/**
	 * Returns the width of the given sprite in the atlas.
	 * @param {string} key The sprite key.
	 * @returns {number}
	 */
	public getSpriteWidth(key: string): number
	{
		return this.sprites[key][2];
	}

	/**
	 * Returns the height of the given sprite in the atlas.
	 * @param {string} key The sprite key.
	 * @returns {number}
	 */
	public getSpriteHeight(key: string): number
	{
		return this.sprites[key][3];
	}
}
