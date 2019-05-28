let cancelTimer = null,
	gameOver = false;

const newspaper = document.getElementById('news'),
	headline = document.getElementById('headline');

export default function publishNews(newHeadline, forever) {
	console.log('THE LATEST NEWS:', newHeadline);
	if (gameOver) return;
	if (cancelTimer) clearTimeout(cancelTimer);
	headline.innerHTML = newHeadline;
	newspaper.classList.add('on');
	newspaper.classList.remove('off');
	if (!forever)
		cancelTimer = setTimeout(() => {
			newspaper.classList.add('off');
			newspaper.classList.remove('on');
			cancelTimer = null;
		}, 1500);
	else gameOver = true;
}
