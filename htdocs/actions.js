var actions = {
connect : function (){
	if(socket && socket.socket.connected){
		console.log('socket is already connected');
		return;
	}
	strMyName = ui.getMyName();
	if(!strMyName){
		ui.alert('please input player name');
		console.log('socket not connect. require name.');
		return;
	}
	if(socket){
		socket.socket.reconnect();
		console.log('reconnect');
	}else{
		socket = io.connect('ws://'+location.host+'/99points', socket_config);
		socket.on('connect', socket_onopen);
		socket.on('message', socket_onmessage);
		socket.on('error', socket_onerror);
		socket.on('disconnect', socket_onclose);
		console.log('new connect');
	}
},
switchConn : function (){
	if(socket){
		//var websocket = socket.socket.transport.websocket;
		if(socket.socket.connected){
			console.log('close...');
			socket.socket.disconnect();
		}
		else if(socket.socket.connecting){
			console.log('CONNECTING...');
		}
		else if(!socket.socket.connected){
			console.log('connect (1)...');
			actions.connect();
		}
	}else{
		console.log('connect (2)...');
		actions.connect();
	}
},
login : function (){
	socket.emit('message', {op:'login', data:strMyName});
},
play : function (data){
	socket.emit('message', {op:'play', data:data});
},
sitdown : function (e){
	var seat=ui.getSeatByElement(e.target);
	if(seat===null){
		return;
	}
	if(seat === myseatId){
		socket.emit('message', {op:'standup'});
	}
	else if(!players[seat]){
		socket.emit('message', {op:'sitdown', data:{seat:seat}});
	}
},
standup : function (){
	socket.emit('message', {op:'standup'});
},
ready : function (){
	if(myseatId===null){
		ui.alert('please sit down before starting');
		return;
	}
	socket.emit('message', {op:'ready'});
},
playerJoin : function (){
},
playerLeave : function (){
},
chat : function (){
	var v=ui.getChatMessage();
	if(v){
		socket.emit('message', {op:'chat', data:{msg:v}});
	}
	else{
		alert('please input message');
	}
}
,onclick_seat : function (seat){
	if(!request_me){
		return;
	}
	if(request_type === 'otherseat'){
		if(seat===myseatId){
			ui.alert('请选别人的座位');
			return;
		}
		socket.emit('message', {op:'play', data:{seat:seat}});
	}
}
,onclick_card : function (seat,card){
	if(!request_me){
		return;
	}
	if(request_type === 'othercard'){
		if(seat===myseatId){
			ui.alert('请选别人的牌');
			return;
		}
		socket.emit('message', {op:'play', data:{seat:seat, card:card}});
	}
	else if(request_type === 'selfcard'){
		if(seat==myseatId){
			ui.alert('请选自己的牌');
			return;
		}
		socket.emit('message', {op:'play', data:{card:card}});
	}
	request_type = '';
	request_me = false;
}
};
