import { scene, onFrame } from './init.js';
import Kart from './Kart.js';
import Player from './Player.js';
import pad from './gamepad.js';

export const karts = [];
export const player = new Player();

for (let i = 0; i < 8; ++i) {
	const kart = (i == 7) ? player : new Kart();
	kart.position.x = 75 - (i & 1) * 5;
	kart.position.z = -5 - i * 5;
	kart.angle = Math.PI * 0.5;
	kart.addToScene(scene);
	karts.push(kart);
	onFrame(() => {
		for (let i = 0; i < 7; ++i) {
			const a = karts[i];
			for (let j = i + 1; j < 8; ++j) {
				const b = karts[j];
				const dx = a.position.x - b.position.x,
					dy = a.position.z - b.position.z,
					ds = dx * dx + dy * dy;
				if (ds < 4) {
					console.log('Karts collided');
					const d = Math.sqrt(ds) * 0.5;
					a.collide(d, { x: dx * -0.5, y: dy * -0.5 });
					b.collide(d, { x: dx * 0.5, y: dy * 0.5 });
				}
			}
		}
	});
}
