$(document).ready(function() {
	var projectData = <%= projectData %>; //jshint ignore:line
	var tileSize = <%= tileSize %>; //jshint ignore:line
	console.log("script.js got executed!", projectData, tileSize);
});