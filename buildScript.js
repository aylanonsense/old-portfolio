var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawCode = fs.readFileSync('./web/script.js').toString();

module.exports = function buildIndexHTML() {
	return underscore.template(rawCode)({
		projectData: JSON.stringify(projectData),
		tileSize: JSON.stringify(tileSize)
	});
};