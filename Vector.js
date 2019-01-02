export function Vector(x, y) {
  
  //ensure new-agnostic construction
  var self = this instanceof Vector
           ? this
           : Object.create(Vector.prototype)
  
  if(typeof x == 'number' && typeof y == 'number'){
    self.X = x
    self.Y = y
  }
  else if(x instanceof Object && typeof x.X == 'number' && typeof x.Y == 'number')
  {
    self.X = x.X
    self.Y = x.Y
  }
  else throw 'Unexpected value x=' + x + ' y=' + y
}

//Magnitude of the vector
Object.defineProperty(Vector.prototype, 'M', {
  get: function() {
    //https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/vector-magnitude-normalization
    return Math.sqrt((this.X * this.X) + (this.Y * this.Y))
  }
});

Vector.prototype.Add = function(value) {
  return Vector.Add(this, value);
}

Vector.prototype.Subtract = function(value) {
  return Vector.Subtract(this, value);
}

Vector.prototype.Multiply = function(value) {
  return Vector.Multiply(this, value);
}

Vector.prototype.Divide = function(value) { 
  return Vector.Divide(this, value);
}

Vector.prototype.DotProduct = function(v) {
  return Vector.DotProduct(this, v)
}

Vector.prototype.GetUnitVector = function() {
  return Vector.GetUnitVector(this)
}

Vector.prototype.GetTangentVector = function() {
  return Vector.GetTangentVector(this)
}

Vector.prototype.Inverse = function() {
  return Vector.Inverse(this)
}

Vector.Add = function(vector, value){
  if(value instanceof Vector){
    return new Vector(vector.X + value.X, vector.Y + value.Y);
  }
  else if(typeof value === 'number') {
    return new Vector(vector.X + value, vector.Y + value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.Subtract = function(vector, value) {
  if(value instanceof Vector){
    return new Vector(vector.X - value.X, vector.Y - value.Y);
  }
  else if(typeof value === 'number') {
    return new Vector(vector.X - value, vector.Y - value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.Multiply = function(vector, value) {
  if(value instanceof Vector){
    return new Vector(vector.X * value.X, vector.Y * value.Y);
  }
  else if(typeof value === 'number') {
    return new Vector(vector.X * value, vector.Y * value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.Divide = function(vector, value) {
  if(value instanceof Vector){
    throw 'Cannot divide vectors!';
  }
  else if(typeof value === 'number') {
    return new Vector(this.X / value, this.Y / value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.DotProduct = function(v1, v2) {
  return (v1.X + v2.X) + (v1.Y + v2.Y);
}

Vector.GetResultVector = function(vectors) {
  if(Array.isArray(vectors)){
    var result = new Vector(0, 0);
    for(var v in vectors) {
      if(vectors[v]){
        if(!(vectors[v] instanceof Vector)) throw 'Array must only contain Vector objects';
        result = result.Add(vectors[v]);
      }
    }
    return result;
  }
  else throw vectors + ' must be an Array';
}

Vector.GetUnitVector = function(v) { 
  //http://www.maths.usyd.edu.au/u/MOW/vectors/vectors-4/v-4-3.html
  return new Vector(v.X / v.M, v.Y / v.M);
}

//http://cobweb.cs.uga.edu/~maria/classes/4070-Spring-2017/Adam%20Brookes%20Elastic%20collision%20Code.pdf
Vector.GetUnitNormalVector = function(v1, v2) {
  if(!(v1 instanceof Vector)) throw "v1 must be an instance of Vector"
  if(!(v2 instanceof Vector)) throw "v2 must be an instance of Vector"

  var dX = (v2.X - v1.X)
  var dY = (v2.Y - v1.Y)
  var normalVector = new Vector(dX, dY)
  return normalVector.GetUnitVector()
}

Vector.GetTangentVector = function(v) {
  return new Vector((v.Y * -1), v.X)
}

Vector.Inverse = function(v) {
  return new Vector(v.X * -1, v.Y + -1)
}