jQuery(function($) {
    (function(ARE) {
        var w = $(document).width();
        var h = $(document).height();

        var cdTime = 20 * 1000;
        var gameStart = true;

        $('canvas#demo').prop('width', w).prop('height', h);
        var Stage = ARE.Stage,
            Bitmap = ARE.Bitmap,
            Loader = ARE.Loader,
            RectShape = ARE.RectShape,
            Tween = ARE.TWEEN.Tween,
            Text = ARE.Text,
            Container = ARE.Container,
            To = ARE.To;

        var ld = new Loader(),
            cloud1, cloud2, cloud3, cloud4, cloud5, cloud6;
        var stage = new Stage("#demo", localStorage.webgl == "1");
        stage.debug = true;


        var startPerSecond = 1; // 开始时每秒掉落金币数
        var endPerSecond = 4; //结束时每秒掉落金币数
        var totalSeconde = 20 * 1000; //游戏总时间(毫秒)
        var loadCoin = new Loader();
        var coinContainer = new Container();
        var textScore;
        var textCD;
        var scoreGold = 50,
            scoreSilver = 30,
            scoreCopper = 10;
        stage.add(coinContainer);
        var intervalTime = function(a, b, c, t) {
            var r = (1000 * (a - b) / (c * b * a) * t + 1000 / a);
            if (r < 1000 / b) {
                return 1000 / b;
            }
            return r;
        }
        loadCoin.loadRes([{
            id: "gold",
            src: "images/p30.png"
        }, {
            id: "silver",
            src: "images/p31.png"
        }, {
            id: "copper",
            src: "images/p32.png"
        }]);
        loadCoin.complete(function() {
        	var xArray = [w / 5, w / 2, w / 5 * 4];
        	var coin = new RectShape(30,30, '#ffffff');
        	coin.originX = coin.orginY = 0.5
            coin.scaleX = coin.scaleY = 0.5;
            coin.x = xArray[_.random(0, 2)];
            coin.y = 100;
            To.get(coin)
            .to()
            .y(h, 5000)
            .end(function() {
                coinContainer.remove(coin);
            })
            .start();
            coinContainer.add(coin);

            var coin2 = new Bitmap(loadCoin.get('gold'));
        	coin2.originX = coin.orginY = 0.5
            coin2.scaleX = coin.scaleY = 0.5;
            coin2.x = xArray[_.random(0, 2)];
            To.get(coin2)
            .to()
            .y(h, 5000)
            .end(function() {
                coinContainer.remove(coin2);
            })
            .start();
            coinContainer.add(coin2);

            var coin2 = new Bitmap(loadCoin.get('gold'));
        	coin2.originX = coin.orginY = 0.5
            coin2.scaleX = coin.scaleY = 0.5;
            coin2.x = xArray[_.random(0, 2)];
            To.get(coin2)
            .to()
            .y(h, 5000)
            .end(function() {
                coinContainer.remove(coin2);
            })
            .start();
            coinContainer.add(coin2);

            var coin2 = new Bitmap(loadCoin.get('gold'));
        	coin2.originX = coin.orginY = 0.5
            coin2.scaleX = coin.scaleY = 0.5;
            coin2.x = xArray[_.random(0, 2)];
            To.get(coin2)
            .to()
            .y(h, 5000)
            .end(function() {
                coinContainer.remove(coin2);
            })
            .start();
            coinContainer.add(coin2);


            // var startTime = new Date().valueOf();
            // var lastTime = new Date().valueOf();
            // var xArray = [w / 5, w / 2, w / 5 * 4];
            // var coinContainer = new ARE.Container();
            // stage.add(coinContainer);

            // var currentScore = 0;
            // stage.onTick(function() {
            //     if (!gameStart) {
            //         startTime = new Date().valueOf();
            //         lastTime = new Date().valueOf();
            //         return
            //     };
            //     var nowTime = new Date().valueOf();
            //     var remainSecond = ((totalSeconde - (nowTime - startTime)) / 1000).toFixed(1);
            //     if (remainSecond <= 0) {
            //         gameStart = false;
            //         window.setTimeout(function() {
            //             showResult(currentScore);
            //         }, intervalTime(0.333, 0.75, totalSeconde, nowTime - startTime));
            //     }
            //     if (nowTime - lastTime > intervalTime(startPerSecond, endPerSecond, totalSeconde, nowTime - startTime)) {
            //         var r = _.random(0, 2);
            //         var coin;
            //         switch (r) {
            //             case 0:
            //                 coin = new Bitmap(loadCoin.get('gold'));
            //                 coin.score = scoreGold;
            //                 break;
            //             case 1:
            //                 coin = new Bitmap(loadCoin.get('silver'));
            //                 coin.score = scoreSilver;
            //                 break;
            //             case 2:
            //                 coin = new Bitmap(loadCoin.get('copper'));
            //                 coin.score = scoreCopper;
            //                 break;
            //         }
            //         coin.originX = coin.orginY = 0.5
            //         coin.scaleX = coin.scaleY = 0.5;
            //         coin.x = xArray[_.random(0, 2)];
            //         coin.onTouchStart(function() {
            //             // to.pause();
            //             currentScore += coin.score;
            //             To.get(coin)
            //                 .to()
            //                 .scaleX(0.7, 300)
            //                 .scaleY(0.7, 300)
            //                 .alpha(0, 300)
            //                 .end(function() {
            //                     coinContainer.remove(coin);
            //                     // to = null;  
            //                 })
            //                 .start();
            //         });
            //         To.get(coin)
            //             .to()
            //             .y(h, intervalTime(0.333, 0.75, totalSeconde, nowTime - startTime))
            //             .end(function() {
            //                 coinContainer.remove(coin);
            //             })
            //             .start();
            //         coinContainer.add(coin);
            //         lastTime = nowTime;
            //     }

            // });
        });

    })(ARE);
});
