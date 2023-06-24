import * as THREE from 'three';
import { EventBus } from '../helpers/eventBus.ts';

export class Blaster {
  entities: any;
  scene: THREE.Scene;
  time: any;
  clock: THREE.Clock;
  constructor(params) {
    this.entities = [];
    this.scene = params.scene;
    this.clock = new THREE.Clock();

    EventBus.subscribe('shoot', this.addOne.bind(this));
  }

  addOne({position, quaternion}) { 
    const blast = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#39FF14' }));
    const offset = new THREE.Vector3(0, -1, -5);
    offset.applyQuaternion(quaternion);
    offset.add(position);
    blast.position.copy(offset);  
    this.scene.add(blast);

    const blastBB = new THREE.Sphere(blast.position, 1);
    const tmpQuaternion = quaternion.clone();
    const entity = { blast, offset, quaternion: tmpQuaternion, blastBB, startTime: this.time };
    this.entities.push(entity);
  }

  checkCollision(blast, asteroid) {
    const dx = blast.center.x - asteroid.center.x;
    const dy = blast.center.y - asteroid.center.y;
    const dz = blast.center.z - asteroid.center.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance < blast.radius + asteroid.radius;
  }

  update(asteroidEntities) {
    this.time = this.clock.getElapsedTime();
    if (!this.entities.length) return;

    this.entities.forEach(({blast, offset, quaternion, startTime, blastBB}, i) => {
      if (startTime + 5 > this.time) {
        const direction = new THREE.Vector3(0, 0, -10);
        direction.applyQuaternion(quaternion);
        offset.add(direction);
        blast.position.copy(offset);

        asteroidEntities.forEach(({asteroid, asteroidBB}) => {
          if (this.checkCollision(blastBB, asteroidBB)) {
            console.log('asteroid hit')
            EventBus.publish('asteroidHit', {asteroid, asteroidBB, blast});
            this.cleanup(blast, i)
          }
        })

      } else {
        this.cleanup(blast, i);
      }
    })
  }

  cleanup(blast, i) {
    blast.geometry.dispose();
    blast.material.dispose(); 
    this.scene.remove(blast);
    this.entities.splice(i, 1);
  }
}

