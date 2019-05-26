import { scene, onFrame } from './js/init.js';
import Kart from './js/Kart.js';

const kart = new Kart();
kart.addToScene(scene);

kart.drive = 0.1;
kart.steering = 0.1;
kart.brake = 1;
kart.position.x = -300;
kart.position.z = -300;

onFrame((scene, camera, delta) => {
	camera.position.subVectors(
		kart.position,
		kart.driveVector().multiplyScalar(55));
	camera.position.y = 25;
	camera.lookAt(kart.position);
});
