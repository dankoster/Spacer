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

  //TODO: dynamically add SVG objects from the JavaScript
  var selectedObject = new SpaceObject('bluecircle', 50000);
  self.universe.Add(selectedObject);
  self.universe.Add(new SpaceObject('redcircle1', 50000));

  self.thrust = {
    U: new Vector({ X: 0, Y: -.2 }),
    D: new Vector({ X: 0, Y: .2 }),
    L: new Vector({ X: -.2, Y: 0 }),
    R: new Vector({ X: .2, Y: 0 })
  };

  document.addEventListener('keydown', (event) => {
    //add temporary up/down/left/right vectors to the selected object
    switch (event.key) {
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
      case 'Tab':
        var i = self.universe.Objects.indexOf(selectedObject)
        if (self.universe.Objects.length - 1 > i)
          selectedObject = self.universe.Objects[i + 1]
        else
          selectedObject = self.universe.Objects[0]
        console.log('Selected ' + i + ': ' + selectedObject.obj.id)
        break;
      // default:
      //   console.log(event.key);
      //   break;
    }
  }, false);

  document.addEventListener('keyup', (event) => {
    //remove temporary vector for the key
    switch (event.key) {
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

  this.mainLoop = function (tFrame) {
    self.stopMain = window.requestAnimationFrame(self.mainLoop);

    //Call your update method. In our case, we give it requestAnimationFrame's timestamp.
    // self.update(tFrame);
    self.render();
  }
}

// Game.prototype.update = function(tFrame) {
//   console.log(tFrame); 
// }

Game.prototype.render = function () {

  //TODO: separate rendering from calculating positions
  var max_X = 800, min_X = 0, max_Y = 600, min_Y = 0
  this.universe.UpdatePositions(max_X, min_X, max_Y, min_Y);

  this.universe.Vectors.forEach(v => {
    if (!v.id) {
      v.id = Date.now()
      var svg = document.getElementsByTagName('svg')[0]
      var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
      newElement.setAttribute("name", v.name); 
      newElement.setAttribute("id", v.id); 
      newElement.setAttribute("x1", 0); 
      newElement.setAttribute("y1", 0); 
      newElement.setAttribute("x2", v.vector.X * 10); 
      newElement.setAttribute("y2", v.vector.Y * 10); 
      newElement.style.stroke = "red"; //Set stroke colour
      newElement.style.strokeWidth = "1px"; //Set stroke width
      svg.appendChild(newElement);
    }
  });
}
