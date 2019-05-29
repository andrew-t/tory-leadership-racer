import { Sprite } from './Sprite.js';
import newspaper from './newspaper.js';
import { karts } from './the-grid.js';
import { scene } from './init.js';
import gamepad from './gamepad.js'

newspaper('THERESA MAY RESIGNS, IDIOT MAKES GAME');

function hold() {
	if (gamepad.start) start();
	else {
		// if (gamepad.raw) console.log(gamepad.raw.buttons.map(i => i.pressed));
		requestAnimationFrame(hold);
	}
}
hold();

const may = new Sprite('res/may.png', 2);
may.setSize(4);
may.position.set(90, 2, -5);
may.addToScene(scene);
may.setSprite(0);

const hanky = new Sprite('res/hanky.png', 1);
hanky.setSize(0.5);
hanky.addToScene(scene);

const music = new Audio('res/music.mp3');

function start() {
	console.log('Starting');
	let i, start;
	newspaper('THERESA MAY TO GIVE SPEECH OUTSIDE PARLIAMENT');
	setTimeout(() => may.setSprite(2), 2500);
	setTimeout(() => may.setSprite(1), 3500);
	setTimeout(() => {
		may.setSprite(3);
		hanky.position.set(90.5, 4, -5.05);
		start = Date.now();
		i = setInterval(() => {
			const t = (Date.now() - start) / 2000,
				theta = t * Math.PI * 2;
			hanky.position.set(90.5 + Math.sin(theta),
				4 - 1.5 * t - (1 - Math.abs(Math.sin(theta))) * 0.5,
				-5.05);
			hanky.setSprite(0, (t * 8) % 1 > 0.5);
		});
	}, 4000);
	setTimeout(() => may.setSprite(0), 5000);
	setTimeout(() => {
		karts.forEach(k => k.active = true);
		clearInterval(i);
		hanky.position.set(90.5, 0.25, -5.05);
		music.play();
	}, 8000);
}
