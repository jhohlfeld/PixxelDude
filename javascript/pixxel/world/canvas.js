var gamejs = require('../../gamejs');
var pixxel = require('../../pixxel');
var log = gamejs.log;
var $v = gamejs.utils.vectors;
var $t = pixxel.transform;
var $ext = gamejs.utils.objects.extend;

/**
 * Canvas.
 * 
 * Represents any object drawn on the screen that is managed by the world
 * object. The canvas simply binds all the world object together in one update
 * cycle.
 * 
 * @constructor
 * @param {pixxel.world.World}
 *            world
 */
var Canvas = exports.Canvas = function(world) {
	this.surface = gamejs.display.getSurface();
	this.objects = [];

	this.world = world;
};

/**
 * Add canvas object.
 * 
 * Attaches object to the world object.
 * 
 * @param {Object}
 *            obj
 */
Canvas.prototype.add = function(obj) {
	obj.world = this.world;
	this.objects.push(obj);
};

/**
 * Remove canvas object.
 * 
 * Detaches object from world object.
 * 
 * @param {Object}
 *            obj
 */
Canvas.prototype.remove = function(obj) {
	for ( var i = 0; i < this.objects.length; i++) {
		if (obj === this.objects[i]) {
			delete this.objects[i].world;
			this.objects.splice(i, 1);
		}
	}
};

/**
 * Informs all objects to update and then lets them draw themselves.
 * 
 */
Canvas.prototype.draw = function() {
	this.surface.clear();
	this.surface.fill('rgba(255,0,0,.1)');
	for ( var i = 0; i < this.objects.length; i++) {
		this.objects[i].update();
	}
	for ( var i = 0; i < this.objects.length; i++) {
		this.objects[i].draw(this.surface);
	}
};

/**
 * Canvas object.
 * 
 * @constructor
 */
var CanvasObject = exports.CanvasObject = function() {
	this.pos = [ 0, 0 ];
};

/**
 * Update.
 * 
 * @param canvas
 */
CanvasObject.prototype.update = function(canvas) {
	// ..
};

/**
 * Draw.
 * 
 * @param surface
 */
CanvasObject.prototype.draw = function(surface) {
	// ..
};

/**
 * Set the position in screen pixel.
 * 
 * @param {Number|Array}
 *            x - if an array is given, it will be expanded to the position and
 *            therefore must be in the form of [x, y]
 * @param {Number}
 *            y - optional (see above)
 */
CanvasObject.prototype.setPosition = function(x, y) {
	if (x instanceof Array) {
		this.pos = x;
	} else {
		this.pos = [ x, y ];
	}
};
