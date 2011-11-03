var gamejs = require('./gamejs');
var $ext = gamejs.utils.objects.extend;
var log = gamejs.log;

exports.transform = require('./pixxel/transform');
exports.world = require('./pixxel/world');
exports.draw = require('./pixxel/draw');
exports.sprites = require('./pixxel/sprites');

var radians = exports.radians = function(deg) {
	return deg * Math.PI / 180;
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
