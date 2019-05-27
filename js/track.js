// this is all very spuriously precise:
export const parliamentPolygon = [
	{ x: -94.49362816138596, y: -11.077542017590646 },
	{ x: -47.069362056543355, y: -6.935344410421979 },
	{ x: -58.0873395176439, y: 121.89917536688797 },
	{ x: 47.33869650237059, y: 130.47067374245586 },
	{ x: 71.57387972869161, y: -162.6913789488997 },
	{ x: -11.476451915101773, y: -168.95740857765364 },
	{ x: -17.917923991172707, y: -110.00119714253077 },
	{ x: -86.62104547049205, y: -115.70710236449086 }
	// then back to the start
];
export const simpleParliament = [ ...parliamentPolygon ];
simpleParliament.splice(6, 1);
simpleParliament.splice(1, 1);

export function parliamentDistance(p) {
	const d = sdf(p, parliamentPolygon);
	if (d < 0) console.warn('Kart in Parliament');
	return d;
}
export function parliamentNormal(p) {
	return normal(p, parliamentPolygon);
}

export function simpleParliamentDistance(p) {
	return sdf(p, simpleParliament);
}
export function simpleParliamentNormal(p) {
	return normal(p, simpleParliament);
}

// https://github.com/substack/point-in-polygon/blob/master/index.js
function pointInPolygon(p, poly) {
	let inPolygon = false;
	for (const [ a, b ] of lines(poly))
		if (((a.y > p.y) != (b.y > p.y))
            && (p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x))
			inPolygon = !inPolygon;
	return inPolygon;
}

// signed distance function
export function sdf(p, poly) {
	if (pointInPolygon(p, poly)) {
		console.warn('Kart within Parliament');
		return -udf(p, poly);
	}
	return udf(p, poly);
}

const epsilon = 0.01;
export function normal(p, poly) {
	const x = sdf({ x: p.x + epsilon, y: p.y }, poly)
			- sdf({ x: p.x - epsilon, y: p.y }, poly),
		y = sdf({ x: p.x, y: p.y + epsilon }, poly)
			- sdf({ x: p.x, y: p.y - epsilon }, poly),
		l = Math.sqrt(x*x + y*y);
	return { x: x/l, y : y/l };
}

// unsigned distance function
function udf(p, poly) {
	let dSqr = Infinity;
	for (const line of lines(poly)) {
		const lDSqr = distToSegmentSquared(p, ...line);
		if (lDSqr < dSqr) dSqr = lDSqr;
	}
	const d = Math.sqrt(dSqr);
	// console.log('Distance to edge of Parliament:', d);
	return d;
}

export function* lines(poly) {
	for (let i = 0; i < poly.length; ++i)
		yield [ poly[i], poly[(i + 1) % poly.length] ];
}

// distance from point to line segment
// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
	var l2 = dist2(v, w);
	if (l2 == 0) return dist2(p, v);
	var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	t = Math.max(0, Math.min(1, t));
	return dist2(p, {
		x: v.x + t * (w.x - v.x),
		y: v.y + t * (w.y - v.y)
	});
}
