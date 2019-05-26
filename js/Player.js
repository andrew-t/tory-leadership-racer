import { scene, onFrame } from './init.js';
import Kart from './Kart.js';
import pad from './gamepad.js';

export default class Player extends Kart {
	constructor() {
		super();
		onFrame((scene, camera, delta) => {
			const moving = this.coast > 0.01,
				reversing = this.coast < -0.01;
			if (reversing) {
				this.drive = pad.brake ? -0.5 : 0;
				this.brake = pad.accelerate ? 0.3 : 1;
			} else if (moving) {
				this.brake = pad.brake ? 0.3 : 1;
				this.drive = pad.accelerate ? 1 : 0;
			} else {
				this.drive = pad.accelerate ? 1 :
					(pad.brake ? -0.5 : 0);
				this.brake = 1;
			}
			this.steering = pad.stick.x * 0.01;
			// position camera 8m behind the player and 3.5m above them,
			// looking at a point 1m above them
			camera.position.subVectors(
				this.position,
				this.driveVector().multiplyScalar(8));
			camera.position.y = 2.5;
			camera.lookAt(this.position);
			camera.position.y += 1;
		});

	}
}
