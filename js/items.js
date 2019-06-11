import { Sprite } from './Sprite.js';
import { onFrame, removeFrameListener, scene } from './init.js';
import { karts } from './the-grid.js';
import { distanceSquared } from './trees.js';
import { addVec, vecByScal, dot } from './Kart.js';
import { parliamentDistance, parliamentNormal } from './track.js';

const tau = Math.PI * 2;

export class BananaPeel extends Sprite {
	constructor(filename, owner) {
		super(filename, 1);
		this.size = 1.5;
		this.addToScene(scene);
		this.owner = owner;
		this.selfActivationTime = Date.now() + 1000;
		this.position.copy(owner.position);

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
					console.log(owner.character.name + '\'s item hit',
						kart.character.name);
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
		super('res/blue-shell.png', kart);
	}

	onFrame(delta) {
		const lastKart = karts
				.map(k => ({
					kart: k,
					pos: k.lastTheta + k.laps - k.unlaps
				}))
				.reduce((p, n) => (n.pos < p.pos) ? n : p)
				.kart,
			theta = ((Math.atan2(this.position.z, this.position.x) + tau) / tau) % 1,
			diff = ((lastKart.lastTheta - theta) + 1) % 1;
			if (diff > 0.2 && diff < 0.95) {
				// shell and player aren't too close, just zoom round the track
				const pos = { x: this.position.x, y: this.position.z },
					left = parliamentNormal(pos),
					forwards = { x: -left.y, y: left.x };
				this.position.x += forwards.x * delta * 40;
				this.position.z += forwards.y * delta * 40;
			} else {
				// shell's pretty near to player, just home in
				const { dx, dy, d2 } = distanceSquared(this, lastKart),
					d = Math.sqrt(d2);
				this.position.x += dx * 40 / d;
				this.position.z += dy * 40 / d;
			}
	}

	onHitParliament(pos, d) {
		const n = parliamentNormal(pos);
		this.position.x += n.x * 0.2;
		this.position.z += n.y * 0.2;
	}
}
