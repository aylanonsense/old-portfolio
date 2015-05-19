var express = require('express');
var expressLess = require('express-less');
var app = express();

//serve static web resources
app.use(express.static(__dirname + '/web/static'));

//serve css files
app.use('/css', expressLess(__dirname + '/web/less'));

//serve jquery
app.get('/jquery.min.js', function(req, res) {
	res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});
app.get('/jquery.min.map', function(req, res) {
	res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.map');
});

//serve script.js
var scriptText = require('./buildScript')();
app.get('/script.js', function(req, res) {
	res.writeHeader(200, { "Content-Type": "text/javascript" });
	res.write(scriptText);
	res.end();
});

//serve index.html
var indexHTML = require('./buildIndexHTML')();
app.get('/', function(req, res) {
	res.writeHeader(200, { "Content-Type": "text/html" });
	res.write(indexHTML);
	res.end();
});

//start the server
var server = app.listen(process.env.PORT || 3000);