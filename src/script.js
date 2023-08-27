import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;
const loaderAnim = document.getElementById("js-loader");
const title = document.getElementById("title");
const changeBtn = document.getElementById("arrow-btn");

const age = new Date().getFullYear() - new Date("1998-08-28").getFullYear();
title.innerHTML = `Aee!! ${age} anos!`;

const MODEL_PATH = "models/source/mochi-mochi.glb";

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
const catText1 = textureLoader.load("models/textures/tex1.png");
const catText2 = textureLoader.load("models/textures/tex2.png");

/**
 * BOX
 */
const boxGeo = new THREE.BoxGeometry(4, 4, 4);
const matBox = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeo, matBox);
scene.add(box);

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let text;
fontLoader.load("/fonts/Inter_Tight_Regular.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text
  const textGeometry = new TextGeometry(`Feliz\nAniversário,\nYnarinha!\n`, {
    font: font,
    size: 0.19,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  text = new THREE.Mesh(textGeometry, material);
  text.position.y = 0.4;
  scene.add(text);

  let catModel;
  let modelLoader = new GLTFLoader().load(MODEL_PATH, (cat) => {
    catModel = cat.scene;
    scene.add(catModel);

    catModel.position.x = -0.23;
    catModel.position.y = -0.7;
    catModel.rotateX(-0.32);
    catModel.rotateY(0.02);

    catModel.scale.set(0.23, 0.23);

    loaderAnim.remove();

    const animateCatModel = () => {
      const elapsedTime = clock.getElapsedTime();
      catModel.position.y += Math.sin(elapsedTime) * 0.0009;
      catModel.rotateY(Math.sin(elapsedTime) * 0.001);
      text.rotateY(Math.sin(elapsedTime) * 0.001);
    };

    renderer.setAnimationLoop(animateCatModel);
  });
});

/**
 * Model
 */

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
// camera.position.x = -2;
// camera.position.y = -1;
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
  canvas,
  antialias: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // camera.position.set(
  //   Math.sin(elapsedTime) * 0.1,
  //   Math.cos(elapsedTime) * -0.1
  // );

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
