import './style.css'
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { generateScene } from './scenes/LightsCameraSceneComposer.ts'
import { ThirdPersonCamera } from './controllers/ThirdPersonCamera.ts';
import { BasicCharacterController } from './controllers/BasicCharacterController.ts';
import { AsteroidController } from './controllers/AsteroidController.ts';
import { Blaster } from './controllers/Blaster.ts';
import { loadSun, loadStars, loadBlackHole } from './mesh/meshes.ts';
import { constants } from './helpers/constants.ts';
// import { getLoading } from './store/store.ts';
import { generateMinimap } from './scenes/Minimap.ts';
import { ParticleSystem } from './controllers/ParticleSystem.ts';
import { Explosion } from './controllers/Explosion.ts'
import { EventBus } from './helpers/EventBus.ts';

class app {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  // clock: THREE.Clock;
  previousRAF: number;
  composer: EffectComposer;
  thirdPersonCamera: ThirdPersonCamera;
  characterControls: BasicCharacterController;
  asteroidControls: AsteroidController;
  mars: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  sun: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  blackHole: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  opacity: number;
  minimapRenderer: THREE.WebGLRenderer;
  minimapCamera: THREE.OrthographicCamera;
  minimapScene: THREE.Scene;
  earthBB: THREE.Sphere;
  // raycaster: THREE.Raycaster;
  asteroidEntities: any;
  blaster: Blaster;
  blasterEntities: any;
  // particleSystem: ParticleSystem;
  // explosion: Explosion; 
  explosionArray: Explosion[];
  particleArray: any[];
  constructor() {
    this.asteroidEntities = [];
    this.blasterEntities = [];
    this.explosionArray = [];
    this.particleArray = [];
    EventBus.subscribe('asteroidHit', this.asteroidHit.bind(this));
    // this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg') as HTMLCanvasElement   
    });
    // this.renderer.setClearColor('gray', .01);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // this.opacity = 0;
    const info = document.querySelector("#info");
    const textNode = document.createTextNode('Press W A S D to move, Q E to roll, ARROWS to look around, and MOUSE or SHIFT to BOOST.'); 
    info.appendChild(textNode);

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
    // this.raycaster = new THREE.Raycaster();


    this.previousRAF = null;

    this.loadMeshes();
    this.loadModels();
    this.RAF();
  }

  loadMeshes() {
    loadStars(this.scene);
    this.sun = loadSun();


    this.blackHole = loadBlackHole();
    this.scene.add(this.sun, this.blackHole);
    const minimapSun = this.sun.clone();
    this.minimapScene.add(minimapSun);

    // special glowing box
    // const geometry = new THREE.BoxGeometry(200, 200, 200);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(500, 0, 930)
    // // Add the cube to the scene
    // this.scene.add(cube);
    // const minmapCube = cube.clone();
    // this.minimapScene.add(minmapCube);

  }

  loadModels() {
    this.asteroidControls = new AsteroidController({
      scene: this.scene,
      minimapScene: this.minimapScene,
      asteroidEntities: this.asteroidEntities,
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

    this.blaster = new Blaster({ 
      scene: this.scene, 
      blasterEntities: this.blasterEntities 
    });

    // this.particleSystem  = new ParticleSystem({scene: this.scene})

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
    const timeElapsedS = timeElapsed * 0.001;
    // console.log(timeElapsedS)
    if (this.asteroidControls) this.asteroidControls.update(this.asteroidEntities);
    if (this.characterControls) this.characterControls.update();
    if (this.thirdPersonCamera) this.thirdPersonCamera.update(timeElapsedS);
    if (this.blaster) this.blaster.update(this.asteroidEntities);
    // if (this.particleSystem) this.particleSystem.update();
    // if (this.explosion) this.explosion.update();
    // if (this.explosionArray.length) this.explosionArray.forEach((exp) => exp.update());
    // this.explosionArray = this.explosionArray.filter((exp) => exp.explosion);
    if (this.particleArray.length) this.particleArray.forEach((particle) => particle.update());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  asteroidHit({blast, asteroid}) {
    // const explosion = new Explosion({scene: this.scene, blast, asteroid});
    // this.explosionArray.push(explosion);
    const particle = new ParticleSystem({scene: this.scene, blast, asteroid});
    this.particleArray.push(particle);
  }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new app();
});

