var pixxel = require('pixxel');
var gamejs = require('gamejs');
var Unit = require('pixxel/world/units').Unit;
var sprites = pixxel.sprites;
var log = gamejs.log;
var $v = gamejs.utils.vectors;
var $t = pixxel.transform;

gamejs.preload([ 'public/sprites.png' ]);
gamejs.ready(function() {

	gamejs.display.setMode([ 480, 360 ]);

	var world = new pixxel.world.World(8, 8, 32);
	var grid = new pixxel.world.Grid(8, 8, 32);

	// create a cursor
	var cursor = new pixxel.draw.Rect(new gamejs.Rect(0, 0, 32, 32),
			'rgba(255,0,0,1)', 1);
	cursor.setTransform(cursor.TRANSFORM_SCREEN);

	world.canvas.add(grid);
	world.canvas.add(cursor);

	// add a unit
	var dude = new Unit(new sprites.Dude());
	world.objmanager.add(dude);
	world.objmanager.activate(dude);
	dude.setGridPosition(2, 3);

	// event callbacks
	world.event.mouseMove.add(function(event) {
		cursor.pos = world.lockPosition(event.pos);
	});

	world.event.mouseUp.add(function(event) {
		if (event.button != 0) {
			return;
		}
		var pos = $v.subtract(event.pos, world.origin);
		pos = $t.cartesian(pos[0], pos[1]);
		pos = $t.grid(pos[0], pos[2], world);
		if (world.objmanager.clicked(x, y)) {
			return;
		}
		var unit = world.objmanager.getUnit();
		if (unit) {
			unit.moveTo(pos);
		}
	});

	// route events to world event manager
	gamejs.time.fpsCallback(world.event.update, world.event, 100);

	// update screen - 60fps
	gamejs.time.fpsCallback(world.draw, world, 60);

});
