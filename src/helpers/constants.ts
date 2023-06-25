import * as THREE from 'three';

export const constants = {
  camera: {
    visionDepth: 10000,
  },
  light: {
    lightIntensity: 1, //expects a float default 1
    lightDistance: 100000, 
    lightDecay: 1, // default 2
    bloompassStrength: 2, // 0 to 3
    bloompassRadius: 0.1, // 0 to 1
    bloompassThreshold: 0.1 // 0 to 1
  },
  ship: {
    startingPosition: new THREE.Vector3(-250, 100, -700),
    startingRotation: new THREE.Euler(0, 180, 0, 'XYZ'),
    deceleration: 0.5,
    boostMultiplier: 10,

    // moveMultiplier: 0.09,
    moveMultiplier: 2,
    moveMultiplierX: 0.05,

    rotationMultiplier: 0.01,
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