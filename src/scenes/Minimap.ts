import * as THREE from 'three';
import { constants } from '../helpers/constants.ts'

export const generateMinimap = () => {
  const minimapScene = new THREE.Scene();

  const pointLight = new THREE.PointLight(
    0xffffff, 
    20, 
    constants.light.lightDistance, 
    1);
    
  pointLight.position.set(0, 4000, 0);
  // const ambientLight = new THREE.AmbientLight(0xffffff);
  minimapScene.add(pointLight)
  // left right top bottom near far
  const minimapCamera = new THREE.OrthographicCamera(8000 / -2, 8000 / 2, 8000 / 2, 8000 / -2, .11, 100000)
  minimapCamera.position.set(0, 10000, 0);
  minimapCamera.lookAt(0, 0, 0);

  const minimapRenderer = new THREE.WebGLRenderer({ antialias: true });
  minimapRenderer.setSize(300, 300);
  minimapRenderer.setClearColor('gray'); // Set the background color of the minimap
  minimapRenderer.domElement.style.position = 'absolute';
  minimapRenderer.domElement.style.border = '5px solid white';
  minimapRenderer.domElement.style.bottom = '10px';

  return { minimapScene, minimapCamera, minimapRenderer };
}