import * as THREE from 'three';
import { constants } from './constants';

let angle = 0;
const ORBIT_CENTER = new THREE.Vector3(0, 0, 0);

export const loadEarth = () => {
  const earthTexture = new THREE.TextureLoader().load('earth.jpg');
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(constants.earth.radius, 32, 32),
    new THREE.MeshStandardMaterial({
      map: earthTexture
    })
  );
  earth.castShadow = true;
  earth.position.copy(constants.earth.initialPosition());
  earth.name = 'earth';
  return earth;
}

export const updateEarth = (earth: THREE.Mesh) => {
  earth.rotation.y += 0.005;
  earth.position.x = ORBIT_CENTER.x + constants.earth.orbitRadius() * Math.cos(angle);
  earth.position.z = ORBIT_CENTER.y + constants.earth.orbitRadius() * Math.sin(angle);
  angle += constants.earth.orbitalSpeed * Math.PI;
}

export const loadSun = () => {
  const sunGeometry = new THREE.SphereGeometry(constants.sun.radius, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
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

export const loadMars = () => {
  const marsTexture = new THREE.TextureLoader().load('mars.jpeg');
  const mars = new THREE.Mesh(
    new THREE.SphereGeometry(constants.mars.radius, 32, 32),
    new THREE.MeshStandardMaterial({
      map: marsTexture
    })
  );
  mars.castShadow = true;
  mars.position.copy(constants.mars.initialPosition());
  mars.name = 'mars';
  return mars;
}

export const updateMars = (mars: THREE.Mesh) => {
  mars.rotation.y += 0.005;
  mars.position.x = ORBIT_CENTER.x + constants.mars.orbitRadius() * Math.cos(angle);
  mars.position.z = ORBIT_CENTER.y + constants.mars.orbitRadius() * Math.sin(angle);
  angle += constants.mars.orbitalSpeed * Math.PI;
}


export const loadMercury = () => {
  const mercuryTexture = new THREE.TextureLoader().load('mercury.jpeg');
  const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(constants.mercury.radius, 32, 32),
    new THREE.MeshStandardMaterial({
      map: mercuryTexture
    })
  );
  mercury.castShadow = true;
  mercury.position.copy(constants.mercury.initialPosition());
  mercury.name = 'mercury';
  return mercury;
}

export const updateMercury = (mercury: THREE.Mesh) => {
  mercury.rotation.y += 0.005;
  mercury.position.x = ORBIT_CENTER.x + constants.mercury.orbitRadius() * Math.cos(angle);
  mercury.position.z = ORBIT_CENTER.y + constants.mercury.orbitRadius() * Math.sin(angle);
  angle += constants.mercury.orbitalSpeed * Math.PI;
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

