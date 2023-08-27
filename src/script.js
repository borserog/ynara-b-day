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
const letter = document.querySelector(".letter");
const letterContent = document.getElementById("letter-content");
const close = document.getElementById("close");

const age = new Date().getFullYear() - new Date("1998-08-28").getFullYear();
title.innerHTML = `Aee!! ${age} anos!`;

const MODEL_PATH = "models/source/mochi-mochi.glb";

const msg = [
  `feliz aniversário, minha linda!${String.fromCodePoint(
    0x1f389
  )}${String.fromCodePoint(0x1f382)}`,
  `parabéns pelos seus ${age} anos!!`,
  "te desejo um dia abençoado, leve e repleto de bons pensamentos.",
  "esse ano que está por vir vai ser muito importante; te desejo saúde e sabedoria na sua jornada.",
  "conte comigo para o que precisar.",
  `te amo ${String.fromCodePoint(0x2764)},`,
  "g.",
];
msg.forEach((msg, index) => {
  const el = letter.appendChild(document.createElement("p"));
  el.setAttribute("class", "message");
  el.style.animationFillMode = `backwards`;
  el.style.animationDelay = `${index * 0.5}s`;

  el.innerHTML = msg;
});

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.destroy();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/4.png");
const panorama = textureLoader.load("images/panorama.jpg");
panorama.wrapS = THREE.RepeatWrapping;
panorama.repeat.x = -2;

/**
 * Fonts & Model
 */
const fontLoader = new FontLoader();
let text;
fontLoader.load("/fonts/Inter_Tight_Regular.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text
  const textGeometry = new TextGeometry(`Feliz\nAniversário,\nYnarinha!\n`, {
    font: font,
    size: 0.17,
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
      catModel.rotateY(Math.sin(elapsedTime) * 0.0005);
    };

    renderer.setAnimationLoop(animateCatModel);
  });
});

/**
 * Background
 */

const sphereGeo = new THREE.SphereGeometry(200, 60, 40);
sphereGeo.scale(-1, 1, 1);

const sphereMaterial = new THREE.MeshBasicMaterial({ map: panorama });

const mesh = new THREE.Mesh(sphereGeo, sphereMaterial);
scene.add(mesh);

mesh.rotation.set(-0.2, 9.72, 0);
mesh.scale.set(1, 0.3, 0.7);
mesh.position.set(0, -30, 0);

gui.add(mesh.scale, "y", -1, 10, 0.1);
gui.add(mesh.scale, "z", -1, 10, 0.1);
gui.add(mesh.scale, "x", -1, 10, 0.1);
gui.add(mesh.position, "y", -200, 0, 0.1).name("distance");
gui.add(mesh.rotation, "y", 0, 30, 0.001);
gui.add(mesh.rotation, "x", -30, 30, 0.001);
gui.add(sphereMaterial, "wireframe");

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
  1,
  1000
);
// camera.position.x = -2;
// camera.position.y = -1;
camera.position.z = 1.9;
scene.add(camera);

camera.rotation.set(0, 0, 0);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enabled = false;

// gui.add(controls, "enabled");

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
 * EVENTS
 */
changeBtn.addEventListener("click", () => {
  letter.classList.toggle("display");
  changeBtn.classList.toggle("hide");
});

close.addEventListener("click", () => {
  letter.classList.toggle("display");
  changeBtn.classList.toggle("hide");
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  // controls.update();

  if (window.screen.width < 500) {
    mesh.rotation.set(
      Math.sin(elapsedTime) * 0.1,
      Math.cos(elapsedTime) * 0.6,
      0
    );
  } else {
    mesh.rotation.set(
      Math.sin(elapsedTime) * 0.1,
      Math.cos(elapsedTime) * 0.1,
      0
    );
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
