import { onFrame } from './init.js';

const gamepad = {
	stick: { x: 0, y: 0 },
	accelerate: false,
	brake: false,
	fire: false
};

let inputs = null;
window.addEventListener('gamepadconnected', e => {
	console.log(e.gamepad.id, 'connected');
	if (!inputs) inputs = e.gamepad;
	onFrame(update);
});

function update() {
	const i = navigator.getGamepads()[inputs.index];
	gamepad.stick.x = deadZone(i.axes[0]); // -ve is left here
	gamepad.stick.y = deadZone(i.axes[1]); // -ve is up here
	gamepad.accelerate = i.buttons[0].pressed;
	gamepad.brake = i.buttons[1].pressed;
	gamepad.fire = i.buttons[2].pressed;
	gamepad.y = i.buttons[3].pressed;
}

function deadZone(n) {
	return (Math.abs(n) < 0.05) ? 0 : n;
}

export default gamepad;