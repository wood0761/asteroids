import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { constants } from '../helpers/constants.ts'
import { updateLoading } from '../store/store.ts';
export class AsteroidController {
  params: any;
  driftSpeed: number;
  constructor(params) {
    this.params = params;
    this.driftSpeed = 1;
    this.init(params);
  }

  init(params) {
    const loader = new GLTFLoader();
    this.loadAsteroid(loader).then((ast: THREE.Scene) => {
      for (let i=0; i<1; i++) {
        ast.name = `asteroid${i}`;

        const asteroid = ast.clone();
        const scale = this.randomIntFromInterval(85, 250);
        // asteroid.scale.set(scale,scale,scale);
        asteroid.scale.set(100, 100, 100)
        // const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(8000));
        // asteroid.position.set(2000, 0, 2600);
        asteroid.position.copy(constants.asteroid.startingPosition);

        // BOUDING SPHERE FOR COLLISION DETECTION
        const asteroidBB = new THREE.Sphere(asteroid.position, scale)
        // const driftDirection = constants.asteroid.startingDriftDirection;
        const driftDirection = new THREE.Vector3(1, 0, -1.5)
        // const driftDirection = this.getRandomDriftDirection();
        asteroid.userData.driftDirection = driftDirection;

        this.params.scene.add(asteroid);

        const minimapAsteroid = asteroid.clone();
        this.params.minimapScene.add(minimapAsteroid);

        params.asteroidEntities.push({ asteroid, minimapAsteroid, driftDirection, asteroidBB });

      }
      updateLoading();
    })
  } 

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  loadAsteroid(loader: GLTFLoader) {
    return new Promise((resolve, reject) => {
      loader.load('/assets/asteroid/scene.gltf', (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error));
    });
  }

  getRandomDriftDirection() {
    const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(1));
    return new THREE.Vector3(x, y, z).normalize();
  }

  update(asteroidEntities) {
    for (let i=0; i<asteroidEntities.length; i++) {
      let [x, y, z] = asteroidEntities[i].asteroid.position.toArray();
      if (Math.abs(x) > 2000) x = -x;
      if (Math.abs(y) > 2000) y = -y;
      if (Math.abs(z) > 2000) z = -z;
      asteroidEntities[i].asteroid.rotation.y += 0.00005;
      asteroidEntities[i].asteroid.position.set(x, y, z);
      asteroidEntities[i].asteroid.position.addScaledVector(asteroidEntities[i].driftDirection, this.driftSpeed)
      asteroidEntities[i].minimapAsteroid.position.copy(asteroidEntities[i].asteroid.position);
    }
  }
}