var handlers = {
welcome : function (data){
	log(data);
},
getTables : function (data){
},
getPlayers : function (data){
	//users = data.users;
	players = data.players;
	ui.updatePlayers(data);
},
playerJoin : function (data){
	console.log('new user '+data.user.name+' join');
	if(data.user.id===myuserId){
		ui.createSeats(8);
	}
	ui.updatePlayers({users: [data.user]});
},
playerLeave : function (data){
	var i;
	for(i=0,n=players.length;i<n;i++){
		var player = players[i];
		if(player && player.id == data.user.id){
			ui.removePlayer(player);
			delete players[i];
			ui.alert('User ['+player.name+'] escaped!');
			console.log('user '+player.name+' leave');
			break;
		}
	}
},
sitdown : function (data){
	players[data.seat] = data.user;
	if(data.user.id==myuserId){
		myseatId=data.seat;
		ui.toggleReady(true);
	}
	if(typeof data.seatOld === 'number'){
		ui.updateSeat(data.seatOld, null);
	}
	ui.updateSeat(data.seat, data.user);
},
standup : function (data){
	if(data.seat !== undefined){
		if(data.seat==myseatId){
			myseatId=null;
		}
		//var seat=ui.getSeatByIndex(data.seat);
		ui.updateSeat(data.seat, null);
	}
},
ready : function (data){
	ui.ready(data, data.seat===myseatId);
},
start : function (data){
	mycards = data.mycards;
	ui.start(mycards,players);
},
turn : function (data){
	//data {seat:, request: selfcard | othercard | otherseat }
	request_me=data.seat===myseatId;
	request_type=data.request;
	var logstr = '轮到' + (request_me ? '我(#'+data.seat+')' : '#'+data.seat);
	if(request_type==='selfcard'){
		logstr+='出牌';
	}
	else if(request_type==='othercard'){
		logstr+='指定别人的牌';
	}
	else if(request_type==='otherseat'){
		logstr+='指定别人的座位';
	}
	else{
		logstr='data.request 无效';
		console.warn('data.request 无效');
		return;
	}
	ui.log(logstr);
	//if(request_me){
	//}
},
play : function (data){
	if(data.result = 'invalid'){
		ui.alert('出牌无效');
	}
},
score : function (data){
	tablescore = data.score;
	ui.updateScore(tablescore);
},
chat : function (data){
	ui.chat(data);
}
};
