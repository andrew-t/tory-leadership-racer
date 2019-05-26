import { onFrame } from './init.js'
import { DirectionalSprite } from './Sprite.js';

const coastFriction = 0.999,
	driftFriction = 0.950;

export default class Kart extends DirectionalSprite {
	constructor() {
		super('res/test-sprite.png', 2, 4);
		this.setSize(20);
		this.position.y = 10;
		this.speed = { x: 0, y: 0 };

		this.drive = 0; // 0 = no acceleration, +ve = forwards, -ve = backwards
		this.brake = 1; // 1 = no brake, 0 = immediate stop
		this.steering = 0; // 0 = no steer, +ve = left, -ve = right
		onFrame((scene, camera, delta) => {
			// acceleration
			const forward = {
					x: Math.cos(this.angle),
					y: Math.sin(this.angle)
				},
				left = { x: -forward.y, y: forward.x };
			this.speed.x += this.drive * forward.x * delta;
			this.speed.y += this.drive * forward.y * delta;
			// braking and friction
			const coast = dot(this.speed, forward),
				drift = dot(this.speed, left);
			this.speed = addVec(
				vecByScal(forward,
					coast * Math.pow(coastFriction * this.brake, delta)),
				vecByScal(left,
					drift * Math.pow(driftFriction, delta)));
			// steering
			this.angle += this.steering * coast;
		});
	}

	face(x, y) {
		this.angle = Math.atan2(this.facing.y, this.facing.x);
	}

	driveVector() {
		return new THREE.Vector3(
			Math.cos(this.angle),
			0,
			Math.sin(this.angle)
		);
	}
}

function dot(a, b) {
	return a.x * b.x + a.y * b.y;
}
function vecByScal(v, s) {
	return { x: v.x * s, y: v.y * s };
}
function addVec(a, b) {
	return { x: a.x + b.x, y: a.y + b.y };
}