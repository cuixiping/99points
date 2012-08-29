<!DOCTYPE html>
<html>
	<head>
		<title>Hall</title>
		<meta charset="utf-8" />
		<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
		<link rel="stylesheet" type="text/css" href="resources/css/99_index.css" />
		<script type="text/javascript" src="../lib/poker.min.js"></script>
		<script type="text/javascript" src="resources/js/99_lib.js"></script>
		<script type="text/javascript" src="../lib/jquery.min.js" ></script>
	</head>
	<body>
		<div id="page">
			<div id="header" class="w960 center">&nbsp;</div>
			<div id="content" class="w960 center">
				<div class="clear-fixed">
					<div class="float-left w802 outer position-r">
						<div class="game-container center">
							<div class="main">
								<div class="co">
									<ul>
										<?php for($i = 0, $j = 1; $i < 12; $i++){
										?>
										<li <?php echo($j%2==0?'class="noMarginRight"':'')?>>
											<div class="status f-lock">无人</div>
											<?php for($z = 0; $z < 10; $z++){ ?><a href="javascript:void(0);" class="seats<?php echo($z >= 5 ?'-f':'')?>" actType="seat" nid="<?php echo($i.'-'.$z)?>">
												<span class="img">
													<!--<img src="http://tp2.sinaimg.cn/1884764017/50/5604793857/1" width="40" height="40" alt="jerrod_zhou-hehe123">-->
												</span>
												<span class="status hide">&nbsp;</span></a><?php } ?>
										</li>	
										<?php
											$j++;
										} ?>
									</ul>
								</div>
								<div class="">
									
								</div>
							</div>
							<canvas id="canvas" class="hide center canvas" width="800" height="480" >
								didn't supports canvas
							</canvas>
						</div>
					</div>
				</div>	
			</div>
		</div>
		<script type="text/javascript">
		(function(){
			$('#content .game-container>.main>.co').click(function(e){
				var target = e.target,
					Target = $(target);
				if(target.nodeName === 'A'){
					console.log('yes')
				}
			});
		})();
		</script>
	</body>
</html>				