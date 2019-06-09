import activateTheresaMay from './may.js';
import gamepad from './gamepad.js'
import chars from './contenders.js';
import { karts, player } from './the-grid.js';
import { camera } from './init.js';

let startReleased = false, done = false, stickReleased;

export function start() {
	if (document.readyState != 'complete') return;
	document.body.classList.remove('splash');
	document.body.classList.add('char-select');
	updateDom();
	update();
}

function update() {
	if (!gamepad.start) startReleased = true;
	if (startReleased && gamepad.start) startRace();
	else if (!done) requestAnimationFrame(update);

	if (Math.abs(gamepad.stick.x) < 0.5) stickReleased = true;
	if (stickReleased && gamepad.stick.x < -0.9) {
		prev(); stickReleased = false;
	}
	if (stickReleased && gamepad.stick.x > 0.9) {
		next(); stickReleased = false;
	}
	player.setCamera(camera);
}

function startRace() {
	done = true;
	activateTheresaMay();
}

function prev() {
	chars.push(chars.shift());
	updateDom();
}
function next() {
	chars.unshift(chars.pop());
	updateDom();
}

function updateDom() {
	document.getElementById('character-name').innerHTML = chars[karts.length - 1].name;
	for (let i = 0; i < karts.length; ++i) {
		karts[i].updateFilename(`res/${chars[i].filename}.png`);
		karts[i].character = chars[i];
	}
}

document.addEventListener('DOMContentLoaded', e => {
	document.getElementById('ok-char').addEventListener('click', startRace);
	document.getElementById('prev-char').addEventListener('click', prev);
	document.getElementById('next-char').addEventListener('click', next);
});
