import { onFrame } from './init.js';
import { simpleParliamentDistance, simpleParliamentNormal } from './track.js';
import Kart from './Kart.js';

const acceleration = 1.5, // faster than player kart
	reverseAcceleration = -0.5,
	brakePower = 0.02, // stop faster than player kart
	steer = 0.03, // handle better than player kart
	tau = Math.PI * 2;

export default class Enemy extends Kart {
	constructor() {
		super();
		this.preferredDistance = Math.random() * 10 + 20;
		onFrame(() => {
			const pos = { x: this.position.x, y: this.position.z },
				left = simpleParliamentNormal(pos),
				forwards = { x: -left.y, y: left.x },
				distance = simpleParliamentDistance(pos),
				dDistance = this.preferredDistance - distance,
				speedSquared = this.speed.x * this.speed.x
					+ this.speed.y * this.speed.y;
			let desiredAngle = Math.atan2(forwards.y, forwards.x);
			if (dDistance < -10) desiredAngle += 0.5;
			else if (dDistance > 5) desiredAngle -= 0.3;
			else desiredAngle -= dDistance * 0.2;
			const dTheta = (desiredAngle - this.angle + tau * 5.5) % tau - Math.PI;
			this.steering = dTheta * 0.5;
			// while (this.steering < Math.PI) this.steering += tau;
			// this.steering %= tau;
			this.drive = speedSquared < 0.4 ? acceleration : 0;
			this.brake = 1;
			if (this.steering > steer) {
				this.steering = steer;
				if (speedSquared > 0.4) {
					this.drive = 0;
					this.brake = brakePower;
				}
			} else if (this.steering < -steer) {
				this.steering = -steer;
				if (speedSquared > 0.4) {
					this.drive = 0;
					this.brake = brakePower;
				}
			}
			// console.log({
			// 	// distance, desiredDistance: this.preferredDistance,
			// 	// angle: this.angle, desiredAngle,
			// 	dDistance, dTheta,
			// 	steering: this.steering,
			// 	drive: this.drive,
			// 	brake: this.brake
			// })
		});
	}
}
