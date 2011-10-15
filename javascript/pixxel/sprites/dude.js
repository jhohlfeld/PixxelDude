gamejs = require('../../gamejs');
sprites = require('../sprites');

/**
 * Dude sprite.
 * 
 * @constructor
 */
Dude = exports.Dude = function() {
	img = gamejs.image.load("public/sprites.png");
	spriteSheet = new sprites.SpriteSheet(img, 32, 48);
	
	this.image = new sprites.Animation(spriteSheet, [ 0, 1 ], [ 1, 5 ], .25);

	this.pos = [ 0, 0 ];

	/**
	 * Set the sprite's position.
	 * 
	 * @param x
	 * @param y
	 */
	this.setPosition = function(x, y) {
		this.pos = [ x, y ];
	};

	return this;
};
gamejs.utils.objects.extend(Dude, gamejs.sprite.Sprite);

Dude.prototype.update = function() {
	
};

Dude.prototype.draw = function(surface) {
	this.image.blit(surface, this.pos[0], this.pos[1]);
};
