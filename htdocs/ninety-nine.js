
function Player(a){
	this.name=a.name;
	this.id=a.id||a.name;
	this.die=false;
	//this.seat=0;
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
	this.points=0;
	this.direction=1;
	this.players=[];
	this.inhandCards={};
	this.bottomCards=[];
	this.outhandCards=[];
	this.initCards();
}
Game.prototype = {
	/* 玩家出牌1张 */
	initCards : function (){
		for(var i=0,arr=[];i<54;i++){
			arr[i]=i;
		}
		for(i=0;i<54;i++){
			var rnd = Math.random()*54|0;
			var t = arr[i];
			arr[i]=arr[rnd];
			arr[rnd]=t;
		}
		var suits=['Hearts','Diamonds','Spades','Clubs'],
			points=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
		for(i=0;i<54;i++){
			var v=arr[i], suit,point;
			if(v<52){
				suit = suits[v/13|0];
				point = points[v%13];
			}
			else if(v==52){
				suit = 'Joker';
				point = 'Small';
			}
			else if(v==53){
				suit = 'Joker';
				point = 'Big';
			}
			this.bottomCards.push(new Card(suit,point));
		}
	},
	/* 玩家入座 */
	addPlayer : function (player){
		player.seat=this.players.length;
		this.players.push(player);
		this.players[player.id]=player;
		this.inhandCards[player.id]=[];
	},
	/* 玩家摸牌1张 */
	addCardToPlayer : function (player){
		this.inhandCards[player.id].push(this.bottomCards.pop());
	},
	/* 玩家从另一玩家抽牌1张 */
	moveCardFromTo : function (i,fromPlayer,toPlayer){
		var cards = this.inhandCards[fromPlayer.id];
		this.inhandCards[toPlayer.id].push( cards.splice(i,1)[0] );
	},
	/* 玩家互相换牌 */
	exchangeCards : function (player1,player2){
		var cards1 = this.inhandCards[player1.id];
		this.inhandCards[player1.id] = this.inhandCards[player2.id];
		this.inhandCards[player2.id] = cards1;
	},
	/* 玩家只留1张 */
	playerOnlyOneCard : function (i,player){
		var cards = this.inhandCards[player.id];
		var card = cards.splice(i,1)[0];
		Array.unshift.apply(this.outhandCards, cards.splice(0));
		cards.push(card);
	},
	/* 复活 */
	relivePlayer : function (player){
		Array.push.apply(this.inhandCards[player.id], this.bottomCards.splice(-5));
	},
	/* 玩家出牌1张 */
	playOneCard : function (card,player){
		var cards = this.inhandCards[player.id];
		if(typeof card=='number'){
			card = cards.splice(card,1)[0];
		}else{
			for(var i=0;i<cards.length;i++){
				if(cards[i]==card){
					cards.splice(i,1)[0];
					break;
				}
			}
		}
		var cp=card.point, gp=this.point;
		if(cp=='A'){
			//询问指定谁出牌
			//补牌
		}
		else if(cp=='4'){
			//反向
			this.direction *= -1;
			//补牌
		}
		else if(cp=='7'){
			//询问和谁换牌, 不补牌
		}
		else if(cp=='10'){
			//加减10
			if(+cp+gp>99){
				this.point -= cp;
			}
			else{
				this.point += cp; //询问是加还是减
			}
			//补牌
		}
		else if(cp=='J'){
			//询问抽谁的一张牌, 不补牌
		}
		else if(cp=='Q'){
			//加减20
			if(+20+gp>99){
				this.point -= 20;
			}
			else{
				this.point += 20; //询问是加还是减
			}
			//补牌
		}
		else if(cp=='K'){
			//满分
			this.point = 99;
			//补牌
		}
		else if(cp=='Small'){
			//加害，询问将谁只留哪1张
			//补牌
		}
		else if(cp=='Big'){
			//询问复活谁
			//补牌
		}
		else{
			//2,3,5,6,8,9
			if(+cp+gp>99){
				alert('这张打出去就超出99分了！');
			}
			//补牌
		}
		return this.outhandCards.push(card);
	},
	/* 从玩家手牌中拿走1张 */
	removeCardFromPlayer : function (card,player){
		var cards = this.inhandCards[player.id];
		if(typeof card=='number'){
			return cards.splice(card,1)[0];
		}
		for(var i=0;i<cards.length;i++){
			if(cards[i]==card){
				return cards.splice(i,1)[0];
			}
		}
	},
	/* 显示 */
	print : function (){
		var s=[];
		s.push('<div>底牌'+this.bottomCards.length+'张</div>');
		s.push('<div>已出'+this.outhandCards.length+'张，最后4张:'+this.outhandCards.slice(-4)+'</div>');
		s.push('<div>玩家手上的牌：</div>');
		for(var i=0;i<this.players.length;i++){
			s.push('<div>* '+this.players[i].name+' : '+this.inhandCards[this.players[i].id]+'</div>');
		}
		console.log(s.join('\n'));
		//s.push('<div></div>');
	}
};

function test(){
	game = new Game();
	selfPlayer = new Player({name:'igin'});
	game.addPlayer(selfPlayer);
	game.addPlayer(new Player({name:'xiaole'}));
	game.addPlayer(new Player({name:'jerrod'}));
	game.addPlayer(new Player({name:'othella'}));
	for(var i=0;i<game.players.length;i++){
		for(var j=0;j<5;j++){
			game.addCardToPlayer(game.players[i]);
		}
	}

	game.print();
	game.playOneCard(0,game.players['igin']);
	game.playOneCard(0,game.players['igin']);
	game.print();
	game.addCardToPlayer(game.players['igin']);
	game.addCardToPlayer(game.players['igin']);
	game.print();
}
test();
