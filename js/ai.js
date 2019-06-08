import { onFrame } from './init.js';
import { simpleParliamentDistance, simpleParliamentNormal } from './track.js';
import Kart from './Kart.js';
import options from './options.js';
import cheats from './cheats.js';

options.acceleration = 1.3; // faster than player kart
const reverseAcceleration = -0.5, // reverse faster than player kart
	brakePower = 0.02, // stop faster than player kart
	steer = 0.03, // handle better than player kart
	tau = Math.PI * 2; // bigger circle constant than player kart

options.aiPrefSpeed = 2.5;

export default class Enemy extends Kart {
	constructor() {
		super();
		this.preferredDistance = Math.random() * 15 + 5;
		this.lookAheadDistance = Math.random() * 15 + 5;
		this.preferredSpeedSquared = Math.random() * options.aiPrefSpeed + 1;
		if (cheats.meowmeowkart) {
			this.preferredSpeedSquared = this.preferredSpeedSquared * 3 - 3;
			this.stonedSteering = (Math.random() * 2 - 1) * steer;
		}
		this.preferredCorneringSpeedSquared = Math.random() * 1.5 + 0.8;
		this.steeriness = Math.random() * 0.6 + 0.2;
		this.steerSpriteEffect = 0;

		onFrame(() => {
			const pos = { x: this.position.x, y: this.position.z },
				left = simpleParliamentNormal(pos),
				forwards = { x: -left.y, y: left.x },
				soonPos = { x: pos.x + forwards.x * this.lookAheadDistance,
					y: pos.y + forwards.y * this.lookAheadDistance },
				distance = simpleParliamentDistance(soonPos),
				dDistance = this.preferredDistance - distance,
				speedSquared = this.speed.x * this.speed.x
					+ this.speed.y * this.speed.y;
			let desiredAngle = Math.atan2(forwards.y, forwards.x);
			if (dDistance < -10) desiredAngle += 0.5;
			else if (dDistance > 5) desiredAngle -= 0.3;
			else desiredAngle -= dDistance * 0.2;
			const dTheta = (desiredAngle - this.angle + tau * 5.5) % tau - Math.PI;
			this.steering = dTheta * this.steeriness;
			if (cheats.meowmeowkart) this.steering = this.stonedSteering;
			// while (this.steering < Math.PI) this.steering += tau;
			// this.steering %= tau;
			this.drive = speedSquared < this.preferredSpeedSquared
				? options.acceleration : 0;
			this.brake = 1;
			if (this.steering > steer) {
				this.steering = steer;
				if (speedSquared > this.preferredCorneringSpeedSquared) {
					this.drive = 0;
					this.brake = brakePower;
				}
			} else if (this.steering < -steer) {
				this.steering = -steer;
				if (speedSquared > this.preferredCorneringSpeedSquared) {
					this.drive = 0;
					this.brake = brakePower;
				}
			}
			// hack to stop them getting caught on corners
			if (distance < 2) {
				this.position.x += left.x;
				this.position.z += left.y;
			}
		});
	}
}
