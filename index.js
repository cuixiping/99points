var http = require('http'),
	conf = require('./conf/env'),
	webServer = require('./web-server');

var staticServer = new (webServer.Server)(conf.env.basePath + '/htdocs');

console.log('Static server is starting at port of 80');
http.createServer(function(request, response) {
	request.addListener('end', function() {
		staticServer.serve(request, response);
	});
}).listen(80);


/*
console.log('Socket server is starting at port of 9433');
http.createServer(function(request, response) {
	request.addListener('end', function() {
		staticServer.serve(request, response);
	});
}).listen(9433);
*/

