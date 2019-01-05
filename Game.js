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
  var selectedObject = new SpaceObject('bluecircle', 100000);
  self.universe.Add(selectedObject);
  //self.universe.Add(new SpaceObject('redcircle1', 1000));

  self.thrust = {
    U: new Vector({ X: 0, Y: -.2 }),
    D: new Vector({ X: 0, Y: .2 }),
    L: new Vector({ X: -.2, Y: 0 }),
    R: new Vector({ X: .2, Y: 0 })
  };

  document.addEventListener('keydown', (event) => {
    //add temporary up/down/left/right vectors to the selected object
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
      case 'UIKeyInputUpArrow':
        selectedObject.ThrustVectors.U = self.thrust.U;
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
      case 'UIKeyInputDownArrow':
        selectedObject.ThrustVectors.D = self.thrust.D;
        break;
      case 'a':
      case 'A':
      case 'ArrowLeft':
      case 'UIKeyInputLeftArrow':
        selectedObject.ThrustVectors.L = self.thrust.L;
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
      case 'UIKeyInputRightArrow':
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
      default:
        console.log(event.key);
        break;
    }
  }, false);

  document.addEventListener('keyup', (event) => {
    //remove temporary vector for the key
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
      case 'UIKeyInputUpArrow':
        selectedObject.ThrustVectors.U = undefined;
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
      case 'UIKeyInputDownArrow':
        selectedObject.ThrustVectors.D = undefined;
        break;
      case 'a':
      case 'A':
      case 'ArrowLeft':
      case 'UIKeyInputLeftArrow':
        selectedObject.ThrustVectors.L = undefined;
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
      case 'UIKeyInputRightArrow':
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
    self.render(tFrame);
  }

}

Game.prototype.test = function () {

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  var id = Date.now()
  //<circle cx="125.1" cy="80" r="20" fill="red" id="redcircle1" />

  var svg = document.getElementsByTagName('svg')[0]
  var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
  newElement.setAttribute("id", id)
  newElement.setAttribute("cx", random(20,800))
  newElement.setAttribute("cy", random(0,600))
  newElement.setAttribute("r", 15)
  newElement.setAttribute("fill", "red")
  svg.appendChild(newElement)

  var so = new SpaceObject(id, 50000)
  this.universe.Add(so)
}



// Game.prototype.update = function(tFrame) {
//   console.log(tFrame); 
// }

Game.prototype.render = function (frame) {
  //console.log('render')
  //TODO: separate rendering from calculating positions
  var max_X = 800, min_X = 0, max_Y = 600, min_Y = 0
  this.universe.UpdatePositions(max_X, min_X, max_Y, min_Y);

  this.RenderVectors()
}

Game.prototype.RenderVectors = function () {
  this.universe.Vectors.forEach(v => {
    if (!v.id) {
      v.id = Date.now()
      var svg = document.getElementsByTagName('svg')[0]
      var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
      if (v.name) newElement.setAttribute("name", v.name);
      newElement.setAttribute("id", v.id);
      newElement.setAttribute("x1", v.position.X);
      newElement.setAttribute("y1", v.position.Y);
      newElement.setAttribute("x2", v.position.X + (v.vector.X * 100));
      newElement.setAttribute("y2", v.position.Y + (v.vector.Y * 100));
      newElement.setAttribute("marker-end", "url(#arrow)")
      newElement.style.strokeWidth = "5"
      newElement.style.stroke = v.obj.attributes["fill"].value; //Set stroke colour
      newElement.style.strokeWidth = "1px"; //Set stroke width
      svg.appendChild(newElement);
    }
    else if (Date.now() - v.id > 5000) {
      //remove old lines
      var line = document.getElementById(v.id)
      if (line) {
        const index = this.universe.Vectors.indexOf(v)
        this.universe.Vectors.splice(index, 1)
        line.parentNode.removeChild(line)
      }
    }
  })
}