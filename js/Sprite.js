import { onFrame } from './init.js';

const textureLoader = new THREE.TextureLoader(),
	dir = new THREE.Vector3(),
	tau = Math.PI * 2;

export class Sprite {
	constructor(filename, sheetSize = 1) {
		this.updateFilename(filename);
		this.sheetSize = sheetSize;
		this.map.repeat.set(1 / sheetSize, 1 / sheetSize);
		this.mirror = false;
		this.size = 1;
		this.zOffset = 0;
		this.position = new THREE.Vector3(0, 0, 0);
		onFrame((scene, camera) => {
			dir.copy(getCameraDirection(camera))
				.multiplyScalar(this.size * 0.5 + this.zOffset);
			dir.setY(dir.y * 0.25);
			this.sprite.position.subVectors(this.position, dir);
		});
	}

	setSize(size) {
		this.size = size;
		this.sprite.scale.set(size * 1.25, size * 1.25, 1);
	}

	setSprite(n, flip) {
		this.setSprite2(
			n % this.sheetSize,
			this.sheetSize +~(n / this.sheetSize),
			flip);
	}

	setSprite2(x, y, flip) {
		this.map.offset.set(
			(flip ? -~x : ~~x) / this.sheetSize,
			~~y / this.sheetSize);
		this.map.repeat.set((flip ? -1 : 1) / this.sheetSize, 1 / this.sheetSize);
	}

	addToScene(scene) {
		this.scene = scene;
		scene.add(this.sprite);
	}
	removeFromScene(scene) {
		scene.remove(this.sprite);
	}

	updateFilename(filename) {
		this.map = textureLoader.load(filename);
		this.map.wrapS = THREE.RepeatWrapping;
		this.map.wrapT = THREE.RepeatWrapping;
		this.material = new THREE.SpriteMaterial(
			{ map: this.map, color: 0xffffff, fog: false });
		if (!this.sprite) this.sprite = new THREE.Sprite(this.material);
		else this.sprite.material = this.material;
	}
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
		this.steering = 0; // 0 = no steer, +ve = left, -ve = right
		this.steerSpriteEffect = 25;
		onFrame((scene, camera) => {
			const cameraDirection = getCameraDirection(camera),
				cameraAngle = Math.atan2(cameraDirection.z, cameraDirection.x),
				fract = ((this.angle + this.steering * this.steerSpriteEffect - cameraAngle) / Math.PI + 4) % 2,
				mirror = (fract > 1),
				n = Math.round(Math.abs(1 - fract) * lastSprite);
			// if (this.isPlayer) console.log(n, mirror, fract)
			this.setSprite(n, mirror);
		});
	}
}

function getCameraDirection(camera) {
	return dir.set(0, 0, -1)
		.applyMatrix4(camera.matrixWorld)
		.sub(camera.position)
}