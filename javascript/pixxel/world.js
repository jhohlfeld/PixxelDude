gamejs = require('gamejs');
pixxel = require('pixxel');
var $v = gamejs.utils.vectors;

var World = exports.World = function(width, height, size) {

	this.width = width;
	this.height = height;
	this.size = size;

	// construct the bounding rect
	a = pixxel.transform.screen(width * size, 0, -(height * size));
	b = pixxel.transform.screen(width * size, 0, height * size);
	drect = gamejs.display.getSurface().rect;
	w = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
	h = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2));
	x = (drect.width - w) / 2;
	y = (drect.height - h) / 2;
	this.rect = new gamejs.Rect(Math.round(x), Math.round(y), Math.round(w),
			Math.round(h));
	this.origin = [ this.rect.left + this.rect.width / 2, this.rect.bottom ];

	this.mapgraph = new MapGraph(this);
	this.objmanager = new WorldObjectManager(this);
	this.event = new WorldEventAdapter();

	var click = function(event) {
		if (event.button != 0) {
			return;
		}
		if (this.objmanager.clicked(event.pos)) {
			return;
		}
		pos = $v.subtract(event.pos, this.origin);
		pos = pixxel.transform.cartesian(pos[0], pos[1]);
		pos = pixxel.transform.grid(pos[0], pos[2], this);
		gamejs.log(pos);
		tile = this.mapgraph.tile(pos[0], pos[1]);
		if (unit = this.objmanager.getUnit()) {
			// this.objmanager.moveUnit(unit, tile);
		}
	};
	this.event.mouseUp.add(click, this);

	/**
	 * Draw the game world.
	 * 
	 * @param {gamejs.display.Surface}
	 *            surface
	 */
	this.draw = function(surface) {
		gamejs.draw.rect(surface, '#ff0000', this.rect.move(.5, .5), 1);
	};
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
	this.update = function(events) {
		for (i in events) {
			e = this.types[events[i].type];
			if (e instanceof pixxel.Event) {
				e.fire(events[i]);
			}
		}
	};
};

var MapGraph = function(world) {
	this.world = world;

	this.tile = function(x, y) {

	};

};

var WorldObjectManager = function(world) {

	this.world = world;
	this.objects = {};
	this.tiles = {};
	this.types = {};
	this.active = {};

	/**
	 * Add new world objects.
	 * 
	 * @param {object}
	 *            obj the world object
	 * @param {Number}
	 *            x x-position on grid
	 * @param {Number}
	 *            y y-position on grid
	 * 
	 */
	this.add = function(obj, x, y) {

		tile = this.world.mapgraph.tile(x, y);
		if (!this.objects[tile]) {
			this.objects[tile] = [];
		}
		this.objects[tile].push(obj);
		this.tiles[obj] = tile;
		if (!this.types[obj.constructor]) {
			this.types[obj.constructor] = [];
		}
		this.types[obj.constructor].push(obj);

		// position the object
		p = pixxel.transform.world(x, y);
		obj.pos = pixxel.transform.screen(p[0], p[1]);
	};

	this.clicked = function(x, y) {
		return false;
	};

	this.getUnit = function(num) {
		if (num instanceof Number) {
			return;
		}
		if (active = this.active[Unit]) {
			return active[0];
		}
	};

	this.activate = function(obj) {
		t = obj.constructor;
		if (!this.active[t]) {
			this.active[t] = [];
		}
		this.active[t].push(obj);
	};
};

var Unit = exports.Unit = function(world, skin) {
	this.world = world;
	this.pos = [ 0, 0 ];

	this.sprite = null;
	this.texture = null;
	this.walk_num_frames = 4;
	this.walking = false;
	this.direction = [ 0, -1 ];

};

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
	iso = pixxel.transform.screen(w, 0, h);

	// grid's height in screen coordinates
	gScreenHeight = Math.sqrt(Math.pow(iso[0], 2) + Math.pow(iso[1], 2));

	// the anchor (center grid on canvas)
	this.anchor = [ dWidth / 2, (dHeight + gScreenHeight) / 2 ];

	this.draw = function(surface) {
		for ( var i = 0; i < this.height * this.size; i += this.size) {
			for ( var j = 0; j < this.width * this.size; j += this.size) {
				var x = j + this.size / 2;
				var y = i + this.size / 2;
				pos = pixxel.transform.screen(x, 0, y);
				pixxel.draw.point(surface, [ 0, 0, 0, 255 ], $v.add(pos,
						this.anchor));
			}
		}
	};

	return this;
};