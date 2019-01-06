import {limitedRandom} from '../utility.js'

export class renderSVG {

	constructor(game) {
		this.game = game
		this.renderItems = {}
		this.svg = document.getElementsByTagName('svg')[0]
	}

	render() {
		this.game.universe.Objects.forEach(so => {
			if (!this.renderItems[so.id]) {
				var newItem = new circle(so)
				this.renderItems[so.id] = newItem
				this.svg.appendChild(newItem.element)
			}
			else { //item already exists
				this.renderItems[so.id].update()
			}
		});
	}
}

export class rendered {
	constructor(so, element) {
		this.so = so
		this.element = element
	}

	get id() { return so.id }
}

export class circle extends rendered {
	//<circle cx="100" cy="200" r="5" fill="red" id="redcircle1" />
	constructor(so, fill = 'red') {
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
		e.setAttribute("fill", "red")
		return e
	}

	get x() { return parseFloat(this.element.getAttribute('cx')); }
	set x(value) { if (value) this.element.setAttribute('cx', value); }

	get y() { return parseFloat(this.element.getAttribute('cy')); }
	set y(value) { if (value) this.element.setAttribute('cy', value); }

	get r() { return parseFloat(this.element.getAttribute('r')); }
	set r(value) { if (value) this.element.setAttribute('r', value); }
}