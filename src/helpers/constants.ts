import * as THREE from 'three';

export const constants = {
  camera: {
    visionDepth: 5000,
    startingPosition: new THREE.Vector3(2000, 0, 0),
    startingRotation: new THREE.Euler(0, 180.9, 0, 'XYZ'),
  },
  light: {
    lightIntensity: 1, //expects a float default 1
    lightDistance: 10000, 
    lightDecay: 1, // default 2
    bloompassStrength: 2, // 0 to 3
    bloompassRadius: 0.1, // 0 to 1
    bloompassThreshold: 0.1 // 0 to 1
  },
  ship: {
    startingPosition: new THREE.Vector3(-250, 0, -1000),
    startingRotation: new THREE.Euler(0, 180.15, 0, 'XYZ'),
    deceleration: 0.7,

    moveMultiplier: 0.15,
    boostMultiplier: 5,

    rotationMultiplier: 0.01,
  },
  asteroid: {
    startingPosition: new THREE.Vector3(2000, 0, 1500),
    startingDriftDirection: new THREE.Vector3(-100, 0, 1),
  },
  sun: {
    radius: 109,
  },
  earth: {
    radius: 300,
    initialPosition: () => new THREE.Vector3(0, 0, 1700),
    orbitRadius: () => constants.earth.initialPosition().distanceTo(new THREE.Vector3(0, 0, 0)),
    orbitalSpeed: 0.0002,
  },
  stars: {
    numberOfStars: 1000,
    locationSpread: 5000,
  },
}