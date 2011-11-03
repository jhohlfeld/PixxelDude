var gamejs = require('../gamejs');
var pixxel = require('../pixxel');

exports.world = {
	canvas : require('./world/canvas'),
	objects : require('./world/objects'),
	units : require('./world/units'),
	map : require('./world/map'),
};

var log = gamejs.log;
var $v = gamejs.utils.vectors;
var $t = pixxel.transform;
var $ext = gamejs.utils.objects.extend;

var Canvas = exports.world.canvas.Canvas;
var Map = exports.world.map.Map;
var MapGraph = exports.world.map.MapGraph;
var WorldObjectManager = exports.world.objects.WorldObjectManager;
var CanvasObject = exports.world.canvas.CanvasObject;

/**
 * World object.
 * 
 * @constructor Takes initial map width and height as well as tile size.
 * @param {Number}
 *            width
 * @param {Number}
 *            height
 * @param {Number}
 *            size
 */
var World = exports.World = function(width, height, size) {

	this.width = width;
	this.height = height;
	this.size = size;

	// construct the bounding rect
	a = $t.screen(width * size, 0, -(height * size));
	b = $t.screen(width * size, 0, height * size);
	drect = gamejs.display.getSurface().rect;
	w = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
	h = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2));
	x = (drect.width - w) / 2;
	y = (drect.height - h) / 2;
	this.rect = new gamejs.Rect(Math.round(x), Math.round(y), Math.round(w),
			Math.round(h));
	this.origin = [ this.rect.left + this.rect.width / 2, this.rect.bottom ];

	this.canvas = new Canvas(this);

	// this holds the map graph
	this.map = new Map(new MapGraph(this));

	// the object manager
	this.objmanager = new WorldObjectManager(this);

	// enable event handling
	this.event = new WorldEventAdapter();

	// show world border
	this.canvas.add(new pixxel.draw.Rect(this.rect, 'rgba(255,0,0,1)', 1));
};

/**
 * Draw the game world.
 * 
 * @param {gamejs.display.Surface}
 *            surface
 */
World.prototype.draw = function() {
	this.canvas.draw();
};

/**
 * Transform screen coordinates so that they lock onto the grid.
 * 
 * @param {Array}
 *            pos beeing [x, y]
 * @returns {Array} [x, y]
 */
World.prototype.lockPosition = function(pos) {
	pos = $v.subtract(pos, this.origin);
	pos = $t.cartesian(pos[0], pos[1]);
	pos = $t.grid(pos[0], pos[2], this);
	x = pos[0] < 0 ? 0 : pos[0];
	y = pos[1] < 0 ? 0 : pos[1];
	pos = [ x < this.width - 1 ? x : this.width - 1,
			y < this.height - 1 ? y : this.height - 1 ];
	pos = $t.world(pos[0], pos[1], this);
	pos = $t.screen(pos[0], 0, pos[1]);
	pos = $v.add(pos, this.origin);
	return pos;
};

/**
 * Event adapter for the world object.
 * 
 */
var WorldEventAdapter = function() {

	this.types = {};
	this.mouseMove = this.types[gamejs.event.MOUSE_MOTION] = new pixxel.Event();
	this.mouseDown = this.types[gamejs.event.MOUSE_DOWN] = new pixxel.Event();
	this.mouseUp = this.types[gamejs.event.MOUSE_UP] = new pixxel.Event();
	this.mouseWheel = this.types[gamejs.event.MOUSE_WHEEL] = new pixxel.Event();

	/**
	 * Update the hosted events with the current event chain.
	 * 
	 */
	this.update = function() {
		var events = gamejs.event.get();
		for ( var i in events) {
			e = this.types[events[i].type];
			if (e instanceof pixxel.Event) {
				e.fire(events[i]);
			}
		}
	};
};

/**
 * Grid
 * 
 * Creates a grid by the width and height of the world's tile dimensions.
 * 
 * @author jakob
 * 
 * @constructor
 * @param {Number}
 *            width
 * @param {Number}
 *            height
 * @param {Number}
 *            size
 */
var Grid = exports.Grid = function(width, height, size) {

	this.width = width;
	this.height = height;
	this.size = size;

	// display dimensions
	var dWidth = gamejs.display.getSurface().rect.width;
	var dHeight = gamejs.display.getSurface().rect.height;

	// carthesian grid dimensions
	var w = width * size;
	var h = height * size;
	iso = $t.screen(w, 0, h);

	// grid's height in screen coordinates
	gScreenHeight = Math.sqrt(Math.pow(iso[0], 2) + Math.pow(iso[1], 2));

	// the anchor (center grid on canvas)
	this.anchor = [ dWidth / 2, (dHeight + gScreenHeight) / 2 ];
};
$ext(Grid, CanvasObject);

/**
 * Draw function.
 * 
 * @param {gamejs.Surface}
 *            surface
 */
Grid.prototype.draw = function(surface) {
	for ( var i = 0; i < this.height * this.size; i += this.size) {
		for ( var j = 0; j < this.width * this.size; j += this.size) {
			var x = j + this.size / 2;
			var y = i + this.size / 2;
			pos = $t.screen(x, 0, y);
			pixxel.draw.point(surface, [ 0, 0, 0, 255 ], $v.add(pos,
					this.anchor));
		}
	}
};
