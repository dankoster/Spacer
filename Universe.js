import { SpaceObject } from './SpaceObject.js'
import { Vector } from './Vector.js'

export function Universe() {
  
  //ensure new-agnostic construction
  var self = this instanceof Universe
           ? this
           : Object.create(Universe.prototype);
    
  self.Objects = [] //a list of all the objects in the universe (so we can calculate gravity correctly)
  self.Vectors = []
}

Universe.prototype.Add = function(so) {
  if(!(so instanceof SpaceObject)) throw 'obj must be an instance of SpaceObject';
  
  so.universe = this;
  this.Objects.push(so);
}

Universe.prototype.UpdatePositions = function(max_X, min_X, max_Y, min_Y) {
  for(var o in this.Objects){
    this.Objects[o].CalculateNewPosition(max_X, min_X, max_Y, min_Y);
  }

  for(var o in this.Objects){
    this.Objects[o].UpdatePosition();
  }
  
}

Universe.distanceMultiplier = 1
Universe.G = 0.0000000000667400; //universal gravitational constant (doesn't actually matter so much unless we use real units and such for everything)

Universe.GetGravityVector = function(thisObject) {
  if(!(thisObject instanceof SpaceObject)) throw 'unexpected type!';
  if(!thisObject.universe || !(thisObject.universe instanceof Universe)) throw 'object is not in a universe!'
  if(!Array.isArray(thisObject.universe.Objects)) throw 'unexpected non-array!';
  
  // http://en.wikipedia.org/wiki/Law_of_universal_gravitation
  // https://en.wikipedia.org/wiki/Gravitational_constant#Orbital_mechanics
  
  var gravVector = new Vector(0,0);
  
  if(thisObject.mass > 0){    
    for(var so in thisObject.universe.Objects) {
      var otherObject = thisObject.universe.Objects[so];
			if(otherObject != thisObject && otherObject.mass !== 0)
			{      
        var otherObjectGravVector = this.GetGravityVectorFromTo(thisObject, otherObject)
        gravVector.X += otherObjectGravVector.X
        gravVector.Y += otherObjectGravVector.Y
      }
    }
  }
  
  return gravVector;
}

Universe.GetGravityVectorFromTo = function (thisObject, otherObject){
  var result = new Vector(0,0)
  var distance = thisObject.DistanceTo(otherObject) 
  distance *= this.distanceMultiplier;
  if(distance !== 0)
  {
    var gravity = (this.G * thisObject.mass * otherObject.mass) / Math.pow(distance, 2.0);
    result.X += gravity * (otherObject.X - thisObject.X);
    result.Y += gravity * (otherObject.Y - thisObject.Y);
  }
  return result
}