var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawCode = fs.readFileSync('./web/script.js').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project, i) {
		var rows = project.grid.tiles.length;
		var cols = Math.max.apply(Math, project.grid.tiles.map(function(row) { return row.length; }));
		var shapeArea = 0;
		for(var r = 0; r < project.grid.tiles.length; r++) {
			for(var c = 0; c < project.grid.tiles[r].length; c++) {
				if(project.grid.tiles[r][c] !== ' ') {
					shapeArea += 1;
				}
			}
		}
		return {
			id: project.id,
			title: project.title,
			timePeriod: project.timePeriod,
			medium: project.medium,
			repoUrl: project.repoUrl,
			description: project.description,
			instructions: project.instructions,
			grid: {
				imageUrl: project.grid.imageUrl,
				previewImageUrl: project.grid.previewImageUrl,
				tiles: project.grid.tiles,
				rows: rows,
				cols: cols,
				width: cols * (tileSize.width + tileSize.margin),
				height: rows * (tileSize.height + tileSize.margin),
				area: shapeArea
			},
			content: project.content,
			index: i
		};
	});
	return underscore.template(rawCode)({
		projects: JSON.stringify(processedProjectData),
		tileSize: JSON.stringify(tileSize)
	});
};