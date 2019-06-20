import cheats from './cheats.js';

let contenders = [
	{ name: 'Bojo the Clown', filename: 'boris' },
	{ name: 'Jeremy Hulture', filename: 'generic' }
];

if (!cheats.withers) contenders.push(
	{ name: 'Biker Gove', filename: 'gove' },
	{ name: 'Savij Jardin', filename: 'sajid' },
	{ name: 'Andrea Loathsome', filename: 'andrea' },
	{ name: 'Racer McFace', filename: 'esther' },
	{ name: 'Demonic Raab', filename: 'generic' },
	{ name: 'Rory Stupid', filename: 'generic' },
	{ name: 'Mark No-Hoper', filename: 'generic' },
	{ name: 'Matt Half-Cocked', filename: 'generic' }
);

if (cheats.amorosi) contenders.push(
	{ name: 'Sam Dreamer', filename: 'james' },
	{ name: 'Kit Madhouse', filename: 'generic' },
	{ name: 'James Cravenly', filename: 'james' }
);

if (cheats.maybot) contenders.push(
	{ name: 'The Maybot', filename: 'andrea' }
);

if (cheats.prorogation)
	contenders = [{ name: 'Demonic Raab', filename: 'generic' }];

export default shuffle(contenders);

function shuffle(arr) {
	for (let i = 0; i < arr.length; ++i) {
		const j = Math.floor(Math.random() * (arr.length - i)) + i;
		[ arr[i], arr[j] ] = [ arr[j], arr[i] ];
	}
	return arr;
}
