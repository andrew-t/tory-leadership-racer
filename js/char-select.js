import activateTheresaMay from './may.js';
import gamepad from './gamepad.js'
import chars from './contenders.js';
import { karts } from './the-grid.js'

function hold() {
	if (gamepad.start) start();
	else requestAnimationFrame(hold);
}
hold();

let startReleased = false, done = false, stickReleased;

function start() {
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
	document.getElementById('character-name').innerHTML = chars[7].name;
	for (let i = 0; i < karts.length; ++i)
		karts[i].updateFilename(`res/${chars[i].filename}.png`);
}

document.addEventListener('DOMContentLoaded', e => {
	document.getElementById('ok-char').addEventListener('click', startRace);
	document.getElementById('prev-char').addEventListener('click', prev);
	document.getElementById('next-char').addEventListener('click', next);
});
