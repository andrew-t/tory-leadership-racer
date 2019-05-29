import { scene, onFrame } from './js/init.js';
import { karts, player } from './js/the-grid.js';
import { parliamentPolygon, simpleParliament } from './js/track.js';
import newspaper from './js/newspaper.js';
import './js/char-select.js';

newspaper('THERESA MAY RESIGNS, IDIOT MAKES GAME');

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
		let n = 0;
		for (const k of karts) if (k.laps === laps) ++n;
		if (n + laps == karts.length)
			for (const k of karts)
				if (k.active && k.laps < laps) {
					k.active = false;
					newspaper(laps == 7
							? `${karts.find(k => k.active).character.name} BECOMES PRIME MINISTER`
							: `${k.character.name} ELIMINATED IN ROUND ${laps}`,
						(laps == 7) || !player.active);
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
}, 1000);

function round(n) {
	return n.toFixed(2);
}