import { scene, onFrame } from './js/init.js';
import { karts, player } from './js/the-grid.js';
// import { drawPolygon, dilate } from './js/draw.js';
import { parliamentPolygon, simpleParliament } from './js/track.js';

// console.log(simpleParliament);
// console.log(dilate(simpleParliament, 4));
// drawPolygon(scene, dilate(simpleParliament, 40));
// drawPolygon(scene, dilate(parliamentPolygon, 20));
// drawPolygon(scene, dilate(parliamentPolygon, 0.5));

console.log('Stats for the racers:');
karts.forEach(k => console.log(
	k.character.name, k.isPlayer ? 'is player' : {
		pref_dist: round(k.preferredDistance),
		look_ahead: round(k.lookAheadDistance),
		pref_spd2: round(k.preferredSpeedSquared),
		corner_spd2: round(k.preferredCorneringSpeedSquared),
		steer: round(k.steeriness)
	}));

setInterval(() => {
	document.getElementById('placing-list').innerHTML =
		karts.map(k => ({
			pos: k.lastTheta + k.laps - k.unlaps,
			name: k.character.name,
			isPlayer: k.isPlayer
		})).sort((a, b) => b.pos - a.pos)
			.map(k => `<li class="${ k.isPlayer ? 'player' : 'ai' }">
					${ k.name }<br />${ Math.max(round(k.pos), 0) } laps
				</li>`)
			.join('');
}, 1000);

function round(n) {
	return n.toFixed(2);
}