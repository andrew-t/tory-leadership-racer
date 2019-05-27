const leftMeter = document.getElementById('left-wing'),
	rightMeter = document.getElementById('right-wing');

let leaning = 0;

const maxNudge = 3,
	mult = 2;

export default function nudge(d) {
	d *= mult;
	if (d > maxNudge) d = maxNudge;
	if (d < -maxNudge) d = -maxNudge;
	leaning += d;
	if (leaning > 100) leaning = 100;
	if (leaning < -100) leaning = -100;
	if (leaning > 0) {
		leftMeter.style.transform = `scale(0, 1)`;
		rightMeter.style.transform = `scale(${ leaning / 100 }, 1)`;
	} else {
		leftMeter.style.transform = `scale(${ leaning / -100 }, 1)`;
		rightMeter.style.transform = `scale(0, 1)`;
	}
}
