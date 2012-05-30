var util = require('util');
var nstatic = require('node-static');
var io = require('socket.io');

var port = 8090;

var file = new(nstatic.Server)('./htdocs', { cache: 7200, headers: {'X-Hello':'World!'} });

var app = require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		file.serve(request, response, function (err, res) {
			if (err) { // An error as occured
				util.error("> Error serving " + request.url + " - " + err.message);
				response.writeHead(err.status, err.headers);
				response.end();
			} else { // The file was served successfully
				// util.puts("> " + request.url + " - " + res.message);
			}
		});
	});
});

io = io.listen(app, { log: false, 'log level':1 });

app.listen(port);

io.sockets.on('connection', function (socket) {
	console.log('----------- connection : '+socket.id+' ------------');

	//console.log('\n----------- socket : ------------');
	//console.dir(socket);

	//console.log('\n----------- io.sockets : ------------');
	//console.dir(io.sockets);

	//console.dir(socket);
	/*
		socket.emit('news', { hello: 'world' });

		io.sockets.emit('this', { will: 'be received by everyone' });

		socket.on('message', function (data) {
			console.log('message ' + data);
		});

		socket.on('my other event', function (data) {
		});

		socket.on('private message', function (from, msg) {
			console.log('I received a private message by ', from, ' saying ', msg);
		});
	*/

	socket.on('message', function (data) {
		//console.log('message : ' + data);
		//console.dir(data);
		if(data=='hello'){
			socket.emit('message', 'nice to meet you.');
		}
		if(data.op in handlers){
			handlers[data.op](socket, data.data);
		}
	});

	socket.on('disconnect', function (e) {
		console.log('disconnect :'+socket.id);
		handlers.playerLeave(socket);
	});
});

var handlers = {
	login : function (socket, data){
		socket.emit('message', {op:'welcome', data:'Hi, '+data});
		socket.user = {id: socket.id, name: data || 'Guest'};

		handlers.playerJoin(socket);
		handlers.getTables(socket);
		handlers.getPlayers(socket);
	},
	getTables : function (socket, data){
		var tablsData = [{}];
		socket.emit('message', {op:'getTables', data:tablsData});
	},
	getPlayers : function (socket, data){
		var playersData = [];
		var sks = io.sockets.sockets;
		for(var id in sks){
			playersData.push(sks[id].user);
		}
		socket.emit('message', {op:'getPlayers', data:playersData});
	},
	playerJoin : function (socket, data){
		io.sockets.emit('message', {op:'playerJoin', data:{user:socket.user}});
	},
	playerLeave : function (socket, data){
		io.sockets.emit('message', {op:'playerLeave', data:{user:socket.user}});
	},
	play : function (socket, data){
		io.sockets.emit('play', data);
	},
	chat : function (socket, data){
		var chatData = {
			user:socket.user,
			msg: data.msg
		};
		if(data.to && (data.to in io.sockets.sockets)){
			chatData.secret = true;
			io.sockets.sockets[data.to].emit('message', {op:'chat', data:chatData});
		}
		else{
			io.sockets.emit('message', {op:'chat', data:chatData});
		}
	}
};

function disconnect(socket, data){

}

function sendPrivateMessageTo(id,msg){
	io.sockets.socket(id).emit('private message', msg);
}

util.puts("> node-static is listening on port "+port);
