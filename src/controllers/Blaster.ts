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

  update() {
    this.time = this.clock.getElapsedTime();
    if (!this.entities.length) return;
    this.entities.forEach(({blast, offset, quaternion, startTime}, index) => {
      const direction = new THREE.Vector3(0, 0, -10);
      direction.applyQuaternion(quaternion);
      offset.add(direction);
      blast.position.copy(offset);

      if (startTime + 5 < this.time) {
        this.entities[0].blast.geometry.dispose();
        this.entities[0].blast.material.dispose();
        this.entities.shift();
      }
    })
    console.log(this.entities)
  }
}

