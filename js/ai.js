import { onFrame } from './init.js';
import Kart from './Kart.js';

const acceleration = 1,
	reverseAcceleration = -0.5,
	brakePower = 0.1,
	steer = 0.01,
	tau = Math.PI * 2;

export default class Enemy exgtends Kart {
	constructor() {
		super();
		this.preferredDistance = Math.random() * 10 + 50;
		onFrame(() => {

		});
	}
}
