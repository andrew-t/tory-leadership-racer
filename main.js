import { scene, camera, onFrame } from './js/init.js';
import { karts, player, resetKarts } from './js/the-grid.js';
import { parliamentPolygon, simpleParliament } from './js/track.js';
import newspaper from './js/newspaper.js';
import { start as charSelect } from './js/char-select.js';
import startRace, { music, gameOver } from './js/may.js';
import { reset as resetTrees } from './js/trees.js';
import { reset as resetLeaning } from './js/leaning.js';
import { reset as resetInventory } from './js/inventory.js';
import cheats from './js/cheats.js';

newspaper('Tory leadership contest: Iain Duncan Smith warns of ‘chaos’', 5000);

let winScreen, loseScreen;

console.log('Stats for the racers:');
karts.forEach(k => {
	console.log(
		k.character.name, k.isPlayer ? 'is player' : {
			pref_dist: round(k.preferredDistance),
			look_ahead: round(k.lookAheadDistance),
			pref_spd2: round(k.preferredSpeedSquared),
			corner_spd2: round(k.preferredCorneringSpeedSquared),
			steer: round(k.steeriness)
		});
	k.onLap(laps => {
		if (!player.active) return;
		if (cheats.prorogation) {
			if (laps == 3) {
				newspaper(`DEMONIC RAAB BECOMES PRIME MINISTER`, 5000);
				winScreen.classList.remove('hidden');
				gameOver();
			}
			return;
		}
		let n = 0;
		for (const k of karts) if (k.laps >= laps) ++n;
		if (cheats.withers ? (laps == 5) : (n + laps == karts.length))
			for (const k of karts)
				if (k.active && k.laps < laps) {
					k.active = false;
					const lastLap = cheats.withers
						? (laps == 5)
						: (laps == karts.length - 1);
					newspaper(lastLap
							? `${karts.find(k => k.active).character.name} BECOMES PRIME MINISTER`
							: `${k.character.name} ELIMINATED IN ROUND ${laps}`,
						lastLap ? 5000 : null);
					if (!player.active) {
						loseScreen.classList.remove('hidden');
						gameOver();
					}
					else if (karts.every(k => !k.isPlayer == !k.active)) {
						winScreen.classList.remove('hidden');
						gameOver();
					}
				}
	});
});

setInterval(() => {
	document.getElementById('placing-list').innerHTML =
		karts.map(k => ({
			pos: k.lastTheta + k.laps - k.unlaps,
			name: k.character.name,
			isPlayer: k.isPlayer,
			active: k.active
		})).sort((a, b) => b.pos - a.pos)
			.map(k => `<li class="${ k.isPlayer ? 'player' : 'ai' }
				${ k.active ? 'in' : 'out' }">
					${ k.name }<br />${ Math.max(round(k.pos), 0) } laps
				</li>`)
			.join('');
	console.log('Player speed',
		Math.sqrt(player.speed.x * player.speed.x
			+ player.speed.y * player.speed.y));
}, 1000);

function round(n) {
	return n.toFixed(2);
}

document.addEventListener('DOMContentLoaded', e => {
	document.getElementById('start-again').addEventListener('click', restart);
	document.getElementById('play-again').addEventListener('click', restart);
	document.getElementById('win-title-screen').addEventListener('click', titleScreen);
	document.getElementById('lose-title-screen').addEventListener('click', titleScreen);
	winScreen = document.getElementById('win-screen');
	loseScreen = document.getElementById('lose-screen');
	reset();
	document.getElementById('start').addEventListener('click', charSelect);
	document.getElementById('abort').addEventListener('click', abortRace);
});
function restart(e) {
	reset(e);
	startRace();
}
function reset(e) {
	if (e) e.preventDefault();
	resetKarts();
	resetLeaning();
	resetTrees();
	resetInventory();
	winScreen.classList.add('hidden');
	loseScreen.classList.add('hidden');
}

function abortRace(e) {
	if (e) e.preventDefault();
	if (player.character.name == 'Jeremy Hulture')
		newspaper('JEREMY HULTURE SAYS YOU MUST CARRY THE RACE TO TERM');
	else titleScreen();
}

function titleScreen(e) {
	reset(e);
	music.pause();
	music.currentTime = 0;
	document.body.classList.add('splash');
	document.body.classList.remove('char-select');
	winScreen.classList.add('hidden');
	loseScreen.classList.add('hidden');
}

document.addEventListener('readystatechange', () => {
	if (document.readyState == 'complete')
		document.getElementById('start').classList.remove('disabled');
});
