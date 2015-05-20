var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawHTML = fs.readFileSync('./web/index.html').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		var cols = Math.max.apply(Math, project.shape.map(function(row) { return row.length; }));
		var rows = project.shape.length;
		var hitbox = [];
		for(var r = 0; r < project.shape.length; r++) {
			for(var c = 0; c < project.shape[r].length; c++) {
				if(project.shape[r][c] !== ' ') {
					hitbox.push({
						x: c * (tileSize.width + tileSize.margin),
						y: r * (tileSize.height + tileSize.margin),
						width: tileSize.width + tileSize.margin,
						height: tileSize.height + tileSize.margin
					});
				}
			}
		}
		return {
			id: project.id,
			tileImage: project.tileImage,
			tilePreviewImage: project.tilePreviewImage,
			width: cols * (tileSize.width + tileSize.margin),
			height: rows * (tileSize.height + tileSize.margin),
			hitbox: hitbox,
		};
	});
	return underscore.template(rawHTML)({
		projects: processedProjectData,
		tileSize: tileSize
	});
};