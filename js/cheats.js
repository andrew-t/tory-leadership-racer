const cheats = {};

for (const part of window.location.search.substr(1).split('&')) {
	const [ key, value ] = part.split('=');
	if (key == 'cheatcode') {
		console.log('Cheat activated', value);
		cheats[value] = true;
	}
}

export default cheats;
