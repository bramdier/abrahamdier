import * as THREE from "three";
import { BackgroundScene } from "./BackgroundScene.js";

export class SceneManager {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.reducedMotion = options.reducedMotion ?? false;
    this.isMobile = options.isMobile ?? window.innerWidth < 768;
    this.clock = new THREE.Clock();
    this.running = !this.reducedMotion;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.background = new BackgroundScene({
      reducedMotion: this.reducedMotion,
      isMobile: this.isMobile,
    });

    this.progress = 0;
    this.activeIndex = 0;

    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.isMobile = window.innerWidth < 768;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  setProgress(progress) {
    this.progress = progress;
    this.background.setProgress(progress);
  }

  setActiveIndex(index) {
    this.activeIndex = index;
    this.background.setActiveIndex(index);
  }

  start() {
    if (!this.running) return;
    this.renderer.setAnimationLoop(() => this.tick());
  }

  stop() {
    this.running = false;
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = this.clock.getDelta();
    this.background.update(delta);
    this.background.render(this.renderer);
  }
}
