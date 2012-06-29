function $(id){return document.getElementById(id);}

function log(html){
	var tmp = document.createElement('div');
	tmp.innerHTML = html;
	logs.appendChild(tmp);
}
function appendHTML(target,html){
	target.insertAdjacentHTML('BeforeEnd',html);
	//var f = window.frg || (window.frg=document.createDocumentFragment());
	//if(!frg.firstChild){
		//frg.appendChild(document.createElement('div'));
	//}
	//frg.firstChild.innerHTML = html;
	//target.appendChild(frg);
}
function toggleClass(ele,name,on){
	if(on===true){
		ele.classList.add(name);
	}else if(on===false){
		ele.classList.remove(name);
	}else{
		ele.classList.toggle('ready',true);
	}
}

var state = $('state'),
	btnSwitchConn = $('btnSwitchConn'),
	textChat = $('textChat'),
	btnChat = $('btnChat'),
	chatItems = $('chatItems'),
	logs = $('logs');
var div_players = $('div_players'),
	txtMyName = $('txtMyName');
var strMyName;
var tableId = null;
var players = [];
var myuserId = null;
var myseatId = null;
var mycards = [];
var request_type = '';
var request_me = false;
var tablescore = 0;

if (window.MozWebSocket) {
  window.WebSocket = window.MozWebSocket;
}

var socket=null;
var socket_config = {
	'reconnect': false,
	'auto connect': true
};

socket_onopen = function () {
	console.log('onopen : '+socket.socket.sessionid); //socket.id is undefined now
	//console.log('   date : '+((+ new Date())%1000));
	myuserId = socket.socket.sessionid;
	ui.updateConnState(true);
	actions.login();
};
socket_onmessage = function (e) {
	//console.log('onmessage :');
	//console.dir(e);
	if(e.op in handlers){
		console.log('onmessage op: '+e.op+', data:');
		console.dir(e.data);
		handlers[e.op](e.data);
	}
};
socket_onerror = function (e) {
	console.log('onerror :');
	console.dir(e);
};
socket_onclose = function () {
	console.log('onclose .');
	//socket = null;
	players.length = 0;
	ui.clearPlayers();
	ui.clearSeats();
	ui.updateConnState(false);
};


function Card(suit,point){
	this.suit = suit;
	this.point = point;
}
Card.prototype = {
	toString : function (){
		return this.suit+'_'+this.point;
	}
};


btnSwitchConn.onclick = actions.switchConn;
btnChat.onclick = actions.chat;
$('div_seats').onclick = actions.sitdown;
$('txtMyName').onkeypress = function (e){
	if(e.which==13){
		actions.switchConn();
	}
};
$('textChat').onkeypress = function (e){
	if(e.which==13 && !btnChat.disabled){
		actions.chat();
	}
};
$('btnReady').onclick = actions.ready;

$('div_playercards').onclick = function (e){
	var ele=e.target, id=ele.id, seat, card, cp;
	if(/^playernumber\d+$/.test(id)){
		//click on playernumber
		seat = + id.replace('playernumber','');
		actions.onclick_seat.call(actions,seat);
	}
	else if(ele.tagName==='BUTTON'){
		//click on card button
		seat = + ele.parentNode.id.replace('div_playercards_','');
		card = 0;
		while(ele.previousSibling && ele.previousSibling.tagName==='BUTTON'){
			ele = ele.previousSibling;
			card++;
		}
		actions.onclick_card.call(actions,seat,card);
		/*var data = {card:card};
		card = mycards[card];
		cp = card.point;
		switch (cp){
			case 'A':   //指定
				ui.alert('未实现');return;
				break;
			case '4':   //反向
				break;
			case '7':   //换牌, 不补牌
				//询问和谁换牌, 不补牌, flag是座位号
				ui.alert('未实现');return;
				break;
			case '10':  //加减10
				//加减10, flag是+-指定
				cp=10;
				if(+cp+gp>maxp){
					this.point -= +cp;
				}
				else if(-cp+gp<0){
					this.point += +cp;
				}
				else{
					this.point += flag=='-'?-cp:+cp; //询问是加还是减
				}
				break;
			case 'J':   //偷牌, 不补牌
				//询问抽谁的一张牌, 不补牌, flag是座位号, flag2是所抽的牌序号
				targetPlayer = this.players[flag];
				this.stealCard(player,targetPlayer,flag2);
				this.playStack.push(['steal', seat, flag, flag2, this.inhandCards[player.id].slice(-1)]);
				break;
			case 'Q':   //加减20
				//加减20, flag是+-指定
				cp=20;
				if(+cp+gp>maxp){
					this.point -= +cp;
				}
				else if(-cp+gp<0){
					this.point += +cp;
				}
				else{
					this.point += flag=='-'?-cp:+cp; //询问是加还是减
				}
				break;
			case 'K':   //加满
				//满分
				this.point = maxp;
				break;
			case 'Small': //加害
				//加害，询问将谁只留哪1张, flag是座位号, flag2是所留的牌序号
				targetPlayer = this.players[flag];
				//需检验参数是否有效
				i = this.inhandCards[targetPlayer.id].length; //被加害玩家的牌的张数
				this.harmPlayer(targetPlayer, flag2);
				this.playStack.push(['harm', flag, flag2, this.outhandCards.slice(-i+1)]);
				break;
			case 'Big':   //拯救
				//询问复活谁, flag是座位号
				//如果无人可以复活，则忽略
				targetPlayer = this.players[flag];
				if(targetPlayer && this.inhandCards[targetPlayer.id].length===0){
					this.relivePlayer(targetPlayer);
					this.playStack.push(['in', flag, this.inhandCards[targetPlayer.id].slice(0)]);
				}
				break;
			default:      //加
				//2,3,5,6,8,9
				this.point += +cp;
		}
		actions.play(data);*/
	}
};
