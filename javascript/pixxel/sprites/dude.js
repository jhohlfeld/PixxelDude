var gamejs = require('../../gamejs');
var pixxel = require('../../pixxel');
var sprites = require('../sprites');
var CanvasObject = require('../world/canvas').CanvasObject;
var log = gamejs.log;
var $extend = gamejs.utils.objects.extend;
var $v = gamejs.utils.vectors;

/**
 * Dude sprite.
 * 
 * @constructor
 */
Sprite = exports.Sprite = function() {
	gamejs.sprite.Sprite.call(this);
	CanvasObject.call(this);
	img = gamejs.image.load("public/sprites.png");
	sheet1 = new sprites.SpriteSheet(img, 32, 48);
	sheet2 = sheet1.flip();

	// animations for the four directions
	var a = this.animations = {};
	a[[ 0, -1 ]] = {

		// initialize with the first stance
		'stance' : this.image = sheet2.get([ 0, 0 ]),
		'walk' : new sprites.Animation(sheet2, [ 0, 1 ], [ 1, 5 ], 8)
	};
	a[[ 1, 0 ]] = {
		'stance' : sheet1.get([ 1, 0 ]),
		'walk' : new sprites.Animation(sheet1, [ 1, 1 ], [ 2, 5 ], 8)
	};
	a[[ 0, 1 ]] = {
		'stance' : sheet2.get([ 1, 0 ]),
		'walk' : new sprites.Animation(sheet2, [ 1, 1 ], [ 2, 5 ], 8)
	};
	a[[ -1, 0 ]] = {
		'stance' : sheet1.get([ 0, 0 ]),
		'walk' : new sprites.Animation(sheet1, [ 0, 1 ], [ 1, 5 ], 8)
	};

	this.pos = [ 0, 0 ];
	this.origin = [16, 58];
};
$extend(Sprite, gamejs.sprite.Sprite);
$extend(Sprite, CanvasObject);

Sprite.prototype.draw = function(surface) {
	var pos = $v.subtract(this.pos, this.origin);
	this.image.blit(surface, pos[0], pos[1]);
};
