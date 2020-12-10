import { Sprite } from './Sprite.js';
import { player, karts } from './the-grid.js';
import { onFrame, scene } from './init.js';
import newspaper from './newspaper.js';
import { gameOver } from './may.js';

const leftMeter = document.getElementById('left-wing'),
	rightMeter = document.getElementById('right-wing');

let leaning = 0;

const maxNudge = 2,
      leftBuffer = 2,
	mult = 2;

export function reset() {
	leaning = 0;
}

export default function nudge(d) {
	if (player.active) {
		d *= mult;
		if (d < 0) {
			d += leftBuffer;
			if (d > 0) d = 0;
		}
		if (d > maxNudge) d = maxNudge;
		if (d < -maxNudge) d = -maxNudge;
		leaning += d;
		if (leaning > 100) leaning = 100;
		if (leaning < -100) leaning = -100;
	}
	if (leaning > 0) {
		leftMeter.style.transform = `scale(0, 1)`;
		rightMeter.style.transform = `scale(${ leaning / 100 }, 1)`;
	} else {
		leftMeter.style.transform = `scale(${ leaning / -100 }, 1)`;
		rightMeter.style.transform = `scale(0, 1)`;
	}
}

const ghost = new Sprite('res/jacob.png', 1),
	gPos = new THREE.Vector3();
ghost.setSize(3);
ghost.addToScene(scene);

onFrame(() => {
	const now = Date.now() * 0.0002,
		m = (leaning + 300) / 400;
	if (player.forward)
		ghost.position.set(
			player.position.x * m + player.forward.x * 2 + Math.sin(now) * 0.5,
			Math.sin(now * 0.61) * 0.5 + 1.5,
			player.position.z * m + player.forward.y * 2 + Math.sin(now * 1.61) * 0.5);
	rightMeter.style.opacity = (leaning > 95)
		? Math.sin(Date.now() * 0.01) * 0.5 + 0.5
		: 1;
	leftMeter.style.opacity = (leaning < -95)
		? Math.sin(Date.now() * 0.01) * 0.5 + 0.5
		: 1;
	if (!player.active
		|| karts.every(k => !k.active == !k.isPlayer)
		|| player.bubbleTime)
		return;
	if (leaning > 99)
		player.drive *= 0.3;
	if (leaning < -99) {
		player.active = false;
		gameOver();
		newspaper(`${player.character.name} DRIFTS TOO FAR LEFT AND JOINS CHANGE UK`, 5000);
		document.getElementById('lose-screen').classList.remove('hidden');
	}
});
