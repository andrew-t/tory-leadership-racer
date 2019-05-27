import { scene, onFrame } from './js/init.js';
import { karts, player } from './js/the-grid.js';
// import { drawPolygon, dilate } from './js/draw.js';
import { parliamentPolygon, simpleParliament } from './js/track.js';

// console.log(simpleParliament);
// console.log(dilate(simpleParliament, 4));
// drawPolygon(scene, dilate(simpleParliament, 40));
// drawPolygon(scene, dilate(parliamentPolygon, 20));
// drawPolygon(scene, dilate(parliamentPolygon, 0.5));

setInterval(() => {
	document.getElementById('placing-list').innerHTML = '<li>'
		+ karts.map(k => ({
			pos: k.lastTheta + k.laps - k.unlaps,
			name: k.isPlayer ? 'Player'
				: `AI (PD: ${ round(k.preferredDistance) },
					LA: ${ round(k.lookAheadDistance) },
					PS: ${ round(k.preferredSpeedSquared) },
					CS: ${ round(k.preferredCorneringSpeedSquared) },
					SN: ${ round(k.steeriness) })`
		})).sort((a, b) => b.pos - a.pos)
			.map(k => `${ k.name } @ ${ round(k.pos) }`)
			.join('</li><li>')
		+ '</li>';
}, 1000);

function round(n) {
	return n.toFixed(2);
}