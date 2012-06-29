var ui = {
log : function (s){
	appendHTML($('logs'), '<div class="log">'+s+'</div>');
},
alert : function (s){
	appendHTML($('logs'), '<div class="alert">'+s+'</div>');
},
getMyName : function (e){
	return txtMyName.value;
},
getChatMessage : function (e){
	return textChat.value;
},
getSeatByIndex : function (i){
	var ele=$('seat'+i);
	if(ele){
		return {i:+ele.getAttribute('i'), uid:ele.getAttribute('uid')};
	}
	return null;
},
getSeatByElement : function (ele){
	var i=ele.id.replace(/^seat/,'');
	if((/^\d+$/i).test(i)){
		return +i;
	}
	return null;
},
clearPlayers : function (data){
	div_players.innerHTML = '';
},
updatePlayers : function (data){
	var i,n;
	for(i=0,n=data.users.length;i<n;i++){
		var user = data.users[i];
		if(user==null){
			console.warn('updatePlayers :: invalid user data');
			break;
		}
		if(!$('player_'+user.id)){
			var tmp = document.createElement('div');
			tmp.id = 'player_'+user.id;
			tmp.innerHTML = user.name;
			div_players.appendChild(tmp);
		}
	}
	if(data.players && data.readys){
		var seatsCount=8;
		for(i=0;i<seatsCount;i++){
			ui.updateSeat(i, data.players[i], data.readys[i]);
		}
	}
},
removePlayer : function (player){
	var i, uid, ele = $('player_'+player.id), seatsCount=8;
	if(ele){
		div_players.removeChild(ele);
	}
	for(i=0;i<seatsCount;i++){
		if(players[i] && players[i].id === player.id){
			ui.updateSeat(i, null);
			break;
		}
	}
},
clearSeats : function (){
	$('div_seats').innerHTML = '';
	$('btnReady').style.display = 'none';
},
createSeats : function (n){
	var i,s;
	$('div_playercards').innerHTML = '';
	for(i=0,s=[];i<n;i++){
		s.push('<input type="button" id="seat'+i+'" value="'+i+'# sit down" class="'+(i%2 ? 'odd':'even')+'"> ');
		appendHTML($('div_playercards'), '<div id="div_playercards_'+i+'"></div>');
	}
	$('div_seats').innerHTML = s.join(' ');
},
updateSeat : function (seat, player, ready){
	var ele=$('seat'+seat);
	ele.value = seat+'# '+(player?player.name:'sit down');
	toggleClass(ele,'sat',!!player);
	toggleClass(ele,'ready',ready||false);
	ele.disabled = player && player.id!=myuserId;
},
toggleReady : function (b){
	$('btnReady').style.display = b?'':'none';
},
ready : function (data, isSelf){
	var seat = data.seat;
	toggleClass($('seat'+seat),'ready',true);
	if(isSelf){
		$('btnReady').style.display = 'none';
	}
},
start : function (mycards,players){ //begin game
	var i,ele;
	for(i=0;i<mycards.length;i++){
		mycards[i]=new Card(mycards[i].suit, mycards[i].point);
	}
	for(i=0;i<players.length;i++){
		ele = $('div_playercards_'+i);
		if(players[i]){
			ele.style.display='';
			this.updateCards(i, ( (i === myseatId) ? mycards : 5) );
		}
		else{
			ele.style.display='none';
		}
	}
},
updateCards : function (seat, cards){
	var ele = $('div_playercards_'+seat), s='<span id="playernumber'+seat+'">#'+seat+'</span> : ';
	if(typeof cards==='number'){
		if(cards>0){
			s += (new Array(cards+1)).join('<button>◇</button> ');
		}
	}else{
		s += '<button>'+cards.join('</button><button>')+'</button>';
	}
	ele.innerHTML = s;
},
chat : function (data){
	appendHTML($('chatItems'), '<div>* '+data.user.name+': '+data.msg+'</div>');
},
updateConnState : function (open){
	$('state').innerHTML=open?'Connected.':'Not Connected.';
	btnSwitchConn.value=open?'Disconnect':'Connect';
	btnChat.disabled=!open;
},
updateScore : function (score){
	$('span_score').innerHTML=score;
}
};
