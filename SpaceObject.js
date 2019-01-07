import { Vector } from './Vector.js'

export class Position {
  constructor({ X, Y }) {
    this.X = X
    this.Y = Y
  }
  get X() { return this.x }
  set X(value) {
    if (value === 0 || value) this.x = value
    else throw `invalid X value: ${value}`
  }
  get Y() { return this.y }
  set Y(value) {
    if (value === 0 || value) this.y = value
    else throw `invalid Y value: ${value}`
  }
}

export class SpaceObject {

  constructor({ X, Y, R, mass, id }) {
    this.id = id >= 0 ? id : Date.now()
    this.mass = mass
    this.Velocity = new Vector(0, 0)
    this.ThrustVectors = {}
    this.collidingWith = []
    this.universe = undefined
    this.radius = R
    this.position = new Position({ X, Y })
    this.newPos = new Position({ X, Y })
  }

  get hasNewPosition() {
    return this.newPos.X != this.position.X || this.newPos.Y != this.position.Y
  }

  get totalAcceleration() {
    var forces = [];
    var accelerationDueToGravity = this.universe.GetGravityVector(this);
    forces.push(accelerationDueToGravity);

    for (var t in this.ThrustVectors) {
      if (this.ThrustVectors[t]) forces.push(this.ThrustVectors[t]);
    }

    var totalAcceleration = Vector.GetResultVector(forces);
    return totalAcceleration;
  }

  static DistanceBetween(a, b) {
    return Math.sqrt(((b.X - a.X) * (b.X - a.X)) + ((b.Y - a.Y) * (b.Y - a.Y)));
  }

  DistanceTo(so) {
    return SpaceObject.DistanceBetween(this.position, so.position)
  }

  UpdatePosition() {
    this.position.X = this.newPos.X;
    this.position.Y = this.newPos.Y;
  }

  CalculateNewPosition(max_X, min_X, max_Y, min_Y) {

    if (!this.hasNewPosition) {
      this.Velocity = this.Velocity.Add(this.totalAcceleration);

      //Have to calculate the new position separately from the thix.X and this.Y
      // because changes to those don't take effect until the page is rendered
      this.newPos.X = this.position.X
      this.newPos.Y = this.position.Y

      //have made it outside the boundaries?
      var overX = this.newPos.X > max_X;
      var overY = this.newPos.Y > max_Y;
      var undrX = this.newPos.X < min_X;
      var undrY = this.newPos.Y < min_Y;

      //constrain velocity at the boundaries
      if (overX || undrX) { 
        this.Velocity.X *= -1; this.Velocity.X *= 0.25; 
      }
      if (overY || undrY) { 
        this.Velocity.Y *= -1; this.Velocity.Y *= 0.25; 
      }

      //constrain position
      if (overX) this.newPos.X = max_X;
      if (overY) this.newPos.Y = max_Y;
      if (undrX) this.newPos.X = min_X;
      if (undrY) this.newPos.Y = min_Y;

      //detect and handle collision
      for (var o in this.universe.Objects) {
        var uo = this.universe.Objects[o]
        if (uo != this) {
          let distance = this.DistanceTo(uo)
          let overlap = distance - this.radius - uo.radius;
          if (overlap < 1) {

            if (!this.collidingWith.includes(uo)) {
              //console.log({thing: this.obj, collidingWith: uo.obj})
              this.collidingWith.push(uo)
              uo.collidingWith.push(this)
              var newV = this.ResolveCollision(this, uo)
              var damper = 0.9 //don't want perfectly elastic collisions
              this.Velocity.X = newV.X1 * damper
              this.Velocity.Y = newV.Y1 * damper
              uo.Velocity.X = newV.X2 * damper
              uo.Velocity.Y = newV.Y2 * damper
              this.UpdateNewPosition(this.Velocity)
              SpaceObject.UpdateNewPosition(uo, uo.Velocity)
            }
            else if (!this.hasNewPosition) {
              //haven't calculated a new position for this yet but it's overlapping the other thing
              // so displace it away from the other thing along an inverse of the gravity vector
              // by the amount of the overlap
              var vectorToUo = new Vector(
                uo.position.X - this.position.X,
                uo.position.Y - this.position.Y
              )
              var displacement = vectorToUo.Unit.Inverse.Multiply(Math.abs(overlap/2))
              this.newPos.X += displacement.X
              this.newPos.Y += displacement.Y
              this.UpdateNewPosition(this.Velocity)
            }
          }
          else if (this.collidingWith.includes(uo))
            this.collidingWith.pop(uo)
        }
      }

      if (!this.hasNewPosition) {
        this.UpdateNewPosition(this.Velocity)
      }
    }
  }

  UpdateNewPosition(v) {
    SpaceObject.UpdateNewPosition(this, v)
  }

  static UpdateNewPosition(so, v) {
    so.newPos.X += v.X
    so.newPos.Y += v.Y
  }

  ResolveCollision(b1, b2) {
    //https://stackoverflow.com/a/27016465

    var v1x = b1.Velocity.X,
      v2x = b2.Velocity.X,
      v1y = b1.Velocity.Y,
      v2y = b2.Velocity.Y;

    // Collision vector
    var delta = {
      x: b2.position.X - b1.position.X,
      y: b2.position.Y - b1.position.Y
    };
    
    // can't have a zero-distance (you get black holes and such)
    if(delta.x == 0 && delta.y == 0){
      delta.x = Math.random()
      delta.y = Math.random()
    }

    var d = Math.sqrt(delta.x * delta.x + delta.y * delta.y)

    // Normalized collision vector
    var dn = {
      x: delta.x / d,
      y: delta.y / d
    }

    // Normalized tangent collision vector
    var dt = {
      x: dn.y,
      y: dn.x
    };

    var m1 = b1.mass;
    var m2 = b2.mass;
    var M = m1 + m2;

    // projection of v1 on the collision vector
    var v1Proj = {
      n: dn.x * v1x + dn.y * v1y,
      t: dt.x * v1x + dt.y * v1y
    };

    // projection of v2 on the collision vector
    var v2Proj = {
      n: dn.x * v2x + dn.y * v2y,
      t: dt.x * v2x + dt.y * v2y
    };

    // solving collision on the normal
    var newV1ProjN = ((m1 - m2) * v1Proj.n + 2 * m2 * v2Proj.n) / M;
    var newV2ProjN = ((m2 - m1) * v2Proj.n + 2 * m1 * v1Proj.n) / M;

    // re-building speed vector out of projected vectors
    var result = {
      X1: newV1ProjN * dn.x + v1Proj.t * dt.x,
      Y1: newV1ProjN * dn.y + v1Proj.t * dt.y,
      X2: newV2ProjN * dn.x + v2Proj.t * dt.x,
      Y2: newV2ProjN * dn.y + v2Proj.t * dt.y,
    }

    return result
  }
}