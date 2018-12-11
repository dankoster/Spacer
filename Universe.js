import { SpaceObject } from './SpaceObject.js'
import { Vector } from './Vector.js'

export function Universe() {
  
  //ensure new-agnostic construction
  var self = this instanceof Universe
           ? this
           : Object.create(Universe.prototype);
    
  self.Objects = []; //a list of all the objects in the universe (so we can calculate gravity correctly)
  self.Collisions = {};
}

Universe.prototype.Add = function(so) {
  if(!(so instanceof SpaceObject)) throw 'obj must be an instance of SpaceObject';
  
  so.universe = this;
  this.Objects.push(so);
}

Universe.prototype.UpdatePositions = function(max_X, min_X, max_Y, min_Y) {
  for(var o in this.Objects){
    this.Objects[o].UpdatePosition(max_X, min_X, max_Y, min_Y);
  }
  
  //calculate collisions
  //http://gamedev.stackexchange.com/questions/27508/how-will-the-velocities-of-two-moving-objects-change-once-they-collide
  //https://en.wikipedia.org/wiki/Collision
  //https://en.wikipedia.org/wiki/Elastic_collision
  //https://en.wikipedia.org/wiki/Coefficient_of_restitution
  this.Collisions = {};
  for(var a in this.Objects){
    for(var b in this.Objects){
      if(a != b){
        var A = this.Objects[a];
        var B = this.Objects[b];
        if(A.DistanceTo(B) <= A.R + B.R){
          this.Collisions[A.obj.id] = {A,B};
        }
      }
    }
  }
}

Universe.GetGravityVector = function(thisObject) {
  if(!(thisObject instanceof SpaceObject)) throw 'unexpected type!';
  if(!thisObject.universe || !(thisObject.universe instanceof Universe)) throw 'object is not in a universe!'
  if(!Array.isArray(thisObject.universe.Objects)) throw 'unexpected non-array!';
  
  // http://en.wikipedia.org/wiki/Law_of_universal_gravitation
  // https://en.wikipedia.org/wiki/Gravitational_constant#Orbital_mechanics
  
  var gravVector = new Vector(0,0);
  
  if(thisObject.mass > 0){
    var G = 0.0000000000667400; //universal gravitational constant (doesn't actually matter so much unless we use real units and such for everything)
    var distMultiplier = 1;
    var distance = 0;
    var gravity;
    
    for(var so in thisObject.universe.Objects) {
      var otherObject = thisObject.universe.Objects[so];
      
			if(otherObject != thisObject && otherObject.mass !== 0)
			{
				distance = thisObject.DistanceTo(otherObject);
				distance *= distMultiplier;
				if(distance !== 0)
				{
					gravity = (G * thisObject.mass * otherObject.mass) / Math.pow(distance, 2.0);
					gravVector.X += gravity * (otherObject.X - thisObject.X);
					gravVector.Y += gravity * (otherObject.Y - thisObject.Y);
				}
			}

    }
  }
  
  return gravVector;
}
