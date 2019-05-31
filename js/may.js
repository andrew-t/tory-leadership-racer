import { Sprite } from './Sprite.js';
import newspaper from './newspaper.js';
import { karts, player } from './the-grid.js';
import { scene, camera, beforeFrame } from './init.js';

const may = new Sprite('res/may.png', 2);
may.setSize(4);
may.position.set(90, 2, -5);
may.addToScene(scene);
may.setSprite(0);

const hanky = new Sprite('res/hanky.png', 1);
hanky.setSize(0.5);
hanky.addToScene(scene);

const music = new Audio('res/music.mp3');
music.volume = 0.5;
export function gameOver() {
	music.pause();
	music.currentTime = 0;
}

let animationStart = null,
	finalCameraPosition = new THREE.Vector3();
beforeFrame((scene, camera) => {
	if (animationStart) {
		const now = Date.now() - animationStart,
			p = (now > 4500) ? (now > 7000) ? 1 : (now - 4500) / 2500 : 0,
			q = 1 - p;
		// camera ends up at 85, 4.5, -44 to look at 85, 3.5, -36
		// may is at 90, 2, -5
		// camera on may can be at 90, 2, -15
		camera.position.set(
			finalCameraPosition.x + 10 * q,
			finalCameraPosition.y + Math.sin(p * Math.PI) * 8,
			finalCameraPosition.z + 28 * q);
	}
});

export default function start() {
	console.log('Starting');
	document.body.classList.remove('char-select');
	let i, hankyStart;
	animationStart = Date.now();
	hanky.position.set(0, -5, 0);
	player.setCamera(camera);
	finalCameraPosition.copy(camera.position);
	newspaper('THERESA MAY TO GIVE SPEECH OUTSIDE PARLIAMENT');
	setTimeout(() => may.setSprite(2), 2500);
	setTimeout(() => may.setSprite(1), 3500);
	setTimeout(() => {
		may.setSprite(3);
		hanky.position.set(88.5, 4, -6.5);
		hankyStart = Date.now();
		i = setInterval(() => {
			const t = (Date.now() - hankyStart) / 2000,
				theta = t * Math.PI * 2;
			hanky.position.set(88.5 + Math.sin(theta),
				4 - 1.5 * t - (1 - Math.abs(Math.sin(theta))) * 0.5,
				-6.5);
			hanky.setSprite(0, (t * 8) % 1 > 0.5);
		});
	}, 4000);
	setTimeout(() => may.setSprite(0), 5000);
	setTimeout(() => {
		animationStart = false;
		karts.forEach(k => k.active = true);
		clearInterval(i);
		hanky.position.set(88.5, 0.25, -6.5);
		music.play();
	}, 8000);
}
