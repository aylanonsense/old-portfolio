var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawCode = fs.readFileSync('./web/script.js').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		return {
			id: project.id,
			title: project.title,
			description: project.description,
			medium: project.medium,
			timePeriod: project.timePeriod,
			repoUrl: project.repoUrl,
			grid: {
				tiles: project.grid.tiles
			},
			content: {
				type: project.content.type,
				url: project.content.url,
				width: project.content.width,
				height: project.content.height
			}
		};
	});
	return underscore.template(rawCode)({
		projects: JSON.stringify(processedProjectData),
		tileSize: JSON.stringify(tileSize)
	});
};