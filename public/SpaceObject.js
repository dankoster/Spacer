function SpaceObject(objID, mass) {
  
  //ensure new-agnostic construction
  var self = this instanceof SpaceObject
           ? this
           : Object.create(SpaceObject.prototype);
  
  //initialize
  self.obj = document.getElementById(objID);
  self.mass = mass;
  self.Velocity = new Vector(0,0);
  self.ThrustVectors = [];
  
  //check for proper initialization
  if(!self.obj) 
    throw objID + ' not recognized as a valid element';
}

SpaceObject.prototype.UpdatePosition = function(){
  
  //TODO: separate rendering from calculating positions (calculating positions
  // can be done server side for multiplayer)

  var accelerationDueToGravity = Universe.GetGravityVector(this);

  this.Velocity = this.Velocity.Add(accelerationDueToGravity);

  this.X += this.Velocity.X;
  this.Y += this.Velocity.Y;
}

SpaceObject.prototype.DistanceTo = function (so) {
  return Math.sqrt(((so.X - this.X) * (so.X - this.X)) + ((so.Y - this.Y) * (so.Y - this.Y)));
}

Object.defineProperty(SpaceObject.prototype, 'X', {
  get: function() { return parseFloat(this.obj.getAttribute('cx')); },
  set: function(value) { if(value) this.obj.setAttribute('cx', value); }
});

Object.defineProperty(SpaceObject.prototype, 'Y', {
  get: function() { return parseFloat(this.obj.getAttribute('cy')); },
  set: function(value) { if(value) this.obj.setAttribute('cy', value); }
});

Object.defineProperty(SpaceObject.prototype, 'mass', {
  get: function() { return this._mass; },
  set: function(value) { this._mass = value; }
});