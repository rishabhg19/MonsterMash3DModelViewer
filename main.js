// set scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// set lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// initialize state variables
let model;
let isRotating = true;
let isHovered = false;

let initialCameraZ = 10;
let enlargedCameraZ = 8;
camera.position.z = initialCameraZ;
camera.lookAt(scene.position);

// define how model is animated
function animate() {
    requestAnimationFrame(animate);
    if (model && isRotating) {
        model.rotation.y += 0.01;
    }
    // enlarge model on hover
    if (isHovered) {
        camera.position.z += (enlargedCameraZ - camera.position.z) * 0.05;
    } else {
        camera.position.z += (initialCameraZ - camera.position.z) * 0.05;
    }
    renderer.render(scene, camera);
}

// load 3d model and set position and scale
const loader = new THREE.GLTFLoader();
loader.load('model/mm_project.glb', function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(0.75, 0.75, 0.75);
    scene.add(model);
    animate();
}, undefined, function (error) {
    console.error(error);
});

// initialize raycaster for model to respond to click and hover events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// click listener
window.addEventListener('click', onClick, false);

function onClick(event) {
    // get mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update raycaster
    raycaster.setFromCamera(mouse, camera);

    // see if raycaster hits the model and update isRotating
    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0) {
        isRotating = !isRotating;
    }
}

// mouse move listener
window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(model, true);

    // update isHovered
    if (intersects.length > 0) {
        isHovered = true;
    } else {
        isHovered = false;
    }
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});