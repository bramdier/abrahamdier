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
  uniform float uProgress;
  uniform vec2 uOrigin;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uOrigin);
    float radius = uProgress * 1.6;
    float edge = smoothstep(radius - 0.08, radius, dist);
    float reveal = 1.0 - edge;

    gl_FragColor = vec4(uColor, reveal);
  }
`;

export class ModalScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.progress = 0;
    this.origin = new THREE.Vector2(0.5, 0.5);
    this.animating = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.uniforms = {
      uProgress: { value: 0 },
      uOrigin: { value: this.origin },
      uColor: { value: new THREE.Color(COLORS.dark) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    this.scene.add(this.mesh);

    this._onResize = () => this.resize();
    window.addEventListener("resize", this._onResize);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  setOrigin(clientX, clientY) {
    this.origin.set(
      clientX / window.innerWidth,
      1 - clientY / window.innerHeight
    );
    this.uniforms.uOrigin.value.copy(this.origin);
  }

  animateTo(target, duration = 0.85) {
    return new Promise((resolve) => {
      this.animating = true;
      const start = this.progress;
      const startTime = performance.now();

      const tick = (now) => {
        const t = Math.min((now - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - t, 3);
        this.progress = start + (target - start) * eased;
        this.uniforms.uProgress.value = this.progress;
        this.render();

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          this.progress = target;
          this.uniforms.uProgress.value = target;
          this.animating = false;
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });
  }

  open(clientX, clientY) {
    this.setOrigin(clientX, clientY);
    this.progress = 0;
    this.uniforms.uProgress.value = 0;
    return this.animateTo(1);
  }

  close() {
    return this.animateTo(0, 0.7);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener("resize", this._onResize);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.renderer.dispose();
  }
}
