var gamejs = require('../../gamejs');
var pixxel = require('../../pixxel');
var WorldObject = require('./objects').WorldObject;

var log = gamejs.log;
var $t = pixxel.transform;
var $ext = gamejs.utils.objects.extend;

/**
 * Unit
 * 
 * The unit is a movable, interacting class of world objects.
 * 
 */
var Unit = exports.Unit = function(sprite) {
	WorldObject.call(this, sprite);

	this.walking = false;
	this.movement = new UnitMover(this);
};
$ext(Unit, WorldObject);

/**
 * Select the 'walk' animation.
 * 
 * @param {Number}
 *            dx direction
 * @param {Number}
 *            dy direction
 */
Unit.prototype.walk = function(dx, dy) {
	var dir = this.direction(dx, dy);
	var a = this.sprite.animations[dir];
	this.sprite.image = a['walk'];
	this.walking = true;
};

/**
 * Halt the unit.
 * 
 */
Unit.prototype.halt = function() {
	var dir = this.direction();
	var a = this.sprite.animations[dir];
	this.sprite.image = a['stance'];
	this.walking = false;
};

/**
 * Get/set the current direction the unit is heading.
 * 
 * @param dx
 * @param dy
 * @returns
 */
Unit.prototype.direction = function(dx, dy) {
	if (!(this._dir instanceof Array)) {
		this._dir = [];
	}
	if (!isNaN(dx) && !isNaN(dy)) {
		this._dir = [ dx != 0 ? dx / Math.abs(dx) : 0,
				dy != 0 ? dy / Math.abs(dy) : 0 ];
	}
	return this._dir;
};

/**
 * Proxy method for the movement unit.
 * 
 * @param index
 */
Unit.prototype.moveTo = function(index) {
	this.movement.moveTo(index);
};

/**
 * UnitMover.
 * 
 * This class controls the movement of a Unit type world object.
 * 
 * @constructor
 * @param {pixxel.world.Unit}
 *            unit
 */
var UnitMover = exports.UnitMover = function(unit) {
	this.unit = unit;
	this.orders = [];
	this.fps = 8;
};

/**
 * Initialize movement.
 * 
 * @param index
 *            the index on the map to move unit onto
 */
UnitMover.prototype.moveTo = function(index) {

	// are we interrupting?
	if (this.unit.walking) {

		// delete further path segments
		// and schedule new task
		this.path = [];
		this.orders = [ index ];
		return;
	}

	// the current position
	pos = this.unit.getGridPosition();

	// find a path
	var world = this.unit.world;
	this.path = world.map.findRoute(pos, index);

	if (!this.path.length) {
		return;
	}

	// run!
	n = this.path.pop();
	n = $t.world(n[0], n[1], this.unit.world);
	pos = $t.world(pos[0], pos[1], this.unit.world);
	dx = n[0] - pos[0];
	dy = n[1] - pos[1];
	this.vector = {
		x : n[0],
		y : n[1],
		dx : dx,
		dy : dy
	};
	gamejs.time.fpsCallback(this.update, this, this.fps);
	this.unit.walk(dx, dy);
};

/**
 * Update method - callback for fps scheduling.
 * 
 * @param {Number}
 *            dt - milliseconds since last call
 */
UnitMover.prototype.update = function(dt) {

	var x = this.vector.x, y = this.vector.y;
	var dx = this.vector.dx, dy = this.vector.dy;

	// determine, how far we have to advance to be still synced
	dt = dt / 1000;

	// determine unit's next position
	c = this.unit.getPosition();
	c = $t.cartesian(c[0], c[1]);
	c = [ c[0] + (dx * dt), c[2] + (dy * dt) ];

	// did we reach the end of this path segment?
	if ((dx == 0 || (dx > 0 && c[0] >= x) || (dx < 0 && c[0] <= x))
			&& (dy == 0 || (dy > 0 && c[1] >= y) || (dy < 0 && c[1] <= y))) {

		this.unit.setPosition($t.screen(x, 0, y));

		// there are more path segments
		if (this.path.length) {
			n = [ x, y ];
			var m = this.path.pop();
			m = $t.world(m[0], m[1], this.unit.world);
			dx = m[0] - n[0];
			dy = m[1] - n[1];
			this.vector = {
				x : m[0],
				y : m[1],
				dx : dx,
				dy : dy
			};
			this.unit.walk(dx, dy);
		} else {

			// if not, halt and see to next tasks
			gamejs.time.deleteCallback(this.update, this.fps);

			this.unit.halt();
			this.nextAssignment();
			return;
		}

		// continue walking
	} else {
		p = $t.screen(c[0], 0, c[1]);
		this.unit.setPosition(p[0], p[1]);
	}
};

/**
 * Fulfill next assignment.
 * 
 */
UnitMover.prototype.nextAssignment = function() {
	if (!this.orders.length) {
		return;
	}
	var o = this.orders.pop();
	this.moveTo(o);
};
