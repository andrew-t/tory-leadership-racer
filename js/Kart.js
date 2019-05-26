import { onFrame } from './init.js'
import { DirectionalSprite } from './Sprite.js';
import { parliamentDistance, parliamentNormal } from './track.js';

const coastFriction = 0.8,
	driftFriction = 0.12;

export default class Kart extends DirectionalSprite {
	constructor() {
		super('res/test-sprite.png', 2, 4);
		this.setSize(2);
		this.position.y = 1;
		this.speed = { x: 0, y: 0 };

		this.drive = 0; // 0 = no acceleration, +ve = forwards, -ve = backwards
		this.brake = 1; // 1 = no brake, 0 = immediate stop
		this.steering = 0; // 0 = no steer, +ve = left, -ve = right
		onFrame((scene, camera, delta) => {
			// acceleration
			this.forward = {
				x: Math.cos(this.angle),
				y: Math.sin(this.angle)
			};
			this.left = { x: -this.forward.y, y: this.forward.x };
			this.speed.x += this.drive * this.forward.x * delta;
			this.speed.y += this.drive * this.forward.y * delta;
			// braking and friction
			this.coast = dot(this.speed, this.forward);
			this.drift = dot(this.speed, this.left);
			if (this.drive == 0) {
				if (Math.abs(this.coast) < 0.01) this.coast = 0;
				if (Math.abs(this.drift) < 0.01) this.drift = 0;
			}
			// console.log('total braking', Math.pow(coastFriction * this.brake, delta))
			this.speed = addVec(
				vecByScal(this.forward,
					this.coast * Math.pow(coastFriction * this.brake, delta)),
				vecByScal(this.left,
					this.drift * Math.pow(driftFriction, delta)));
			// steering - kind of a turning circle but you can also spin slightly on the spot
			this.angle += this.steering * (1 + this.coast);
			// and finally movement
			this.position.x += this.speed.x;
			this.position.z += this.speed.y;

			// oh, and you can hit buildings
			const pos = { x: this.position.x, y: this.position.z };
			const d = parliamentDistance(pos) - 1;
			if (d < 0) this.collide(d, parliamentNormal(pos));
		});
	}

	face(x, y) {
		this.angle = Math.atan2(this.facing.y, this.facing.x);
	}

	collide(d, normal) {
		this.speed.x *= 0.3;
		this.speed.y *= 0.3;
		this.position.x += normal.x * (0.01 - d * 1.5);
		this.position.z += normal.y * (0.01 - d * 1.5);
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
