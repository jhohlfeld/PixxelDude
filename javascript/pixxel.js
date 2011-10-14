var gamejs = require('gamejs');
exports.draw = require('pixxel/draw');

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
exports.transform_iso = function(x, y, z) {
	return [ (x - z) * Math.cos(0.46365), -(y + (x + z) * Math.sin(0.46365)) ];
};