import * as THREE from 'three';
import { EventBus } from '../helpers/eventBus.ts';

export class ParticleSystem {
  particles: any;
  scene: any;
  positions: Float32Array;
  constructor(params) {
    this.particles = null;
    this.scene = null;
    this.positions = new Float32Array(3);


    EventBus.subscribe('asteroidHit', this.addOne.bind(this));

    this.init(params);
  }

  init(params) {
    this.particles = new THREE.BufferGeometry();
    
    // const positions = new Float32Array(1000 * 3); // Three components (x, y, z) for each particle
    // Set random positions for each particle
    // for (let i = 0; i < 1000; i++) {
    //   const index = i * 3;
    //   positions[index] = Math.random() * 200 - 100; // x
    //   positions[index + 1] = Math.random() * 200 - 100; // y
    //   positions[index + 2] = Math.random() * 200 - 100; // z
    // }
    // const positions = [-250, 100, -700];
    this.positions[0] = -250;
    this.positions[1] = 100;
    this.positions[2] = -700;

    // new THREE.Vector3(-250, 100, -700)
    this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.5 });
    const particleSystem = new THREE.Points(this.particles, particleMaterial);
    
    const textureLoader = new THREE.TextureLoader();
    const spriteTexture = textureLoader.load('explosion-single.png');
    
    const spriteMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 20,
      map: spriteTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
    });
    
    particleSystem.material = spriteMaterial;
    
    params.scene.add(particleSystem);
  }

  addOne({blast}) {
    this.positions
    // this.positions.push(position);
  }

  update() {
    const positions = this.particles.getAttribute('position').array as Float32Array;
    
    for (let i = 0; i < positions.length; i++) {
      let index = i * 3;
      positions[index] += Math.random() * 0.2 - 0.1; // Update x position
      positions[index + 1] += Math.random() * 0.2 - 0.1; // Update y position
      positions[index + 2] += Math.random() * 0.2 - 0.1; // Update z position
    }
  
    this.particles.getAttribute('position').needsUpdate = true;
  } 
}

