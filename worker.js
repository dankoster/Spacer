
onmessage = function (e) {
	var result = ResolveCollision(e.data[0])
	postMessage(result)
}

function Vector ({x,y}){
	this.X = x
	this.Y = y
	this.Add = function (value) {
		return new Vector({ x: this.X + value.X, y: this.Y + value.Y })
	}

	this.Multiply = function (value) {
		return new Vector({ x: this.X * value, y: this.Y * value })
	}
}

var ResolveCollision = function ({ x1, y1, x2, y2, m1, m2, v1x, v1y, v2x, v2y }) {
	//https://stackoverflow.com/a/27016465
	//https://imada.sdu.dk/~rolf/Edu/DM815/E10/2dcollisions.pdf

	// Collision vector
	// var delta = {
	//   x: b2.newPos.X - b1.newPos.X,
	//   y: b2.newPos.Y - b1.newPos.Y
	// };
	var delta = {
		x: x2 - x1,
		y: y2 - y1
	};

	// can't have a zero-distance (you get black holes and such)
	if (delta.x == 0 && delta.y == 0) {
		delta.x = Math.random()
		delta.y = Math.random()
	}

	var d = Math.sqrt(delta.x * delta.x + delta.y * delta.y)

	// Normalized collision vector
	var dn = new Vector({
		x: delta.x / d,
		y: delta.y / d
	})

	// Normalized tangent collision vector
	var dt = new Vector({
		x: dn.Y == 0 ? dn.Y : dn.Y * -1,
		y: dn.Y == 0 ? dn.X * -1 : dn.X
	})

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
	// var m1 = b1.mass;
	// var m2 = b2.mass;
	var M = (m1 + m2);
	var newV1ProjN = (((m1 - m2) * v1Proj.n) + (2 * m2 * v2Proj.n)) / M;
	var newV2ProjN = (((m2 - m1) * v2Proj.n) + (2 * m1 * v1Proj.n)) / M;

	// re-building speed vector out of projected vectors
	var v1n = dn.Multiply(newV1ProjN)
	var v2n = dn.Multiply(newV2ProjN)
	var v1t = dt.Multiply(v1Proj.t)
	var v2t = dt.Multiply(v2Proj.t)
	var V1 = v1n.Add(v1t)
	var V2 = v2n.Add(v2t)

	var result = {
		V1: {x:V1.X, y:V1.Y},
		V2: {x:V2.X, y:V2.Y},
	}

	return result
}
