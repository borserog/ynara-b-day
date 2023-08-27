import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/4.png");
const matcapTextureDonut = textureLoader.load("textures/matcaps/7.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();

let text;
const donuts = [];

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text
  const textGeometry = new TextGeometry("boa noite,\n ynarinha\n\n   <3", {
    font: font,
    size: 0.2,
    height: 0.2,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // Donuts
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTextureDonut,
  });

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, textMaterial);
    donut.position.x = (Math.random() - 0.5) * 25;
    donut.position.y = (Math.random() - 0.5) * 25;
    donut.position.z = (Math.random() - 0.5) * 25;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    donuts.push(donut);

    scene.add(donut);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -2;
camera.position.y = -1;
camera.position.z = 1.9;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.xr.enabled = true;

document.body.appendChild(VRButton.createButton(renderer));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  camera.position.set(Math.sin(elapsedTime) * 0.25, -0.5);

  donuts.forEach((donut, index) => {
    const turn = index % 2 === 0 ? elapsedTime : -elapsedTime;

    donut.rotation.set(turn, turn, turn);
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

renderer.xr.addEventListener(`sessionstart`, () => {
  renderer.xr.getCamera().position.x = 0
  renderer.xr.getCamera().position.y = 0


  //camera.position.copy(renderer.xr.getCamera().position);
});

renderer.setAnimationLoop(function () {
  renderer.render(scene, camera);
});

tick();
