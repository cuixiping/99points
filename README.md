99points
========

99points is a multi-player online card game developed by html5 and javascript.

![screenshot01](http://cuixiping.github.com/99points/images/screenshot01.jpg)

#“99分”html5游戏项目简介：
* 在浏览器里玩的多人99分扑克牌游戏；
* 代码分前后端两部分，都使用Javascript构建；
* 前端代码基于HTML5 Canvas；
* 服务器端代码使用Node.Js + Socket.io + Node.static构建；
* 前后端都开源。

  目前正在开发中，可能无法完整运行。

  依赖的第三方库有Node.Js, Socket.io, Node.static, 请自行下载安装。

#主创人员
* [Igin] (https://github.com/cuixiping)
* [Xiaole] (https://github.com/Tairraos)
* [Jerrod] (https://github.com/hehe123)

#游戏规则介绍

##游戏过程
* 游戏至少2人参与，可以分成两组对战或各自单战；
* 游戏时每个玩家抓5张牌，然后轮流出牌，剩下的牌为底牌；
* 打出的如果是功能牌，则执行相应的功能；
* 打出的如果是分数牌，则分值计入分数池累积。
* 分数池分值上限为99分；
* 除4，J外，其余牌打出后可以再补一张牌；

##牌面
* 4/7/10/J/Q/K/A/小王/大王是“功能牌”；
* 其他的牌都是“分数牌”，牌面数值即代表分值。
* 根据人数多少使用一到两副扑克牌；
* 牌面不分花色；

##出局
* 如果某玩家出牌后使分数池分值大于99分，则该人丢弃手中全部牌并出局。
* 如果某玩家出牌后手上无牌，则出局。

##功能牌
* 4： 转换出牌方向（顺时针变逆时针，逆时针变顺时针）；
* 7： 和指定的某人交换手头的全部牌，操作结束不补牌；
* 10：可以选择让分数池分值减10分或加10分；
* J： 从其它玩家手中抽一张牌给自己，操作结束不补牌；
* Q： 可以选择让分数池分值减20分或加20分；
* K： 分数池加至99分，如果分数池本来就是99分则不作用；
* A： 指定某玩家出牌；
* 小王：加害，从某玩家该人手上任意抽取一张牌，该人只能留下这张牌，其他牌都放回底牌；
* 大王：拯救，指定复活某个已出局的玩家并补全5张牌，或让某个未出局的玩家补全5张牌；

##胜负
* 如果不分组，则剩下最后一人为赢家。
* 如果分组游戏，组员全部出局的一方为输家，另一方为赢家。


###Dependences
* [Node.JS](http://nodejs.org/)
* [socket.io](http://socket.io/)
* [node-static](https://github.com/cloudhead/node-static)

