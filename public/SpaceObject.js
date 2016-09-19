function SpaceObject(objID, mass) {
  
  //ensure new-agnostic construction
  var self = this instanceof SpaceObject
           ? this
           : Object.create(SpaceObject.prototype);
  
  //initialize
  self.obj = document.getElementById(objID);
  self.mass = mass;
  self.Velocity = new Vector(0,0);
  self.ThrustVectors = {};
  
  //check for proper initialization
  if(!self.obj) 
    throw objID + ' not recognized as a valid element';
}

SpaceObject.prototype.UpdatePosition = function(max_X, min_X, max_Y, min_Y){
  
  //TODO: separate rendering from calculating positions (calculating positions
  // can be done server side for multiplayer)
  
  var curPos = { 
    X: this.X, 
    Y: this.Y
  }
  
  //Have to calculate the new position separately from the thix.X and this.Y
  // because changes to those don't take effect until the page is rendered
  var newPos = {
    X: curPos.X,
    Y: curPos.Y
  }
  
  this.Velocity = this.Velocity.Add(this.totalAcceleration);
  
  //have made it outside the boundaries?
  var overX = curPos.X >= max_X;
  var overY = curPos.Y >= max_Y;
  var undrX = curPos.X <= min_X;
  var undrY = curPos.Y <= min_Y;

  //constrain velocity at the boundaries
  if(overX || undrX) { this.Velocity.X *= -1; this.Velocity.X *= 0.15; }
  if(overY || undrY) { this.Velocity.Y *= -1; this.Velocity.Y *= 0.15; }

  //constrain position
  if(overX) newPos.X = max_X; 
  if(overY) newPos.Y = max_Y; 
  if(undrX) newPos.X = min_X; 
  if(undrY) newPos.Y = min_Y; 

  //apply calculated change in position
  newPos.X += this.Velocity.X;
  newPos.Y += this.Velocity.Y;
  
  for(var c in this.universe.Collisions) {
    var collision = this.universe.Collisions[c];
    if(collision.A == this){
      //TODO: handle collisions
    }
  }

  this.X = newPos.X;
  this.Y = newPos.Y;
}

SpaceObject.prototype.DistanceTo = function (so) {
  return Math.sqrt(((so.X - this.X) * (so.X - this.X)) + ((so.Y - this.Y) * (so.Y - this.Y)));
}

Object.defineProperty(SpaceObject.prototype, 'totalAcceleration', {
  get: function() { 
    var forces = [];
    
    var accelerationDueToGravity = Universe.GetGravityVector(this);
    //accelerationDueToGravity = accelerationDueToGravity.Multiply(new Number(2/this.mass))
    forces.push(accelerationDueToGravity);
    
    for(var t in this.ThrustVectors) {
      if(this.ThrustVectors[t]) forces.push(this.ThrustVectors[t]);
    }
  
    var totalAcceleration = Vector.GetResultVector(forces);
    return totalAcceleration;
  }
});

Object.defineProperty(SpaceObject.prototype, 'X', {
  get: function() { return parseFloat(this.obj.getAttribute('cx')); },
  set: function(value) { if(value) this.obj.setAttribute('cx', value); }
});

Object.defineProperty(SpaceObject.prototype, 'Y', {
  get: function() { return parseFloat(this.obj.getAttribute('cy')); },
  set: function(value) { if(value) this.obj.setAttribute('cy', value); }
});

Object.defineProperty(SpaceObject.prototype, 'R', {
  get: function() { return parseFloat(this.obj.getAttribute('r')); },
  set: function(value) { if(value) this.obj.setAttribute('r', value); }
});

Object.defineProperty(SpaceObject.prototype, 'mass', {
  get: function() { return this._mass; },
  set: function(value) { this._mass = value; }
});