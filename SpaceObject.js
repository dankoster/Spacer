import { Vector } from './Vector.js'
import { Universe } from './Universe.js'

export class SpaceObject {

  constructor(objID, mass) {
    this.obj = document.getElementById(objID)
    this.mass = mass
    this.Velocity = new Vector(0, 0)
    this.ThrustVectors = {}
    this.collidingWith = []

    //check for proper initialization
    if (!this.obj)
      throw objID + ' not recognized as a valid element';
  }

  CalculateNewPosition(max_X, min_X, max_Y, min_Y) {

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
    if (overX || undrX) { this.Velocity.X *= -1; this.Velocity.X *= 0.15; }
    if (overY || undrY) { this.Velocity.Y *= -1; this.Velocity.Y *= 0.15; }

    //constrain position
    if (overX) this.newPos.X = max_X;
    if (overY) this.newPos.Y = max_Y;
    if (undrX) this.newPos.X = min_X;
    if (undrY) this.newPos.Y = min_Y;

    //detect and handle collision
    for (var o in this.universe.Objects) {
      var uo = this.universe.Objects[o]
      if (uo != this) {
        if (this.DistanceTo(uo) <= this.R + uo.R) {

          if (!this.collidingWith.includes(uo)) {
            this.collidingWith.push(uo)
            uo.collidingWith.push(this)
            this.ResolveCollision(this, uo)
          }
          else {
            var gv = Universe.GetGravityVectorFromTo(this, uo)
            var gvi = gv.Inverse()
            // this.Velocity.X += gvi.X
            // this.Velocity.Y += gvi.Y
            this.newPos.X += gvi.X
            this.newPos.Y += gvi.Y

          }
        }
        else if (this.collidingWith.includes(uo))
          this.collidingWith.pop(uo)
      }
    }

    //apply calculated change in position
    this.newPos.X += this.Velocity.X;
    this.newPos.Y += this.Velocity.Y;
  }

  UpdatePosition() {
    this.X = this.newPos.X;
    this.Y = this.newPos.Y;
  }

  ResolveCollision(b1, b2, damper) {
    //https://stackoverflow.com/a/27016465

    var v1x = b1.Velocity.X,
      v2x = b2.Velocity.X,
      v1y = b1.Velocity.Y,
      v2y = b2.Velocity.Y;

    // Collision vector
    var delta = {
      x: b2.X - b1.X,
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
    var newV2ProjN = ((m2 - m1) * v2Proj.n + 2 * m1 * v1Proj.n) / M;

    if (damper === undefined) damper = 1

    // re-building speed vector out of projected vectors
    b1.Velocity.X = damper * (newV1ProjN * dn.x + v1Proj.t * dt.x);
    b1.Velocity.Y = damper * (newV1ProjN * dn.y + v1Proj.t * dt.y);

    b2.Velocity.X = damper * (newV2ProjN * dn.x + v2Proj.t * dt.x);
    b2.Velocity.Y = damper * (newV2ProjN * dn.y + v2Proj.t * dt.y);
  }

  static DistanceBetween(a, b) {
    return Math.sqrt(((b.X - a.X) * (b.X - a.X)) + ((b.Y - a.Y) * (b.Y - a.Y)));
  }

  DistanceTo(so) {
    return SpaceObject.DistanceBetween(this, so)
  }

  get totalAcceleration() {
    var forces = [];
    var accelerationDueToGravity = Universe.GetGravityVector(this);
    forces.push(accelerationDueToGravity);

    for (var t in this.ThrustVectors) {
      if (this.ThrustVectors[t]) forces.push(this.ThrustVectors[t]);
    }

    var totalAcceleration = Vector.GetResultVector(forces);
    return totalAcceleration;
  }

  get X() { return parseFloat(this.obj.getAttribute('cx')); }
  set X(value) { if (value) this.obj.setAttribute('cx', value); }

  get Y() { return parseFloat(this.obj.getAttribute('cy')); }
  set Y(value) { if (value) this.obj.setAttribute('cy', value); }

  //Radius!
  //<circle cx="100" cy="200" r="5" fill="red" id="redcircle1" />
  get R() { return parseFloat(this.obj.getAttribute('r')); }
  set R(value) { if (value) this.obj.setAttribute('r', value); }

  get mass() { return this._mass; }
  set mass(value) { this._mass = value; }
}