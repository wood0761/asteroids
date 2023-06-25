import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { constants } from '../helpers/constants';

export const generateScene = (renderer) => {
  //CAMERA
  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, constants.camera.visionDepth);

  //SCENE
  const scene = new THREE.Scene();

  //LIGHTS 0xffffff, 1, 1000, 1
  // const pointLight = new THREE.PointLight(
  //   0xffffff, 
  //   constants.light.lightIntensity, 
  //   constants.light.lightDistance, 
  //   constants.light.lightDecay);
  // pointLight.position.set(4000, 0, 0);
  // const ambientLight = new THREE.AmbientLight(0xffffff);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(4000, 0, 0);
  // directionalLight.target default is 0, 0, 0
  scene.add(directionalLight);

  //BLOOMPASS
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 3, 1, 0
  );
  bloomPass.strength = constants.light.bloompassStrength;
  bloomPass.radius = constants.light.bloompassRadius;
  bloomPass.threshold = constants.light.bloompassThreshold;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(bloomPass);

  return { scene, camera, composer, light: directionalLight };

}