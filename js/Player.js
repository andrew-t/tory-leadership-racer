import { scene, onFrame, beforeFrame } from './init.js';
import Kart from './Kart.js';
import pad from './gamepad.js';
import { parliamentDistance } from './track.js';
import adjustLeaning from './leaning.js';

const acceleration = 0.6,
	reverseAcceleration = -0.3,
	brakePower = 0.1,
	steer = 0.008,
	yAxis = new THREE.Vector3(0, 1, 0);

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
		this.isPlayer = true;
		this.accelerateButton = new Button(this);
		this.brakeButton = new Button(this);
		this.fireButton = new Button(this);
		this.yButton = new Button(this);
		this.stillFrames = 0;

		beforeFrame((scene, camera, delta) => {
			if (this.coast > 0.01 || this.coast < -0.01)
				this.stillFrames = 0;
			else if (++this.stillFrames > 2) {
				this.moving = false;
				this.reversing = false;
				this.collidedSinceHalt = false;
			}
			this.accelerateButton.update(pad.accelerate);
			this.brakeButton.update(pad.brake);
			this.fireButton.update(pad.fire);
			this.yButton.update(pad.y);

			if (this.moving) {
				this.brake = this.brakeButton.pressed ? brakePower : 1;
				this.drive = this.accelerateButton.pressed ? acceleration : 0;
			} else if (this.reversing) {
				this.drive = this.brakeButton.pressed ? reverseAcceleration : 0;
				this.brake = this.accelerateButton.pressed ? brakePower : acceleration;
			} else {
				if (this.accelerateButton.pressed
					&& !this.accelerateButton.movingWhenPressed
					&& !this.accelerateButton.reversingWhenPressed) {
					this.drive = acceleration;
					this.moving = true;					
				}
				else if (this.brakeButton.pressed
					&& !this.brakeButton.movingWhenPressed
					&& !this.brakeButton.reversingWhenPressed) {
					this.drive = reverseAcceleration;
					this.reversing = true;
				}
				else {
					this.drive = 0;
					this.brake = 1;
				}
			}

			if (pad.y && !this.lastY)
				console.log(this.position.x, this.position.z);

			this.lastAccelerate = pad.accelerate;
			this.lastBrake = pad.brake;
			this.lastFire = pad.fire;
			this.lastY = pad.y;

			this.steering = pad.stick.x * steer;
			if (this.active) this.setCamera(camera);

			const d = parliamentDistance({ x: this.position.x, y: this.position.z });
			// console.log('Current distance:', d);
			adjustLeaning((23 - d) * delta);
		});

	}

	setCamera(camera) {
		// position camera 8m behind the player and 3.5m above them,
		// looking at a point 1m above them
		camera.position.subVectors(
			this.position,
			this.driveVector()
				.applyAxisAngle(yAxis,
					Math.abs(pad.camStick.x) > 0.05 ? pad.camStick.x * 5 : 0)
				.multiplyScalar(8));
		camera.position.y = 2.5;
		camera.lookAt(this.position);
		camera.position.y += 1;
	}
}
