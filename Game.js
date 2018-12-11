// <reference path="SpaceObject.js" />

import { SpaceObject } from './SpaceObject.js'
import { Universe } from './Universe.js'
import { Vector } from './Vector.js'

//https://developer.mozilla.org/en-US/docs/Games/Anatomy
export function Game() {
  
  //ensure new-agnostic construction
  var self = this instanceof Game
           ? this
           : Object.create(Game.prototype);
           
  self.universe = new Universe();
  
  var selectedObject = new SpaceObject('bluecircle', 10000000000);
  //TODO: detect SVG objects and add them automatically...
  //TODO: dynamically add SVG objects from the JavaScript
  self.universe.Add(selectedObject);
  //self.universe.Add(new SpaceObject('orangecircle', 100));
  self.universe.Add(new SpaceObject('redcircle1', 10));
  self.universe.Add(new SpaceObject('redcircle2', 10));
  self.universe.Add(new SpaceObject('redcircle3', 10));
  self.universe.Add(new SpaceObject('redcircle4', 10));
  self.universe.Add(new SpaceObject('redcircle5', 10));
  self.universe.Add(new SpaceObject('redcircle6', 10));
  
  self.thrust = {
    U: new Vector(0, .2),
    D: new Vector(0, .2),
    L: new Vector(-.2, 0),
    R: new Vector(.2, 0)
  };
  
  document.addEventListener('keydown', (event) => {
    //add temporary up/down/left/right vectors to the selected object
    switch(event.key){
      case 'ArrowUp': 
        console.log(event.key);
        selectedObject.ThrustVectors.U = self.thrust.U;
        break;
      case 'ArrowDown':
        console.log(event.key);
        selectedObject.ThrustVectors.D = self.thrust.D;
        break;
      case 'ArrowLeft':
        console.log(event.key);
        selectedObject.ThrustVectors.L = self.thrust.L;
        break;
      case 'ArrowRight':
        console.log(event.key);
        selectedObject.ThrustVectors.R = self.thrust.R;
        break;
      // default:
      //   console.log(event.key);
      //   break;
    }
  }, false);

  document.addEventListener('keyup', (event) => {
    //remove temporary vector for the key
    switch(event.key){
      case 'ArrowUp': 
        console.log(event.key);
        selectedObject.ThrustVectors.U = undefined;
        break;
      case 'ArrowDown':
        console.log(event.key);
        selectedObject.ThrustVectors.D = undefined;
        break;
      case 'ArrowLeft':
        console.log(event.key);
        selectedObject.ThrustVectors.L = undefined;
        break;
      case 'ArrowRight':
        console.log(event.key);
        selectedObject.ThrustVectors.R = undefined;
        break;
      // default:
      //   console.log(event.key);
      //   break;
    }
  }, false);
    
  this.mainLoop = function(tFrame) {
    self.stopMain = window.requestAnimationFrame(self.mainLoop); 

    //Call your update method. In our case, we give it requestAnimationFrame's timestamp.
    // self.update(tFrame);
    self.render();
  }
}

// Game.prototype.update = function(tFrame) {
//   console.log(tFrame); 
// }
    
Game.prototype.render = function() {
  
  //TODO: separate rendering from calculating positions
  var max_X = 1200, min_X = 0, max_Y = 700, min_Y = 0
  this.universe.UpdatePositions(max_X, min_X, max_Y, min_Y);
  
}
