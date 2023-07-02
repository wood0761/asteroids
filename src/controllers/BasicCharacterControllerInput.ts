export class BasicCharacterControllerInput {
  keys: { shoot: number, forward: number; back: number; left: number; right: number; space: number; shift: number; pitchUp: number; pitchDown: number; yawLeft: number; yawRight: number; rollLeft: number; rollRight: number; up: number; down: number;};
  constructor() {
    this.init();    
  }

  init() {
    this.keys = {
      forward: 0,
      back: 0,
      left: 0,
      right: 0,
      space: 0,
      shift: 0,
      pitchUp: 0, 
      pitchDown: 0, 
      yawLeft: 0, 
      yawRight: 0, 
      rollLeft: 0, 
      rollRight: 0,
      up: 0,
      down: 0,
      shoot: 0,
    };
  }

  onKeyDown(event) {
    switch ( event.code ) {
      case 'Space':
      case 'ShiftLeft':
      case 'ShiftRight': this.keys.shift = 1; break;
      case 'KeyW': this.keys.forward = 1; break;
      case 'KeyS': this.keys.back = 1; break;
      case 'KeyA': this.keys.left = 1; break;
      case 'KeyD': this.keys.right = 1; break;
      case 'KeyR': this.keys.shoot = 1; break;
      // case 'KeyF': this.keys.down = 1; break;
      case 'ArrowUp': this.keys.pitchUp = 1; break;
      case 'ArrowDown': this.keys.pitchDown = 1; break;
      case 'ArrowLeft': this.keys.yawLeft = 1; break;
      case 'ArrowRight': this.keys.yawRight = 1; break;
      case 'KeyQ': this.keys.rollLeft = 1; break;
      case 'KeyE': this.keys.rollRight = 1; break;
    }
  }

  onKeyUp(event) {
    switch ( event.code ) {
      case 'Space':
      case 'ShiftLeft':
      case 'ShiftRight': this.keys.shift = 0; break;
      case 'KeyW': this.keys.forward = 0; break;
      case 'KeyS': this.keys.back = 0; break;
      case 'KeyA': this.keys.left = 0; break;
      case 'KeyD': this.keys.right = 0; break;
      case 'KeyR': this.keys.shoot = 0; break;
      // case 'KeyF': this.keys.down = 0; break;
      case 'ArrowUp': this.keys.pitchUp = 0; break;
      case 'ArrowDown': this.keys.pitchDown = 0; break;
      case 'ArrowLeft': this.keys.yawLeft = 0; break;
      case 'ArrowRight': this.keys.yawRight = 0; break;
      case 'KeyQ': this.keys.rollLeft = 0; break;
      case 'KeyE': this.keys.rollRight = 0; break;
    }
  }
}