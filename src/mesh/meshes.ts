import * as THREE from 'three';
import { constants } from '../helpers/constants';

export const loadEarth = () => {
  const earthTexture = new THREE.TextureLoader().load('earth.jpg');
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(constants.earth.radius, 32, 32),
    new THREE.MeshStandardMaterial({
      map: earthTexture
    })
  );
  earth.castShadow = true;
  earth.name = 'earth';
  return earth;
}

export const updateEarth = (earth: THREE.Mesh) => {
  earth.rotation.y += 0.005;
}

export const loadSun = () => {
  const sunGeometry = new THREE.SphereGeometry(constants.sun.radius, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(4000, 0, 0)
  return sun;
}

export const loadStars = (scene) => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const str = new THREE.Mesh(geometry, material);
  for (let i=0; i<1000; i++) {
    const star = str.clone();
    const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(constants.stars.locationSpread));
    star.position.set(x, y, z);
    scene.add(star);
  }
}

export const loadBlackHole = () => {
  const geometry = new THREE.SphereGeometry(100, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    // color: 0x000000,
    color: 'red',
    side: THREE.DoubleSide,
  });
  const blackHole = new THREE.Mesh(geometry, material);
  blackHole.position.set(0, 5000, 1500)
  return blackHole;
}

