export const camera = new THREE.PerspectiveCamera(45,
	window.innerWidth / window.innerHeight,
	0.1, 2000);
export const scene = new THREE.Scene();
export const clock = new THREE.Clock();
export const renderer = new THREE.WebGLRenderer();

const maxDelta = 0.1;

const frameCallbacks = [];
export function beforeFrame(callback) {
	frameCallbacks.unshift(callback);
}
export function onFrame(callback) {
	frameCallbacks.push(callback);
}

document.addEventListener('DOMContentLoaded', () => {

	if (!WEBGL.isWebGLAvailable())
		document.body.appendChild(WEBGL.getWebGLErrorMessage());

	const container = document.getElementById('scene'),
		ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
	camera.position.set(320, 90, 320);
	camera.lookAt(0, 3, 0);
	scene.add(ambientLight);

	let parliament;
	const loadingManager = new THREE.LoadingManager(() => scene.add(parliament)),
		loader = new THREE.ColladaLoader(loadingManager);
	loader.load( '../res/parliament/parliament.dae', collada =>
		parliament = collada.scene);

	const textureLoader = new THREE.TextureLoader();
	const floorTexture = textureLoader.load('../res/road1.jpg');
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(600, 600);
	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(10000, 10000),
		new THREE.MeshBasicMaterial({ map: floorTexture }));
	// nudge down slightly so we can draw a track on top easily:
	floor.position.y = -0.0001;
	floor.rotation.x = Math.PI / 2;
	floor.material.side = THREE.DoubleSide;
	scene.add(floor);

	const panoramaTexture = textureLoader.load('../res/panorama.jpg'),
		background = new THREE.Mesh(
			new THREE.CylinderGeometry(300, 300, 160, 30),
			new THREE.MeshBasicMaterial({ map: panoramaTexture }));
	background.position.y = 78;
	background.material.side = THREE.DoubleSide;
	scene.add(background);

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	render();
});

function render() {
	const delta = Math.min(clock.getDelta(), maxDelta);
	for (const c of frameCallbacks)
		c(scene, camera, delta);
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
