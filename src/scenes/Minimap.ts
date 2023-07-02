import * as THREE from 'three';
import { constants } from '../helpers/constants.ts'

export const generateMinimap = () => {
  const minimapScene = new THREE.Scene();

  const pointLight = new THREE.PointLight(
    0xffffff, 
    20, 
    constants.light.lightDistance, 
    1);
    
  pointLight.position.set(0, 2000, 0);
  // const ambientLight = new THREE.AmbientLight(0xffffff);
  minimapScene.add(pointLight)
  // left right top bottom near far
  const minimapCamera = new THREE.OrthographicCamera(4000 / -2, 4000 / 2, 4000 / 2, 4000 / -2, .1, 100000)
  minimapCamera.position.set(0, 10000, 0);
  minimapCamera.lookAt(0, 0, 0);

  const minimapRenderer = new THREE.WebGLRenderer({ antialias: true });
  minimapRenderer.setSize(300, 225);
  minimapRenderer.setClearColor('#121212'); // Set the background color of the minimap
  minimapRenderer.domElement.style.position = 'absolute';
  minimapRenderer.domElement.style.border = '2px solid white';
  minimapRenderer.domElement.style.bottom = '10px';
  minimapRenderer.domElement.style.borderRadius = '5px';

  return { minimapScene, minimapCamera, minimapRenderer };
}