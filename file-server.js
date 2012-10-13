var util = require('util');
var nstatic = require('node-static');
var io = require('socket.io');
var Game = require('./htdocs/ninety-nine.js').Game;

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

//mgr是一个Manager实例
var mgr = io.listen(app, { log: false, 'log level':1 });

app.listen(port);

mgr.of('/99points').on('connection', function (socket) {
	console.log('----------- connection : '+socket.id+' ------------');
	//console.log('   date : '+((+ new Date())%1000));

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
		//不处理未入桌的连接
		if(!tableSockets[socket.id]){
			return;
		}
		handlers.playerLeave(socket);
	});
});

var actions = {
	messageInTable : function (data){
		mgr.of('/99points')['in']('table01').emit('message', data);
	}
};

//var ns_room = mgr.of('/99points')['in']('table01');

var tableSockets=null;
var game=new Game();

var handlers = {
	login : function (socket, data){
		//暂时禁止游戏进行中的有新人加入
		if(game.started){
			socket.emit('message', {op:'welcome', data:'Hi, '+data+', The game has started, you cannot join until game over'});
			socket.user = {id: socket.id, name: data || 'Guest'};
			socket.user = {id: socket.id, name: data || 'Guest'};
			return;
		}

		socket.join('table01');
		socket.emit('message', {op:'welcome', data:'Hi, '+data});
		//of,in方法返回的是一个SocketNamespace实例
		//SocketNamespace.sockets 是一个json hash map.
		tableSockets = mgr.of('/99points')['in']('table01').sockets;
		tableSockets[socket.id].user = socket.user = {id: socket.id, name: data || 'Guest'};

		handlers.playerJoin(socket);
		handlers.getTables(socket);
		handlers.getPlayers(socket);

		//test
		//var ns_room = mgr.of('/99points')['in']('table01');
		//ns_room.except(socket.id).emit('message', {op:'test', data:'test except ************'}).setFlags();
		//ns_room.socket(socket.id).emit('message', {op:'test', data:'test socket ************'});
	},
	getTables : function (socket){
		var tablsData = [{id:'table01'}];
		socket.emit('message', {op:'getTables', data:tablsData});
	},
	getPlayers : function (socket){
		var playersData = [];
		var sks = tableSockets;
		var id;
		for(id in sks){
			playersData.push(sks[id].user);
		}
		socket.emit('message', {op:'getPlayers', data:{users: playersData, players:game.players, readys:game.readys }});
	},
	playerJoin : function (socket){
		actions.messageInTable({op:'playerJoin', data:{user:socket.user}});
	},
	playerLeave : function (socket){
		//如果游戏正在进行中，则处理玩家逃跑
		game.delPlayer(socket.user);
		actions.messageInTable({op:'playerLeave', data:{user:socket.user}});
		if(game.started){
			game.reset(true);
		}
	},
	sitdown : function (socket, data){
		var seatOld = game.getPlayerSeat(socket.user);
		game.addPlayer(socket.user, +data.seat, seatOld);
		actions.messageInTable({op:'sitdown', data:{seat:+data.seat, seatOld:seatOld, user:socket.user}});
	},
	standup : function (socket){
		var seatOld = game.delPlayer(socket.user);
		actions.messageInTable({op:'standup', data:{seat:seatOld}});
	},
	ready : function (socket){
		var seat = game.getPlayerSeat(socket.user);
		seat = game.setPlayerReady(socket.user, true, seat);
		var id, i;
		//socket.emit('message', {op:'ready', data:{seat:seat}});
		//socket.broadcast.emit('message', {op:'ready', data:{seat:seat}}); //emit everyone except self
		actions.messageInTable({op:'ready', data:{seat:seat}});
		//if all started , then begin play
		if(!game.checkCanStart()){
			return;
		}
		game.start();
		var sks = tableSockets;
		for(i=0;i<game.seatsCount;i++){
			if(game.players[i]){
				id = game.players[i].id;
				sks[id].emit('message', {op:'start', data:{mycards: game.inhandCards[id]}});
			}
		}
		//提醒该用户出牌
		//sks[game.getCurrPlayer().id].emit('message', {op:'turn'});
		//广播出牌权
		actions.messageInTable({op:'turn', data:{seat:game.currSeat, request: 'selfcard', points: game.points}});
		game.waitingPlay = {seat:game.currSeat, request: 'selfcard'};
	},
	play : function (socket, data){
		var p = game.play(socket.user, data);
		if(p === 'invalid'){
			data.result = p;
			socket.emit('message', {op:'play', data:data});
			return;
		}
		var i, s=game.playStack, n=s.length;
		for(i=0;i<n;i++){
			var item = s[i], type = item.type;
			if(type in emit_play){
				emit_play[type].call(emit_play, socket, item);
			}
			else{
				console.log('*** invalid playStack type: '+type);
			}
		}
		if(p === 'gameOver'){
			actions.messageInTable({op:'gameOver', data:{winner:game.winner}});
		}
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

var emit_play = {
	'in' : function (socket, data){
		var data_private = {op:'play', data:{type:'in',seat:data.seat,cards:data.cards}};
		var data_others = {op:'play', data:{type:'in',seat:data.seat,count:data.cards.length}};
		emit_play_msg(data.seat, data_private, data_others);
	},
	out : function (socket, data){
		var data_all = {op:'play', data:{type:'out',seat:data.seat,cards:data.cards}};
		emit_play_msg(data.seat, null, null, data_all);
	},
	exchange : function (socket, data){
		var room = mgr.of('/99points')['in']('table01');
		var player_id = game.players[player_seat].id;
		var play_id = game.players[play_seat].id;
		room.socket(player_id).emit('message', {op:'play', data:{type:'exchange',player_seat:data.player_seat,play_seat:data.play_seat,cards:data.cards1}});
		room.socket(play_id).emit('message', {op:'play', data:{type:'exchange',player_seat:data.player_seat,play_seat:data.play_seat,cards:data.cards2}});
		room.except(player_id).except(play_id).emit('message', {op:'play', data:{type:'exchange',player_seat:data.player_seat,play_seat:data.play_seat}}).setFlags();
	},
	steal : function (socket, data, card){
		var room = mgr.of('/99points')['in']('table01');
		var player_id = game.players[player_seat].id;
		room.socket(player_id).emit('message', {op:'play', data:{type:'steal',player_seat:data.player_seat,play_seat:data.play_seat,cards:data.cards}});
		room.except(player_id).emit('message', {op:'play', data:{type:'steal',player_seat:data.player_seat,play_seat:data.play_seat,card:data.card}}).setFlags();
	},
	harm : function (socket, data, cards){
		var room = mgr.of('/99points')['in']('table01');
		var player_id = game.players[player_seat].id;
		var play_id = game.players[play_seat].id;
		room.socket(play_id).emit('message', {op:'play', data:{type:'harm',player_seat:data.player_seat,play_seat:data.play_seat,card:data.card,cards:data.cards}});
		room.except(play_id).emit('message', {op:'play', data:{type:'steal',player_seat:data.player_seat,play_seat:data.play_seat,cards:data.cards}}).setFlags();
	},
	specify : function (socket, data){
	},
	relive : function (socket, data){
	}
};

function emit_play_msg(seat, data_private, data_others, data_all){
	if(!game.players[seat]){
		return;
	}
	var id = game.players[seat].id;
	var room = mgr.of('/99points')['in']('table01');
	if(data_private){
		room.socket(id).emit('message', data_private);
	}
	if(data_others){
		room.except(id).emit('message', data_others).setFlags();
	}
	if(data_all){
		actions.messageInTable(data_all);
	}
}

function sendPrivateMessageTo(id,msg){
	mgr.sockets.socket(id).emit('private message', msg);
}

util.puts(">>> node-static is listening on port "+port);
