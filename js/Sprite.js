import { onFrame } from './init.js';

const textureLoader = new THREE.TextureLoader(),
	dir = new THREE.Vector3(),
	tau = Math.PI * 2;

export class Sprite {
	constructor(filename, sheetSize = 1) {
		this.map = textureLoader.load(filename);
		this.map.wrapS = THREE.RepeatWrapping;
		this.map.wrapT = THREE.RepeatWrapping;
		this.material = new THREE.SpriteMaterial(
			{ map: this.map, color: 0xffffff, fog: false });
		this.sprite = new THREE.Sprite(this.material);
		this.sheetSize = sheetSize;
		this.map.repeat.set(1 / sheetSize, 1 / sheetSize);
		this.mirror = false;
		this.size = 1;
	}

	setSize(size) {
		this.sprite.scale.set(size, size, 1);
	}

	setSprite(n, flip) {
		this.setSprite2(
			n % this.sheetSize,
			this.flipSpriteId(n / this.sheetSize),
			flip);
	}

	flipSpriteId(n) { return this.sheetSize +~ n; }

	setSprite2(x, y, flip) {
		this.map.offset.set(
			(flip ? this.flipSpriteId(x) : ~~x) / this.sheetSize,
			~~y / this.sheetSize);
		this.map.repeat.set((flip ? -1 : 1) / this.sheetSize, 1 / this.sheetSize);
	}

	addToScene(scene) {
		scene.add(this.sprite);
	}

	get position() { return this.sprite.position; }
	set position(p) { return this.sprite.position = p; }
}

export class DirectionalSprite extends Sprite {
	// a really bad sprite might have spriteCount = 3
	// that would be forwards, backwards and right
	// (left being made by mirroring right)
	// and that would require a sheetSize of 2 to fit them all in
	// (leaving one quarter of the sheet blank)
	constructor(filename, sheetSize, spriteCount) {
		super(filename, sheetSize);
		this.angle = 0;
		const lastSprite = spriteCount - 1;
		onFrame((scene, camera) => {
			const cameraDirection = dir.set(0, 0, -1)
					.applyMatrix4(camera.matrixWorld)
					.sub(camera.position),
				cameraAngle = Math.atan2(cameraDirection.z, cameraDirection.x),
				fract = ((this.angle - cameraAngle) / Math.PI + 4) % 2,
				mirror = (fract > 1),
				n = Math.round(Math.abs(1 - fract) * lastSprite);
			this.setSprite(n, mirror);
		});
	}
}
