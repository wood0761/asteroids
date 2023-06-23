import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { constants } from '../helpers/constants.ts'
import { updateLoading } from '../store/store.ts';
export class AsteroidController {
  params: any;
  driftSpeed: number;
  constructor(params) {
    this.params = params;
    this.driftSpeed = 0.5;
    this.init(params);
  }

  init(params) {
    const loader = new GLTFLoader();
    this.loadAsteroid(loader).then((ast: THREE.Scene) => {
      for (let i=0; i<10; i++) {
        ast.name = `asteroid${i}`;

        const asteroid = ast.clone();
        const scale = this.randomIntFromInterval(85, 250);
        asteroid.scale.set(scale,scale,scale);
        const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(8000));
        asteroid.position.set(x, y, z);

        // BOUDING SPHERE FOR COLLISION DETECTION
        const asteroidBB = new THREE.Sphere(asteroid.position, scale)

        this.params.scene.add(asteroid);

        const minimapAsteroid = asteroid.clone();
        this.params.minimapScene.add(minimapAsteroid);

        const driftDirection = this.getRandomDriftDirection();
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
      if (Math.abs(x) > 4000) x = -x;
      if (Math.abs(y) > 4000) y = -y;
      if (Math.abs(z) > 4000) z = -z;
      asteroidEntities[i].asteroid.rotation.y += 0.005;
      asteroidEntities[i].asteroid.position.set(x, y, z);
      asteroidEntities[i].asteroid.position.addScaledVector(asteroidEntities[i].driftDirection, this.driftSpeed)
      asteroidEntities[i].minimapAsteroid.position.copy(asteroidEntities[i].asteroid.position);
    }
  }
};