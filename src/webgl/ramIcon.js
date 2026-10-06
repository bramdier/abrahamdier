import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const BOARD_W = 1.72;
const BOARD_H = 0.56;
const BOARD_D = 0.12;
const NOTCH_CENTER = -0.04;
const NOTCH_W = 0.16;
const NOTCH_H = 0.1;

export function initRamIcon(canvas, { reducedMotion = false } = {}) {
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0.95, 0.62, 3.15);
  camera.lookAt(0, -0.06, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 1.05;
  pmrem.dispose();

  scene.add(new THREE.AmbientLight(0xfff8f3, 0.28));

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(2.4, 3.2, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xd5e8ff, 0.55);
  fill.position.set(-3.2, 0.4, 2.2);
  scene.add(fill);

  const ram = createRamModule();
  ram.rotation.set(0.38, -0.55, -0.08);
  scene.add(ram);

  const button = canvas.closest("a");
  let hovering = false;
  const onEnter = () => {
    hovering = true;
  };
  const onLeave = () => {
    hovering = false;
  };
  button?.addEventListener("pointerenter", onEnter);
  button?.addEventListener("pointerleave", onLeave);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (reducedMotion) renderer.render(scene, camera);
  }

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const clock = new THREE.Clock();

  function pose(elapsed) {
    if (hovering) {
      return { x: 0.28, y: -0.72 };
    }
    return {
      x: 0.4 + Math.sin(elapsed * 0.45) * 0.04,
      y: -0.58 + Math.sin(elapsed * 0.55) * 0.22,
    };
  }

  function renderFrame() {
    const delta = clock.getDelta();
    const target = pose(clock.elapsedTime);
    const k = 1 - Math.exp(-delta * (hovering ? 9 : 14));
    ram.rotation.x += (target.x - ram.rotation.x) * k;
    ram.rotation.y += (target.y - ram.rotation.y) * k;
    renderer.render(scene, camera);
  }

  const stop = () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    button?.removeEventListener("pointerenter", onEnter);
    button?.removeEventListener("pointerleave", onLeave);
  };

  if (reducedMotion) {
    ram.rotation.x = 0.38;
    ram.rotation.y = -0.55;
    renderer.render(scene, camera);
    return { stop };
  }

  renderer.setAnimationLoop(() => {
    if (document.hidden || document.body.classList.contains("modal-open")) return;
    renderFrame();
  });

  return { stop };
}

function createRamModule() {
  const group = new THREE.Group();
  const materials = {
    pcb: new THREE.MeshPhysicalMaterial({
      color: 0x1c8a4e,
      roughness: 0.36,
      metalness: 0.06,
      clearcoat: 0.7,
      clearcoatRoughness: 0.32,
    }),
    chip: new THREE.MeshPhysicalMaterial({
      color: 0x2c323a,
      roughness: 0.22,
      metalness: 0.42,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
    }),
    gold: new THREE.MeshPhysicalMaterial({
      color: 0xffd56a,
      metalness: 1,
      roughness: 0.2,
    }),
    silk: new THREE.MeshStandardMaterial({
      color: 0xf7f4ee,
      roughness: 0.72,
    }),
  };

  group.add(new THREE.Mesh(createBoardGeometry(), materials.pcb));
  group.add(createChips(materials.chip));
  group.add(createPins(materials.gold));
  group.add(createPinMarker(materials.silk));

  return group;
}

function createBoardGeometry() {
  const hw = BOARD_W / 2;
  const hh = BOARD_H / 2;
  const n0 = NOTCH_CENTER - NOTCH_W / 2;
  const n1 = NOTCH_CENTER + NOTCH_W / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hh);
  shape.lineTo(n0, -hh);
  shape.lineTo(n0, -hh + NOTCH_H);
  shape.lineTo(n1, -hh + NOTCH_H);
  shape.lineTo(n1, -hh);
  shape.lineTo(hw, -hh);
  shape.lineTo(hw, hh);
  shape.lineTo(-hw, hh);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: BOARD_D,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -BOARD_D / 2);
  return geometry;
}

function createChips(material) {
  const geometry = new THREE.BoxGeometry(0.3, 0.18, 0.045);
  const xs = [-0.54, -0.18, 0.18, 0.54];
  const mesh = new THREE.InstancedMesh(geometry, material, xs.length * 2);
  const dummy = new THREE.Object3D();
  let index = 0;

  for (const z of [0.078, -0.078]) {
    for (const x of xs) {
      dummy.position.set(x, 0.06, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      index += 1;
    }
  }

  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

function createPins(material) {
  const pitch = 0.108;
  const pinW = 0.058;
  const pinH = 0.2;
  const left = -BOARD_W / 2 + 0.08;
  const right = BOARD_W / 2 - 0.08;
  const notch0 = NOTCH_CENTER - NOTCH_W / 2 - 0.03;
  const notch1 = NOTCH_CENTER + NOTCH_W / 2 + 0.03;
  const positions = [];

  for (let x = left + pinW / 2; x <= right; x += pitch) {
    if (x > notch0 && x < notch1) continue;
    positions.push(x);
  }

  const geometry = new THREE.BoxGeometry(pinW, pinH, 0.055);
  const mesh = new THREE.InstancedMesh(geometry, material, positions.length);
  const dummy = new THREE.Object3D();

  positions.forEach((x, index) => {
    dummy.position.set(x, -BOARD_H / 2 - 0.045, 0.01);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

function createPinMarker(material) {
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), material);
  marker.position.set(-BOARD_W / 2 + 0.11, BOARD_H / 2 - 0.1, 0.085);
  return marker;
}
