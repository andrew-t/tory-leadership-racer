const options = {};

export default options;

document.addEventListener('DOMContentLoaded', e => {
	const difficulty = document.getElementById('difficulty'),
		difficultyLabel = document.getElementById('difficulty-label'),
		defaults = { ...options };
	difficulty.addEventListener('input', update);
	update();
	function update() {
		const d = parseFloat(difficulty.value);
		options.acceleration = defaults.acceleration + d * 45;
		options.aiPrefSpeed = defaults.aiPrefSpeed + d * 10000;
		options.treeCount = defaults.treeCount + d * 10.0;
		if (d < -0.75)
			difficultyLabel.innerHTML = 'Easiest trade deal in history';
		else if (d < -0.25)
			difficultyLabel.innerHTML = '2016 election';
		else if (d < 0.25)
			difficultyLabel.innerHTML = 'Normal';
		else if (d < 0.75)
			difficultyLabel.innerHTML = 'Voting reform';
		else
			difficultyLabel.innerHTML = 'Brexit';
	}
});
