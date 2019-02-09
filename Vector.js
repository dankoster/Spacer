export class Vector {
  constructor({x = 0, y = 0}) {

    if (typeof x == 'number' && typeof y == 'number') {
      this.X = x
      this.Y = y
    }
    else if (x instanceof Object && typeof x.X == 'number' && typeof x.Y == 'number') {
      this.X = x.X
      this.Y = x.Y
    }
    else throw 'Unexpected value x=' + x + ' y=' + y
  }
  //Magnitude of the vector
  get M() {
    //https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/vector-magnitude-normalization
    return Math.sqrt((this.X * this.X) + (this.Y * this.Y))
  }

  get Inverse() { return this.GetInverse() }
  get Unit() { return this.GetUnitVector() }

  Add(value) { return Vector.Add(this, value) }
  Subtract(value) { return Vector.Subtract(this, value) }
  Multiply(value) { return Vector.Multiply(this, value) }
  Divide(value) { return Vector.Divide(this, value) }
  DotProduct(v) { return Vector.DotProduct(this, v) }
  GetUnitVector() { return Vector.GetUnitVector(this) }
  GetTangentVector() { return Vector.GetTangentVector(this) }
  GetInverse() { return Vector.GetInverse(this) }

  static Add(vector, value) {
    if (value instanceof Vector) {
      return new Vector({x:vector.X + value.X, y:vector.Y + value.Y});
    }
    else if (typeof value === 'number') {
      return new Vector({x:vector.X + value, y:vector.Y + value});
    }
    else throw value + ' must be a Vector or a Number';
  }

  static Subtract(vector, value) {
    if (value instanceof Vector) {
      return new Vector({x:vector.X - value.X, y:vector.Y - value.Y});
    }
    else if (typeof value === 'number') {
      return new Vector({x:vector.X - value, y:vector.Y - value});
    }
    else throw value + ' must be a Vector or a Number';
  }

  static Multiply(vector, value) {
    if (value instanceof Vector) {
      return new Vector({x:vector.X * value.X, y:vector.Y * value.Y});
    }
    else if (typeof value === 'number') {
      return new Vector({x:vector.X * value, y:vector.Y * value});
    }
    else throw value + ' must be a Vector or a Number';
  }

  static Divide(vector, value) {
    if (value instanceof Vector) {
      throw 'Cannot divide vectors!';
    }
    else if (typeof value === 'number') {
      return new Vector({x:this.X / value, y:this.Y / value});
    }
    else throw value + ' must be a Vector or a Number';
  }

  static DotProduct(v1, v2) {
    //https://en.wikipedia.org/wiki/Dot_product
    return (v1.X * v2.X) + (v1.Y * v2.Y);
  }

  static GetResultVector(vectors) {
    if (Array.isArray(vectors)) {
      var result = new Vector({});
      for (var v in vectors) {
        if (vectors[v]) {
          if (!(vectors[v] instanceof Vector)) throw 'Array must only contain Vector objects';
          result = result.Add(vectors[v]);
        }
      }
      return result;
    }
    else throw vectors + ' must be an Array';
  }

  static GetUnitVector(v) {
    //http://www.maths.usyd.edu.au/u/MOW/vectors/vectors-4/v-4-3.html
    return new Vector({x:v.X / v.M, y:v.Y / v.M});
  }

  //http://cobweb.cs.uga.edu/~maria/classes/4070-Spring-2017/Adam%20Brookes%20Elastic%20collision%20Code.pdf
  static GetUnitNormalVector(v1, v2) {
    if (!(v1 instanceof Vector)) throw "v1 must be an instance of Vector"
    if (!(v2 instanceof Vector)) throw "v2 must be an instance of Vector"

    var dX = (v2.X - v1.X)
    var dY = (v2.Y - v1.Y)
    var normalVector = new Vector({x:dX, y:dY})
    return normalVector.GetUnitVector()
  }

  static GetTangentVector(v) {
    return new Vector({x:(v.Y * -1), y:v.X})
  }

  static GetInverse(v) {
    return new Vector({x:v.X * -1, y:v.Y * -1})
  }
}