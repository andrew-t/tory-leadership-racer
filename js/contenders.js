export default shuffle([
	{ name: 'Bojo the Clown', filename: 'boris' },
	{ name: 'Biker Gove', filename: 'gove' },
	{ name: 'Savij Jardin', filename: 'sajid' },
	{ name: 'Andrea Loathsome', filename: 'andrea' },
	{ name: 'James Cravenly', filename: 'james' },
	{ name: 'Racer McFace', filename: 'esther' },
	{ name: 'Kit Madhouse', filename: 'generic' },
	{ name: 'Jeremy Hulture', filename: 'generic' },
	{ name: 'Demonic Raab', filename: 'generic' },
	{ name: 'Hot Rod Stewart', filename: 'generic' },
	{ name: 'Mark No-Hoper', filename: 'generic' },
	{ name: 'Matt Half-Cocked', filename: 'generic' }
]);

function shuffle(arr) {
	for (let i = 0; i < arr.length; ++i) {
		const j = Math.floor(Math.random() * (arr.length - i)) + i;
		[ arr[i], arr[j] ] = [ arr[j], arr[i] ];
	}
	return arr;
}
