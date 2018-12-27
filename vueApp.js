var app = new Vue({
	el: '#vueApp',
	data: {
	  value: 50,
	  minx: -100,
	  miny: -100,
	  width: 800,
	  height: 600
	},
	computed: {
		//usage  v-bind:view-box.camel="viewBoxValue"
		viewBoxValue: function () {
		return `${this.minx} ${this.miny} ${this.width} ${this.height}`
	  }
	}
  });