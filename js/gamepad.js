import { onFrame } from './init.js';

const gamepad = {
	stick: { x: 0, y: 0 },
	camStick: { x: 0, y: 0 },
	accelerate: false,
	brake: false,
	fire: false
};

const heldKeys = new Set();
window.addEventListener('keydown', e => heldKeys.add(e.key.toUpperCase()));
window.addEventListener('keyup', e => heldKeys.delete(e.key.toUpperCase()));
window.addEventListener('keypress', e => e.preventDefault());

const touches = new Map(),
	touchControls = {
		left: false, right: false,
		gas: false, brake: false
	},
	touchEls = [];
document.addEventListener('DOMContentLoaded', e => {
	const c = document.getElementById('touch-controls');
	touchEls.push(document.getElementById('left'));
	touchEls.push(document.getElementById('right'));
	touchEls.push(document.getElementById('gas'));
	touchEls.push(document.getElementById('brake'));
	c.addEventListener('touchstart', updateTouch);
	c.addEventListener('touchmove', updateTouch);
	c.addEventListener('touchend', endTouch);
	c.addEventListener('touchcancel', endTouch);
	function updateTouch(e) {
		for (const t of e.changedTouches)
			touches.set(t.identifier, t);
		updateTouchControls();
	}
	function endTouch(e) {
		for (const t of e.changedTouches)
			touches.delete(t.identifier);
		updateTouchControls();
	}
});
function updateTouchControls() {
	touchControls.left = false;
	touchControls.right = false;
	touchControls.gas = false;
	touchControls.brake = false;
	for (const el of touchEls) el.classList.remove('active');
	for (const t of touches.values()) {
		console.log(t)
		const el = document.elementFromPoint(t.pageX, t.pageY);
		console.log(el)
		if (el && touchControls.hasOwnProperty(el.id)) {
			touchControls[el.id] = true;
			el.classList.add('active');
		}
	}
}

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
		(heldKeys.has('A') || touchControls.left) ? -1
		: (heldKeys.has('D') || touchControls.right) ? 1
		: deadZone(i.axes[0]); // -ve is left here
	gamepad.stick.y = deadZone(i.axes[1]); // -ve is up here
	gamepad.camStick.x = deadZone(i.axes[2]); // -ve is left here
	gamepad.camStick.y = deadZone(i.axes[3]); // -ve is up here
	gamepad.accelerate = i.buttons[0].pressed || heldKeys.has('SHIFT') || touchControls.gas;
	gamepad.brake = i.buttons[1].pressed || heldKeys.has('S') || touchControls.brake;
	gamepad.fire = i.buttons[2].pressed;
	gamepad.y = i.buttons[3].pressed;
	gamepad.start = i.buttons[9].pressed || heldKeys.has(' ') || touchControls.gas;
	gamepad.raw = i;
}

function deadZone(n) {
	return (Math.abs(n) < 0.05) ? 0 : n;
}

export default gamepad;
