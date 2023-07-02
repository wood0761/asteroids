import * as THREE from 'three';
import { EventBus } from '../helpers/EventBus.ts';

export class ParticleSystem {
  positions: Float32Array;
  explosion: boolean;
  numParticles: number;
  particles: THREE.BufferGeometry;
  particleSystem: THREE.Points;
  scene: THREE.Scene;
  constructor(params) {
    this.particles = null;
    this.numParticles = 1000;
    this.scene = params.scene;
    this.positions = new Float32Array(3 * 1000);
    this.explosion = false;
    // EventBus.subscribe('asteroidHit', this.addOne.bind(this));

    this.makeParticles(params.blast, params.asteroid);
  }

  makeParticles(blast, asteroid) {
    this.particles = new THREE.BufferGeometry();
    const [ x, y, z ] = blast.position.toArray();
    // Set random positions for each particle
    for (let i = 0; i < this.numParticles / 3; i++) {
      const index = i * 3;
      this.positions[index] = x + Math.random() * 5; // x
      this.positions[index + 1] = y + Math.random() * 5; // y
      this.positions[index + 2] = z + Math.random() * 5; // z
    }

    this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xff0000 });
    this.particleSystem = new THREE.Points(this.particles, particleMaterial);
    const textureLoader = new THREE.TextureLoader();
    const spriteTexture = textureLoader.load('explosion-single.png');
    
    const spriteMaterial = new THREE.PointsMaterial({
      // color: 0xffffff,
      size: 1,
      // blendDst: THREE.OneMinusSrcAlphaFactor,
      // blendSrc: THREE.SrcAlphaFactor,
      map: spriteTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
    });

    this.particleSystem.material = spriteMaterial;
    this.particleSystem.userData.driftDirection = asteroid.userData.driftDirection.clone();
    this.scene.add(this.particleSystem);
    this.explosion = true;
  }

  update() {
  
    // const positions = this.particles.getAttribute('position').array as Float32Array;
    if ((<THREE.PointsMaterial>this.particleSystem.material).opacity < 0.01) {
      this.explosion = false;
      return this.scene.remove(this.particleSystem);
    }
    (<THREE.PointsMaterial>this.particleSystem.material).opacity -= 0.01;
    const v = this.particleSystem.userData.driftDirection.clone();

    // const v = this.particleSystem.userData.driftDirection.clone();
    for (let i = 0; i < this.positions.length / 3; i++) {
      const index = i * 3;
      const thang = new THREE.Vector3(this.positions[index], this.positions[index + 1], this.positions[index + 2]);
      thang.addScaledVector(v, 0.5);
      const [x, y, z] = thang.toArray();
      this.positions[index] += x + Math.random() * 0.2 - 0.1; // Update x position
      this.positions[index + 1] += y +  Math.random() * 0.2 - 0.1; // Update y position
      this.positions[index + 2] += z + Math.random() * 0.2 - 0.1; // Update z position
      // this.positions[index] += Math.random() * 0.2 - 0.1; // Update x position
      // this.positions[index + 1] += Math.random() * 0.2 - 0.1; // Update y position
      // this.positions[index + 2] += Math.random() * 0.2 - 0.1; // Update z position
    }
  
    this.particles.getAttribute('position').needsUpdate = true;
  } 
}

