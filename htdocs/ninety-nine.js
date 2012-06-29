//Player类，本局的玩家类
function Player(a){
	this.name=a.name;
	this.id=a.id||a.name;
	//this.die=false;
	//this.seat=null;
	//this.ready=false;
	//this.team=null;
	//this.inhandCards=[];
}
Player.prototype = {
	toString : function (){
		return this.name;
	}
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

function Game(){
	this.reset();
}
Game.prototype = {
	/* 重置初始状态 */
	reset : function (keep){
		this.points=0;         //当前牌面总分
		this.direction=1;      //1顺时针(0,1,2...)，-1逆时针(0,7,6,5...)
		this.currSeat=-1;      //当前出牌权在哪个座位, -1表示未知
		if(keep!==true){
			this.players=[];       //玩家，下标为座位号
			this.lookers=[];       //旁观者，下标为座位号
			this.readys=[];        //ready状态，下标为座位号
		}
		this.seatsCount=8;         //座位数量
		//this.seatsMap={};          //座位与玩家的映射
		this.teams=[];             //队伍号，同一队的人有同样的队伍号，下标为座位号
		this.winner=-1;            //得胜的队伍号
		this.started=false;        //游戏是否已开始
		this.inhandCards={};       //玩家手中的牌
		this.bottomCards=[];       //剩余底牌
		this.outhandCards=[];      //所有玩家已经出到桌面的牌
		this.playStack=[];         //记录一次出牌及相关连续影响的牌的变化
		this.waitingPlay=null;     //
	},
	/* 洗牌 */
	initCards : function (){
		//一局完成后，以该局的出牌序列做为洗牌前的初始序列。以后实现。
		var i,j,n1=54,n=54*2,arr=[];
		for(i=0;i<n1;i++){
			arr[i]=i;
			arr[i+n1]=i;
		}
		/* 洗牌3次 */
		for(j=0;j<3;j++){
			for(i=0;i<n;i++){
				var rnd = Math.random()*n|0;
				var t = arr[i];
				arr[i]=arr[rnd];
				arr[rnd]=t;
			}
		}
		var suits=['\u2665','\u2666','\u2660','\u2663']/* ['Hearts','Diamonds','Spades','Clubs'] */,
			points=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
		for(i=0;i<54*2;i++){
			var v=arr[i], suit,point;
			if(v<52){
				suit = suits[v/13|0];
				point = points[v%13];
			}
			else if(v==54-2){
				suit = 'Joker';
				point = 'Small';
			}
			else if(v==54-1){
				suit = 'Joker';
				point = 'Big';
			}
			this.bottomCards.push(new Card(suit,point));
		}
	},
	/* 开始发牌，出牌时以最先Ready的玩家开始 */
	start : function (){
		//需要先保证都ready之后才调用start方法
		var team,i;
		this.initCards();
		for(i=0;i<this.seatsCount;i++){
			if(this.players[i]){
				this.addCardsToPlayer(this.players[i],5);
				team = (team===0 ? 1 : 0);
				this.teams[i] = team;
				if(this.currSeat===-1){
					this.currSeat=i;
				}
			}
		}
		this.started=true;
	},
	/* 检测是否可以开始了：各玩家都ready，且玩家数量为>=4的偶数，且玩家数量*5<牌的总张数/2 */
	checkCanStart : function (){
		var i,n=0,packsCount = 2; //几副牌
		for(i=0;i<this.seatsCount;i++){
			var player = this.players[i];
			if(player){
				if(!this.readys[i]){
					return false;
				}
				n++;
			}
		}
		console.log('n:'+n);
		return n>=4 && n%2===0 && n*5<packsCount*54/2;
	},
	/* 求玩家的座位号 */
	getPlayerSeat : function (player){
		var i;
		for(i=0;i<this.seatsCount;i++){
			if(this.players[i] && this.players[i].id === player.id){
				return i;
			}
		}
		return null;
	},
	/* 玩家入座 */
	addPlayer : function (player,seat,seatOld){
		if(seatOld === undefined){
			seatOld = this.getPlayerSeat(player);
		}
		if(seatOld !== null){
			delete this.players[seatOld];
			delete this.readys[seatOld];
		}
		this.players[seat]=player;
		this.inhandCards[player.id]=[];
	},
	/* 玩家入座自动找空位，返回座位号，无空位则返回null */
	addPlayerAutoSeat : function (player){
		var i;
		for(i=0;i<this.seatsCount;i++){
			if(!this.players[i]){
				this.addPlayer(player,i);
				return i;
			}
		}
		return null;
	},
	/* 玩家出座 standup */
	delPlayer : function (player,seat){
		if(seat === undefined){
			seat = this.getPlayerSeat(player);
		}
		if(seat !== null){
			delete this.players[seat];
			delete this.readys[seat];
			return seat;
		}
		delete this.inhandCards[player.id];
		return null;
	},
	/* 玩家ready */
	setPlayerReady : function (player,readyOrNot,seat){
		if(seat === undefined){
			seat = this.getPlayerSeat(player);
		}
		if(seat !== null){
			this.readys[seat] = readyOrNot;
		}
		return seat;
	},
	/* 玩家摸牌n张 */
	addCardsToPlayer : function (player,n){
		Array.prototype.push.apply(this.inhandCards[player.id], this.bottomCards.splice(-n));
	},
	/* 玩家摸牌1张 */
	addCardToPlayer : function (player){
		this.inhandCards[player.id].push(this.bottomCards.pop());
	},
	/* 玩家偷另一玩家的牌1张 */
	stealCard : function (player,fromPlayer,i){
		var cards = this.inhandCards[fromPlayer.id];
		this.inhandCards[player.id].push( cards.splice(i,1)[0] );
	},
	/* 两位玩家的牌互换 */
	exchangeCards : function (player,player2){
		var cards = this.inhandCards[player.id];
		this.inhandCards[player.id] = this.inhandCards[player2.id];
		this.inhandCards[player2.id] = cards;
	},
	/* 加害，使指定玩家只留1张 */
	harmPlayer : function (player,i){
		var cards = this.inhandCards[player.id];
		var card = cards.splice(i,1)[0];
		Array.prototype.unshift.apply(this.outhandCards, cards.splice(0));
		cards.push(card);
	},
	/* 复活 */
	relivePlayer : function (player){
		Array.prototype.push.apply(this.inhandCards[player.id], this.bottomCards.splice(-5));
	},
	/* 从玩家手牌中拿走1张 */
	/* removeCardFromPlayer : function (player,card){
		var i, cards = this.inhandCards[player.id];
		if(typeof card=='number'){
			return cards.splice(card,1)[0];
		}
		for(i=0;i<cards.length;i++){
			if(cards[i]==card){
				return cards.splice(i,1)[0];
			}
		}
	}, */
	/* 求下一个出牌权的座位号 */
	getNextSeat : function (){
		var p;
		while(true){
			p=(this.currSeat+this.direction+this.seatsCount) % this.seatsCount;
			if(this.players[p]){
				if(this.inhandCards[this.players[p].id].length > 0){
					return p;
				}
			}
			if(p===this.currSeat){
				return null;
			}
		}
		return null;
	},
	/* 求下一个出牌权的座位号 */
	getCurrPlayer : function (){
		return this.players[this.currSeat] || null;
	},
	/* 检测即将必死的玩家 */
	checkDying : function (){
		//该玩家死亡后，将轮到下一家出牌，下一家还是无牌可出，继续死亡，以此类推。
		//最坏的情况是，所有玩家都死亡，那就算和局了。
		//如A队死完，B队还有人，则A队算输，本局结束。
		//如两队都还有人，游戏继续。
		var i, seat = this.currSeat, gp=this.point, maxp=99;
		var cards = this.inhandCards[this.players[seat].id], cardsCount=cards.length;
		if(cardsCount > 0){
			for(i=0;i<cardsCount;i++){
				var cp = cards[i].point;
				if(cp=='2'||cp=='3'||cp=='5'||cp=='6'||cp=='8'||cp=='9'){
					if(+cp+gp <= maxp){
						return;
					}
				}else{
					return;
				}
			}
			Array.prototype.push.apply(this.outhandCards, cards.splice(0));
			this.playStack.push({type:'out', seat:seat, cards:this.outhandCards.slice(-cardsCount)});
		}
		var nextSeat = this.getNextSeat();
		if(nextSeat !== null){
			this.currSeat = nextSeat;
			this.checkDying();
		}
		else{
			return 'gameOver';
		}
	},
	/* 计算同队玩家还活着的人数 */
	getTeamLives : function (team){
		var i, n=0;
		for(i=0;i<this.seatsCount;i++){
			if(this.teams[i] === team){
				n++;
			}
		}
		return n;
	},
	/* 计算是否应结束了，未结束返回false，结束则返回获胜队序号 */
	checkGameOver : function (){
		var i, a, b, c;
		for(i=0;i<this.seatsCount;i++){
			c = this.teams[i];
			if(c !== a){
				if(b===a){
					b=c;
				}
				else if(c !== b){
					return false;
				}
			}
		}
		return b; //b队获胜
	},
	/* 玩家出牌 */
	play : function (player, data){
		if(!this.waitingPlay){
			return;
		}
		this.playStack.length = 0;
		var request_type = this.waitingPlay.request;
		var waiting_seat = this.waitingPlay.seat;
		var waiting_cause = this.waitingPlay.cause;
		var err_invalid = 'invalid';
		var needFillCards = false; //是否需要补牌
		//此时的currSeat应该是等于waiting_seat的
		var player_seat = this.getPlayerSeat(player);
		if(player_seat !== waiting_seat){
			console.log('---- 无效的出牌：#%d无出牌权 ----', card_seat);
			return err_invalid;
		}
		var play_seat=data.seat;
		if(play_seat === undefined){
			play_seat = player_seat;
		}
		var player_id = player.id;
		var play_id = play_seat === player_seat ? player_id : this.players[play_seat].id;

		if(request_type === 'selfcard'){
			if(play_seat !== player_seat){
				console.log('---- 无效：#%d没有出自己的牌 ----', player_seat);
				return err_invalid;
			}
			var r = this.playOneCard(player, data); //会自动更新this.waitingPlay.request
			if(r === err_invalid){
				console.log('---- 无效：(playOneCard返回) ----', player_seat);
				return err_invalid;
			}
			if(this.waitingPlay.request === 'selfcard'){
				needFillCards = true;
			}
			//return r;
		}
		else if(request_type === 'othercard'){  // 指定1张别人的牌
			if(play_seat === player_seat){
				console.log('---- 无效：#%d指定的不是别人的牌 ----', player_seat);
				return err_invalid;
			}
			//case 1 : 指定偷谁的哪1张
			//case 2 : 指定加害谁只留哪1张
			//return this.specifyOtherCard(player, data);
			if(waiting_cause==='steal'){
				this.stealCard(player, this.players[play_seat], data.card);
				this.playStack.push({type:'steal', player_seat:player_seat, play_seat:play_seat, card:data.card, cards:this.inhandCards[player_id].slice(-1)});
			}else if(waiting_cause==='harm'){
				var n = this.inhandCards[play_id].length; //被加害玩家的牌的张数
				this.harmPlayer(this.players[play_seat], data.card);
				this.playStack.push({type:'harm', player_seat:player_seat, play_seat:play_seat, card:data.card, cards:this.outhandCards.slice(-n+1)});
				needFillCards = true;
			}else{
				return err_invalid;
			}
			this.waitingPlay.request = 'selfcard';
		}
		else if(request_type === 'otherseat'){  //指定1个别人的座位
			if(play_seat === player_seat){
				console.log('---- 无效：#%d指定的不是别人的座位 ----', player_seat);
				return err_invalid;
			}
			//case 1 : 指定和谁换牌
			//case 2 : 指定谁出牌
			//case 3 : 指定复活谁
			//return this.specifyOtherSeat(player, data);
			if(waiting_cause==='exchange'){
				this.exchangeCards(player, this.players[play_seat]);
				this.playStack.push({type:'exchange', player_seat:player_seat, play_seat:play_seat, cards1:this.inhandCards[player_id].slice(0), cards2:this.inhandCards[play_id].slice(0)});
			}else if(waiting_cause==='specify'){
				this.specifySeat(player, this.players[play_seat]);
				this.playStack.push({type:'specify', player_seat:player_seat, play_seat:play_seat});
				needFillCards = true;
			}else if(waiting_cause==='relive'){
				targetPlayer = this.players[play_seat];
				if(targetPlayer && this.inhandCards[play_id].length===0){
					this.relivePlayer(targetPlayer);
					this.playStack.push({type:'relive', player_seat:player_seat, play_seat:play_seat, cards:this.inhandCards[play_id].slice(0)});
				}
				needFillCards = true;
			}else{
				return err_invalid;
			}
			this.waitingPlay.request = 'selfcard';
		}
		if(needFillCards){
			var needCount = 5 - mycards.length;
			if(needCount > 0){
				this.addCardsToPlayer(player,needCount);
				this.playStack.push({type:'in', player_seat:player_seat, cards:this.inhandCards[player_id].slice(-needCount)});
			}
		}
		if(this.waitingPlay.request !== 'selfcard'){
			return;
		}
		var nextSeat = cp=='A' ? flag : this.getNextSeat();
		if(nextSeat === null){
			//只有偷牌之后，才可能走到这个分支
			//其他人都死了, 本队获胜
			console.log('-------- playOneCard game is over --------');
			this.winner = team;
			this.gameOver();
			return 'gameOver';
		}
		else{
			this.currSeat = nextSeat;
			//判断下家是否有合适的牌出，如无，则另其死亡，转入再下一家判断
			//轮到下一个出牌的玩家，如果无适合的牌可出，则死亡
			if(this.checkDying()==='gameOver'){
				//有可能出现2队同时都死亡的情况，这种情况算最后有出牌的一方获胜
				console.log('-------- playOneCard game is over after checkDying --------');
				this.winner = team;
				this.gameOver();
				return 'gameOver';
			}
			else{
				return true;
			}
		}
	},
	/* 玩家出牌1张 */
	playOneCard : function (player, data){
		var play_card=data.card;
		var player_id=player.id;
		var i, mycards = this.inhandCards[player_id], seat = this.currSeat, team = this.teams[seat];
		var card = mycards[play_card];
		var cp=card.point, gp=this.point, maxp=99;
		if(cp=='2'||cp=='3'||cp=='5'||cp=='6'||cp=='8'||cp=='9'){
			//2,3,5,6,8,9
			if(+cp+gp>maxp){
				console.log('---- 无效：超出分数，请换一张 ----');
				//玩家出这个牌是无效的，玩家应该改出其他牌
				//玩家必有不死的牌出，因为必死的玩家将在上一步就被自动处理了
				return 'invalid';
			}
		}
		card = mycards.splice(card,1)[0];
		this.outhandCards.push(card);

		this.playStack.length = 0;
		this.playStack.push({type:'out', seat:seat, cards:this.outhandCards.slice(-1)});

		var needFillCards = true; //是否需要补牌

		//A,7,J,Small,Big 需要分2步操作

		switch (cp){
			case 'A':   //指定
				//询问指定谁出牌, flag是座位号
				//需检验，不能指定已死亡的
				//补牌要在指定完成之后再补
				this.waitingPlay.cause = 'specify';
				this.waitingPlay.request = 'otherseat';
				//this.waitingPlay.seat = ;
				break;
			case '4':   //反向
				//反向
				this.direction *= -1;
				this.waitingPlay.request = 'selfcard';
				break;
			case '7':   //换牌, 不补牌
				//询问和谁换牌, 不补牌, flag是座位号
				needFillCards = false;
				this.waitingPlay.cause = 'exchange';
				this.waitingPlay.request = 'otherseat';
				break;
			case '10':  //加减10
				//加减10, flag是+-
				cp=10;
				if(+cp+gp>maxp){
					this.point -= cp;
				}
				else if(-cp+gp<0){
					this.point += cp;
				}
				else{
					this.point += data.sign=='-'?-cp:cp; //加减都可
				}
				this.waitingPlay.request = 'selfcard';
				break;
			case 'J':   //偷牌, 不补牌
				//询问抽谁的一张牌, 不补牌, flag是座位号, flag2是所抽的牌序号
				needFillCards = false;
				this.waitingPlay.cause = 'steal';
				this.waitingPlay.request = 'othercard';
				break;
			case 'Q':   //加减20
				//加减20, flag是+-指定
				cp=20;
				if(+cp+gp>maxp){
					this.point -= cp;
				}
				else if(-cp+gp<0){
					this.point += cp;
				}
				else{
					this.point += data.sign=='-'?-cp:cp; //加减都可
				}
				this.waitingPlay.request = 'selfcard';
				break;
			case 'K':   //加满
				//满分
				this.point = maxp;
				this.waitingPlay.request = 'selfcard';
				break;
			case 'Small': //加害
				//加害，询问将谁只留哪1张, flag是座位号, flag2是所留的牌序号
				//需检验参数是否有效
				this.waitingPlay.cause = 'harm';
				this.waitingPlay.request = 'othercard';
				break;
			case 'Big':   //拯救
				//询问复活谁, flag是座位号
				//如果无人可以复活，则忽略
				this.waitingPlay.cause = 'relive';
				this.waitingPlay.request = 'otherseat';
				break;
			default:      //加
				//2,3,5,6,8,9
				this.point += +cp;
				this.waitingPlay.request = 'selfcard';
		}
		if(true){
			return;
		}
		//反向或加减分的时候，立即补牌，其他情况要等后续操作完成再补牌
		if(this.waitingPlay.request !== 'selfcard'){
			return;
		}
		if(needFillCards){
			var needCount = 5 - mycards.length;
			if(needCount > 0){
				this.addCardsToPlayer(player,needCount);
				this.playStack.push({type:'in', seat:seat, cards:this.inhandCards[player_id].slice(-needCount)});
			}
		}
		var nextSeat = cp=='A' ? flag : this.getNextSeat();
		if(nextSeat === null){
			//只有偷牌之后，才可能走到这个分支
			//其他人都死了, 本队获胜
			console.log('-------- playOneCard game is over --------');
			this.winner = team;
			this.gameOver();
			return 'gameOver';
		}
		else{
			this.currSeat = nextSeat;
			//判断下家是否有合适的牌出，如无，则另其死亡，转入再下一家判断
			//轮到下一个出牌的玩家，如果无适合的牌可出，则死亡
			if(this.checkDying()==='gameOver'){
				//有可能出现2队同时都死亡的情况，这种情况算最后有出牌的一方获胜
				console.log('-------- playOneCard game is over after checkDying --------');
				this.winner = team;
				this.gameOver();
				return 'gameOver';
			}
			else{
				return true;
			}
		}
	},
	/* 结束 */
	gameOver : function (){
		console.log('-------- gameOver --------');
		this.started=false;
		//游戏结束后，出牌情况仍然保留，直到玩家离开或按Ready
	},
	/* 显示 */
	print : function (){
		var s=[],i;
		s.push('<div>底牌'+this.bottomCards.length+'张</div>');
		s.push('<div>已出'+this.outhandCards.length+'张，最后4张:'+this.outhandCards.slice(-4)+'</div>');
		s.push('<div>玩家手上的牌：</div>');
		for(i=0;i<this.players.length;i++){
			s.push('<div>* '+this.players[i].name+' : '+this.inhandCards[this.players[i].id]+'</div>');
		}
		console.log(s.join('\n'));
		//s.push('<div></div>');
	}
};

function test(){
	game = new Game();
	selfPlayer = new Player({name:'igin'});
	var players = [
		selfPlayer,
		new Player({name:'xiaole'}),
		new Player({name:'jerrod'}),
		new Player({name:'othella'})
	];
	var i;
	for(i=0;i<players.length;i++){
		this.addPlayer(players[i], i);
		this.setPlayerReady(players[i],true,null);
	}
	game.start();

	game.print();
	game.playOneCard(selfPlayer,0);
	game.playOneCard(selfPlayer,0);
	game.print();
	game.addCardToPlayer(selfPlayer);
	game.addCardToPlayer(selfPlayer);
	game.print();
}
//test();

if(typeof exports !== 'undefined'){
	exports.Game = Game;
}