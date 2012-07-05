/*
 Author: Xiaole Tao (http://xiaole.happylive.org)
 */
var poker = {};
(function() {
	if(window.CanvasRenderingContext2D) {

		poker.enabled = true;

		poker.symbolPath = {
			'hearts' : 'M100,30C60,7 0,7 0,76C0,131 100,190 100,190C100,190 200,131 200,76C200,7 140,7 100,30z',
			'diamonds' : 'M184,100C152,120,120,160,100,200C80,160,48,120,16,100C48,80,80,40,100,0C120,40,152,80,184,100z',
			'spades' : 'M200,120C200,168,144,176,116,156C116,180,116,188,128,200C112,196,88,196,72,200C84,188,84,180,84,156C56,176,0,168,0,120C0,72,60,36,100,0C140,36,200,72,200,120z',
			'clubs' : 'M80,200C92,184,92,160,92,136C76,180,0,176,0,124C0,80,40,76,68,88C80,92,80,88,72,84C44,64,40,0,100,0C160,0,156,64,128,84C120,88,120,92,132,88C160,76,200,80,200,124C200,176,124,180,108,136C108,160,108,184,120,200C100,196,100,196,80,200z',
			'a' : 'M6,200V183H23L58,0H78L117,183H131V200H85V183H97L92,156H46L42,183H54V200H6zM88,135L68,37L49,135H88z',
			'2' : 'M10,200L11,187C15,149,23,136,70,97C93,78,100,68,101,57C104,31,81,23,65,23C46,22,23,34,35,62L12,68C8,43,12,18,33,8C61,-6,96,-1,115,21C127,36,129,56,123,72C104,113,39,131,35,179H105V152H127V200L10,200z',
			'3' : 'M2,156L18,145C31,167,47,181,70,178C104,176,119,140,112,113C105,89,76,77,53,90C47,93,43,96,41,96C39,96,33,85,34,82C50,59,87,21,87,21H28V47H6V0H120V16C120,16,90,48,80,64C104,65,125,81,132,105C136,118,135,148,129,160C119,182,94,199,71,200C33,202,12,176,2,156L2,156z',
			'4' : 'M70,200L70,183L86,183L86,153L5,153L5,133L93,0L107,0L107,133L132,133L132,153L107,153L107,183L120,183L120,200zM86,49L30,133L86,133z',
			'5' : 'M4,148L24,148C28,160,37,173,48,176C80,183,101,166,108,144C116,120,107,84,85,71C67,61,40,70,27,92L13,83L20,0H112V20H37L37,55C52,44,77,44,93,52C123,66,137,98,131,137C123,175,105,197,64,200C20,201,4,170,4,148L4,148z',
			'6' : 'M8,139C6,122,6,78,8,65C15,26,30,7,55,2C81,-4,116,3,124,35L103,36C91,14,60,15,46,29C34,37,28,68,30,70C30,70,50,55,73,55C120,55,132,94,130,127C129,167,116,198,73,200C31,198,12,177,8,139zM110,128C111,101,98,80,73,77C50,76,26,99,27,127C29,155,40,179,69,179C101,179,110,147,110,128z',
			'7' : 'M37,200C50,131,65,79,102,22H26V46H6V0H117L131,22C91,64,54,202,61,200H37z',
			'8' : 'M2,142C3,115,13,105,32,90C17,79,10,63,12,50C15,17,41,0,69,0C98,1,123,24,125,48C127,69,120,79,105,90C123,105,135,115,135,141C134,168,111,199,71,200C31,201,1,168,2,142L2,142zM113,142C115,117,93,101,69,101C45,101,23,121,23,143C23,166,51,178,69,178C91,178,112,163,113,142L113,142zM105,55C106,34,87,20,67,21C50,21,31,34,31,51C31,72,52,83,70,83C86,84,105,71,105,55L105,55z',
			'9' : 'MM11,161L30,156C37,174,52,180,67,178C94,176,102,146,104,120C94,131,78,137,64,136C21,134,10,100,10,65C9,35,21,13,43,3C55,-1,81,-1,92,4C118,18,128,42,126,98C126,144,117,198,66,200C36,204,14,181,11,161L11,161zM85,111C94,105,98,100,102,92C106,86,106,83,106,69C103,36,86,17,60,21C44,23,36,31,33,46C24,73,35,105,55,112C63,116,78,115,85,111L85,111z',
			'10' : 'M6,200V0H26V200H6M85,0C66,0,50,17,50,39V162C50,183,66,200,85,200H96C115,200,130,183,130,162V39C130,17,115,0,96,0H85M90,19C102,19,110,28,110,38V163C110,174,102,183,90,183C79,183,70,174,70,163V38C70,28,79,19,90,19L90,19z',
			'j' : 'M68,0V21H88C88,21,89,41,89,84C89,126,90,146,88,158C81,185,40,185,32,166C27,155,28,146,28,134H6C6,134,6,140,6,147C6,178,17,193,41,198C65,204,95,194,105,174C111,162,111,161,111,89C111,41,111,21,111,21H130V0H68z',
			'q' : 'M24,134L6,134L6,112L24,112C24,112,24,60,24,40C24,18,40,0,66,0C92,0,110,18,110,40C110,62,111,148,110,155C110,168,108,170,108,171C110,176,130,178,130,177L130,199C115,201,109,199,96,190C88,198,65,205,46,196C32,190,24,174,24,134zM81,174C73,162,58,145,44,140C44,156,46,165,51,171C59,181,71,183,81,174zM66,22C50,22,44,30,44,70C44,94,44,116,44,116C67,123,90,150,90,150L90,70C90,30,82,22,66,22z',
			'k' : 'M76,180L96,180L64,106L40,142L40,180L56,180L56,200L0,200L0,180L20,180L20,20L0,20L0,0L56,0L56,20L40,20L40,100L92.0636,19.841L76,20L76,0L136,0L136,20L120,20L76,88L116,180L136,180L136,200L76,200z',
			'crown' : 'M 44,60 C 45,56 -3,33 0,70 C 2,107 39,146 48,150 C 57,154 12,107 12,77 C 12,45 43,65 44,60 M 37,65 C 31,64 20,60 19,81 C 19,100 63,158 65,149 C 65,139 33,102 37,65 M 86,56 C 87,52 38,28 40,66 C 43,103 69,141 78,148 C 86,155 54,102 54,71 C 54,39 86,60 86,56 M 82,65 C 77,64 59,54 59,74 C 60,95 82,146 84,138 C 86,132 78,102 82,65 M 154,60 C 153,56 203,33 200,70 C 197,107 159,146 151,150 C 142,154 187,107 187,77 C 187,45 155,65 154,60 M 161,65 C 167,64 179,60 180,81 C 181,100 137,158 135,149 C 134,139 165,102 161,65 M 113,56 C 112,52 161,28 158,66 C 155,103 130,141 122,148 C 114,155 145,102 145,71 C 145,39 114,60 113,56 M 117,65 C 123,64 141,54 141,74 C 140,95 118,146 116,138 C 114,132 121,102 117,65 z',
			'nine' : 'M157,89C159,188 80,211 16,196L23,160C62,172 100,167 107,119C93,127 83,133 62,132C28,133 0,113 0,70C0,25 37,0 78,0C137,0 157,41 157,89M105,56C100,42 92,34 77,33C59,33 49,49 49,69C52,101 83,104 107,95C107,82 108,66 105,56z',
			'joker' : 'M141,0L181,0C168,55 161,150 129,183C91,219 15,198 21,141L60,137C58,157 62,166 81,166C102,165 110,143 115,118M6,378C6,306 53,256 119,256C197,256 213,346 187,398C164,438 130,458 88,459C39,458 7,422 6,378M47,377C49,406 67,425 93,425C168,423 182,292 115,290C69,294 47,338 47,377M0,714L42,518L84,518L66,601L159,518L215,518L124,595L191,714L144,714L94,621L55,654L42,714M8,973L50,777L200,777L193,809L85,809L75,854L180,854L173,887L68,887L56,940L173,940L166,973M43,1231L1,1231L44,1035L133,1035C170,1037 197,1051 198,1087C195,1127 169,1143 136,1148C158,1171 171,1206 182,1231L137,1231C116,1182 112,1150 60,1150M67,1121C96,1121 155,1126 156,1087C151,1061 100,1068 78,1068z'
		};

		/*
		 -----------
		 画圆角矩形
		 -----------
		 x,y 左上角坐标，缺省值0,0
		 w,h 宽高
		 r 圆角半径
		 dir 圆角反向，缺省false
		 例：
		 canvas.fillRoundRect(0,0,200,200,30);
		 canvas.fillRoundRect(50,50,100,100,30,true);
		 */
		CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r, dir) {
			x = x || 0;
			y = y || 0;
			w = w || 200;
			h = h || 200;
			r = r || 20;

			this.beginPath();
			if(!dir) {
				this.moveTo(x + r, y);
				this.lineTo(x + w - r, y);
				this.arc(x + w - r, y + r, r, (Math.PI / 180) * 270, 0);
				this.lineTo(x + w, y + h - r);
				this.arc(x + w - r, y + h - r, r, 0, (Math.PI / 2));
				this.lineTo(x + r, y + h);
				this.arc(x + r, y + h - r, r, (Math.PI / 2), Math.PI);
				this.lineTo(x, y + r);
				this.arc(x + r, y + r, r, Math.PI, (Math.PI / 180) * 270);
			} else {
				this.moveTo(x, y + r);
				this.lineTo(x, y + h - r);
				this.arc(x, y + h, r, (Math.PI / 180) * 270, 0);
				this.lineTo(x + w - r, y + h);
				this.arc(x + w, y + h, r, Math.PI, (Math.PI / 180) * 270);
				this.lineTo(x + w, y + r);
				this.arc(x + w, y, r, Math.PI / 2, Math.PI);
				this.lineTo(x + r, y);
				this.arc(x, y, r, 0, Math.PI / 2);
			}
			this.closePath();
		};
		CanvasRenderingContext2D.prototype.strokeRoundRect = function(x, y, w, h, r, dir) {
			this.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, r, dir);
			this.stroke();
		};
		CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, r, dir) {
			this.roundRect(x, y, w, h, r, dir);
			this.fill();
		};

		/*
		 -----------
		 画SVG曲线
		 -----------
		 svgPath svg的path方法的d属性值，目前只支持绝对坐标和非连续命令。由于Canvas里没有对应的方法，svgPath里的AQ和T不支持。
		 x,y 左上角坐标，缺省值0,0
		 size 尺寸，使用时需要预在svg软件里把svgPath置于0,0，宽高中较大值为200时复制d属性值
		 例：（画一个心形）
		 canvas.svgCurve('M100,30C60,7 0,7 0,76C0,131 100,190 100,190C100,190 200,131 200,76C200,7 140,7 100,30z',0,0,200));
		 */
		CanvasRenderingContext2D.prototype.svgCurve = function(svgPath, x, y, size) {
			var ax, ay, rx, ry, px, py, pn, pa, sa;
			//relative x,y / previous x,y / path number / path array / svgpath array

			ax = function(n) {
				return ( px = x + n * size / 200);
			};
			ay = function(n) {
				return ( py = y + n * size / 200);
			};
			sa = svgPath.replace(/ *([MmZzLlHhVvCcSsQqTtAa]) */g, '|$1,').replace(/^\||\|[zZ],/g, '').split(/\|/);

			this.beginPath();
			for(pn in sa) {
				pa = sa[pn].split(/[, ]/);
				(pa[0] === 'M') ? (this.moveTo(ax(pa[1]), ay(pa[2]))) : 
				(pa[0] === 'L') ? (this.lineTo(ax(pa[1]), ay(pa[2]))) : 
				(pa[0] === 'H') ? (this.lineTo(ax(pa[1]), ry)) : 
				(pa[0] === 'V') ? (this.lineTo(rx, ay(pa[1]))) : 
				(pa[0] === 'C') ? (this.bezierCurveTo(ax(pa[1]), ay(pa[2]), ax(pa[3]), ay(pa[4]), ax(pa[5]), ay(pa[6]))) : 
				(pa[0] === 'Q') && (this.quadraticCurveTo(ax(pa[1]), ay(pa[2]), ax(pa[3]), ay(pa[4])));
				rx = px;
				ry = py;
			}
			this.closePath();
		};

		/*
		 -----------
		 画扑克符号
		 -----------
		 symbol 符号名称：
		 'hearts','diamonds','spades','clubs' 红心，方块，黑桃，草花
		 'a','2','3','4','5','6','7','8','9','10','j','q','k' A-K 13张片点
		 'joker' 大写JOKER字样
		 'crown' 皇冠的一部分（用于拼Joker的图案）
		 'nine' 粗胖的9字
		 x,y 左上角坐标，缺省值0,0
		 size 符号高或宽里的较大值，缺省为200
		 例：
		 canvas.fillPokerSymbol('hearts',0,0,200);
		 */
		CanvasRenderingContext2D.prototype.drawPokerSymbol = function(symbol, x, y, size) {
			x = x || 0;
			y = y || 0;
			size = size || 200;
			symbol = (symbol || 'hearts').toLowerCase();
			((poker.symbolPath[symbol]) && this.svgCurve(poker.symbolPath[symbol], x, y, size));
		};
		CanvasRenderingContext2D.prototype.strokePokerSymbol = function(symbol, x, y, size) {
			this.drawPokerSymbol(symbol, x + 0.5, y + 0.5, size - 1);
			this.stroke();
		};
		CanvasRenderingContext2D.prototype.fillPokerSymbol = function(symbol, x, y, size) {
			this.drawPokerSymbol(symbol, x, y, size);
			this.fill();
		};

		/*
		 -----------
		 画空白牌
		 -----------
		 canvas.drawEmptyCard(x,y,size,[c1],[c2])
		 x,y 左上角坐标，缺省值0,0
		 size 牌高，缺省200
		 c1,c2 牌的渐变颜色，缺省值为c1='#a22',c2='#b55'
		 例：
		 canvas.drawEmptyCard(0,0,200);
		 */
		CanvasRenderingContext2D.prototype.drawEmptyCard = function(x, y, size, c1, c2) {
			var ax, ay, as, fillLinGrad;
			
			x = x || 0;
			y = y || 0;
			size = size || 200;
			c1 = c1 || '#a22';
			c2 = c2 || '#b55';
			
			ax = function(n) {
				return x + n * size / 200;
			};
			ay = function(n) {
				return y + n * size / 200;
			};
			as = function(n) {
				return n * size / 200;
			};
			
			fillLinGrad = this.createLinearGradient(ax(5), ay(5), ax(55), ay(200));
			fillLinGrad.addColorStop(0, '#ffffff');
			fillLinGrad.addColorStop(1, '#e0e0e0');

			this.fillStyle = fillLinGrad;
			this.fillRoundRect(ax(0), ay(0), as(150), as(200), as(16));
			this.strokeStyle = '#666';
			this.strokeRoundRect(ax(0), ay(0), as(150), as(200), as(16));
		};

		/*
		 -----------
		 画皇冠
		 -----------
		 x,y 左上角坐标，缺省值0,0
		 size 牌高，缺省200
		 c1,c2 皇冠的渐变颜色，缺省值为c1='#fdf98b',c2='#e7bd4f'
		 c3 中间宝石的填充色，缺省值为c3='#fff'
		 例：
		 canvas.drawPokerCrown(0,0,200);
		 */
		CanvasRenderingContext2D.prototype.drawPokerCrown = function(x, y, size, c1, c2, c3) {
			var ax, ay, as, fillLinGrad;
			
			x = x || 0;
			y = y || 0;
			size = size || 200;
			c1 = c1 || '#fdf98b';
			c2 = c2 || '#e7bd4f';
			c3 = c3 || '#fff';
			
			ax = function(n) {
				return x + n * size / 200;
			};
			ay = function(n) {
				return y + n * size / 200;
			};
			as = function(n) {
				return n * size / 200;
			};
			
			fillLinGrad = this.createLinearGradient(ax(5), ay(5), ax(100), ay(200));
			fillLinGrad.addColorStop(0, c1);
			fillLinGrad.addColorStop(1, c2);

			this.fillStyle = fillLinGrad;
			this.fillPokerSymbol('crown', ax(0), ay(0), as(200));
			this.fillRoundRect(ax(88), ay(42), as(23), as(110), as(12));
			this.fillPokerSymbol('spades', ax(86), ay(18), as(27));
			this.fillRoundRect(ax(40), ay(150), as(120), as(24), as(10));
			this.fillStyle = c3;
			this.fillPokerSymbol('diamonds', ax(92), ay(26), as(15));
			this.fillPokerSymbol('hearts', ax(93), ay(60), as(13));
			this.fillPokerSymbol('hearts', ax(93), ay(80), as(13));
			this.fillPokerSymbol('hearts', ax(93), ay(100), as(13));
			this.fillPokerSymbol('hearts', ax(93), ay(120), as(13));
			this.fillPokerSymbol('hearts', ax(93), ay(155), as(13));
			this.fillPokerSymbol('hearts', ax(73), ay(155), as(13));
			this.fillPokerSymbol('hearts', ax(53), ay(155), as(13));
			this.fillPokerSymbol('hearts', ax(113), ay(155), as(13));
			this.fillPokerSymbol('hearts', ax(133), ay(155), as(13));
		};

		/*
		 -----------
		 画牌背
		 -----------
		 x,y 左上角坐标，缺省值0,0
		 size 牌高，宽高比固定为3:4，缺省值200
		 color1 深色，缺省值'#a22'
		 color2 浅色，缺省值'#b55'
		 例：
		 canvas.drawPokerBack(10,10,300,'#a22','#b55')
		 canvas.drawPokerBack(375,400,100,'#2E319C','#7A7BB8');
		 */
		CanvasRenderingContext2D.prototype.drawPokerBack = function(x, y, size, c1, c2) {
			var ax, ay, as;
			
			x = x || 0;
			y = y || 0;
			size = size || 200;
			c1 = c1 || '#a22';
			c2 = c2 || '#b55';
			
			ax = function(n) {
				return x + n * size / 200;
			};
			ay = function(n) {
				return y + n * size / 200;
			};
			as = function(n) {
				return n * size / 200;
			};

			this.drawEmptyCard(x, y, size, c1, c2);

			this.fillStyle = c1;
			this.fillRoundRect(ax(10), ay(10), as(130), as(180), as(8));
			this.strokeStyle = c2;
			this.strokeRoundRect(ax(18), ay(18), as(114), as(164), as(4));
			this.fillStyle = c2;
			this.fillRoundRect(ax(26), ay(26), as(96), as(148), as(24), true);

			this.fillPokerSymbol('spades', ax(24), ay(24), as(20));
			this.fillPokerSymbol('spades', ax(106), ay(24), as(20));
			this.fillPokerSymbol('spades', ax(44), ay(176), as(-20));
			this.fillPokerSymbol('spades', ax(126), ay(176), as(-20));
			this.fillStyle = c1;
			this.fillRoundRect(ax(50), ay(40), as(50), as(120), as(24));
			this.fillPokerSymbol('spades', ax(32), ay(54), as(86));
			this.fillPokerSymbol('spades', ax(30), ay(60), as(16));
			this.fillPokerSymbol('spades', ax(104), ay(60), as(16));
			this.fillPokerSymbol('spades', ax(30), ay(128), as(16));
			this.fillPokerSymbol('spades', ax(104), ay(128), as(16));
			this.strokePokerSymbol('spades', ax(31), ay(53), as(88));
			this.fillStyle = c2;
			this.fillPokerSymbol('nine', ax(47), ay(80), as(35));
			this.fillPokerSymbol('nine', ax(77), ay(80), as(35));
		};

		/*
		 -----------
		 画牌面
		 -----------
		 x,y 左上角坐标，缺省值0,0
		 size 牌高，宽高比固定为3:4，缺省值200
		 suit 花色，用于JOKER时，红花色表示大王，黑花色表示小王。hearts,diamonds,spades,clubs
		 point 牌面点。A,2,3,4,5,6,7,8,9,10,J,Q,K,JOKER
		 例：
		 canvas.drawPokerCard(0,400,100,'hearts','joker');
		 canvas.drawPokerCard(0,400,100,'hearts','Q');
		 */
		CanvasRenderingContext2D.prototype.drawPokerCard = function(x, y, size, suit, point) {
			var ax, ay, as;
			
			x = x || 0;
			y = y || 0;
			size = size || 200;
			suit = (suit || 'hearts').toLowerCase();
			point = (point || 'joker').toLowerCase();
			
			ax = function(n) {
				return x + n * size / 200;
			};
			ay = function(n) {
				return y + n * size / 200;
			};
			as = function(n) {
				return n * size / 200;
			};

			this.drawEmptyCard(ax(0), ay(0), as(200));
			this.fillStyle = (suit === 'hearts' || suit === 'diamonds') ? '#a22' : '#000';
			if(point !== 'joker') {
				this.fillPokerSymbol(suit, ax(40), ay(65), as(70));
				this.fillPokerSymbol(point, ax(10), ay(10), as(30));
				this.fillPokerSymbol(suit, ax(11), ay(45), as(19));
				this.fillPokerSymbol(point, ax(140), ay(190), as(-30));
				this.fillPokerSymbol(suit, ax(139), ay(155), as(-19));
			} else {
				this.fillPokerSymbol('joker', ax(11), ay(10), as(18));
				this.fillPokerSymbol('joker', ax(139), ay(190), as(-18));
				if(suit === 'hearts' || suit === 'diamonds') {
					this.drawPokerCrown(ax(38), ay(63), as(74), '#b55', '#a22');
					this.drawPokerCrown(ax(40), ay(65), as(70), '#fdf98b', '#e7bd4f', '#a22');
				} else {
					this.drawPokerCrown(ax(38), ay(63), as(74), '#000', '#000');
					this.drawPokerCrown(ax(40), ay(65), as(70), '#eee', '#888', '#333');
				}
			}
		};
	} else {
		poker.enabled = false;
	}
})();
