var gamejs = require('../../gamejs');
var $ext = gamejs.utils.objects.extend;
var log = gamejs.log;

/**
 * A Map implementation.
 * 
 */
var Map = exports.Map = function(mapgraph) {

	this.mapgraph = mapgraph;
	
};
$ext(Map, gamejs.pathfinding.astar.Map);

/**
 * Extend Map to use the A* path finder from gamejs.
 * 
 */
Map.prototype.findRoute = function(from, to) {
	var path = [];
	var route = gamejs.pathfinding.astar.findRoute(this, from, to, 500);
	if(route == null) {
		return path;
	}
	while(route != null) {
		path.push(route.point);
		route = route.from;
	}
	path.pop()
	return path;
};

/**
 * @param {Array}
 *            origin
 * @returns {Array} list of `Point`s accessible from given Point
 */
Map.prototype.adjacent = function(origin) {
	var mapgraph =this.mapgraph;
	function insideMap(point) {
		try {
			var tile = mapgraph.tile(point);
		} catch (e) {
			return false;
		}
		return tile instanceof Tile;
	}
	var directions = [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ];
	var allPoints = directions.map(function(dir) {
		return [ origin[0] + dir[0], origin[1] + dir[1] ];
	});
	var inside = allPoints.filter(insideMap);
	return inside;
};

/**
 * Estimated lower bound distance between two given points.
 * 
 * @param {Array}
 *            pointA
 * @param {Array}
 *            pointB
 * @returns {Number} the estimated distance between two points
 */
Map.prototype.estimatedDistance = function(pointA, pointB) {
	return Math.abs(pointA[0] - pointB[0]) + Math.abs(pointA[1] - pointB[1])
			* this.mapgraph.world.size;
};

/**
 * Actual distance between the two given points.
 * 
 * @param {Array}
 *            pointA
 * @param {Array}
 *            pointB
 * @returns {Number} the actual distance between two points
 */
Map.prototype.actualDistance = function(pointA, pointB) {
	var mapgraph = this.mapgraph;
	function heightAt(point) {
		return mapgraph.tile(point).height() * mapgraph.world.size;
	}
	var heightDifference = heightAt(pointB) - heightAt(pointA);
	var climbFactor = (heightDifference < 0 ? 1 : 2);
	return mapgraph.world.size + climbFactor * Math.abs(heightDifference);
};

/**
 * MapGraph
 * 
 * The map graph hosts all the floor tiles.
 * 
 * It provides path finding capabilities through an instance of a path finding
 * algorithm.
 * 
 */
var MapGraph = exports.MapGraph = function(world) {
	this.world = world;

	// initialize empty tile floor
	this.floor = [];
	for ( var i = 0; i < this.world.height; i++) {
		this.floor[i] = [];
		for ( var j = 0; j < this.world.width; j++) {
			this.floor[i][j] = new Tile([ j, i ]);
		}
	}
};

/**
 * Get a tile with the given index.
 * 
 * @returns {Tile}
 */
MapGraph.prototype.tile = function(x, y) {
	if (x instanceof Array) {
		var index = x;
		x = index[0], y = index[1]
	}
	if (y < this.floor.length && x < this.floor[y].length) {
		return this.floor[y][x];
	} else {
		throw 'MapGraphException("Tile ' + j + 'x' + i + ' does not exist")';
	}
};

/**
 * Tile
 * 
 * This class holds and manages the properties and actions related to map tiles.
 * 
 * @author jakob
 * 
 * @constructor
 * @param index
 */
var Tile = exports.Tile = function(index) {
	this.walkable = true;
	this.index = index;
};

/**
 * @returns {Number}
 */
Tile.prototype.height = function() {
	return 1;
};
