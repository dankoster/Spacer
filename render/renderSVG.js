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
				var newItem = new circle({ so, fill: so.id > 0 ? 'red' : 'lime' })
				this.renderItems[so.id] = newItem
				this.svg.appendChild(newItem.element)
				if (newItem.label) this.svg.appendChild(newItem.label)
			}
			else { //item already exists
				this.renderItems[so.id].update()
			}
		});

		if (!this.overview) {
			this.overview = new rectangle({ id: 'overview' })
			this.svg.appendChild(this.overview.element)
		}
		this.overview.update(this.game.universe.OverviewSize)
	}
}

export class rendered {
	constructor({ so, element, label }) {
		this.so = so
		this.element = element
		this.label = label
	}

	get id() { return so.id }
}

export class rectangle extends rendered {
	//<rect width="500%" height="500%" fill="url(#grid)" />
	constructor({ so, id, x, y, w, h }) {
		if (so != undefined) throw 'so not implemented for rectangle'
		var e = rectangle.createElement({ id, x, y, w, h })
		super({ element: e })
	}

	static createElement({ id, x = 0, y = 0, w = 0, h = 0 }) {
		var e = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
		e.setAttribute("id", id)
		e.setAttribute("x", x)
		e.setAttribute("y", y)
		e.setAttribute("width", w)
		e.setAttribute("height", h)
		return e
	}

	update({ x, y, w, h }) {

		var parentWidth = this.element.parentElement.width.baseVal.value
		var parentHeight = this.element.parentElement.height.baseVal.value
		var ratio
		
		// var ratio = Math.min(w / parentWidth, h / parentHeight);
		// var s = { width: w*ratio, height: h*ratio };

		// if (w > parentWidth) {
		// 	ratio = w/parentWidth
		// 	h *= ratio
		// }

		// if (h > parentHeight) {
		// 	ratio = h/parentHeight
		// 	w *= ratio
		// }

		this.x = x
		this.y = y
		this.w = w > parentWidth ? w : parentWidth
		this.h = h > parentHeight ? h : parentHeight
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

		// //<text x="40" y="35" class="heavy">cat</text>
		// var l = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
		// l.setAttribute("id", so.id)
		// l.setAttribute("x", so.position.X)
		// l.setAttribute("y", so.position.Y)
		// l.setAttribute("class", "label")
		// l.textContent = so.id

		super({ so, element: e })
	}

	update() {
		this.x = this.so.position.X
		this.y = this.so.position.Y
		this.r = this.so.radius
	}

	static createElement({ id, x, y, r = 15, fill = 'red' }) {
		// Object.getOwnPropertyNames(argumements).forEach(a => {
		// 	if(arguments[a] === undefined) { debugger; throw $`{a} is undefined` }
		// })

		var e = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
		e.setAttribute("id", id)
		e.setAttribute("cx", x)
		e.setAttribute("cy", y)
		e.setAttribute("r", r)
		e.setAttribute("fill", fill)
		return e
	}

	get x() { return parseFloat(this.element.getAttribute('cx')); }
	set x(value) {
		if (value) {
			this.element.setAttribute('cx', value);
			if (this.label) this.label.setAttribute('x', value)
		}
	}

	get y() { return parseFloat(this.element.getAttribute('cy')); }
	set y(value) {
		if (value) {
			this.element.setAttribute('cy', value);
			if (this.label) this.label.setAttribute('y', value)
		}
	}

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
