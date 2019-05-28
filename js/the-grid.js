import { scene, onFrame } from './init.js';
import Enemy from './ai.js';
import Player from './Player.js';
import pad from './gamepad.js';

export const karts = [];
export const player = new Player();

for (let i = 0; i < 8; ++i) {
	// if (i % 7) continue; // debug - one ai
	const kart = (i == 7) ? player : new Enemy();
	kart.position.x = 85 - (i & 1) * 5;
	kart.position.z = -5 - i * 5;
	kart.angle = Math.PI * 0.5;
	kart.addToScene(scene);
	karts.push(kart);
	onFrame(() => {
		for (let i = 0; i < 8; ++i) {
			const a = karts[i];
			for (let j = i + 1; j < 8; ++j) {
				const b = karts[j];
				// if (!b) continue; // for debug mode
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
			// oh, and you can hit theresa may
			const dx = a.position.x - 92,
				dy = a.position.z + 5,
				ds = dx * dx + dy * dy;
			if (ds < 4) {
				console.log('Kart hit Theresa May!');
				const d = Math.sqrt(ds) * 0.5;
				a.collide(d, { x: dx * -0.5, y: dy * -0.5 });
			}
		}
	});
}
