var pixxel = require('pixxel');
var gamejs = require('gamejs');
var $v = gamejs.utils.vectors;

gamejs.preload([ 'public/sprites.png' ]);
gamejs.ready(function() {

	gamejs.display.setMode([ 640, 480 ]);


	var dude = new pixxel.sprites.Dude();
	dude.setPosition(100, 100);

	var world = new pixxel.world.World(8, 8, 32);
	var u = new pixxel.world.Unit();
	world.objmanager.add(u);
	world.objmanager.activate(u);
	
	var grid = new pixxel.world.Grid(8, 8, 32);

	var mainSurface = gamejs.display.getSurface();

	function tick() {
		// update
		world.event.update(gamejs.event.get());
		
		// draw
		mainSurface.clear();
		mainSurface.fill('rgba(255,0,0,.1)');
		
		grid.draw(mainSurface);
		world.draw(mainSurface);
		dude.draw(mainSurface);
	}
	gamejs.time.fpsCallback(tick, this, 8);
//	tick();

});
