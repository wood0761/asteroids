import * as THREE from 'three';

// sun diameter 865.3k miles = 8653
// earth diameter 7.9175k miles = 79
// earth distance to sun 94.362 million miles = 993620
// jupiter distance to sun 460.71 million miles = 4607100
// jupiter diameter 86.881 miles = 8688
// for future reference a moon bloompass strength 1 radius 0.1 threshold 0.9
// const earthStartZ = 940;
// const marsStartZ = 4000;
// const mercuryStartZ = 600;

export const constants = {
  camera: {
    visionDepth: 10000,
  },
  light: {
    lightIntensity: 0.5, //expects a float default 1
    lightDistance: 10000, 
    lightDecay: 2, // default 2
    bloompassStrength: 2, // 0 to 3
    bloompassRadius: 0.1, // 0 to 1
    bloompassThreshold: 0.1 // 0 to 1
  },
  ship: {
    startingPosition: new THREE.Vector3(500, 0, 940),
    deceleration: 0.5,
    boostMultiplier: 20,

    moveMultiplier: 0.07,
    moveMultiplierX: 0.01,

    rotationMultiplier: 0.01,
  },
  asteroid: {
    startingPosition: new THREE.Vector3(500, 0, 900),
  },
  sun: {
    radius: 109,
  },
  mars: {
    radius: 150,
    initialPosition: () => new THREE.Vector3(0, 0, 3000),
    orbitRadius: () => constants.mars.initialPosition().distanceTo(new THREE.Vector3(0, 0, 0)),
    orbitalSpeed: 0.00021,
  },
  earth: {
    radius: 100,
    initialPosition: () => new THREE.Vector3(0, 0, 1700),
    orbitRadius: () => constants.earth.initialPosition().distanceTo(new THREE.Vector3(0, 0, 0)),
    orbitalSpeed: 0.0002,
  },
  mercury: {
    radius: 30.31,
    initialPosition: () => new THREE.Vector3(0, 0, 900),
    orbitRadius: () => constants.mercury.initialPosition().distanceTo(new THREE.Vector3(0, 0, 0)),
    orbitalSpeed: 0.0002,
  },
  stars: {
    numberOfStars: 1000,
    locationSpread: 5000,
  },
}