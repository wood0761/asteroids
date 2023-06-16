import './style.css'
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { generateScene } from './scenes/LightsCameraSceneComposer.ts'
import { ThirdPersonCamera } from './controllers/ThirdPersonCamera.ts';
import { BasicCharacterController } from './controllers/BasicCharacterController.ts';
import { AsteroidController } from './controllers/AsteroidController.ts';
import { loadEarth, updateEarth, loadSun, loadStars, loadBlackHole } from './mesh/meshes.ts';
import { constants } from './helpers/constants.ts';
import { getLoading } from './store/store.ts';
import { generateMinimap } from './scenes/Minimap.ts';

class app {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  previousRAF: number;
  composer: EffectComposer;
  thirdPersonCamera: ThirdPersonCamera;
  characterControls: BasicCharacterController;
  asteroidControls: AsteroidController;
  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  mars: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  sun: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  mercury: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  blackHole: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  opacity: number;
  minimapRenderer: THREE.WebGLRenderer;
  minimapCamera: THREE.OrthographicCamera;
  minimapScene: THREE.Scene;
  shipBB: THREE.Box3;
  earthBB: THREE.Sphere;
  constructor() {
    this.init();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg') as HTMLCanvasElement   
    });
    this.renderer.setClearColor('gray', .01);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.opacity = 0;
    const info = document.querySelector("#info");
    const textNode = document.createTextNode('Press W A S D to move, Q E to roll, ARROWS to look around, and MOUSE or SHIFT to BOOST.'); 
    info.appendChild(textNode);

    this.earthBB = new THREE.Sphere();

    //RESIZE LISTENER
    window.addEventListener('resize', () => {
      this.onWindowResize();
    }, false);

    const { scene, camera, composer } = generateScene(this.renderer);
    this.camera = camera;
    this.scene = scene;
    this.composer = composer;

    const { minimapScene, minimapCamera, minimapRenderer } = generateMinimap();
    this.minimapScene = minimapScene;
    this.minimapCamera = minimapCamera;
    this.minimapRenderer = minimapRenderer;
    document.body.appendChild(this.minimapRenderer.domElement);
    
    const axesHelper = new THREE.AxesHelper( 500 );
    this.scene.add( axesHelper );


    this.previousRAF = null;

    this.loadMeshes();
    this.loadModels();
    this.RAF();
  }

  loadMeshes() {
    loadStars(this.scene);
    this.sun = loadSun();
    this.earth = loadEarth();
    this.earthBB = new THREE.Sphere(this.earth.position, constants.earth.radius);

    this.blackHole = loadBlackHole();
    this.scene.add(this.earth, this.sun, this.blackHole);
    const minimapSun = this.sun.clone();
    const minimapEarth = this.earth.clone();
    this.minimapScene.add(minimapSun, minimapEarth);
   
    // special glowing box
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(500, 0, 930)
    // Add the cube to the scene
    this.scene.add(cube);

  }

  loadModels() {
    this.asteroidControls = new AsteroidController({
      scene: this.scene,
      minimapScene: this.minimapScene
    })

    this.characterControls = new BasicCharacterController({
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      minimapScene: this.minimapScene,
    });

    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.characterControls,
    });
  }
 
  RAF() {
    requestAnimationFrame((t) => {
      if (this.previousRAF === null) this.previousRAF = t;
      this.RAF();

      this.composer.render();
      this.minimapRenderer.render(this.minimapScene, this.minimapCamera);

      this.step(t - this.previousRAF);
      this.previousRAF = t;
    });
  }

  step(timeElapsed: number) {
    // if (!getLoading() && this.opacity < 1) {
    //   let el = document.getElementById('curtain');
    //   this.opacity = this.opacity + 0.01;
    //   el.style.opacity = this.opacity.toString();
    // }
    const timeElapsedS = timeElapsed * 0.001;
    updateEarth(this.earth);
    if (this.asteroidControls) this.asteroidControls.update();
    if (this.characterControls) this.characterControls.update(this.earthBB)
    if (this.thirdPersonCamera) this.thirdPersonCamera.update(timeElapsedS);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new app();
});


// function _LerpOverFrames(frames, t) {
//   const s = new THREE.Vector3(0, 0, 0);
//   const e = new THREE.Vector3(100, 0, 0);
//   const c = s.clone();

//   for (let i = 0; i < frames; i++) {
//     c.lerp(e, t);
//   }
//   return c;
// }

// function _TestLerp(t1, t2) {
//   const v1 = _LerpOverFrames(100, t1);
//   const v2 = _LerpOverFrames(50, t2);
//   console.log(v1.x + ' | ' + v2.x);
// }

// _TestLerp(0.01, 0.01);
// _TestLerp(1.0 / 100.0, 1.0 / 50.0);
// _TestLerp(1.0 - Math.pow(0.3, 1.0 / 100.0), 
//           1.0 - Math.pow(0.3, 1.0 / 50.0));