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
		status : {
			
		},
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
		scenes : {
			begining : {
				sites : {
					
				},
				init : function(){
					
				}
			},
			hall : function(){
				
			}
		}
	};
	window.Animation = Animation;
})();

(function(){
	
})();
