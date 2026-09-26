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

    // --- Floating 3D Triangles (Tetrahedrons) ---
    this.triangles = [];
    const triangleCount = isMobile ? 8 : 15;
    const triangleGeo = new THREE.TetrahedronGeometry(0.5);
    const triangleMat = new THREE.MeshBasicMaterial({
      color: 0x9a442d,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < triangleCount; i++) {
      const mesh = new THREE.Mesh(triangleGeo, triangleMat);
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 12;
      mesh.position.z = (Math.random() - 0.5) * 4;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      // Random speed for animation
      mesh.userData = {
        speed: 0.1 + Math.random() * 0.3,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.02
      };
      
      this.triangles.push(mesh);
      this.scene.add(mesh);
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
        
        mesh.position.x += mesh.userData.speed * delta * 0.3;
        if (mesh.position.x > 10) {
          mesh.position.x = -10;
        }
      }
    }
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }
}
