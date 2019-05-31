import { Sprite } from './Sprite.js';
import { parliamentDistance } from './track.js';
import { scene, onFrame } from './init.js';
import { karts } from './the-grid.js';

export const trees = [];

reset();

export function reset() {
	for (let i = 0; i < 20; ++i) {
		const tree = new Sprite('res/tree.png', 1);
		trees[i] = tree;
		tree.setSize(3);
		tree.addToScene(scene);
		while (true) {
			const x = Math.random() * 600 - 300,
				y = Math.random() * 600 - 300,
				d = parliamentDistance({ x, y });
			if (d < 5 || d > 40) continue;
			if (y < 10 && y > -50 && x > 60) continue; // keep the grid clear
			tree.position.set(x, 1.5, y);
			break;
		}
	}
}

onFrame(() => {
	for (const kart of karts)
		for (const tree of trees) {
			const dx = tree.position.x - kart.position.x,
				dy = tree.position.z - kart.position.z,
				d2 = dx * dx + dy * dy;
			if (d2 < 4) {
				const d = Math.sqrt(d2);
				kart.collide(d, { x: dx / d, y: dy / d });
			}
		}
});
