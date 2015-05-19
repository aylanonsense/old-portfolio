var fs = require('fs');
var underscore = require('underscore');
var rawProjectData = require('./projects');
var rawHTML = fs.readFileSync('./web/index.html').toString();
var tileProps = { width: 150, height: 150, margin: 5 };

module.exports = function buildIndexHTML() {
	var projects = rawProjectData.map(function(project) {
		return {
			color: project.color,
			width: project.colspan * tileProps.width + (project.colspan - 1) * tileProps.margin,
			height: project.rowspan * tileProps.height + (project.rowspan - 1) * tileProps.margin
		};
	});
	return underscore.template(rawHTML)({
		projects: projects
	});
};