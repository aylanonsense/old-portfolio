var fs = require('fs');
var underscore = require('underscore');

module.exports = function buildIndexHTML() {
	var rawHTML = fs.readFileSync('./web/index.html').toString();
	return underscore.template(rawHTML)({
		bodyText: "blah blah blah"
	});
};