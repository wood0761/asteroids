import * as THREE from 'three';
// import { EventBus } from '../helpers/eventBus.ts';

export class Explosion {
  particleGroup: THREE.Group;
  explosion: boolean;
  particleTexture: THREE.Texture;
  numberParticles: number;
  spd: number;
  color: THREE.Color;
  scene: any;
  // explosions: any;
  constructor(params) {
    this.scene = params.scene;
    this.particleGroup = new THREE.Group();
    this.explosion = false;
    this.particleTexture = new THREE.TextureLoader().load('explosion-single.png');
    // this.numberParticles = Math.random() * 200 + 100;
    this.numberParticles = 100;
    this.spd = 0.01;
    this.color = new THREE.Color();
    this.explosion = true;

    // this.explosions = [];
    // EventBus.subscribe('asteroidHit', this.makeParticles.bind(this));
    // this.makeParticles();
  }

  makeParticles(blast) {
    console.log(blast)
    // this.color.setHSL(Math.random(), 1, 0.5);
    for (let i=0; i<this.numberParticles; i++) {
      let particleMaterial = new THREE.SpriteMaterial({ 
        map: this.particleTexture, 
        color: this.color, 
        depthTest: false 
      });
      let sprite = new THREE.Sprite(particleMaterial);
      sprite.material.blending = THREE.AdditiveBlending;

      sprite.userData.velocity = new THREE.Vector3(
        Math.random() * this.spd - this.spd / 2,
        Math.random() * this.spd - this.spd / 2,
        Math.random() * this.spd - this.spd / 2
      )
      sprite.userData.velocity.multiplyScalar(Math.random() * Math.random() * 3 + 2);

      sprite.material.opacity = Math.random() * 0.2 + 0.8;

      // let size = Math.random() * 0.1 + 0.1;
      let size = Math.random() * 0.1 + 2;
      // let size = 100;
      sprite.scale.set(size, size, size);

      this.particleGroup.add(sprite);

      this.particleGroup.position.set(blast.position.x, blast.position.y, blast.position.z);
      this.explosion = true;

      this.scene.add(this.particleGroup);
    }
  }

  update() {
    this.particleGroup.children.forEach((child) => {
      if (child.type === 'Sprite') {
        child.position.add(child.userData.velocity);
        console.log(child.material)
        child.material.opacity -= 0.01;
        
        if (child.material.opacity < 0.01) {
          this.particleGroup.remove(child);
        }
        // console.log(child)
        // console.log(child.material.opacity)
      }
    })

    // let children = this.particleGroup.children.filter((child) => {
    //   child.material.opacity > 0.0;
    // });
    // console.log(this.particleGroup)
    if (this.particleGroup.children.length === 0) {
      this.explosion = false;
    }
    // explosions = explosions.filter((exp) => exp.explosion);
  }

}