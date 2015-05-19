var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawHTML = fs.readFileSync('./web/index.html').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		var cols = Math.max.apply(Math, project.shape.map(function(row) { return row.length; }));
		var rows = project.shape.length;
		return {
			id: project.id,
			image: project.image,
			width: cols * tileSize.width + (cols - 1) * tileSize.margin,
			height: rows * tileSize.height + (rows - 1) * tileSize.margin
		};
	});
	return underscore.template(rawHTML)({
		projects: processedProjectData
	});
};