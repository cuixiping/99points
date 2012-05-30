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

var mgr = io.listen(app, { log: false, 'log level':1 });

app.listen(port);

mgr.of('/99points').on('connection', function (socket) {
	console.log('----------- connection : '+socket.id+' ------------');

	//console.log('\n----------- socket : ------------');
	//console.dir(socket);

	//console.log('\n----------- mgr.sockets : ------------');
	//console.dir(mgr.sockets);

	//console.dir(socket);
	/*
		socket.emit('news', { hello: 'world' });

		mgr.sockets.emit('this', { will: 'be received by everyone' });

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

var actions = {
	messageInTable : function (data){
		mgr.of('/99points').in('table01').emit('message', data);
	}
};

var tableSockets=null;

var handlers = {
	login : function (socket, data){
		socket.join('table01');
		socket.emit('message', {op:'welcome', data:'Hi, '+data});
		tableSockets = mgr.of('/99points').in('table01').sockets;
		tableSockets[socket.id].user = socket.user = {id: socket.id, name: data || 'Guest'};

		handlers.playerJoin(socket);
		handlers.getTables(socket);
		handlers.getPlayers(socket);
	},
	getTables : function (socket, data){
		var tablsData = [{id:'table01'}];
		socket.emit('message', {op:'getTables', data:tablsData});
	},
	getPlayers : function (socket, data){
		var playersData = [];
		var sks = tableSockets;
		for(var id in sks){
			playersData.push(sks[id].user);
		}
		socket.emit('message', {op:'getPlayers', data:playersData});
	},
	playerJoin : function (socket, data){
		actions.messageInTable({op:'playerJoin', data:{user:socket.user}});
	},
	playerLeave : function (socket, data){
		actions.messageInTable({op:'playerLeave', data:{user:socket.user}});
	},
	sitdown : function (socket, data){
		var seatOld = socket.user.seat;
		socket.user.seat = +data.seat;
		actions.messageInTable({op:'sitdown', data:{seat:+data.seat, seatOld:seatOld, user:socket.user}});
	},
	play : function (socket, data){
		actions.messageInTable({op:'play', data:data});
	},
	chat : function (socket, data){
		var chatData = {
			user:socket.user,
			msg: data.msg
		};
		var sks = tableSockets;
		if(data.to && (data.to in sks)){
			chatData.secret = true;
			sks[data.to].emit('message', {op:'chat', data:chatData});
		}
		else{
			actions.messageInTable({op:'chat', data:chatData});
		}
	}
};

function disconnect(socket, data){

}

function sendPrivateMessageTo(id,msg){
	mgr.sockets.socket(id).emit('private message', msg);
}

util.puts("> node-static is listening on port "+port);
