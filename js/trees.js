import { Sprite } from './Sprite.js';
import { parliamentDistance } from './track.js';
import { scene, onFrame } from './init.js';
import { karts } from './the-grid.js';
import options from './options.js'

export const trees = [];
options.treeCount = 15;

export function reset() {
	for (let i = 0; i < 25; ++i) {
		if (!trees[i]) {
			trees[i] = new Sprite('res/tree.png', 1);
			trees[i].setSize(3);
			trees[i].addToScene(scene);
		}
		const tree = trees[i];
		while (true) {
			const x = Math.random() * 600 - 300,
				y = Math.random() * 600 - 300,
				d = parliamentDistance({ x, y });
			if (d < 5 || d > 40) continue;
			if (y < 10 && y > -50 && x > 60) continue; // keep the grid clear
			tree.position.set(x, 1.5, y);
			break;
		}
		if (i >= options.treeCount) tree.position.y = -100;
	}
}

onFrame(() => {
	for (const kart of karts)
		for (let i = 0; i < options.treeCount; ++i) {
			const tree = trees[i];
			if (!tree) continue;
			const dx = tree.position.x - kart.position.x,
				dy = tree.position.z - kart.position.z,
				d2 = dx * dx + dy * dy;
			if (d2 < 6) {
				const d = Math.sqrt(d2);
				console.log('Kart hit a tree!');
				kart.collide(d, { x: dx / d, y: dy / d });
			}
		}
});
