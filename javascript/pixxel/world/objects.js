var gamejs = require('../../gamejs');
var pixxel = require('../../pixxel');
var CanvasObject = require('./canvas').CanvasObject;
var log = gamejs.log;
var $v = gamejs.utils.vectors;
var $t = pixxel.transform;
var $ext = gamejs.utils.objects.extend;

/**
 * World
 * 
 * @author jakob
 * 
 * @constructor
 * @param world
 */
var WorldObject = exports.WorldObject = function(sprite) {
	CanvasObject.call(this);
	this.world = null;
	this.sprite = sprite;
	this.pos = [ 0, 0 ];
};
$ext(WorldObject, CanvasObject);

/**
 * Update sprite position.
 * 
 * @param canvas
 */
WorldObject.prototype.update = function(canvas) {
	this.sprite.setPosition(this.pos);
};

/**
 * Display world object's sprite on the canvas.
 * 
 * @param surface
 */
WorldObject.prototype.draw = function(surface) {
	this.sprite.draw(surface);
};

/**
 * Set position relative to world coordinates.
 * 
 * @param x
 * @param y
 */
WorldObject.prototype.setPosition = function(x, y) {
	CanvasObject.prototype.setPosition.call(this, x, y);
	this.pos = $v.add(this.pos, this.world.origin);
};

WorldObject.prototype.getPosition = function() {
	return $v.subtract(this.pos, this.world.origin);
};

/**
 * Set the object's position on the grid.
 * 
 * @param x
 *            grid coordinate
 * @param y
 *            grid coordinate
 */
WorldObject.prototype.setGridPosition = function(x, y) {
	p = $t.world(x, y, this.world);
	this.setPosition($t.screen(p[0], 0, p[1]));
};

/**
 * Get the position on the grid in grid coordinates.
 * 
 * This is the more gentle world-object-specific implementation.
 * 
 * @returns {Array}
 */
WorldObject.prototype.getGridPosition = function() {
	var p = $v.subtract(this.pos, this.world.origin);
	p = $t.cartesian(p[0], p[1]);
	p = [ p[0] >= 0 ? Math.round(p[0] / this.world.size) : 0,
			p[2] >= 0 ? Math.round(p[2] / this.world.size) : 0 ];
	return [ p[0] < this.world.width - 1 ? p[0] : this.world.width - 1,
			p[1] < this.world.height - 1 ? p[1] : this.world.height - 1 ];
};

/**
 * WorldObjectManager
 * 
 * The world object manager handles issues around world objects - like
 * remembering the currently activated unit.
 * 
 * @author jakob
 * 
 * @constructor
 * @param world
 */
var WorldObjectManager = exports.WorldObjectManager = function(world) {

	this.world = world;
	this.types = {};
	this.active = {};
};

/**
 * Add new world objects.
 * 
 * @param {object}
 *            obj the world object
 * @param {Number}
 *            x x-position on grid
 * @param {Number}
 *            y y-position on grid
 */
WorldObjectManager.prototype.add = function(obj) {

	if (!this.types[obj.constructor]) {
		this.types[obj.constructor] = [];
	}
	this.types[obj.constructor].push(obj);

	// add to canvas
	this.world.canvas.add(obj);
};

/**
 * 
 */
WorldObjectManager.prototype.clicked = function(x, y) {
	return false;
};

/**
 * 
 * @param num
 * @returns
 */
WorldObjectManager.prototype.getUnit = function(num) {
	if (num instanceof Number) {
		return;
	}
	var Unit = require('./units').Unit;
	if (active = this.active[Unit]) {
		return active[0];
	}
};

/**
 * 
 * @param obj
 */
WorldObjectManager.prototype.activate = function(obj) {
	t = obj.constructor;
	if (!this.active[t]) {
		this.active[t] = [];
	}
	this.active[t].push(obj);
};
