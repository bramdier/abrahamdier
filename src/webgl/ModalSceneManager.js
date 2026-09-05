import { ModalScene } from "./ModalScene.js";

export class ModalSceneManager {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.reducedMotion = reducedMotion;
    this.scene = reducedMotion ? null : new ModalScene(canvas);
  }

  open(clientX, clientY) {
    if (!this.scene) return Promise.resolve();
    return this.scene.open(clientX, clientY);
  }

  close() {
    if (!this.scene) return Promise.resolve();
    return this.scene.close();
  }

  destroy() {
    this.scene?.destroy();
  }
}
