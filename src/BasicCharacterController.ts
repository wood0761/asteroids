import * as THREE from 'three';
import { BasicCharacterControllerInput } from './BasicCharacterControllerInput.ts';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { constants } from './constants.ts'
import { updateLoading } from './store.ts';

export class BasicCharacterController {
  params: any;
  scene: THREE.Scene;
  input: BasicCharacterControllerInput;
  target: THREE.Scene;
  velocity: THREE.Vector3;
  position: THREE.Vector3;
  deceleration: number;
  tmpQuaternion: THREE.Quaternion;
  moveMultiplier: number;
  rotationMultiplier: number;
  minimapScene: THREE.Scene;
  minimapTarget: THREE.Scene;

  constructor(params) {
    this.init(params);
  }

  init(params) {
    this.params = params;
    this.input = new BasicCharacterControllerInput();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.position = new THREE.Vector3();
    this.tmpQuaternion = new THREE.Quaternion();
    this.minimapTarget = new THREE.Scene();

    const loader = new GLTFLoader();
    this.loadCharacter(loader).then((spaceship: THREE.Scene) => {
      spaceship.position.copy(constants.ship.startingPosition);
      this.target = spaceship;
      this.target.name = 'spaceship'
      this.target.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.target.scale.set(0.4, 0.4, 0.4);
      this.params.scene.add(this.target);

      this.minimapTarget = this.target.clone();
      this.minimapTarget.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshBasicMaterial({ color: '#39FF14' });
        }
      })
      this.minimapTarget.scale.set(250, 250, 250);
      this.params.minimapScene.add(this.minimapTarget);
    });

    this.loadAsteroid(loader).then((ast: THREE.Scene) => {
      for (let i=0; i<100; i++) {
        const asteroid = ast.clone();
        asteroid.scale.set(100,100,100)
        const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(8000));
        asteroid.position.set(x, y, z);
        this.params.scene.add(asteroid);

        const minimapAsteroid = asteroid.clone();
        this.params.minimapScene.add(minimapAsteroid);
      }
      updateLoading();
    })

    document.addEventListener('keydown', (e) => {
      this.input.onKeyDown(e);
    }, false);
    document.addEventListener('keyup', (e) => {
      this.input.onKeyUp(e);
    }, false);
  } 

  loadCharacter(loader: GLTFLoader) {
    return new Promise((resolve, reject) => {
      loader.load('/assets/spaceship_nortend/scene.gltf', (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error));
    });
  }

  loadAsteroid(loader: GLTFLoader) {
    return new Promise((resolve, reject) => {
      loader.load('/assets/asteroid/scene.gltf', (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error));
    });
  }

  get Position() {
    if (!this.target) {
      return new THREE.Vector3();
    }
    return this.position;
  }

  get Rotation() {
    if (!this.target) {
      return new THREE.Quaternion();
    }
    return this.target?.quaternion;
  }

  update() {
    const controlObject = this.target;
		const moveVector = new THREE.Vector3( 0, 0, 0 );
		const rotationVector = new THREE.Vector3( 0, 0, 0 );

    this.moveMultiplier = constants.ship.moveMultiplier;
    this.rotationMultiplier = constants.ship.rotationMultiplier;

    this.deceleration = constants.ship.deceleration;
    // BOOST
    if (this.input.keys.shift) this.moveMultiplier *= constants.ship.boostMultiplier;
    // if (this.input.keys.shift && !this.input.keys.shift) this.rotationMultiplier *= constants.ship.boostMultiplier;

    if (controlObject) {
      moveVector.x = ( - this.input.keys.left + this.input.keys.right );
			moveVector.y = ( - this.input.keys.down + this.input.keys.up);
			moveVector.z = ( - this.input.keys.forward + this.input.keys.back);

      // UPDATE VELOCITY
      if (moveVector.x !== 0) this.velocity.x = moveVector.x;
      if (moveVector.y !== 0) this.velocity.y = moveVector.y;
      if (moveVector.z !== 0) this.velocity.z = moveVector.z;
  
			this.target.translateX( this.velocity.x * constants.ship.moveMultiplierX);
			this.target.translateY( (this.velocity.y * this.moveMultiplier));  
			this.target.translateZ( this.velocity.z * this.moveMultiplier);

      this.velocity.x *= this.deceleration;
      this.velocity.y *= this.deceleration;
      this.velocity.z *= this.deceleration;

      // UPDATE ROTATION if !zero update temporary quaternion
      rotationVector.x = ( - this.input.keys.pitchDown + this.input.keys.pitchUp);
			rotationVector.y = ( - this.input.keys.yawRight + this.input.keys.yawLeft);
			rotationVector.z = ( - this.input.keys.rollRight + this.input.keys.rollLeft);

      if (rotationVector.x !== 0) this.tmpQuaternion.x = rotationVector.x * this.rotationMultiplier;
      if (rotationVector.y !== 0) this.tmpQuaternion.y = rotationVector.y * this.rotationMultiplier;
      if (rotationVector.z !== 0) this.tmpQuaternion.z = rotationVector.z * this.rotationMultiplier * 2;

      this.tmpQuaternion.x *= this.deceleration;
      this.tmpQuaternion.y *= this.deceleration;
      this.tmpQuaternion.z *= this.deceleration;

      this.target.quaternion.normalize();
      this.target.quaternion.multiply( this.tmpQuaternion );

      this.position.copy(this.target.position);
      this.minimapTarget.position.copy(this.target.position);
      this.minimapTarget.quaternion.copy(this.target.quaternion);
      // this.target.quaternion.copy(this.tmpQuaternion)
      // const EPS = 0.000001;

      // if (
			// 	this.position.distanceToSquared( this.target.position ) > EPS ||
			// 	8 * ( 1 - this.tmpQuaternion.dot( this.target.quaternion ) ) > EPS
			// ) {
      //   this.target.quaternion.copy(new THREE.Quaternion(0, 0, 0, 1));
			// 	// scope.dispatchEvent( _changeEvent );
			// 	// lastQuaternion.copy( scope.object.quaternion );
      //   // this.tmpQuaternion.copy()
			// 	// lastPosition.copy( scope.object.position );
      //   this.position.copy(this.target.position);

			// }
    }
  }
};