export function Vector(x, y) {
  
  //ensure new-agnostic construction
  var self = this instanceof Vector
           ? this
           : Object.create(Vector.prototype);
    
  self.X = x;
  self.Y = y;
}

//Magnitude of the vector
Object.defineProperty(Vector.prototype, 'M', {
  get: function() {
    //m = 1/(x^2 + y^2)^2
    return 1 / Math.sqrt((this.X * this.X) + (this.Y * this.Y));
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

Vector.Add = function(vector, value){
  if(value instanceof Vector){
    return new Vector(vector.X + value.X, vector.Y + value.Y);
  }
  else if(value instanceof Number) {
    return new Vector(vector.X + value, vector.Y + value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.Subtract = function(vector, value) {
  if(value instanceof Vector){
    return new Vector(vector.X - value.X, vector.Y - value.Y);
  }
  else if(value instanceof Number) {
    return new Vector(vector.X - value, vector.Y - value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.Multiply = function(vector, value) {
  if(value instanceof Vector){
    return new Vector(vector.X * value.X, vector.Y * value.Y);
  }
  else if(value instanceof Number) {
    return new Vector(vector.X * value, vector.Y * value);
  }
  else throw value + ' must be a Vector or a Number';
}

Vector.Divide = function(vector, value) {
  if(value instanceof Vector){
    throw 'Cannot divide vectors!';
  }
  else if(value instanceof Number) {
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