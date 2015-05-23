var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawCode = fs.readFileSync('./web/script.js').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		var shapeArea = 0;
		for(var r = 0; r < project.grid.tiles.length; r++) {
			for(var c = 0; c < project.grid.tiles[r].length; c++) {
				if(project.grid.tiles[r][c] !== ' ') {
					shapeArea += 1;
				}
			}
		}
		var shapeWidth = Math.max.apply(Math, project.grid.tiles.map(function(row) { return row.length; }));
		var shapeHeight = project.grid.tiles.length;
		return {
			id: project.id,
			title: project.title,
			timePeriod: project.timePeriod,
			medium: project.medium,
			repoUrl: project.repoUrl,
			description: project.description,
			instructions: project.instructions,
			grid: {
				tiles: project.grid.tiles,
				width: shapeWidth,
				height: shapeHeight,
				area: shapeArea
			},
			content: {
				type: project.content.type,
				url: project.content.url,
				width: project.content.width,
				height: project.content.height,
				x: project.content.x,
				y: project.content.y
			}
		};
	});
	return underscore.template(rawCode)({
		projects: JSON.stringify(processedProjectData),
		tileSize: JSON.stringify(tileSize)
	});
};