import * as THREE from 'three';

export class Explosion {
  particleGroup: THREE.Group;
  explosion: boolean;
  particleTexture: THREE.Texture;
  numberParticles: number;
  spd: number;
  color: THREE.Color;
  scene: THREE.Scene;
  constructor(params) {
    this.scene = params.scene;
    this.particleGroup = new THREE.Group();
    this.explosion = false;
    this.particleTexture = new THREE.TextureLoader().load('explosion-single.png');
    this.numberParticles = 5;
    this.spd = 0.01;
    // this.color = new THREE.Color();

    this.makeParticles(params.blast, params.asteroid);
  }

  makeParticles(blast, asteroid) {
    // this.color.setHSL(Math.random(), 1, 0.5);
    for (let i=0; i<this.numberParticles; i++) {
      const particleMaterial = new THREE.SpriteMaterial({ 
        map: this.particleTexture, 
        depthTest: false 
      });
      const sprite = new THREE.Sprite(particleMaterial);
      sprite.material.blending = THREE.AdditiveBlending;

      sprite.userData.velocity = new THREE.Vector3(
        Math.random() * this.spd - this.spd / 2,
        Math.random() * this.spd - this.spd / 2,
        Math.random() * this.spd - this.spd / 2
      )
      // sprite.userData.velocity.multiplyScalar(Math.random() * Math.random() * 30 + 2);

      sprite.material.opacity = Math.random() * 0.2 + 0.8;
      
      // let size = Math.random() * 0.1 + 0.1;
      const size = Math.random() * 0.1 + 5;
      // let size = 100;
      sprite.scale.set(size, size, size);
      
      sprite.userData.driftDirection = asteroid.userData.driftDirection.clone();

      this.particleGroup.add(sprite);

      this.particleGroup.position.set(blast.position.x, blast.position.y, blast.position.z);
      this.explosion = true;

      this.scene.add(this.particleGroup);
    }
  }

  update() {
    this.particleGroup.children.forEach((child: THREE.Sprite) => {
      if (child.material.opacity < 0.01) return this.particleGroup.remove(child);
    
      const v = child.userData.driftDirection.clone();
      // v.x += Math.random() * 0.2 - 0.1;
      // v.y += Math.random() * 0.2 - 0.1;
      // v.z += Math.random() * 0.2 - 1;
      // v.z -= 10;
      child.position.addScaledVector(v, 0.55);

      child.material.opacity -= 0.02;
    });


    if (this.particleGroup.children.length === 0) {
      this.explosion = false;
      this.scene.remove(this.particleGroup);
    }
  }
}