import * as THREE from 'three';
import { BasicCharacterController } from './BasicCharacterController.ts';
import { constants } from '../helpers/constants.ts';

export class ThirdPersonCamera {
  camera: THREE.PerspectiveCamera;
  target: BasicCharacterController;
  currentPosition: THREE.Vector3;
  currentLookAt: THREE.Vector3;
  currentRotation: THREE.Quaternion;
  constructor({ camera, target}) {
    this.camera = camera;
    this.target = target;
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
    this.currentRotation = new THREE.Quaternion();
    this.onLoad();
  }

  calculateIdealOffset() {
    // const idealOffset = new THREE.Vector3(-15, 20, -30);

    // const idealOffset = new THREE.Vector3(0, 0.5, 1.9);
    const idealOffset = new THREE.Vector3(0, 1, 5)
    if (this.target?.Rotation) idealOffset.applyQuaternion(this.target.Rotation);
    if (this.target?.Position) idealOffset.add(this.target.Position);
    return idealOffset;
  }

  calculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 0.5, 0);
    // const idealLookat = new THREE.Vector3(0, 10, 50);
    if (this.target?.Rotation) idealLookat.applyQuaternion(this.target.Rotation);
    if (this.target?.Position) idealLookat.add(this.target.Position);
    return idealLookat;
  }

  onLoad() {
    this.camera.position.copy(constants.camera.startingPosition);
    this.camera.rotation.copy(constants.camera.startingRotation);
  }


  update(timeElapsed) {
    const idealOffset = this.calculateIdealOffset();
    const idealLookat = this.calculateIdealLookat();
    const idealRotation = this.target?.Rotation;
    // const t = 0.9;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);
    if (this.currentPosition) this.currentPosition.lerp(idealOffset, t);
    if (this.currentLookAt) this.currentLookAt.lerp(idealLookat, t);
    if (this.currentRotation) this.currentRotation.slerp(idealRotation, t);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
    this.camera.setRotationFromQuaternion(this.currentRotation);
  }
}