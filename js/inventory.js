import { player } from './the-grid.js';
import { milkshake, cannonade, BlueShell } from './items.js';

let inventoryButton;
document.addEventListener('DOMContentLoaded', e => {
	inventoryButton = document.getElementById('fire-button');
	inventoryButton.addEventListener('click', fireAsPlayer);
});

let currentInventory = null;

export function randomItem() {
	const n = Math.random();
	if (n < 0.3) return 'milkshake';
	if (n < 0.6) return 'cannon';
	if (n < 0.8) return 'bubble';
	return 'blue-shell';
}

export function pickUpRandomItem() {
	pickUp(randomItem());
}

function pickUp(item) {
	console.log('Inventory:', item);
	currentInventory = item;
	inventoryButton.classList.forEach(n =>
		inventoryButton.classList.remove(n));
	inventoryButton.classList.add(item);
}

export function reset() { pickUp(null); }

export function fireAsPlayer() {
	if (!currentInventory) {
		console.log('Firing with no inventory; do your own Brexit joke.');
		return;
	}
	fire(currentInventory, player);
	reset();
}

export function fire(item, kart) {
	console.log('Firing', item, 'from', kart.character.name);
	if (kart.active) switch (item) {
		case null:
			console.log('Firing with no inventory; do your own Brexit joke.');
			return;
		case 'milkshake': milkshake(kart); return;
		case 'cannon': cannonade(kart); return;
		case 'blue-shell': new BlueShell(kart); return;
		case 'bubble': kart.bubbleTime += 10; return;
		default:
			console.error('Unexpected item:', currentInventory);
			return;
	}
}
