import { SpaceObject } from './SpaceObject.js'
import { Universe } from './Universe.js'
import { Vector } from './Vector.js'
import { limitedRandom } from './utility.js'

export function StartGameLoop(game) {
  var loop = function (tFrame) {
    game.render(tFrame)
    window.requestAnimationFrame(loop)
  }
  window.requestAnimationFrame(loop)
}

//https://developer.mozilla.org/en-US/docs/Games/Anatomy
export class Game {
  constructor() {

    this.universe = new Universe()
    this.selectedObject = undefined

    this.max_X = 800
    this.min_X = 0
    this.max_Y = 600
    this.min_Y = 0

    this.thrust = {
      U: new Vector({ X: 0, Y: -.2 }),
      D: new Vector({ X: 0, Y: .2 }),
      L: new Vector({ X: -.2, Y: 0 }),
      R: new Vector({ X: .2, Y: 0 })
    };

    document.addEventListener('keydown', (event) => {

      if (!this.selectedObject && this.universe.Objects.length)
        this.selectedObject = this.universe.Objects[0]

      //add temporary up/down/left/right vectors to the selected object
      switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
        case 'UIKeyInputUpArrow':
          this.selectedObject.ThrustVectors.U = this.thrust.U;
          break;
        case 's':
        case 'S':
        case 'ArrowDown':
        case 'UIKeyInputDownArrow':
          this.selectedObject.ThrustVectors.D = this.thrust.D;
          break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
        case 'UIKeyInputLeftArrow':
          this.selectedObject.ThrustVectors.L = this.thrust.L;
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'UIKeyInputRightArrow':
          this.selectedObject.ThrustVectors.R = this.thrust.R;
          break;
        case 'Tab':
          var i = this.universe.Objects.indexOf(this.selectedObject)
          if (this.universe.Objects.length - 1 > i)
            this.selectedObject = this.universe.Objects[i + 1]
          else
            this.selectedObject = this.universe.Objects[0]
          console.log('Selected ' + i + ': ' + this.selectedObject.obj.id)
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
          this.selectedObject.ThrustVectors.U = undefined;
          break;
        case 's':
        case 'S':
        case 'ArrowDown':
        case 'UIKeyInputDownArrow':
          this.selectedObject.ThrustVectors.D = undefined;
          break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
        case 'UIKeyInputLeftArrow':
          this.selectedObject.ThrustVectors.L = undefined;
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'UIKeyInputRightArrow':
          this.selectedObject.ThrustVectors.R = undefined;
          break;
        // default:
        //   console.log(event.key);
        //   break;
      }
    }, false);

  }

  test() {
    var so = new SpaceObject({
      X: limitedRandom(20, 800),
      Y: limitedRandom(20, 600),
      R: 15,
      mass: 50000
    })
    this.universe.Add(so)
  }

  render(frame) {
    this.universe.UpdatePositions(this.max_X, this.min_X, this.max_Y, this.min_Y);

    this.RenderVectors()
  }

  RenderVectors() {
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
}