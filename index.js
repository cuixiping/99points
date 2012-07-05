var http = require('http'),
	conf = require('./conf/env'),
	webServer = require('./web-server');

var staticServer = new (webServer.Server)(conf.env.basePath + '/htdocs');

console.log('静态文件服务启动，80端口');
http.createServer(function(request, response) {
	request.addListener('end', function() {
		staticServer.serve(request, response);
	});
}).listen(80);


/*
console.log('Socket服务启动，9433端口');
http.createServer(function(request, response) {
	request.addListener('end', function() {
		staticServer.serve(request, response);
	});
}).listen(9433);
*/

