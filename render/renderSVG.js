import { limitedRandom } from '../utility.js'

export class renderSVG {

	constructor(game) {
		this.game = game
		this.renderItems = {}
		this.svg = document.getElementsByTagName('svg')[0]
		this.overview = null
	}

	render() {
		this.game.universe.Objects.forEach(so => {
			if (!this.renderItems[so.id]) {
				var newItem = new circle({ so, fill: so.id > 0 ? 'red' : 'blue' })
				this.renderItems[so.id] = newItem
				this.svg.appendChild(newItem.element)
			}
			else { //item already exists
				this.renderItems[so.id].update()
			}
		});

		var s = this.game.universe.OverviewSize
		if (!this.overview) {
			this.overview = new rectangle({ id: 'overview' })
			this.svg.appendChild(this.overview.element)
		}
		this.overview.update(s)
	}
}

export class rendered {
	constructor(so, element) {
		this.so = so
		this.element = element
	}

	get id() { return so.id }
}

export class rectangle extends rendered {
	//<rect width="500%" height="500%" fill="url(#grid)" />
	constructor({ so, id, x, y, w, h }) {
		if (so != undefined) throw 'so not implemented for rectangle'
		var e = rectangle.createElement({ id, x, y, w, h })
		super(null, e)
	}

	static createElement({ id, x=0, y=0, w=0, h=0 }) {
		var e = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
		e.setAttribute("id", id)
		e.setAttribute("x", x)
		e.setAttribute("y", y)
		e.setAttribute("width", w)
		e.setAttribute("height", h)
		return e
	}

	update(s) {
		this.x = s.xMin
		this.y = s.yMin
		this.w = s.xMax - s.xMin
		this.h = s.yMax - s.yMin
	}

	set x(value) { if (value) this.element.setAttribute('x', value); }
	set y(value) { if (value) this.element.setAttribute('y', value); }
	set w(value) { if (value) this.element.setAttribute('width', value); }
	set h(value) { if (value) this.element.setAttribute('height', value); }
}

export class circle extends rendered {
	//<circle cx="100" cy="200" r="5" fill="red" id="redcircle1" />
	constructor({ so, fill = 'red' }) {
		var e = circle.createElement({
			id: so.id,
			x: so.position.X,
			y: so.position.Y,
			r: so.radius,
			fill: fill
		})

		super(so, e)
	}

	update() {
		this.x = this.so.position.X
		this.y = this.so.position.Y
		this.r = this.so.radius
	}

	static createElement({ id, x, y, r = 15, fill = 'red' }) {
		x = x ? x : limitedRandom(20, 800)
		y = y ? y : limitedRandom(0, 600)

		var e = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
		e.setAttribute("id", id)
		e.setAttribute("cx", x)
		e.setAttribute("cy", y)
		e.setAttribute("r", r)
		e.setAttribute("fill", fill)
		return e
	}

	get x() { return parseFloat(this.element.getAttribute('cx')); }
	set x(value) { if (value) this.element.setAttribute('cx', value); }

	get y() { return parseFloat(this.element.getAttribute('cy')); }
	set y(value) { if (value) this.element.setAttribute('cy', value); }

	get r() { return parseFloat(this.element.getAttribute('r')); }
	set r(value) { if (value) this.element.setAttribute('r', value); }
}

  // RenderVectors() {
  //   this.universe.Vectors.forEach(v => {
  //     if (!v.id) {
  //       v.id = Date.now()
  //       var svg = document.getElementsByTagName('svg')[0]
  //       var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
  //       if (v.name) newElement.setAttribute("name", v.name);
  //       newElement.setAttribute("id", v.id);
  //       newElement.setAttribute("x1", v.position.X);
  //       newElement.setAttribute("y1", v.position.Y);
  //       newElement.setAttribute("x2", v.position.X + (v.vector.X * 100));
  //       newElement.setAttribute("y2", v.position.Y + (v.vector.Y * 100));
  //       newElement.setAttribute("marker-end", "url(#arrow)")
  //       newElement.style.strokeWidth = "5"
  //       newElement.style.stroke = v.obj.attributes["fill"].value; //Set stroke colour
  //       newElement.style.strokeWidth = "1px"; //Set stroke width
  //       svg.appendChild(newElement);
  //     }
  //     else if (Date.now() - v.id > 5000) {
  //       //remove old lines
  //       var line = document.getElementById(v.id)
  //       if (line) {
  //         const index = this.universe.Vectors.indexOf(v)
  //         this.universe.Vectors.splice(index, 1)
  //         line.parentNode.removeChild(line)
  //       }
  //     }
  //   })
  // }
