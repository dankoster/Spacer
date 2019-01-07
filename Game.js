import { SpaceObject } from './SpaceObject.js'
import { Universe } from './Universe.js'
import { Vector } from './Vector.js'

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
          console.log('Selected ' + i + ': ' + this.selectedObject.id)
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
    this.universe.Add(new SpaceObject({
      X: 400,
      Y: 100,
      R: 15,
      mass: 50000,
      id: this.universe.Objects.length
    }))
    
    this.universe.Add(new SpaceObject({
      X: 400,
      Y: 200,
      R: 15,
      mass: 50000,
      id: this.universe.Objects.length
    }))
  }

  freeze() {
    this.universe.Objects.forEach(so => {
      so.Velocity = new Vector(0,0)
      so.newPos.X = 400
    })
  }

  render(frame) {
    this.universe.UpdatePositions(this.max_X, this.min_X, this.max_Y, this.min_Y);
  }
}