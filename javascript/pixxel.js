var gamejs = require('gamejs');
exports.draw = require('pixxel/draw');
exports.world = require('pixxel/world');
exports.sprites = require('pixxel/sprites');

var radians = exports.radians = function(deg) {
	return deg * Math.PI / 180;
};

var sin = Math.sin(0.46365);
var cos = Math.cos(0.46365);

exports.transform = {

	/**
	 * Transform cartesian coordinates into screen coordinates.
	 * 
	 * @param {Number}
	 *            x cartesian coordinate, x-component
	 * @param {Number}
	 *            y cartesian coordinate, y-component
	 * @param {Number}
	 *            z cartesian coordinate, z-component
	 * @returns {Array} [x, y] screen position
	 */
	screen : function(x, y, z) {
		x_ = (x - z) * cos;
		y_ = y + (x + z) * sin;
		return [ x_, -y_ ];
	},

	/**
	 * Transform screen into cartesian coordinates.
	 * 
	 * @param {Number}
	 *            x
	 * @param {Number}
	 *            y
	 * @returns [x, y, z] y will be zero
	 */
	cartesian : function(x, y) {
		x_ = (x / 2) / cos - (y / 2) / sin;
		z_ = (x / 2) / cos + (y / 2) / sin;
		return [ x_, 0, -z_ ];
	},

	/**
	 * Transform the world coordinates to grid coordinates.
	 * 
	 * @param {Number}
	 *            x cartesian coordinate
	 * @param {Number}
	 *            y cartesian coordinate
	 * @param {pixxel.world.World}
	 *            world
	 * @returns {Array} [x, y] grid space coordinates
	 */
	grid : function(x, y, world) {
		g = x >= 0 ? x : 0;
		h = y >= 0 ? y : 0;
		g = Math.floor(g / world.size);
		h = Math.floor(h / world.size);
		return [ g < world.width - 1 ? g : world.width - 1,
				h < world.height - 1 ? h : world.height - 1 ];
	},

	/**
	 * Transform the grid coordinates to world coordinates.
	 * 
	 * @param {Number}
	 *            x grid space coordinate
	 * @param {Number}
	 *            y grid space coordinate
	 * @returns {Array} [x, y] cartesian coordinates
	 */
	world : function(x, y) {
		return [ x * this.size, y * this.size ];
	}
};

var Event = exports.Event = function() {

	this.listeners = [];
	this.binds = {};

	this.add = function(listener, bind) {
		this.remove(listener); // ensure listener is not added twice
		this.listeners.push(listener);
		if (null != bind) {
			this.binds[listener] = bind;
		}
	};

	this.remove = function(listener) {
		for ( var i = 0; i < this.listeners.length; i++) {
			if (this.listeners == listener) {
				delete (this.listeners[i]);
				if (this.binds[listener]) {
					delete this.binds[listener];
				}
				return;
			}
		}
	};

	this.fire = function(event) {
		for ( var i = 0; i < this.listeners.length; i++) {
			listener = this.listeners[i];
			if (!(bind = this.binds[listener])) {
				bind = listener;
			}
			listener.apply(bind, arguments);
		}
	};
};
