var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawCode = fs.readFileSync('./web/script.js').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		return {
			id: project.id,
			grid: {
				shape: project.grid.shape
			}
		};
	});
	return underscore.template(rawCode)({
		projects: JSON.stringify(processedProjectData),
		tileSize: JSON.stringify(tileSize)
	});
};