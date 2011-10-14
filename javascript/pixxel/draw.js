/**
 * Draw a point.
 * 
 * FIXME adding a method for batch-drawing individual primitives would give
 * better performance.
 * 
 * @param {gamejs.Surface}
 * @param {Array}
 *            color array with the the four rgba components red, green, blue and
 *            alpha. i.e. [0,0,0,255]
 * @param {Array}
 *            pos [x, y] position of the point
 */
exports.point = function(surface, rgba, pos) {
	var ctx = surface.context;
	imgd = ctx.getImageData(pos[0], pos[1], 1, 1);
	imgd.data[0] = rgba[0]; // Red
	imgd.data[1] = rgba[1]; // Green
	imgd.data[2] = rgba[2]; // Blue
	imgd.data[3] = rgba[3]; // Alpha channel
	ctx.putImageData(imgd, pos[0], pos[1]);
	return;
};
