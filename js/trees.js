import { Sprite } from './Sprite.js';
import { parliamentDistance } from './track.js';
import { scene, onFrame } from './init.js';
import { karts, player } from './the-grid.js';
import options from './options.js'
import { pickUpRandomItem } from './inventory.js';

export const trees = [];
export const blocks = [];
options.treeCount = 15;

export function reset() {
	for (let i = 0; i < 25; ++i) {
		if (!trees[i]) {
			trees[i] = new Sprite('res/tree.png', 1);
			trees[i].setSize(3);
			trees[i].addToScene(scene);
		}
		const tree = trees[i];
		positionTree(tree);
		if (i >= options.treeCount) tree.position.y = -100;
	}
	for (let i = 0; i < 20; ++i) {
		if (!blocks[i]) {
			blocks[i] = new Sprite('res/block.png', 1);
			blocks[i].setSize(2);
			blocks[i].addToScene(scene);
		}
		positionTree(blocks[i]);
	}
}

function positionTree(tree) {
	while (true) {
		const x = Math.random() * 600 - 300,
			y = Math.random() * 600 - 300,
			d = parliamentDistance({ x, y });
		if (d < 5 || d > 40) continue;
		if (y < 10 && y > -50 && x > 60) continue; // keep the grid clear
		tree.position.set(x, tree.size / 2, y);
		return;
	}
}

onFrame(() => {
	for (const kart of karts)
		for (let i = 0; i < options.treeCount; ++i) {
			const tree = trees[i];
			if (!tree) continue;
			const { dx, dy, d2 } = distanceSquared(kart, tree);
			if (d2 < 6) {
				const d = Math.sqrt(d2);
				console.log('Kart hit a tree!');
				kart.collide(d, { x: dx / d, y: dy / d });
			}
		}

	if (player.active) for (const block of blocks) {
		if (!block || block.position.y < 0) continue;
		const { d2 } = distanceSquared(player, block);
		if (d2 < 3) {
			console.log('Kart hit a "?" block!');
			pickUpRandomItem();
			block.position.y -= 100; // hide block
		}
	}
});

export function distanceSquared(kart, tree) {
	const dx = tree.position.x - kart.position.x,
		dy = tree.position.z - kart.position.z;
	return { dx, dy, d2: dx * dx + dy * dy };
}
