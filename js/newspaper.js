let cancelTimer = null;

const newspaper = document.getElementById('news'),
	headline = document.getElementById('headline');

export default function publishNews(newHeadline, timeout) {
	console.log('THE LATEST NEWS:', newHeadline);
	if (cancelTimer) clearTimeout(cancelTimer);
	headline.innerHTML = newHeadline;
	newspaper.classList.add('on');
	newspaper.classList.remove('off');
	cancelTimer = setTimeout(() => {
		newspaper.classList.add('off');
		newspaper.classList.remove('on');
		cancelTimer = null;
	}, timeout || 1500);
}
