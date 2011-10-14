var gamejs = require('gamejs');
var world = require('world');

gamejs.preload([ 'public/sprites.png' ]);
gamejs.ready(function() {

	gamejs.display.setMode([ 640, 480 ]);

	var sprites = require('sprites');
	var dude = new sprites.Dude();
	dude.setPosition(100,100);
	
	var grid = new world.Grid(8, 8, 32);

	var mainSurface = gamejs.display.getSurface();

	function tick() {
		// game loop
		mainSurface.fill('rgba(255,0,0,.1)');

		grid.draw(mainSurface);

		dude.draw(mainSurface);
	}
	// gamejs.time.fpsCallback(tick, this, 8);
	tick();

	// gamejs.draw.point(mainSurface, [ 0, 0, 0, 255 ], [ 0, 0 ])

});
