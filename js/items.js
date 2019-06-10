import { Sprite } from './Sprite.js';
import { onFrame, removeFrameListener, scene } from './init.js';
import { karts } from './the-grid.js';
import { distanceSquared } from './trees.js';
import { addVec, vecByScal, dot } from './Kart.js';

export class BananaPeel extends Sprite {
	constructor(filename, owner) {
		super(filename, 1);
		this.size = 1.5;
		this.addToScene(scene);
		this.selfActivationTime = Date.now() + 1000;
		const _onFrame = (scene, camera, delta) => {
			this.onFrame(delta);
			for (const kart of karts) {
				if (kart == owner && Date.now() < this.selfActivationTime)
					continue;
				const { d2 } = distanceSquared(kart, this);
				if (d2 < 4) {
					console.log('Item hit', kart.character.name);
					kart.itemHit();
					this.removeFromScene(scene);
					removeFrameListener(_onFrame);
				}
			}
			// TODO: collisions with Parliament and the edge
		};
		onFrame(_onFrame);
	}

	onFrame() {} // abstract
}

class GreenShell extends BananaPeel {
	constructor(filename, speed, kart) {
		super(filename, kart);
		this.speed = speed;
		const s = 2 / Math.sqrt(dot(speed, speed));
		this.position.set(
			kart.position.x + speed.x * s,
			1,
			kart.position.z + speed.y * s);
	}

	onFrame(delta) {
		this.position.x += this.speed.x * delta;
		this.position.z += this.speed.y * delta;
	}
}

export function milkshake(kart) {
	new GreenShell('res/milkshake3.png',
		addVec(kart.speed, vecByScal(kart.forward, 5)),
		kart);
}

export function cannonade(kart) {
	new GreenShell('res/cannonball.png',
		addVec(kart.speed, vecByScal(kart.left, 2)),
		kart);
	new GreenShell('res/cannonball.png',
		addVec(kart.speed, vecByScal(kart.left, -2)),
		kart);
}

export class BlueShell extends BananaPeel {
	constructor(kart) {
		super('res/blue-shell.png');
		this.frame = delta => {

		};
	}
}
