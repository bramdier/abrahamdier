import * as THREE from "three";
import { COLORS } from "../data/colors.js";
import { SLIDE_COUNT } from "../data/slides.js";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

export class BackgroundScene {
  constructor({ reducedMotion = false, isMobile = false } = {}) {
    this.reducedMotion = reducedMotion;
    this.isMobile = isMobile;
    this.progress = 0;
    this.activeIndex = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.bgUniforms = {
      uColor: { value: new THREE.Color(COLORS.light) },
    };

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.bgUniforms,
      depthWrite: false,
    });

    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial);
    this.scene.add(bgMesh);

    const particleCount = isMobile ? 120 : 280;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.2 + Math.random() * 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x9a442d,
      size: isMobile ? 0.04 : 0.06,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, particleMaterial);
    this.particleSpeeds = speeds;
    this.scene.add(this.particles);

    // Orthographic camera only sees x/y in [-1, 1] and z in (-1, 0).
    // One cluster per slide, all inside that view, so every page shows them.
    this.triangles = [];
    const perPage = isMobile ? 1 : 2;
    const triangleGeo = new THREE.TetrahedronGeometry(0.14);
    const triangleMat = new THREE.MeshBasicMaterial({
      color: COLORS.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });

    for (let page = 0; page < SLIDE_COUNT; page++) {
      for (let i = 0; i < perPage; i++) {
        const mesh = new THREE.Mesh(triangleGeo, triangleMat);
        const slot = page * perPage + i;
        const cols = isMobile ? 3 : 4;
        const col = slot % cols;
        const row = Math.floor(slot / cols);
        const rows = Math.ceil((SLIDE_COUNT * perPage) / cols);

        mesh.position.x = -0.78 + ((col + 0.35 + Math.random() * 0.3) / cols) * 1.56;
        mesh.position.y = 0.72 - ((row + 0.35 + Math.random() * 0.3) / rows) * 1.44;
        mesh.position.z = -0.35 - Math.random() * 0.45;

        mesh.scale.setScalar(0.75 + Math.random() * 0.7);
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        mesh.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.012,
          rotSpeedY: (Math.random() - 0.5) * 0.012,
          rotSpeedZ: (Math.random() - 0.5) * 0.012,
          driftX: (Math.random() - 0.5) * 0.05,
          driftY: (Math.random() - 0.5) * 0.04,
        };

        this.triangles.push(mesh);
        this.scene.add(mesh);
      }
    }
  }

  setProgress(progress) {
    this.progress = progress;
  }

  setActiveIndex(index) {
    this.activeIndex = index;
  }

  update(delta) {
    if (this.reducedMotion) return;

    // Animate particles
    const positions = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < this.particleSpeeds.length; i++) {
      positions[i * 3] += this.particleSpeeds[i] * delta * 0.3;
      if (positions[i * 3] > 10) {
        positions[i * 3] = -10;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.rotation.z = this.progress * 0.15;

    // Animate 3D Triangles
    if (this.triangles) {
      for (const mesh of this.triangles) {
        mesh.rotation.x += mesh.userData.rotSpeedX;
        mesh.rotation.y += mesh.userData.rotSpeedY;
        mesh.rotation.z += mesh.userData.rotSpeedZ;

        mesh.position.x += mesh.userData.driftX * delta;
        mesh.position.y += mesh.userData.driftY * delta;
        if (mesh.position.x > 0.92) mesh.position.x = -0.92;
        if (mesh.position.x < -0.92) mesh.position.x = 0.92;
        if (mesh.position.y > 0.88) mesh.position.y = -0.88;
        if (mesh.position.y < -0.88) mesh.position.y = 0.88;
      }
    }
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }
}
