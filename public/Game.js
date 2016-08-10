// <reference path="SpaceObject.js" />

//https://developer.mozilla.org/en-US/docs/Games/Anatomy
function Game() {
  
  //ensure new-agnostic construction
  var self = this instanceof Game
           ? this
           : Object.create(Game.prototype);
           
  self.universe = new Universe();
  
  var selectedObject = new SpaceObject('bluecircle', 50);
  //TODO: detect SVG objects and add them automatically...
  self.universe.Add(selectedObject);
  self.universe.Add(new SpaceObject('redcircle1', 100));
  self.universe.Add(new SpaceObject('redcircle2', 100));
  
  document.addEventListener('keydown', (event) => {
    //TODO: add temporary up/down/left/right vectors to the selected object
    switch(event.key){
      case 'ArrowUp': 
        console.log(event.key);
        // selectedObject.ThrustVectors
        break;
      case 'ArrowDown':
        console.log(event.key);
        break;
      case 'ArrowLeft':
        console.log(event.key);
        break;
      case 'ArrowRight':
        console.log(event.key);
        break;
      // default:
      //   console.log(event.key);
      //   break;
    }
  }, false);

  document.addEventListener('keyup', (event) => {
    //TODO: remove temporary vector for the key
    const keyName = event.key;
  }, false);
    
  this.mainLoop = function(tFrame) {
    self.stopMain = window.requestAnimationFrame(self.mainLoop); 

    //Call your update method. In our case, we give it rAF's timestamp.
    // self.update(tFrame);
    self.render();
  }
}

// Game.prototype.update = function(tFrame) {
//   console.log(tFrame); 
// }
    
Game.prototype.render = function() {
  
  //TODO: separate rendering from calculating positions
  this.universe.UpdatePositions();
  
}
