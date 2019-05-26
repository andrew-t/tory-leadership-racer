import { scene, onFrame } from './js/init.js';
import Kart from './js/Kart.js';
import Player from './js/Player.js';
import pad from './js/gamepad.js';

const player = new Player();
player.addToScene(scene);
player.position.x = -300;
player.position.z = -300;
