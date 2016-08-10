function Universe() {
  
  //ensure new-agnostic construction
  var self = this instanceof Universe
           ? this
           : Object.create(Universe.prototype);
    
  self.Objects = []; //a list of all the objects in the universe (so we can calculate gravity correctly)
}

Universe.prototype.Add = function(so) {
  if(!(so instanceof SpaceObject)) throw 'obj must be an instance of SpaceObject';
  
  so.universe = this;
  this.Objects.push(so);
}

Universe.prototype.UpdatePositions = function() {
  for(var o in this.Objects){
    this.Objects[o].UpdatePosition(this.Objects);
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
    var G = 6.67300; //universal gravitational constant (doesn't actually matter so much unless we use real units and such for everything)
    var distMultiplier = 100;
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
