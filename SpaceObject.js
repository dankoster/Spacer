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

  get AsVector() { return new Vector({x:this.X, y:this.Y}) }
}

export class SpaceObject {

  constructor({ X, Y, R, V = new Vector({}), mass, id }) {
    this.id = id >= 0 ? id : Date.now()
    this.mass = mass
    this.Velocity = V
    this.ThrustVectors = {}
    this.collidingWith = []
    this.universe = undefined
    this.radius = R
    this.position = new Position({ X, Y })
    this.newPos = new Position({ X, Y })
    this.old = {}
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
    this.UpdateNewPosition(this.Velocity)

    this.position.X = this.newPos.X;
    this.position.Y = this.newPos.Y;
    this.collidingWith = []
  }

  CalculateNewPosition() {
    //Calculate the new position without changing current position
    // so all the gravity calculations are consistent
    this.newPos.X = this.position.X
    this.newPos.Y = this.position.Y

    //detect and handle collision
    for (var o in this.universe.Objects) {
      var uo = this.universe.Objects[o]
      if (uo != this && !this.collidingWith.includes(uo.id)) {
        let distance = SpaceObject.DistanceBetween(this.newPos, uo.newPos) 
        let overlap = distance - this.radius - uo.radius;
        if (overlap <= 0) {
        
          this.collidingWith.push(uo.id)
          uo.collidingWith.push(this.id)

          //haven't calculated a new position for this yet but it's overlapping the other 
          // thing so displace it away from the other thing along an inverse of the gravity 
          // vector by the amount of the overlap
          var displacement = this.GetDisplacementTo(uo, overlap)
          this.newPos.X += displacement.X
          this.newPos.Y += displacement.Y
          var di = displacement.Inverse
          uo.newPos.X += di.X
          uo.newPos.Y += di.Y

          var newV = this.ResolveCollision(this, uo)
          if(newV)
          {
            this.Velocity.X = newV.X1
            this.Velocity.Y = newV.Y1
            uo.Velocity.X = newV.X2
            uo.Velocity.Y = newV.Y2
          }
        }
      }
    }

    //Add acceleration due to gravity and other factors
    var gv = this.totalAcceleration
    this.Velocity.X += gv.X
    this.Velocity.Y += gv.Y

    this.newPos.X += this.Velocity.X
    this.newPos.Y += this.Velocity.Y
    
    //this.UpdateNewPosition(this.Velocity)
  }

  GetDisplacementTo(otherObject, overlap) {
    var vectorToOtherObject = new Vector({
      x: otherObject.position.X - this.position.X,
      y: otherObject.position.Y - this.position.Y
    })
    var amount = (overlap * -1)
    var displacement = vectorToOtherObject.Unit.Inverse.Multiply(amount)
    return displacement
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
    //https://imada.sdu.dk/~rolf/Edu/DM815/E10/2dcollisions.pdf

    var v1x = b1.Velocity.X,
      v2x = b2.Velocity.X,
      v1y = b1.Velocity.Y,
      v2y = b2.Velocity.Y;

    // Collision vector
    var delta = {
      x: b2.newPos.X - b1.newPos.X,
      y: b2.newPos.Y - b1.newPos.Y
    };

    // can't have a zero-distance (you get black holes and such)
    if (delta.x == 0 && delta.y == 0) {
      console.log('zero distance collision!!!')
      return
      //just use a random value between 0 and 1
//      delta.x = Math.random()
//      delta.y = Math.random()
    }

    var d = Math.sqrt(delta.x * delta.x + delta.y * delta.y)

    // Normalized collision vector
    var dn = new Vector({
      x: delta.x / d,
      y: delta.y / d
    })

    // Normalized tangent collision vector
    var dt = {
      x: dn.y,
      y: -dn.x
    };

    // projection of v1 on the collision vector
    var v1Proj = {
      n: dn.X * v1x + dn.Y * v1y,
      t: dt.X * v1x + dt.Y * v1y
    };

    // projection of v2 on the collision vector
    var v2Proj = {
      n: dn.X * v2x + dn.Y * v2y,
      t: dt.X * v2x + dt.Y * v2y
    };

    // solving collision on the normal
    var m1 = b1.mass;
    var m2 = b2.mass;
    var M = (m1 + m2);
    var newV1ProjN = (((m1 - m2) * v1Proj.n) + (2 * m2 * v2Proj.n)) / M;
    var newV2ProjN = (((m2 - m1) * v2Proj.n) + (2 * m1 * v1Proj.n)) / M;

    // re-building speed vector out of projected vectors
    var v1n = dn.Multiply(newV1ProjN)
    var v2n = dn.Multiply(newV2ProjN)
    var v1t = dt.Multiply(v1Proj.t)
    var v2t = dt.Multiply(v2Proj.t)
    var result = {
      V1: v1n.Add(v1t),
      V2: v2n.Add(v2t)
    }

    return result
  }
}