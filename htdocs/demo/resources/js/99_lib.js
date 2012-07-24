(function(){
	var timer = {
		addFn : function(name, fn, frames, idx){
			var P = this, arr = P.fnList,
				isEmpty = arr.length == 0,
				find,
				i,
				len;
			function _push(){
				arr.push({
					name : name,
					idx : idx || 0,
					fn : fn,
					time : 0,
					frames : frames
				});
			}
			if(isEmpty){
				_push();
			}else{
				find = false;
				i = -1;
				len = arr.length - 1;
				for(;i ++ < len;){
					if(arr[i].name == name){
						find = true;
						break;
					}
				}
				if(!find){
					_push();
				}
			}
			if(idx){
				arr.sort(function(a, b){
					a.time = b.time = 0;
					return a.idx - b.idx;
				});
			}
		},
		delFn : function(name){
			var i = -1,
				arr = this.fnList,
				len = arr.length - 1;
			for(; i++ < len;){
				if(arr[i].name === name){
					arr.splice(i, 1);
					break;
				}
			}
		},
		status : {
			hadInit : false
		},
		init : function(){
			var P = this,
				arr, rec;
			if(P.status.hadInit){
				return;
			}
			P.status.hadInit = true;
			P.stop = false;
			P.del = false;
			P.fnList = [];
			arr = P.fnList;
			function itWorks(){
				var i = -1, len = arr.length - 1;
				if(len == -1){
					return;
				}
				for(;i++ < len;){
					var he = arr[i];
					if(he && he.fn){
						he.time++;
						he.time == he.frames && (he.time = 0, he.fn());
					}
				}
			}
			rec = setInterval(function(){
				if(P.stop) return;
				if(P.del) clearInterval(rec);
				itWorks();
			}, 40);
		}
	};
	window.timer = timer;		
})();

(function(){
	/*
	 * Animation 是一个类. 里面包含很多动作.
	 */
	var Animation = {
		status : new Object(),
		methods : {
			sendPocker : function(site){
				var ani = Animation;
				
			},
			getPocker : function(site, pocker){
				
			},
			touchOnPocker : function(){
				
			},
			touchOutPocker : function(){
				
			},
			findPocker : function(){
				
			},
			dealPocker : function(){
				
			}
		},
		scenes : new Object()
	};
	
	Animation.elements = new Object();
	Animation.data = new Object();
	Animation.data.pockersSended = [];
	Animation.methods.objectChanges = function(a, doing, callback, speed){
		var sTime = +new Date(), p, speed = speed || 300;
		function c(m0, m1, p){
			return m0 + (m1 - m0) * ((-Math.cos(p * Math.PI) / 2) + 0.5);
		}
		return function(){
			p = (+new Date() - sTime) / speed;
			var _a = [], i, len;
			if(p >= 1){
				for(var i = -1, len = a.length - 1; i++ < len;){
					_a.push(a[i][1]);
				}
				callback && callback(_a);
				return _a;
			}
			for(i = -1, len = a.length - 1; i++ < len;){
				_a.push(c(a[i][0],a[i][1],p));
			}
			doing && doing(_a);
			return _a;
		};
	};
	Animation.methods.initPockerPlace = function(){
		var ani = Animation,
			data = ani.data,
			arr = [
				[375, 325],
				[205, 325],
				[135, 280],
				[135, 175],
				[205, 125],
				[375, 125],
				[555, 125],
				[635, 175],
				[635, 280],
				[555, 325]
			], i = 0, j = 0, z = 0,
			len = arr.length;
		data.pockerPlace = [];
		data.pockerPoint = [(800 - 30) / 2 - 100, (480 - 40) / 2 + 10];	
		for(; i < len; i++){
			data.pockerPlace[i] = [];
			var _a = data.pockerPlace[i],
				_x = arr[i][0],
				_y = arr[i][1], _d = 0;
			if(_x === 375 && _y === 325){
				_x = 305;
				_y = 315;
				for(j = 0; j < 5; j++){
					_a.push({
						l : _x,
						t : _y,
						d : 0,
						i : z,
						w : 30 * 1.2,
						h : 40 * 1.2,
						s : true
					});
					_x += 30 * 1.2 + 4;
					z++;
				}
				continue;
			}
			for(j = 0; j < 5; j++){
				_a.push({
					l : _x,
					t : _y,
					d : _d,
					i : z,
					w : 30,
					h : 40,
					s : false
				});
				_x += 10,
				_d += 10,
				z++;
			}
		}
	};
	
	Animation.methods.createPockers = function(){
		var ani = Animation,
			data = ani.data,
			suits = ['hearts', 'diamonds', 'spades', 'clubs'], 
			points = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
			i = 0, j, pw = 30, ph = 40, doc = document;
		data.pockerList	= new Object();
		for(; i < suits.length; i++){
			for(j = 0; j < points.length; j++){
				var c = doc.createElement('canvas'), thisname = suits[i].slice(0, 1) + points[j];
				c.width = pw * 1.8;
				c.height = ph * 1.8;
				c.getContext('2d').drawPokerCard(0, 0, c.height, suits[i], points[j]);
				data.pockerList[thisname] = c;
			}
		}
		~function drawBg(){
			var c = doc.createElement('canvas');
				c.width = pw * 1.5;
				c.height = ph * 1.5;
			c.getContext('2d').drawPokerBack(0, 0, c.height, '#535550', '#90928C');	
			data.pockerList['xb'] = c;
		}();
	};
	Animation.methods.createPointPockers = function(){
		var ani = Animation,
			data = ani.data,
			elms = ani.elements,
			canvas = elms.maincanvas[0],
			ctx = canvas.getContext('2d');
		var i = 0,
			len = 5;
		for(; i  < len; i++){
			ctx.drawPokerBack(data.pockerPoint[0] - i, data.pockerPoint[1] - i - 1 , 40, '#535550', '#90928C');
		}	
	}
	
	Animation.scenes.begining = function(userData){
		var ani = Animation,
			data = ani.data,
			m = Math,
			pi = Math.PI;
		if(!data.pockerPlace){
			ani.methods.initPockerPlace();
		}
		if(!data.pockerList){
			ani.methods.createPockers();
		}
		
		ani.methods.createPointPockers();
		~function drawBegining(){
			var i = 0,
				len = userData.length,
				rec;
				
		}();
		for(var i = 0, 
				canvas = $('#canvas')[0],
				ctx = canvas.getContext('2d'); i < data.pockerPlace.length; i++){
			for(var j = 0,
					arr = data.pockerPlace[i],
					len = arr.length; j < len; j++){
				var _ = arr[j];
				if(_.s) {
					ctx.drawImage(data.pockerList['xb'], _.l, _.t, _.w, _.h);
				} else {
					ctx.save();
					ctx.translate(_.l, _.t);
					ctx.rotate(_.d * pi / 180);
					ctx.drawImage(data.pockerList['xb'], 0, 0, _.w, _.h);
					ctx.restore();
				}		
			}		
		}
	};
	
	
	window.Animation = Animation;
})();

(function(){
	
})();
