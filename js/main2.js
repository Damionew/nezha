(function () {
    var DPR = window.devicePixelRatio,
        gameW = document.body.clientWidth * DPR,
        gameH = document.body.clientHeight * DPR,
        fontSize = 16*DPR,
        aspect = gameW / gameH;
    var topBar = window.screen.height - document.body.clientHeight;
    var game = new Phaser.Game(gameW,gameH*0.91,Phaser.CANVAS,'game');

    var bgm;
    var button;
    var loadbg;
    //游戏加载
    var bootState = function (game) {
        this.init = function () {
            //缩放设置
            // game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            game.stage.backgroundColor = "#1b2436";
        }
        this.preload = function () {
            //资源加载
            game.load.image("loadingBg", 'assets/img/loadingBg.png');
            game.load.image('btn_start', 'assets/img/btn_start.png');
            game.load.spritesheet('player1','assets/img/player1.png',48,48);//加载角色1
            game.load.spritesheet('player2','assets/img/player2.png',32,48);//加载角色2
            // game.load.audio('bgm', 'audio/bgm.mp3', true);
            game.load.image('sky','assets/img/bg.png');//背景
            game.load.image('player1Win','assets/img/player1Win.png');//player1获胜
            game.load.image('player2Win','assets/img/player2Win.png');//player2获胜
            game.load.spritesheet('ball','assets/img/jianzi.png',32,48);
            //开始 start  方法
            game.load.onFileComplete.add(function(progress) {
                if(progress == 100) {
                    game.state.start('start');
                }
            });
            // game.state.start('start');
        }

    }

    //游戏开始画面
    var startState = function (game) {
        this.create = function () {
            //进入开始页面开始播放BGM
            // bgm = game.add.sound('bgm', 0.5, true);
            // bgm.play();
            game.loadbg = game.add.sprite(0, 0, 'loadingBg');
            loadbg =  game.loadbg;
            //背景页面位置
            game.loadbg.x = 0.13*gameW;
            game.loadbg.y= 0.17*gameH;

            //开始按钮
            button = game.add.button(gameW/2.5, gameH*0.71, 'btn_start', actionOnClick, this, 2, 1, 0);
            button.anchor.setTo(0.5, 0.5);
            button.scale.setTo(0.5*DPR);
            function actionOnClick () {
                game.state.start('main');
                // bgm.stop();
            }
        }
    }

    var mainState = function (game) {
        var player1;//用户一
        var player2;//用户二
        var cursors;//输入
        var A;//键盘A
        var D;//键盘D
        var ball;//球（毽子）
        var from = 0;//判断球（毽子）属于谁,1是player1出球,2是player2出球
        var times = 0;//毽子次数
        var bg;
        this.create = function(){
            console.log('进入游戏场景')

            game.physics.startSystem(Phaser.ARCADE);//启动ARCADE物理引擎
            game.bg = game.add.sprite(0,0,'sky');//将资源sky添加入场景
            bg = game.bg;
            game.bg.x = 0.13*gameW;
            game.bg.y = 0.2*gameH;
            player1=game.add.sprite(550,500,'player1');
            game.physics.arcade.enable(player1);//创建角色1的物理属性
            player1.body.collideWorldBounds=true;//碰撞世界范围
            player2=game.add.sprite(1050,490,'player2');
            game.physics.arcade.enable(player2);//创建角色1的物理属性
            player2.body.collideWorldBounds=true;//碰撞世界范围
            //创建按键方向 ↑←↓→
            cursors=game.input.keyboard.createCursorKeys();
            //创建WASD按键
            A = game.input.keyboard.addKey(Phaser.Keyboard.A);
            D = game.input.keyboard.addKey(Phaser.Keyboard.D);
            //球---------
            ball = game.add.sprite(gameW,gameH,"ball");
            game.physics.arcade.enable(ball);//创建球的物理属性
            ball.body.collideWorldBounds=true;//设置球碰撞世界范围
            // game.physics.arcade.enable(ball);//创建角色的物理属性
            // ball.body.gravity.y=300;//设置球的重力
            // ball.anchor.x = 0.5;
            // ball.anchor.y = 0.5;
            ball.x = 550;
            ball.y = 500;
            ball.xSpeed = 3;
            ball.ySpeed = 5;
            game.physics.arcade.enable(ball);//创建ball的物理属性
            ball.body.gravity.y=200;//设置ball的重力

        }
        this.update = function(){
            if (A.isDown) {
                player1.body.velocity.x=-150;
                player1.animations.play('left');
            } else if (D.isDown) {
                player1.body.velocity.x=150;
                player1.animations.play('right');
            } else {
                player1.body.velocity.x=0;//加上这个判断则每按一次运动一次否则直接滑翔
                player1.frame=4;//精灵图第4帧
            }
            //player1使用WASD
            if (cursors.left.isDown) {
                player2.body.velocity.x=-150;
                player2.animations.play('left');
            } else if (cursors.right.isDown) {
                player2.body.velocity.x=150;
                player2.animations.play('right');
            } else {
                player2.bame=4;//精灵图第4帧
                player2.body.velocity.x=0;//加上这个判断则每按一次运动一次否则直接滑翔
            }
            // --------------------接球（碰撞）监听---------------------
            //起始,由palyer1发球，但是因为发球不能乘以系数，因此由from为0开始
            if(from==0) {
                ball.x += ball.xSpeed;
                ball.y -= ball.ySpeed;
                //如果player2接到了球，from=2
                if(game.physics.arcade.overlap(player2, ball)) {//碰撞监听
                    from=2;
                    times++;
                    console.log("player2接到了球！！")
                }
            }
            // console.log("球下落的速度为："+ball.y.speed)
            //球属于player1,from=1
            if(from==1) {
                console.log("球下落的速度为："+ball.ySpeed)
                ball.x += ball.xSpeed;
                //注意此时ySpeed速度过小而重力过大容易轻轻弹起后落下，因此需要乘以一个系数
                if (times>2){
                    ball.y -= ball.ySpeed*3;
                }
                ball.y -= ball.ySpeed*4;
                //如果player2接到了球，from=2
                if(game.physics.arcade.overlap(player2, ball)) {//碰撞监听
                    ball.y -= ball.ySpeed*5;
                    console.log("球下落的速度为："+ball.ySpeed)
                    from=2;
                    times++;
                    console.log("player2接到了球！！")
                }
            }
            //球属于player2,from=2
            if(from==2) {
                // console.log("球下落的速度为："+ball.ySpeed)
                ball.x -= ball.xSpeed;
                //注意此时ySpeed速度过小而重力过大容易轻轻弹起后落下，因此需要乘以一个系数
                if (times>2){
                    ball.y -= ball.ySpeed*3;
                }
                ball.y -= ball.ySpeed*2.5;
                //如果player1接到了球，from=1
                if(game.physics.arcade.overlap(player1, ball)) {//碰撞监听
                    ball.y -= ball.ySpeed*4;
                    from=1;
                    times++;
                    console.log("player1接到了球！！")
                }
            }
            //-----------------胜负判断------------------
            //监听球的碰到边界以及此时from属于谁判断
            if(ball.y > 500 && from == 0){
                ball.kill();
                alert("player2失败")
                game.player1Win = game.add.sprite(0,0,'player1Win');//将资源sky添加入场景
                game.player1Win.x = 0.2*gameW;
                game.player1Win.y = 0.2*gameH;
                var button2 = game.add.button(gameW/2.2, gameH*0.71, 'btn_start', actionOnClick, this, 2, 1, 0);
                button2.anchor.setTo(0.5, 0.5);
                button2.scale.setTo(0.5*DPR);
                function actionOnClick () {
                    game.state.start('main');
                    bgm.stop();
                }
            }
            if(ball.y > 500 && from == 2 ){
                ball.kill();
                alert("player1失败")
                game.player2Win = game.add.sprite(0,0,'player2Win');//将资源sky添加入场景
                game.player2Win.x = 0.2*gameW;
                game.player2Win.y = 0.2*gameH;
                var button2 = game.add.button(gameW/2.2, gameH*0.71, 'btn_start', actionOnClick, this, 2, 1, 0);
                button2.anchor.setTo(0.5, 0.5);
                button2.scale.setTo(0.5*DPR);
                function actionOnClick () {
                    game.state.start('main');
                    bgm.stop();
                }
            }
            if(ball.y > 500 && from == 1 ){
                ball.kill();
                alert("player2失败")
                game.player2Win = game.add.sprite(0,0,'player2Win');//将资源sky添加入场景
                game.player2Win.x = 0.2*gameW;
                game.player2Win.y = 0.2*gameH;
                var button2 = game.add.button(gameW/2.2, gameH*0.71, 'btn_start', actionOnClick, this, 2, 1, 0);
                button2.anchor.setTo(0.5, 0.5);
                button2.scale.setTo(0.5*DPR);
                function actionOnClick () {
                    game.state.start('main');
                    bgm.stop();
                }
            }


        };
    }

    game.state.add('boot',bootState);
    game.state.add('start',startState);
    game.state.add('main',mainState);
    //游戏初始化
    game.state.start('boot')
})();


