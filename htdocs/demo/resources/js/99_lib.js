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
			return this;
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
			return this;
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
		data.deskSize = [110, 100, 600, 280];
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
	Animation.methods.sendBeginingPocker = function(sites, idx, cards, order, callback){
		var ani = Animation,
			data = ani.data,
			elms = ani.elements,
			status = ani.status,
			m = Math,
			pi = Math.PI,
			isSelf = sites[0] === 0,
			pocker = data.pockerPlace[sites[0]][sites[1]],
			fnName = 'sendPocker-' + sites[0] + '-' + sites[1],
			canvas = elms.maincanvas[0],
			ctx = canvas.getContext('2d');
		pocker.i = idx;
		pocker.v = cards;
		timer.addFn(fnName, function(){
			var arrData = isSelf ? [
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
				func = isSelf ? function(a){
					var _a = a;
					ctx.drawImage(pocker.v, _a[0], _a[1], _a[2], _a[3]);
				} : function(a){
					var _a = a;
					ctx.save();
					ctx.translate(_a[0], _a[1]);
					ctx.rotate(_a[2] * pi / 180);
					ctx.drawImage(pocker.v, 0, 0, pocker.w, pocker.h);
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
		}(), 1, pocker.i);	
	};
	
	Animation.methods.sendAndGetPocker = function(sites, card, getcard, callback){
		if(Animation.status.isSendAndGet){
			return;
		}
		var ani = Animation,
			data = ani.data,
			status = ani.status,
			methods = ani.methods,
			elms = ani.elements,
			canvas = elms.maincanvas[0],
			cWidth = canvas.width,
			cHeight = canvas.height,
			ctx=  canvas.getContext('2d'),
			isSelf = sites[0] === 0,
			m = Math,
			ran = m.random,
			pi = m.PI,
			pocker = data.pockerPlace[sites[0]][sites[1]],
			_card_send = !card ? data.pockerList['s2'] : card,
			_card_get = !getcard ? data.pockerList['xb'] : !isSelf ? data.pockerList['xb'] : getcard, 
			_d_send = m.floor(ran() * 90),
			_l_send = m.floor(ran()* 120) + 360,
			_t_send = m.floor(ran() * 80) + 180,
			_arr_send = isSelf ? [
						[pocker.l, _l_send],
						[pocker.t, _t_send],
						[0, _d_send],
						[pocker.w, data.pockerSize[0]],
						[pocker.h, data.pockerSize[1]]
					] : [
						[pocker.l, _l_send],
						[pocker.t, _t_send],
						[pocker.d, _d_send]
					]
			,
			_arr_get = isSelf ? [
						[data.pockerPoint[0], pocker.l],
						[data.pockerPoint[1], pocker.t],
						[data.pockerSize[0], pocker.w],
						[data.pockerSize[1], pocker.h]
					] : [
						[data.pockerPoint[0], pocker.l],
						[data.pockerPoint[1], pocker.t],
						[0, pocker.d]
					]
			,
			_A_send = methods.objectChanges(_arr_send, null, function(){
				status.isSendEnded = true;
				data.pockerSended.push({
					l : _l_send,
					t : _t_send,
					d : _d_send,
					w : data.pockerSize[0],
					h : data.pockerSize[1],
					i : data.pockerSended.length + 1,
					v : _card_send
				});
				_A_get = methods.objectChanges(_arr_get, null, function(){
					status.isSendAndGet = false;
					status.isGetEnded = true;
					pocker.v = _card_get;
				}, 400);
			}, 350),
			_A_get,
			_func_send = isSelf ? function(){
				var a = _A_send();
				ctx.save();
				ctx.translate(a[0], a[1]);
				ctx.rotate(a[2] * pi / 180);
				ctx.drawImage(_card_send, 0, 0, a[3], a[4]);
				ctx.restore();
			} :  function(){
				var a = _A_send();
				ctx.save();
				ctx.translate(a[0], a[1]);
				ctx.rotate(a[2] * pi / 180);
				ctx.drawImage(_card_send, 0, 0, pocker.w, pocker.h);
				ctx.restore();
			},
			_func_get = isSelf ? function(){
				var a = _A_get();
				ctx.drawImage(_card_get, a[0], a[1], a[2], a[3]);
			} : function(){
				var a = _A_get();
				ctx.save();
				ctx.translate(a[0], a[1]);
				ctx.rotate(a[2] * pi / 180);
				ctx.drawImage(_card_get, 0, 0, pocker.w, pocker.h);
				ctx.restore();
			};
			
		status.isSendEnded = false;
		status.isGetEnded = false;
		status.isSendAndGet = true;
		methods.drawCurrentSendPocker(_card_send);	
		timer.addFn('clearDeskTop', function(){
			ctx.clearRect(data.deskSize[0], data.deskSize[1], data.deskSize[2], data.deskSize[3]);
		}, 1, -1).addFn('drawTheLast', function(){
			ctx.drawImage(elms.theLastFrame, 0, 0, cWidth, cHeight);
		}, 1, 0).addFn('send&get', function(){
			if(status.isGetEnded){
				timer.delFn('clearDeskTop').delFn('drawTheLast').delFn('send&get');
			}
			methods.drawDesktopPockers();
			methods.drawSendedPockers(sites, !status.isSendEnded?_func_send:_func_get);
		}, 1, 1);
	};
	
	Animation.methods.drawCurrentSendPocker = function(newPocker){
		var ani = Animation,
			data = ani.data,
			status = ani.status,
			methods = ani.methods,
			elms = ani.elements,
			canvas = elms.maincanvas[0],
			ctx = canvas.getContext('2d'),
			cl = 747,
			ct = 422,
			cw = data.pockerSize[0],
			ch = data.pockerSize[1],
			nl = cl + cw / 4,
			nt = ct + ch / 4,
			nw = cw / 2,
			nh = ch / 2,
			arr_pk = data.pockerSended,
			arr_show = [[nl, cl], [nt, ct], [nw, cw], [nh, ch]],
			arr_hide = [[cl, nl], [ct, nt], [cw, nw], [ch, nh], [1, 0.2]],
			func_show, func_hide,
			action;
		
		if(arr_pk.length === 0){
			func_show = methods.objectChanges(arr_show, null, function(){
				status.isNewPockerShow = true;
			}, 350);
			action = function(){
				var a = func_show();
				ctx.drawImage(newPocker, a[0], a[1], a[2], a[3]);
			};
		}else{
			var	lastPocker = arr_pk[arr_pk.length - 1].v;
			func_hide = methods.objectChanges(arr_hide, null, function(){
				status.isLastPockerHide = true;
				func_show = methods.objectChanges(arr_show, null, function(){
					status.isNewPockerShow = true;
				}, 350);
			}, 350);
			action = function(){
				var a = !status.isLastPockerHide ? func_hide() : func_show();
				if(!status.isLastPockerHide){
					ctx.save();
					ctx.globalAlpha = a[4];
					ctx.drawImage(lastPocker, a[0], a[1], a[2], a[3]);
					ctx.restore();
				}else{
					ctx.drawImage(newPocker, a[0], a[1], a[2], a[3]);
				}
			};
		}
			
		status.isLastPockerHide = false;
		status.isNewPockerShow = false;	
		timer.addFn('clearCurrentSendPocker', function(){
			ctx.clearRect(cl, ct, cw, ch);
		}, 1, 3).addFn('changeCurrentSendPocker', function(){
			if(status.isNewPockerShow){
				timer.delFn('clearCurrentSendPocker').delFn('changeCurrentSendPocker');
			}
			action();
		}, 1, 4);
			
	};
	
	Animation.methods.drawSendedPockers = function(sites, func){
		var ani = Animation,
			data = ani.data,
			status = ani.status,
			methods = ani.methods,
			elms = ani.elements,
			canvas = elms.maincanvas[0],
			ctx = canvas.getContext('2d'),
			m = Math,
			pi = m.PI,
			i, j, ni, nj;
		for(i = -1, ni = data.pockerPlace.length - 1; i++ < ni;){
			for(j = -1, nj = data.pockerPlace[i].length - 1; j++  < nj;){
				if(sites[0] === i && sites[1] === j){
					func();
					continue;
				}
				var _ = data.pockerPlace[i][j];
				if(i === 0){
					ctx.drawImage(_.v, _.l, _.t, _.w, _.h);
				}else{
					if(!_.v){
						continue;
					}
					ctx.save();
					ctx.translate(_.l, _.t);
					ctx.rotate(_.d * pi / 180);
					ctx.drawImage(_.v, 0, 0, _.w, _.h);
					ctx.restore();
				}
			}
		}
	};
	Animation.methods.drawDesktopPockers = function(){
		var ani = Animation,
			data = ani.data,
			status = ani.status,
			methods = ani.methods,
			elms = ani.elements,
			canvas = elms.maincanvas[0],
			ctx = canvas.getContext('2d'),
			m = Math,
			pi = m.PI,
			i = -1, arr = data.pockerSended, ni = arr.length - 1;
		for(; i++ < ni;){
			var _ = arr[i];
			if(!_.v){
				continue;
			}
			ctx.save();
			ctx.translate(_.l, _.t);
			ctx.rotate(_.d * pi / 180);
			ctx.drawImage(_.v, 0, 0, _.w, _.h);
			ctx.restore();
		}	
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
			data.pockerSended = [];
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
				ctx.clearRect(data.deskSize[0], data.deskSize[1], data.deskSize[2], data.deskSize[3]);
			}, 1, -1).addFn('drawTheLast', function(){
				ctx.drawImage(elms.theLastFrame, 0, 0, cWidth, cHeight);
			}, 1, 0);
			rec = setInterval(function(){
				var player = userData[i];
				methods.sendBeginingPocker([player.site, z], idx, data.pockerList['xb'], 'isDrawingObject', (i + 1) % len === 0 && (z + 1 > 4) ? function(){
					timer.delFn('clearDeskTop').delFn('drawTheLast');
					status.isDrawingObject = true;
					function getRan(n){
						return m.floor(m.random() * n);
					}
					var test_n = 0, test_r = setInterval(function(){
						var _r0 = userData[getRan(len)].site,
							_r1 = getRan(5);
						Animation.methods.sendAndGetPocker([_r0, _r1], Animation.data.pockerList[['h','d','s','c'][Math.floor(Math.random()*4)] + (Math.floor(Math.random() * 9) + 1)], Animation.data.pockerList[['h','d','s','c'][Math.floor(Math.random()*4)] + (Math.floor(Math.random()*9) + 1)], null);
						test_n ++;
						if(test_n > 40){
							clearInterval(test_r);
						}
					}, 2000);
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
	};
	
	
	window.Animation = Animation;
})();

(function(){
	
})();
