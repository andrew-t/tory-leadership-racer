import { scene, onFrame } from './init.js';
import Kart from './Kart.js';
import pad from './gamepad.js';

const acceleration = 1,
	reverseAcceleration = -0.5,
	brakePower = 0.1;

class Button {
	constructor(player) {
		this.player = player;
		this.pressed = false;
		this.pressedLastFrame = false;
	}

	update(pressed) {
		this.pressedLastFrame = this.pressed;
		this.pressed = pressed;
		if (this.pressed && !this.pressedLastFrame) {
			this.movingWhenPressed = this.player.moving;
			this.reversingWhenPressed = this.player.reversing;
		}
	}
}

export default class Player extends Kart {
	constructor() {
		super();

		this.accelerateButton = new Button(this);
		this.brakeButton = new Button(this);
		this.fireButton = new Button(this);
		this.yButton = new Button(this);

		onFrame((scene, camera, delta) => {
			this.moving = this.coast > 0.01;
			this.reversing = this.coast < -0.01;
			this.accelerateButton.update(pad.accelerate);
			this.brakeButton.update(pad.brake);
			this.fireButton.update(pad.fire);
			this.yButton.update(pad.y);

			if (this.reversing) {
				this.drive = this.brakeButton.pressed ? reverseAcceleration : 0;
				this.brake = this.accelerateButton.pressed ? brakePower : acceleration;
			} else if (this.moving) {
				this.brake = this.brakeButton.pressed ? brakePower : 1;
				this.drive = this.accelerateButton.pressed ? acceleration : 0;
			} else {
				if (this.accelerateButton.pressed
					&& !this.accelerateButton.movingWhenPressed
					&& !this.accelerateButton.reversingWhenPressed)
					this.drive = acceleration;
				else if (this.brakeButton.pressed
					&& !this.brakeButton.movingWhenPressed
					&& !this.brakeButton.reversingWhenPressed)
					this.drive = reverseAcceleration;
				else this.drive = 0;
				this.brake = 1;
			}

			if (pad.y && !this.lastY)
				console.log(this.position.x, this.position.z);

			this.lastAccelerate = pad.accelerate;
			this.lastBrake = pad.brake;
			this.lastFire = pad.fire;
			this.lastY = pad.y;

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
