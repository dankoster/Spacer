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

		var StartLoop = function (game, renderer) {
			var fps = 30
			var fpsInterval = 1000 / fps;
			var then = window.performance.now();
			var startTime = then;
			var frameCount = 0;
			var now, elapsed
			var loop = function (tFrame) {
				now = tFrame;
				elapsed = now - then;

				game.render(tFrame)
				
				if (elapsed > fpsInterval) {

					// Get ready for next frame by setting then=now, but...
					// Also, adjust for fpsInterval not being multiple of 16.67
					then = now - (elapsed % fpsInterval);

					// draw stuff here
					renderer.render(tFrame)

					// var sinceStart = now - startTime;
					// var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
					// console.log("frame")
				}

				window.requestAnimationFrame(loop)
			}
			window.requestAnimationFrame(loop)
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
		addOne: function (event) {
			this.game.test()
		},
		freeze: function (event) {
			this.game.freeze()
		}
	}
});