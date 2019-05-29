import { onFrame } from './init.js';

const gamepad = {
	stick: { x: 0, y: 0 },
	camStick: { x: 0, y: 0 },
	accelerate: false,
	brake: false,
	fire: false
};

const heldKeys = new Set();
window.addEventListener('keydown', e => heldKeys.add(e.key));
window.addEventListener('keyup', e => heldKeys.delete(e.key));

let inputs = null;
window.addEventListener('gamepadconnected', e => {
	console.log(e.gamepad.id, 'connected');
	if (!inputs) inputs = e.gamepad;
});
onFrame(update);

const dummyPad = { axes: [0, 0, 0, 0], buttons: [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ] };

function update() {
	const i = inputs
		? navigator.getGamepads()[inputs.index]
		: dummyPad;
	gamepad.stick.x =
		heldKeys.has('A') ? -1
		: heldKeys.has('D') ? 1
		: deadZone(i.axes[0]); // -ve is left here
	gamepad.stick.y = deadZone(i.axes[1]); // -ve is up here
	gamepad.camStick.x = deadZone(i.axes[2]); // -ve is left here
	gamepad.camStick.y = deadZone(i.axes[3]); // -ve is up here
	gamepad.accelerate = i.buttons[0].pressed || heldKeys.has('Shift');
	gamepad.brake = i.buttons[1].pressed || heldKeys.has('S');
	gamepad.fire = i.buttons[2].pressed;
	gamepad.y = i.buttons[3].pressed;
	gamepad.start = i.buttons[9].pressed || heldKeys.has(' ');
	gamepad.raw = i;
}

function deadZone(n) {
	return (Math.abs(n) < 0.05) ? 0 : n;
}

export default gamepad;
