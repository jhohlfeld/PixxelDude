var pixxel = require("../pixxel");
var gamejs = require("../gamejs");
var CanvasObject = require('./world/canvas').CanvasObject;
var $ext = gamejs.utils.objects.extend;
var $v = gamejs.utils.vectors;
var log = gamejs.log;

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

/**
 * Fix points so that they fit the pixel gap when drawn on canvas.
 * 
 */
var fixVertexPointFive = exports.fixVertexPointFive = function(vertex) {
	if (vertex instanceof Array) {
		for ( var i in vertex) {
			vertex[i] = $v.add(vertex[i], [ .5, .5 ]);
		}
	} else {
		vertex = $v.add(vertex, [ .5, .5 ]);
	}
	return vertex;
};

/**
 * Rectangle object.
 * 
 */
var Rect = exports.Rect = function(rect, color, stroke, fill) {

	this.pos = [ 0, 0 ];

	this.rect = rect;
	this.color = color;
	this.stroke = stroke;
	this.fill = fill;

	this.TRANSFORM_NONE = function(points) {
		return points;
	};
	this.transform = this.TRANSFORM_NONE;

	/**
	 * Create a pointlist.
	 * 
	 */
	this.pointlist = function() {
		var r = this.rect;
		return this.transform([ [ r.left, r.top ], [ r.left + r.width, r.top ],
				[ r.left + r.width, r.top + r.height ],
				[ r.left, r.top + r.height ] ]);
	};

	/**
	 * Set the transformation method for the pointlist.
	 * 
	 */
	this.setTransform = function(transform) {
		this.transform = transform;
	};

	/**
	 * Transforms rectangle into iso vertices.
	 * 
	 */
	this.TRANSFORM_SCREEN = this.transformScreen = function(points) {
		for ( var i in points) {
			p = points[i];
			points[i] = pixxel.transform.screen(p[0], 0, p[1]);
		}
		return points;
	};

	/**
	 * Draw the rectangle.
	 * 
	 * Respect transformations.
	 * 
	 */
	this.draw = function(surface) {
		p = fixVertexPointFive(this.pointlist());
		for ( var i in p) {
			p[i] = $v.add(p[i], this.pos);
		}
		gamejs.draw.polygon(surface, this.color, p, this.stroke);
	};
};
$ext(Rect, CanvasObject);
