import { Vector } from './Vector.js'
import { Universe } from './Universe.js'

export function SpaceObject(objID, mass) {
  
  //ensure new-agnostic construction
  var self = this instanceof SpaceObject
           ? this
           : Object.create(SpaceObject.prototype);
  
  //initialize
  self.obj = document.getElementById(objID);
  self.mass = mass;
  self.Velocity = new Vector(0,0);
  self.ThrustVectors = {};
  self.collidingWith = []
  
  //check for proper initialization
  if(!self.obj) 
    throw objID + ' not recognized as a valid element';
}

SpaceObject.prototype.CalculateNewPosition = function(max_X, min_X, max_Y, min_Y){
    
  //This is where the thing is rendered onscreen
  var curPos = { 
    X: this.X, 
    Y: this.Y
  }
  
  //Have to calculate the new position separately from the thix.X and this.Y
  // because changes to those don't take effect until the page is rendered
  this.newPos = {
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
  if(overX) this.newPos.X = max_X; 
  if(overY) this.newPos.Y = max_Y; 
  if(undrX) this.newPos.X = min_X; 
  if(undrY) this.newPos.Y = min_Y; 

  //detect and handle collision
  for (var o in this.universe.Objects) {
    var uo = this.universe.Objects[o]
    if (uo != this) {
      if (this.DistanceTo(uo) <= this.R + uo.R) {

        if (!this.collidingWith.includes(uo)) {
          this.collidingWith.push(uo)
          uo.collidingWith.push(this)
          //this.Collide(uo)
          this.ResolveCollision(this, uo)
        }
      }
      else if(this.collidingWith.includes(uo))
        this.collidingWith.pop(uo)
    }
  }

  //apply calculated change in position
  this.newPos.X += this.Velocity.X;
  this.newPos.Y += this.Velocity.Y;
}

SpaceObject.prototype.UpdatePosition = function() {
  this.X = this.newPos.X;
  this.Y = this.newPos.Y;
}

SpaceObject.prototype.Collide = function (uo) {

  //https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling
  //http://cobweb.cs.uga.edu/~maria/classes/4070-Spring-2017/Adam%20Brookes%20Elastic%20collision%20Code.pdf
  //http://www.vobarian.com/collisions/2dcollisions2.pdf
  
  //find unit normal and unit tangent vectors of the collision
  var xDistance = Math.abs(this.X - uo.X)
  var yDistance = Math.abs(this.Y - uo.Y)
  var normalVector = new Vector(xDistance, yDistance)
  normalVector = normalVector.GetUnitVector()

  var tangentVector = normalVector.Y != 0 //watch out for -0 values
    ? new Vector((normalVector.Y * -1), normalVector.X)
    : new Vector(normalVector.Y, (normalVector.X * -1))

  this.universe.Vectors.push({name:'normalVector', vector: normalVector})
  this.universe.Vectors.push({name:'tangentVector', vector: tangentVector})

  // create scalar normal directions
  var AscalarNormal = normalVector.DotProduct(this.Velocity)
  var BscalarNormal = normalVector.DotProduct(uo.Velocity)

  // create scalar velocity in the tagential directions
  var AscalarTangential = tangentVector.DotProduct(this.Velocity)
  var BscalarTangential = tangentVector.DotProduct(uo.Velocity)

  var mA = this.mass
  var mB = uo.mass
  var AScalarNormalAfter = (AscalarNormal * (mA - mB) + 2 * mB * BscalarNormal) / (mA + mB)
  var BScalarNormalAfter = (BscalarNormal * (mB - mA) + 2 * mA * AscalarNormal) / (mA + mB)

  var AscalarNormalAfter_vector = normalVector.Multiply(AScalarNormalAfter)
  var BscalarNormalAfter_vector = normalVector.Multiply(BScalarNormalAfter)
  var AScalarNormalVector = (tangentVector.Multiply(AscalarTangential))
  var BScalarNormalVector = (tangentVector.Multiply(BscalarTangential))

  var vA = AScalarNormalVector.Add(AscalarNormalAfter_vector)
  var vB = BScalarNormalVector.Add(BscalarNormalAfter_vector)

  this.Velocity = vA
  uo.Velocity = vB
}

SpaceObject.prototype.ResolveCollision = function(b1, b2) {
  //https://stackoverflow.com/a/27016465

  var v1x = b1.Velocity.X,
      v2x = b2.Velocity.X,
      v1y = b1.Velocity.Y,
      v2y = b2.Velocity.Y;

  // Collision vector
  var delta = {
      x: b2.X- b1.X,
      y: b2.Y - b1.Y
  };
  // var d = length(delta);
  var d = Math.sqrt(delta.x * delta.x + delta.y * delta.y)

  // Normalized collision vector
  var dn = {
      x: delta.x / d,
      y: delta.y / d
  }

  // Normalized tangent collision vector
  var dt = {
      x: dn.y,
      y: -dn.x
  };

  var m1 = b1.mass;
  var m2 = b2.mass;
  var M = m1 + m2;

  /*    
  // test those separation tricks in a second time
  if (d === 0) {
      b2.x += 0.01;
  }
  var mt = {
      x: dn.x * (b1.r + b2.r - d),
      y: dn.y * (b1.r + b2.r - d)
  };    
  b1.x = b1.x + mt.x * m2 / M
  b1.y = b1.y + mt.y * m2 / M
  b2.x = b2.x + mt.x * m1 / M
  b2.y = b2.y + mt.y * m1 / M
  */

  // projection of v1 on the collision vector
  var v1Proj = {
      n: dn.x * v1x + dn.y * v1y,
      t: dt.x * v1x + dt.y * v1y
  };

  // projection of v2 on the collision vector
  var v2Proj = {
      n: dn.x * v2x + dn.y * v1y,
      t: dt.y * v2x + dt.y * v2y
  };

  // solving collision on the normal
  var newV1ProjN = ((m1 - m2) * v1Proj.n + 2 * m2 * v2Proj.n) / M;
  var newV2ProjN = ((m2 - m1)* v2Proj.n + 2 * m1 * v1Proj.n) / M;

  // re-building speed vector out of projected vectors
  b1.Velocity.X = newV1ProjN * dn.x + v1Proj.t * dt.x;
  b1.Velocity.Y = newV1ProjN * dn.y + v1Proj.t * dt.y;

  b2.Velocity.X = newV2ProjN * dn.x + v2Proj.t * dt.x;
  b2.Velocity.Y = newV2ProjN * dn.y + v2Proj.t * dt.y;
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

//Radius!
//<circle cx="100" cy="200" r="5" fill="red" id="redcircle1" />
Object.defineProperty(SpaceObject.prototype, 'R', {
  get: function() { return parseFloat(this.obj.getAttribute('r')); },
  set: function(value) { if(value) this.obj.setAttribute('r', value); }
});

Object.defineProperty(SpaceObject.prototype, 'mass', {
  get: function() { return this._mass; },
  set: function(value) { this._mass = value; }
});