var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawHTML = fs.readFileSync('./web/index.html').toString();

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		var cols = Math.max.apply(Math, project.grid.shape.map(function(row) { return row.length; }));
		var rows = project.grid.shape.length;
		var hitbox = [];
		for(var r = 0; r < project.grid.shape.length; r++) {
			for(var c = 0; c < project.grid.shape[r].length; c++) {
				if(project.grid.shape[r][c] !== ' ') {
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
			title: project.title,
			description: project.description,
			medium: project.medium,
			timePeriod: project.timePeriod,
			repoUrl: project.repoUrl,
			grid: {
				previewImageUrl: project.grid.previewImageUrl,
				imageUrl: project.grid.imageUrl
			},
			image: {
				url: project.image.url,
				width: project.image.width,
				height: project.image.height,
			},
			iframe: {
				url: project.iframe.url,
				width: project.iframe.width,
				height: project.iframe.height,
			},
			hitbox: hitbox,
			width: cols * (tileSize.width + tileSize.margin),
			height: rows * (tileSize.height + tileSize.margin)
		};
	});
	return underscore.template(rawHTML)({
		projects: processedProjectData,
		tileSize: tileSize
	});
};