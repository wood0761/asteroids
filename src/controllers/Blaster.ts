import * as THREE from 'three';
import { getBlasterEntities } from '../store/store';

export class Blaster {
  entities: any;
  scene: THREE.Scene;
  constructor(params) {
    this.entities = getBlasterEntities();
    this.scene = params.scene;
  }

  addOne(params) {
    const blast = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#39FF14' }));
    const offset = new THREE.Vector3(0, -1, -5);
    offset.applyQuaternion(params.target.quaternion);
    offset.add(params.target.position);
    blast.position.copy(offset);  
    this.scene.add(blast);

    const blastBB = new THREE.Sphere(blast.position, 1);
    const tmpQuaternion = params.target.quaternion.clone();
    const entity = { blast, offset, quaternion: tmpQuaternion, blastBB };
    this.entities.push(entity);
  }

  update() {
    if (!this.entities.length) return;
    this.entities.forEach(({blast, offset, quaternion}, index) => {
      if (index > 10) {
        this.entities[0].blast.geometry.dispose();
        this.entities.shift();
      }
      const direction = new THREE.Vector3(0, 0, -10);
      direction.applyQuaternion(quaternion);
      offset.add(direction);
      blast.position.copy(offset);
    })
  }
}

