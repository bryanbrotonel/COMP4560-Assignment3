const visibleHeightAtZDepth = (depth, camera) => {
	// compensate for cameras not positioned at z=0
	const cameraOffset = camera.position.z;
	if (depth < cameraOffset) depth -= cameraOffset;
	else depth += cameraOffset;

	// vertical fov in radians
	const vFOV = camera.fov * Math.PI / 180;

	// Math.abs to ensure the result is always positive
	return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth, camera) => {
	const height = visibleHeightAtZDepth(depth, camera);
	return height * camera.aspect;
};

function csv() {
	var csv = document.createElement("INPUT");
	csv.setAttribute("type", "file");
	document.body.appendChild(csv);
}

function init() {

	var width = window.innerWidth,
		height = window.innerHeight;
	var widthHalf = width / 2,
		heightHalf = height / 2;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	console.log("width: " + window.innerWidth + "\nheight: " + window.innerHeight)
	document.body.appendChild(renderer.domElement);

	var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 0, 100);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	console.log("width: " + visibleWidthAtZDepth(100, camera) + "\nheight: " + visibleHeightAtZDepth(100, camera))

	var scene = new THREE.Scene();

	//create a blue LineBasicMaterial
	var material = new THREE.LineBasicMaterial({
		color: 0xffffff
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(new THREE.Vector3(20, 0, 0));
	geometry.vertices.push(new THREE.Vector3(20, -10, 0));

	var line = new THREE.Line(geometry, material);

	scene.add(line);
	renderer.render(scene, camera);

}

csv();
init();
