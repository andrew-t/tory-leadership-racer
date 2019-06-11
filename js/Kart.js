import { onFrame } from './init.js';
import { Sprite, DirectionalSprite } from './Sprite.js';
import {
	parliamentDistance, parliamentNormal,
	simpleParliamentDistance, simpleParliamentNormal
} from './track.js';
import contenders from './contenders.js';

const coastFriction = 0.8,
	driftFriction = 0.12,
	tau = Math.PI * 2,
	spinOutDuration = 2,
	spinOutRotations = 3;

let nextCharacter = 0;

function currentCharacter() {
	return contenders[nextCharacter % contenders.length];
}

export default class Kart extends DirectionalSprite {
	constructor() {
		super(`res/${currentCharacter().filename}.png`, 3, 9);
		this.character = currentCharacter();
		++nextCharacter;
		this.setSize(2);
		this.position.y = 1;
		this.speed = { x: 0, y: 0 };

		this.bubbleTime = 0;
		this.bubbleSprite = new Sprite('res/bubble.png', 1);
		this.bubbleSprite.setSize(3);
		this.spinOutTime = 0;

		this.active = false;

		this.lapListeners = [];
		this.unlaps = 1; // cross the start line once to start lap 1
		this.laps = 0;
		this.lastTheta = 0.9; // you start just behind the line

		this.drive = 0; // 0 = no acceleration, +ve = forwards, -ve = backwards
		this.brake = 1; // 1 = no brake, 0 = immediate stop
		// also this.steering

		onFrame((scene, camera, delta) => {
			if (this.bubbleTime < delta) this.bubbleTime = 0;
			else this.bubbleTime -= delta;
			if (this.spinOutTime < delta) this.spinOutTime = 0;
			else this.spinOutTime -= delta;

			// acceleration
			this.forward = {
				x: Math.cos(this.angle),
				y: Math.sin(this.angle)
			};
			this.left = { x: -this.forward.y, y: this.forward.x };
			if (this.active && !this.spinOutTime) {
				this.speed.x += this.drive * this.forward.x * delta;
				this.speed.y += this.drive * this.forward.y * delta;
			}
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
			if (this.active && !this.spinOutTime)
				this.angle += this.steering * (1 + this.coast / 60);
			// and finally movement
			this.lastSpeed = this.speed;
			this.position.x += this.speed.x * delta;
			this.position.z += this.speed.y * delta;

			if (this.spinOutTime)
				this.steering = (this.spinOutTime / spinOutDuration)
					* tau * spinOutRotations / this.steerSpriteEffect;

			// oh, and you can hit buildings
			const pos = { x: this.position.x, y: this.position.z };
			const d = parliamentDistance(pos) - 1;
			if (d < 0) this.collide(d, parliamentNormal(pos));

			// imaginary outer-building!
			const d2 = 40 - simpleParliamentDistance(pos);
			if (d2 < 0) this.collide(d2, neg(simpleParliamentNormal(pos)));

			// bubble sprite
			this.bubbleSprite.position.set(
				this.position.x,
				this.bubbleTime > 0 ? this.position.y : -200,
				this.position.z);

			const theta = ((Math.atan2(this.position.z, this.position.x) + tau) / tau) % 1;
			if ((this.lastTheta > 0.8 || this.lastTheta < 0.2) &&
				(theta > 0.8 || theta < 0.2)) {
				// we're somewhere near the finish line
				if (this.lastTheta > 0.5 && theta < 0.5) {
					if (this.unlaps) {
						--this.unlaps;
						console.log('Did a lap but didn’t count it. You now owe',
							this.unlaps, 'laps');
					} else {
						++this.laps;
						this.lapListeners.forEach(l => l(this.laps));
						console.log('Did a lap!');
					}
				} else if (this.lastTheta < 0.5 && theta > 0.5) {
					++this.unlaps;
					console.log('Did a lap backwards. You now owe',
						this.unlaps, 'laps');
				}
			}
			this.lastTheta = theta;
		});
	}

	addToScene(scene) {
		super.addToScene(scene);
		this.bubbleSprite.addToScene(scene);
	}

	face(x, y) {
		this.angle = Math.atan2(this.facing.y, this.facing.x);
	}

	collide(d, normal) {
		const abnormal = { x: normal.y, y: -normal.x },
			glance = dot(this.speed, abnormal),
			headOn = dot(this.speed, normal);
		this.speed = addVec(
			vecByScal(abnormal, glance * 0.8),
			vecByScal(normal, headOn * -0.4));
		this.position.x -= normal.x * (0.0 + d * 1.05);
		this.position.z -= normal.y * (0.0 + d * 1.05);
	}

	driveVector() {
		return new THREE.Vector3(
			Math.cos(this.angle),
			0,
			Math.sin(this.angle)
		);
	}

	onLap(cb) {
		this.lapListeners.push(cb);
	}

	itemHit() {
		console.log(this.character.name, 'is out for a spin!');
		this.speed = vecByScal(this.speed, 0.2);
		this.spinOutTime = spinOutDuration;
	}
}

export function dot(a, b) {
	return a.x * b.x + a.y * b.y;
}
export function vecByScal(v, s) {
	return { x: v.x * s, y: v.y * s };
}
export function addVec(a, b) {
	return { x: a.x + b.x, y: a.y + b.y };
}
export function neg(v) {
	return { x: -v.x, y: -v.y };
}
