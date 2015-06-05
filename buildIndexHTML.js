var fs = require('fs');
var underscore = require('underscore');
var projectData = require('./project-data');
var tileSize = require('./tile-size');
var rawHTML = fs.readFileSync('./web/index.html').toString();
var minify = require('html-minifier').minify;

module.exports = function buildIndexHTML() {
	var processedProjectData = projectData.map(function(project) {
		var cols = Math.max.apply(Math, project.grid.tiles.map(function(row) { return row.length; }));
		var rows = project.grid.tiles.length;
		var tiles = [];
		for(var r = 0; r < project.grid.tiles.length; r++) {
			for(var c = 0; c < project.grid.tiles[r].length; c++) {
				if(project.grid.tiles[r][c] !== ' ') {
					tiles.push({
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
			grid: {
				previewImage: project.grid.previewImage,
				tiles: tiles,
				width: cols * (tileSize.width + tileSize.margin),
				height: rows * (tileSize.height + tileSize.margin)
			}
		};
	});

	return minify(underscore.template(rawHTML)({
		projects: processedProjectData,
		tileSize: tileSize
	}), {
		removeAttributeQuotes: true,
		removeComments: true,
		collapseWhitespace: true,
		conservativeCollapse: false,
		removeRedundantAttributes: true,
		useShortDoctype: true,
		removeEmptyAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		removeIgnored: true,
		minifyJS: true,
		minifyCSS: true,
		minifyURLs: true
	});
};