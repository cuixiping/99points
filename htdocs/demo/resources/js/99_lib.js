(function(){
	var timer = {
		addFn : function(name, fn, frames, idx){
			if(!timer.fnList){
				timer.init();
			}
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
		elements : new Object(),
		data : new Object(),
		methods : new Object(),
		scenes : new Object()
	};
	
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
				[205, 115],
				[375, 115],
				[555, 115],
				[635, 175],
				[635, 280],
				[555, 325]
			], i = 0, j = 0, z = 0,
			len = arr.length;
		data.pockerSize = [30, 40];		
		data.pockerPlace = [];
		data.pockerPoint = [(800 - data.pockerSize[0]) / 2 - 100, (480 - data.pockerSize[1]) / 2 + 10];
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
						v : null,
						w : data.pockerSize[0] * 1.2,
						h : data.pockerSize[1] * 1.2,
						s : true
					});
					_x += data.pockerSize[0] * 1.2 + 4;
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
					v : null,
					w : data.pockerSize[0],
					h : data.pockerSize[1],
					s : false
				});
				_x += 10,
				_d += 10,
				z++;
			}
		}
	};
	
	Animation.methods.drawTheLastFrame = function(){
		var ani = Animation,
			data = ani.data,
			elms = ani.elements,
			mainCanvas = elms.maincanvas[0],
			width = mainCanvas.width,
			height = mainCanvas.height;
		if(!elms.theLastFrame){
			var c = document.createElement('canvas');
			c.width = width;
			c.height = height;
			elms.theLastFrame = c;
		}
		elms.theLastFrame.getContext('2d').drawImage(mainCanvas, 0, 0, width, height);	
	};
	
	Animation.methods.createPockers = function(){
		var ani = Animation,
			data = ani.data,
			suits = ['hearts', 'diamonds', 'spades', 'clubs'], 
			points = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
			i = 0, j, pw = data.pockerSize[0], ph = data.pockerSize[1], doc = document;
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
			ctx.drawImage(data.pockerList['xb'], data.pockerPoint[0] - i, data.pockerPoint[1] - i - 1, data.pockerSize[0], data.pockerSize[1]);
		}
	};
	Animation.methods.sendPocker = function(sites, idx, cards, order, callback){
		var ani = Animation,
			data = ani.data,
			elms = ani.elements,
			status = ani.status,
			m = Math,
			pi = Math.PI,
			isUser = sites[0] === 0,
			pocker = data.pockerPlace[sites[0]][sites[1]],
			fnName = 'sendPocker-' + sites[0] + '-' + sites[1],
			canvas = elms.maincanvas[0],
			ctx = canvas.getContext('2d');
		timer.addFn(fnName, function(){
			var arrData = isUser ? [
						[data.pockerPoint[0], pocker.l],
						[data.pockerPoint[1], pocker.t],
						[data.pockerSize[0], pocker.w],
						[data.pockerSize[1], pocker.h]
					] : [
						[data.pockerPoint[0], pocker.l],
						[data.pockerPoint[1], pocker.t],
						[0, pocker.d]
					],
				A = ani.methods.objectChanges(arrData, null, callback ? callback : null, 200),
				func = isUser ? function(a){
					var _a = a;
					ctx.drawImage(cards, _a[0], _a[1], _a[2], _a[3]);
				} : function(a){
					var _a = a;
					ctx.save();
					ctx.translate(_a[0], _a[1]);
					ctx.rotate(_a[2] * pi / 180);
					ctx.drawImage(cards, 0, 0, data.pockerSize[0], data.pockerSize[1]);
					ctx.restore();
				};
			return function(){
				if(status[order]){
					timer.delFn(fnName);
					return;
				}
				var a = A();
				func(a);
			};
		}(), 1, idx || 1);	
	};
	
	Animation.methods.sendAndGetPocker = function(sites, cards, callback){
		var ani = Animation,
			data = ani.data,
			status = ani.status,
			elms = ani.elements,
			methods = ani.methods;
			
	};
	
	Animation.methods.drawSendedPockers = function(){
		
	};
	Animation.methods.drawDesktopPockers = function(){
		
	};
	
	Animation.scenes.begining = function(userData){
		var ani = Animation,
			data = ani.data,
			status = ani.status,
			elms = ani.elements,
			methods = ani.methods,
			m = Math,
			pi = Math.PI,
			canvas = elms.maincanvas[0],
			cWidth = canvas.width,
			cHeight = canvas.height,
			ctx = canvas.getContext('2d');
		if(!data.pockerPlace){
			ani.methods.initPockerPlace();
		}
		if(!data.pockerList){
			ani.methods.createPockers();
		}
		
		ani.methods.createPointPockers();
		
		~function drawBegining(){
			var i = 0,
				z = 0,
				len = userData.length,
				idx = 1,
				rec;
			status.isDrawingObject = false;
			ani.methods.drawTheLastFrame();
			timer.addFn('clearDeskTop', function(){
				ctx.clearRect(0, 0, cWidth, cHeight);
			}, 1, -1);
			timer.addFn('drawTheLast', function(){
				ctx.drawImage(elms.theLastFrame, 0, 0, cWidth, cHeight);
			}, 1, 0);
			rec = setInterval(function(){
				var player = userData[i];
				methods.sendPocker([player.site, z], idx, data.pockerList['xb'], 'isDrawingObject', (i + 1) % len === 0 && (z + 1 > 4) ? function(){
					timer.delFn('clearDeskTop');
					timer.delFn('drawTheLast');
					status.isDrawingObject = true;
				} : null);
				idx ++;
				i ++;
				if(i % len === 0){
					i = 0;
					z ++;
				}
				if(z > 4){
					clearInterval(rec);
				}
			}, 70);
		}();
		
		/*
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
		*/
	};
	
	
	window.Animation = Animation;
})();

(function(){
	
})();
