import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { constants } from '../helpers/constants.ts'
import { updateLoading } from '../store/store.ts';

export class AsteroidController {
  params: any;
  driftSpeed: number;
  entities: any[];
  constructor(params) {
    this.init(params);
  }

  init(params) {
    this.params = params;
    this.driftSpeed = 5;
    this.entities = [];
    const loader = new GLTFLoader();
    this.loadAsteroid(loader).then((ast: THREE.Scene) => {
      ast.name = 'asteroid';
      for (let i=0; i<10; i++) {
        const asteroid = ast.clone();
        const scale = this.randomIntFromInterval(85, 250);
        asteroid.scale.set(scale,scale,scale);
        const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(8000));
        asteroid.position.set(x, y, z);

        // BOUDING BOX FOR COLLISION DETECTION
        const asteroidBB = new THREE.Box3().setFromObject(asteroid);
        
        this.params.scene.add(asteroid);

        const minimapAsteroid = asteroid.clone();
        this.params.minimapScene.add(minimapAsteroid);

        const driftDirection = this.getRandomDriftDirection();
        this.entities.push({ asteroid, minimapAsteroid, driftDirection });

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

  update() {
    for (let i=0; i<this.entities.length; i++) {
      let [x, y, z] = this.entities[i].asteroid.position.toArray();
      if (Math.abs(x) > 4000) x = -x;
      if (Math.abs(y) > 4000) y = -y;
      if (Math.abs(z) > 4000) z = -z;
      this.entities[i].asteroid.rotation.y += 0.005;
      this.entities[i].asteroid.position.set(x, y, z);
      this.entities[i].asteroid.position.addScaledVector(this.entities[i].driftDirection, this.driftSpeed)
      this.entities[i].minimapAsteroid.position.copy(this.entities[i].asteroid.position);
    }
  }
};