import { Game, StartGameLoop } from './Game.js'
import { renderSVG } from './render/renderSVG.js';

var app = new Vue({
	el: '#vueApp',
	data: {
		game: null,
		renderer: null,
		value: 50,
		minx: 0,
		miny: 0,
		width: 800,
		height: 600,
		perspectiveDistance: 100,
		originX: 50,
		originY: 50
	},
	mounted: function () {

		var v = this
		var StartLoop = function (game, renderer) {
			var fps = 30
			var fpsInterval = 1000 / fps;
			var then = window.performance.now();
			var now, elapsed

			var loop = function (tFrame) {

				game.universe.UpdatePositions();

				//limit fps for display rendering
				now = tFrame;
				elapsed = now - then;
				if (elapsed > fpsInterval) {
					then = now - (elapsed % fpsInterval);// adjust for fpsInterval not being multiple of 16.67
					renderer.render(tFrame)
					v.setViewBox(game.universe.OverviewSize)
				}

				window.requestAnimationFrame(loop)
			}
			loop()
		}

		this.game = new Game()
		this.renderer = new renderSVG(this.game)
		StartLoop(this.game, this.renderer)
	},
	computed: {
		//usage  v-bind:view-box.camel="viewBoxValue"
		viewBoxValue: function () {
			return `${this.minx} ${this.miny} ${this.width} ${this.height}`
		}
	},
	methods: {
		test: function (event) {
			this.game.test()
		},
		setViewBox(o) {
			o = o ? o : game.universe.OverviewSize
			if (!Object.keys(o).some(k => o[k] == undefined)) {
				this.minx = o.x
				this.miny = o.y
				this.width = o.w
				this.height = o.h
			}
		}
	}
});