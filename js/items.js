import { Sprite } from './Sprite.js';
import { onFrame, removeFrameListener, scene } from './init.js';
import { karts } from './the-grid.js';
import { distanceSquared } from './trees.js';
import { addVec, vecByScal, dot } from './Kart.js';
import { parliamentDistance, parliamentNormal } from './track.js';

export class BananaPeel extends Sprite {
	constructor(filename, owner) {
		super(filename, 1);
		this.size = 1.5;
		this.addToScene(scene);
		this.selfActivationTime = Date.now() + 1000;

		this.destroy = () => {
			this.removeFromScene(scene);
			removeFrameListener(_onFrame);
		};
		const _onFrame = (scene, camera, delta) => {
			this.onFrame(delta);
			for (const kart of karts) {
				if (kart == owner && Date.now() < this.selfActivationTime)
					continue;
				const { d2 } = distanceSquared(kart, this);
				if (d2 < 4) {
					console.log('Item hit', kart.character.name);
					kart.itemHit();
					this.destroy();
				}
			}
			const pos = { x: this.position.x, y: this.position.z },
				d = parliamentDistance(pos);
			if (d < 0) this.onHitParliament(pos, d);
		};
		onFrame(_onFrame);
	}

	// abstract:
	onFrame() {}
	onHitParliament() { this.destroy(); }
}

class GreenShell extends BananaPeel {
	constructor(filename, speed, kart, bouncy) {
		super(filename, kart);
		this.speed = speed;
		this.bouncy = bouncy;
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

	onHitParliament(pos, d) {
		if (this.bouncy) {
			const n = parliamentNormal(pos);
			this.speed = addVec(this.speed,
				vecByScal(n, dot(this.speed, n) * -2));
			this.position.x += n.x * 0.2;
			this.position.z += n.y * 0.2;
		} else this.destroy();
	}
}

export function milkshake(kart) {
	new GreenShell('res/milkshake3.png',
		addVec(kart.speed, vecByScal(kart.forward, 20)),
		kart, false);
}

export function cannonade(kart) {
	new GreenShell('res/cannonball.png',
		addVec(kart.speed, vecByScal(kart.left, 10)),
		kart, true);
	new GreenShell('res/cannonball.png',
		addVec(kart.speed, vecByScal(kart.left, -10)),
		kart, true);
}

export class BlueShell extends BananaPeel {
	constructor(kart) {
		super('res/blue-shell.png');
		this.frame = delta => {

		};
	}
}
