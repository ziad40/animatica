const video = document.getElementById("camera");

// 1. Open the camera
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" },
  audio: false
})
.then((stream) => {
  video.srcObject = stream;
})
.catch((err) => {
  console.error("Camera error:", err);
});

// // 2. Setup Three.js scene
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
// camera.position.z = 2;

// const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // 3. Add 3D cube
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshNormalMaterial();
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// // 4. Animation loop
// function animate() {
//   requestAnimationFrame(animate);

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   renderer.render(scene, camera);
// }
// animate();

console.log('Initializing Three.js scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
console.log('Finishing Three.js scene');

animate();

// 5. Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
