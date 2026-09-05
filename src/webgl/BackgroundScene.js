import * as THREE from "three";
import { COLORS } from "../data/colors.js";

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
  }

  setProgress(progress) {
    this.progress = progress;
  }

  setActiveIndex(index) {
    this.activeIndex = index;
  }

  update(delta) {
    if (this.reducedMotion) return;

    const positions = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < this.particleSpeeds.length; i++) {
      positions[i * 3] += this.particleSpeeds[i] * delta * 0.3;
      if (positions[i * 3] > 10) {
        positions[i * 3] = -10;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.rotation.z = this.progress * 0.15;
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }
}
