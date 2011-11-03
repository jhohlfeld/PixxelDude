/**
 * pixxel.transform
 * 
 * Collection of transformation functions.
 * 
 */

var sin = Math.sin(0.46365);
var cos = Math.cos(0.46365);

/**
 * Transform cartesian to screen coordinates.
 * 
 * @param {Number}
 *            x cartesian coordinate, x-component
 * @param {Number}
 *            y cartesian coordinate, y-component
 * @param {Number}
 *            z cartesian coordinate, z-component
 * @returns {Array} [x, y] screen position
 */
exports.screen = function(x, y, z) {
	x_ = (x - z) * cos;
	y_ = y + (x + z) * sin;
	return [ x_, -y_ ];
};

/**
 * Transform screen to cartesian coordinates.
 * 
 * @param {Number}
 *            x
 * @param {Number}
 *            y
 * @returns [x, y, z] y will be zero
 */
exports.cartesian = function(x, y) {
	x_ = (x / 2) / cos - (y / 2) / sin;
	z_ = (x / 2) / cos + (y / 2) / sin;
	return [ x_, 0, -z_ ];
};

/**
 * Transform cartesian to grid coordinates.
 * 
 * @param {Number}
 *            x cartesian coordinate
 * @param {Number}
 *            y cartesian coordinate
 * @param {pixxel.world.World}
 *            world
 * @returns {Array} [x, y] grid space coordinates
 */
exports.grid = function(x, y, world) {
	return [ Math.floor(x / world.size), Math.floor(y / world.size) ];
};

/**
 * Transform grid to cartesian coordinates.
 * 
 * @param {Number}
 *            x grid space coordinate
 * @param {Number}
 *            y grid space coordinate
 * @returns {Array} [x, y] cartesian coordinates
 */
exports.world = function(x, y, world) {
	return [ x * world.size, y * world.size ];
};
