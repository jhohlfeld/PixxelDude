gamejs = require('../gamejs');

exports.Dude = require('./sprites/dude').Dude;

/**
 * SpriteSheet
 * 
 * @constructor
 */
var SpriteSheet = exports.SpriteSheet = function(image, width, height) {

	var l, k;
	l = 0;
	this.sequence = [];
	for ( var j = 0; j < image.rect.height; j += height) {
		k = 0;
		this.sequence[l] = [];
		for ( var i = 0; i < image.rect.width; i += width) {
			rect = new gamejs.Rect(i, j, width, height);
			this.sequence[l][k] = new SpriteSheetFrame(image, rect);
			k++;
		}
		l++;
	}

	/**
	 * Get a frame.
	 * 
	 */
	this.get = function(index) {
		return this.sequence[index[0]][index[1]];
	};
};

/**
 * SpriteSheetFrame
 * 
 */
var SpriteSheetFrame = exports.SpriteSheetFrame = function(image, rect) {
	this.image = image;
	this.rect = rect;

	/**
	 * Blit the sprite sheet frame onto the screen.
	 * 
	 * @param surface
	 * @param x
	 * @param y
	 */
	this.blit = function(surface, x, y) {
		dst = new gamejs.Rect(x, y, this.rect.width, this.rect.height);
		surface.blit(this.image, dst, this.rect);
	};
};

/**
 * Animation
 * 
 * @constructor
 */
var Animation = exports.Animation = function(spriteSheet, index1, index2,
		duration) {

	// initialize the animation sequence
	this.sequence = [];
	for ( var i = index1[0]; i < index2[0]; i++) {
		for ( var j = index1[1]; j < index2[1]; j++) {
			this.sequence.push(spriteSheet.get([ i, j ]));
		}
	}

	this.duration = duration;
	this.currentFrameIndex = 0;
	
	/**
	 * Blit an animation frame.
	 * 
	 */
	this.blit = function(surface, x, y) {
		frame = this.sequence[this.currentFrameIndex];
		frame.blit(surface, x, y);
		this.currentFrameIndex++;
		if (this.currentFrameIndex >= this.sequence.length) {
			this.currentFrameIndex = 0;
		}
	};

};
