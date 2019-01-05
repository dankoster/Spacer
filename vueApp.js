import { Game } from './Game.js'

var app = new Vue({
	el: '#vueApp',
	data: {
	  value: 50,
	  minx: 0,
	  miny: 0,
	  width: 800,
		height: 600,
		perspectiveDistance: 100,
		originX: 50,
		originY: 50
	},
	computed: {
		//usage  v-bind:view-box.camel="viewBoxValue"
		viewBoxValue: function () {
		return `${this.minx} ${this.miny} ${this.width} ${this.height}`
	  }
	},
	methods: {
    addOne: function (event) {
      Game.test()
    }
  }
  });