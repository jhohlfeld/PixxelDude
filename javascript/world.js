gamejs = require('gamejs');
pixxel = require('pixxel');
var $v = gamejs.utils.vectors;

var Grid = exports.Grid = function(width, height, size) {
	this.width = width;
	this.height = height;
	this.size = size;

	// display dimensions
	var dWidth = gamejs.display.getSurface().rect.width;
	var dHeight = gamejs.display.getSurface().rect.height;

	// carthesian grid dimensions
	var w = ((width - 1) * size);
	var h = ((height - 1) * size);
	iso = pixxel.transform_iso(w, 0, h);

	// grid's height in screen coordinates
	gScreenHeight = Math.sqrt(Math.pow(iso[0], 2) + Math.pow(iso[1], 2));

	// the anchor (center grid on canvas)
	anchor = [ dWidth / 2, (dHeight + gScreenHeight) / 2 ];
	this.draw = function(surface) {
		for ( var i = 0; i < this.height * this.size; i += this.size) {
			for ( var j = 0; j < this.width * this.size; j += this.size) {
				pos = pixxel.transform_iso(j, 0, i);
				pixxel.draw.point(surface, [ 0, 0, 0, 255 ], $v
						.add(pos, anchor));
			}
		}
	};
};