var gamejs = require('../gamejs');
var $ext = gamejs.utils.objects.extend;
var log = gamejs.log;

exports.Dude = require('./sprites/dude').Sprite;
/**
 * SpriteSheet
 * 
 * @constructor
 */
var SpriteSheet = exports.SpriteSheet = function(image, width, height) {

	this.image = image;
	this.width = width;
	this.height = height;

	this.sequence = [];

	var l, k;
	l = 0;
	width = Math.abs(width);
	for ( var j = 0; j < image.rect.height; j += height) {
		this.sequence[l] = [];

		// flipped or not?
		k = this.width > 0 ? 0 : image.rect.width / width - 1;
		d = this.width / Math.abs(this.width);

		// push into sequence
		for ( var i = 0; i < image.rect.width; i += width) {
			rect = new gamejs.Rect(i, j, width, height);
			this.sequence[l][k] = new SpriteSheetFrame(image, rect);
			k += d;
		}
		l++;
	}
};

/**
 * Return a horizontally flipped copy of this sprite sheet.
 * 
 * @returns {SpriteSheet}
 */
SpriteSheet.prototype.flip = function() {
	var image = gamejs.transform.flip(this.image, true, false);
	return new SpriteSheet(image, -this.width, this.height);
};

/**
 * Get a frame.
 * 
 */
SpriteSheet.prototype.get = function(index) {
	return this.sequence[index[0]][index[1]];
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
var Animation = exports.Animation = function(spriteSheet, index1, index2, fps) {

	this.fps = fps;
	this.playing = false;
	this.frameIndex = 0;

	// initialize the animation sequence
	this.sequence = [];
	for ( var i = index1[0]; i < index2[0]; i++) {
		for ( var j = index1[1]; j < index2[1]; j++) {
			this.sequence.push(spriteSheet.get([ i, j ]));
		}
	}
};

Animation.prototype.callback = function( dt ) {
	this.frameIndex++;
	if (this.frameIndex >= this.sequence.length) {
		this.frameIndex = 0;
	}
};

/**
 * Start the animation.
 * 
 */
Animation.prototype.start = function() {
	if (this.playing) {
		return;
	}
	this.frameIndex = 0;
	this.playing = true;
	gamejs.time.fpsCallback(this.callback, this, this.fps);
};

/**
 * Stop the animation.
 * 
 */
Animation.prototype.stop = function() {
	if (!this.playing) {
		return;
	}
	gamejs.time.deleteCallback(this.callback, this.fps);
	this.playing = false;
};

/**
 * Blit an animation frame.
 * 
 */
Animation.prototype.blit = function(surface, x, y) {
	this.start();
	frame = this.sequence[this.frameIndex];
	frame.blit(surface, x, y);
};
