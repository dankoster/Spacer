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

  get AsVector() { return new Vector(this.X, this.Y) }
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
    this.position.X = this.newPos.X;
    this.position.Y = this.newPos.Y;
  }

  CalculateNewPosition() {
    this.old = {
      X: this.Velocity.X,
      Y: this.Velocity.Y
    }
    //Have to calculate the new position separately from the thix.X and this.Y
    // because changes to those don't take effect until the page is rendered
    this.newPos.X = this.position.X
    this.newPos.Y = this.position.Y

    //detect and handle collision
    for (var o in this.universe.Objects) {
      var uo = this.universe.Objects[o]
      if (uo != this) {
        let distance = SpaceObject.DistanceBetween(this.newPos, uo.newPos) //this.DistanceTo(uo)
        let overlap = distance - this.radius - uo.radius;
        if (overlap <= 0) {

          //haven't calculated a new position for this yet but it's overlapping the other thing
          // so displace it away from the other thing along an inverse of the gravity vector
          // by the amount of the overlap
          var displacement = this.GetDisplacementTo(uo, overlap)//.Multiply(1.5)
          this.newPos.X += displacement.X
          this.newPos.Y += displacement.Y
          var di = displacement.Inverse
          uo.newPos.X += di.X
          uo.newPos.Y += di.Y

          var newV = this.ResolveCollision(this, uo)
          var damper = 0.5 //don't want perfectly elastic collisions? Why is 0.5 ideal???

          this.Velocity.X = newV.X1 * damper
          this.Velocity.Y = newV.Y1 * damper
          uo.Velocity.X = newV.X2 * damper
          uo.Velocity.Y = newV.Y2 * damper


          //trying for a simpler collision
          //https://en.wikipedia.org/wiki/Elastic_collision
          // var m1 = this.mass
          // var m2 = uo.mass
          // var M1 = (2*m2)/(m1+m2)
          // var M2 = (2*m1)/(m1+m2)
          // var v1 = this.Velocity
          // var v2 = uo.Velocity
          // var x1 = this.newPos.AsVector
          // var x2 = uo.newPos.AsVector

          // var N1 = Vector.DotProduct(v1.Subtract(v2),x1.Subtract(x2))
          // var D1 = Math.pow(x1.Subtract(x2).M, 2)
          // var v1d = x1.Subtract(x2).Multiply(M1*(N1/D1))

          // var N2 = Vector.DotProduct(v2.Subtract(v1),x2.Subtract(x1))
          // var D2 = Math.pow(x2.Subtract(x1).M, 2)
          // var v2d = x2.Subtract(x1).Multiply(M2*(N2/D2))

          // this.Velocity = v1.Subtract(v1d)
          // uo.Velocity = v2.Subtract(v2d)

        }
      }
    }

    var gv = this.totalAcceleration
    this.Velocity.X += gv.X
    this.Velocity.Y += gv.Y

    this.UpdateNewPosition(this.Velocity)
  }

  GetDisplacementTo(otherObject, overlap) {
    var vectorToOtherObject = new Vector(
      otherObject.position.X - this.position.X,
      otherObject.position.Y - this.position.Y
    )
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
    if (delta.x == 0 && delta.y == 0) {
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
    var m1 = b1.mass;
    var m2 = b2.mass;
    var M = (m1 + m2);
    var newV1ProjN = ((m1 - m2) * v1Proj.n + 2 * m2 * v2Proj.n) / M;
    var newV2ProjN = ((m2 - m1) * v2Proj.n + 2 * m1 * v1Proj.n) / M;

    // re-building speed vector out of projected vectors
    var result = {
      X1: newV1ProjN * dn.x + v1Proj.t * dt.x,
      Y1: newV1ProjN * dn.y + v1Proj.t * dt.y,
      X2: newV2ProjN * dn.x + v2Proj.t * dt.x,
      Y2: newV2ProjN * dn.y + v2Proj.t * dt.y,
    }

    // detect unreasonable acceleration
    if (Math.abs(result.X1) - Math.abs(b1.Velocity.X) > 15) {
      console.log({ id: b1.id, v1x, v1y, v2x, v2y, result })
      debugger
    }

    return result
  }
}