import * as THREE from 'three';

export class Blaster {
  balls: any;
  scene: THREE.Scene;
  constructor(params) {
    console.log(params)
    this.balls = [];
    this.scene = params.scene;
  }

  addOne(params) {
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#39FF14' }));
    const offset = new THREE.Vector3(0, -1, -5);
    offset.applyQuaternion(params.target.quaternion);
    offset.add(params.target.position);
    ball.position.copy(offset);  

    this.scene.add(ball);
    const tmpQuaternion = params.target.quaternion.clone();
    const thingz = { ball, trajectory: offset, quaternion: tmpQuaternion}
    this.balls.push(thingz);
  }

  update() {
    if (!this.balls.length) return;
    this.balls.forEach(({ball, trajectory, quaternion}) => {
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(quaternion);
      trajectory.add(direction);
      ball.position.copy(trajectory);

    })
  }

}

