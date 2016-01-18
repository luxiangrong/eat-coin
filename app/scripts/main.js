document.addEventListener('touchmove', function(event) {
    event.preventDefault();
});
(function() {
    var agent = navigator.userAgent.toLowerCase(); //检测是否是ios
    var iLastTouch = null; //缓存上一次tap的时间
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        document.body.addEventListener('touchend', function(event) {
            var iNow = new Date()
                .getTime();
            iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
            var delta = iNow - iLastTouch;
            if (delta < 500 && delta > 0) {
                event.preventDefault();
                return false;
            }
            iLastTouch = iNow;
        }, false);
    }

})();

var paceOptions = {
    //pace的参数定义
};

Pace.on('done', function() {
    jQuery(function($) {
        //在过场动画结束后添加动画场景动画效果
        var addAnimation = function() {
            window.setTimeout(function() {
                $('.coin-1, .coin-2, .coin-3').addClass('sway');
            }, 1000)
            window.setTimeout(function() {
                $('.text-eat').addClass('sway');
            }, 3000)
        }

        var scoreGradeA = 300, scoreGradeB = 500;

        swiperAnimateCache();
        swiperAnimate($('.swiper-slide-1').get(0));
        addAnimation();

        var showResult = function(score) {
            console.log('游戏结束，你获得了' + score + '分');
            $('.result').removeClass('slideOutUp').addClass('slideInDown').show();
            $('.swiper-slide-2').append('<div class="modal-backdrop fade"></div>');

            if(score < scoreGradeA) {
                $('.result .title').attr('src', 'images/p44.png').attr('srcset', 'images/p44@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').removeClass('light');
                $('.result .star').addClass('dark');
            }

            if(score >= scoreGradeA && score < scoreGradeB) {
                $('.result .title').attr('src', 'images/p36.png').attr('srcset', 'images/p36@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').addClass('dark');
                $('.result .star').eq(0).removeClass('dark');
                $('.result .star').eq(0).addClass('light');
            }

            if(score >= scoreGradeB) {
                $('.result .title').attr('src', 'images/p43.png').attr('srcset', 'images/p43@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').removeClass('dark');
                $('.result .star').addClass('light');
            }
        }

        var hideResult = function(fn) {
            $('.result').removeClass('slideInDown').addClass('slideOutUp');
            window.setTimeout(function() {
                $('.result').hide();
                $('.modal-backdrop').remove();
                fn();
            }, 500);
        }

        //初始化游戏场景
        var initGame = function() {

            (function(ARE) {
                var w = $(document).width();
                var h = $(document).height();

                var cdTime = 20 * 1000;
                var gameStart = false;

                $('canvas#game').prop('width', w).prop('height', h);
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
                var stage = new Stage("#game", localStorage.webgl == "1");
                stage.debug = true;


                /**-------------------- 游戏开始倒计时 start -------------------**/

                var ldCD = new Loader();
                ldCD.loadRes([{
                    id: "cd-1",
                    src: "images/p26.png"
                }, {
                    id: "cd-2",
                    src: "images/p27.png"
                }, {
                    id: "cd-3",
                    src: "images/p28.png"
                }, {
                    id: "cd-go",
                    src: "images/p29.png"
                }]);

                ldCD.complete(function() {
                    var mask = new RectShape(w, h, 'black', false);
                    mask.alpha = 0.5;
                    mask.x = w / 2;
                    mask.y = h / 2;
                    stage.add(mask);
                    var cd = new Bitmap(ldCD.get("cd-3"));
                    cd.originX = cd.originY = 0.5;
                    cd.x = w / 2;
                    cd.y = h / 2;
                    cd.scaleX = cd.scaleY = 0;
                    cd.alpha = 0;
                    To.get(cd)
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            cd.useImage(ldCD.get("cd-2"));
                            cd.scaleX = cd.scaleY = 0;
                            cd.alpha = 0;
                        })
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            cd.useImage(ldCD.get("cd-1"));
                            cd.scaleX = cd.scaleY = 0;
                            cd.alpha = 0;
                        })
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            cd.useImage(ldCD.get("cd-go"));
                            cd.scaleX = cd.scaleY = 0;
                            cd.alpha = 0;
                        })
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            stage.remove(cd);
                            stage.remove(mask);
                            gameStart = true;
                            stage.remove(paperContainer);
                        })
                        .start();

                    stage.add(cd);

                });
                /**-------------------- 游戏开始倒计时 end -------------------**/

                /**-------------------- 金币下落 start -------------------**/
                var startPerSecond = 1; // 开始时每秒掉落金币数
                var endPerSecond = 4; //结束时每秒掉落金币数
                var totalSeconde = 20 * 1000; //游戏总时间(毫秒)
                var loadCoin = new Loader();
                var coinContainer = new Container();
                var textScore;
                var textCD;
                var scoreGold = 50, scoreSilver = 30, scoreCopper = 10;
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
                    var startTime = new Date().valueOf();
                    var lastTime = new Date().valueOf();
                    var xArray = [w / 5, w / 2, w / 5 * 4];
                    var coinContainer = new ARE.Container();
                    stage.add(coinContainer);


                    // var coin = new Bitmap(loadCoin.get('gold'));
                    // coin.originX = coin.orginY = 0.5
                    // coin.scaleX = coin.scaleY = 0.5;
                    // coin.x = w/2;
                    // coin.y = 120;
                    // stage.add(coin);



                    var currentScore = 0;
                    stage.onTick(function() {
                        if (!gameStart) {
                            startTime = new Date().valueOf();
                            lastTime = new Date().valueOf();
                            return
                        };
                        var nowTime = new Date().valueOf();
                        var remainSecond = ((totalSeconde - (nowTime - startTime)) / 1000).toFixed(1); 
                        if(remainSecond <= 0) {
                            gameStart = false;
                            window.setTimeout(function(){
                                showResult(currentScore);
                            },intervalTime(0.333, 0.75, totalSeconde, nowTime - startTime));
                        }
                        textCD.value = Math.abs(remainSecond) + '秒';
                        if (nowTime - lastTime > intervalTime(startPerSecond, endPerSecond, totalSeconde, nowTime - startTime)) {
                            var r = _.random(0, 2);
                            var coin;
                            switch (r) {
                                case 0:
                                    coin = new Bitmap(loadCoin.get('gold'));
                                    coin.score = scoreGold;
                                    break;
                                case 1:
                                    coin = new Bitmap(loadCoin.get('silver'));
                                    coin.score = scoreSilver;
                                    break;
                                case 2:
                                    coin = new Bitmap(loadCoin.get('copper'));
                                    coin.score = scoreCopper;
                                    break;
                            }
                            coin.originX = coin.orginY = 0.5
                            coin.scaleX = coin.scaleY = 0.5;
                            coin.x = xArray[_.random(0, 2)];
                            coin.onTouchStart(function() {
                                // to.pause();
                                currentScore += coin.score;
                                textScore.value = currentScore + '分';
                                To.get(coin)
                                    .to()
                                    .scaleX(0.7, 300)
                                    .scaleY(0.7, 300)
                                    .alpha(0, 300)
                                    .end(function() {
                                        coinContainer.remove(coin);
                                        // to = null;  
                                    })
                                    .start();
                            });
                            To.get(coin)
                                .to()
                                .y(h, intervalTime(0.333, 0.75, totalSeconde, nowTime - startTime))
                                .end(function() {
                                    coinContainer.remove(coin);
                                })
                                .start();
                            coinContainer.add(coin);
                            lastTime = nowTime;
                        }

                        // _.each(coinContainer.children, function(item, n){
                        //     if(item) {
                        //         item.y += 1;
                        //         if(item.y > h) {
                        //             coinContainer.remove(item);
                        //         }
                        //     }
                        // });


                    });
                    // window.setTimeout(function(){
                    //     console.log(coinContainer.children);
                    // }, 5000);
                });
                /**-------------------- 金币下落 end -------------------**/


                /**-------------------- 初始化彩色纸片 start -------------------**/
                var colorPaperArr = [];
                for (var i = 1; i < 10; i++) {
                    var colorPaper = new RectShape(16, 16, 'white', false);
                    colorPaper.x = w / 10 * i;
                    colorPaper.y = 0;
                    colorPaper.scaleX = colorPaper.scaleY = _.random(5, 8) / 10;
                    colorPaper.setFilter(_.random(0, 10) / 10, _.random(0, 10) / 10, _.random(0, 10) / 10, _.random(5, 8) / 10);
                    colorPaperArr.push(colorPaper);
                }
                var paperContainer = new ARE.Container();
                stage.add(paperContainer);
                //彩色纸片下落动画
                var createColorPaperTween = function(ele) {
                    var duration = _.random(1000, 2500);
                    To.get(ele)
                        .to()
                        .set("y", h, duration)
                        .rotation(1080, duration)
                        .to()
                        .set("y", 0, 0)
                        .rotation(0, 0)
                        .end(function() {
                            ele.setFilter(_.random(0, 10) / 10, _.random(0, 10) / 10, _.random(0, 10) / 10, _.random(5, 8) / 10);
                            createColorPaperTween(ele);
                        }).start();
                };
                _.each(colorPaperArr, function(paper) {
                    createColorPaperTween(paper);
                    paperContainer.add(paper);
                });
                /**-------------------- 初始化彩色纸片 end -------------------**/

                // 载入云层等其他位图资源资源
                var bitmapLoader = new Loader();

                bitmapLoader.loadRes([{
                    id: "score",
                    src: "images/p33.png"
                }, {
                    id: "cd",
                    src: "images/p34.png"
                },{
                    id: "cloud1",
                    src: "images/p03@2x.png"
                }, {
                    id: "cloud2",
                    src: "images/p04@2x.png"
                }, {
                    id: "cloud3",
                    src: "images/p05@2x.png"
                }, {
                    id: "cloud4",
                    src: "images/p08@2x.png"
                }, {
                    id: "cloud5",
                    src: "images/p09@2x.png"
                }, {
                    id: "cloud6",
                    src: "images/p10@2x.png"
                }]);

                var topContainer = new Container();
                bitmapLoader.complete(function() {

                    var clouds = [];
                    //定义云层的初始值

                    cloud1 = new Bitmap(bitmapLoader.get("cloud1"));
                    cloud1.originX = 0.5;
                    cloud1.originY = 0.5;
                    cloud1.scaleX = 0.5;
                    cloud1.scaleY = 0.5;
                    cloud1.x = w / 2;
                    cloud1.y = 10;


                    cloud2 = new Bitmap(bitmapLoader.get("cloud2"));
                    cloud2.originX = 0.5;
                    cloud2.originY = 0.5;
                    cloud2.scaleX = 0.5;
                    cloud2.scaleY = 0.5;
                    cloud2.x = 0;
                    cloud2.y = 10;


                    cloud3 = new Bitmap(bitmapLoader.get("cloud3"));
                    cloud3.originX = 0.5;
                    cloud3.originY = 0.5;
                    cloud3.scaleX = 0.5;
                    cloud3.scaleY = 0.5;
                    cloud3.x = w;
                    cloud3.y = 10;


                    cloud4 = new Bitmap(bitmapLoader.get("cloud4"));
                    cloud4.originX = 0.5;
                    cloud4.originY = 0.5;
                    cloud4.scaleX = 0.5;
                    cloud4.scaleY = 0.5;
                    cloud4.x = w / 2;
                    cloud4.y = h - 10;


                    cloud5 = new Bitmap(bitmapLoader.get("cloud5"));
                    cloud5.originX = 0.5;
                    cloud5.originY = 0.5;
                    cloud5.scaleX = 0.5;
                    cloud5.scaleY = 0.5;
                    cloud5.x = 50;
                    cloud5.y = h - 10;


                    cloud6 = new Bitmap(bitmapLoader.get("cloud6"));
                    cloud6.originX = 0.5;
                    cloud6.originY = 0.5;
                    cloud6.scaleX = 0.5;
                    cloud6.scaleY = 0.5;
                    cloud6.x = w - 50;
                    cloud6.y = h - 10;

                    clouds = [
                        cloud1, cloud2, cloud3, cloud4, cloud5, cloud6
                    ];

                    topContainer.add(cloud2);
                    topContainer.add(cloud3);
                    topContainer.add(cloud1);
                    topContainer.add(cloud5);
                    topContainer.add(cloud6);
                    topContainer.add(cloud4);

                    var scoreBitmap = new Bitmap(bitmapLoader.get('score'));
                    scoreBitmap.scaleX = scoreBitmap.scaleY = 0.5;
                    scoreBitmap.x = 10;
                    scoreBitmap.y = 5;
                    topContainer.add(scoreBitmap);
                    var cdBitmap = new Bitmap(bitmapLoader.get('cd'));
                    cdBitmap.scaleX = cdBitmap.scaleY = 0.5;
                    cdBitmap.x = w - 97.5 - 10;
                    cdBitmap.y = 5;
                    topContainer.add(cdBitmap);


                    textScore = new Text("0分", "12px arial", "#fa372d");
                    textScore.x = 50;
                    textScore.y = 12;
                    topContainer.add(textScore);

                    textCD = new Text((totalSeconde/1000).toFixed(1) + '秒', "12px arial", "#666666");
                    textCD.originY = 1;
                    textCD.x = w - 40 - 10;
                    textCD.y = 12;
                    topContainer.add(textCD);

                    stage.add(topContainer);


                //     var step = 0.01;
                //     //定义云层的运动速度和范围
                //     var steps = [{
                //         x: 0.1,
                //         y: 0.0,
                //         xRange: [w / 2 - w / 20, w / 2 + w / 20],
                //         yRange: [-5, 5]
                //     }, {
                //         x: 0.15,
                //         y: 0.0,
                //         xRange: [-20, 20],
                //         yRange: [-5, 5]
                //     }, {
                //         x: -0.12,
                //         y: 0.0,
                //         xRange: [w - 20, w + 20],
                //         yRange: [-5, 5]
                //     }, {
                //         x: 0.1,
                //         y: 0.0,
                //         xRange: [w / 2 - w / 20, w / 2 + w / 20],
                //         yRange: [-5, 5]
                //     }, {
                //         x: -0.12,
                //         y: 0.0,
                //         xRange: [30, 70],
                //         yRange: [-5, 5]
                //     }, {
                //         x: 0.15,
                //         y: 0.0,
                //         xRange: [w - 70, w - 30],
                //         yRange: [-5, 5]
                //     }];
                //     //在舞台的循环事件中定义运动逻辑
                //     stage.onTick(function() {

                //         //云层的运动逻辑
                //         for (var i = 0; i < clouds.length; i++) {
                //             if (clouds[i].x <= steps[i].xRange[0] || clouds[i].x >= steps[i].xRange[1]) {
                //                 steps[i].x *= -1;
                //             }
                //             clouds[i].x += steps[i].x;
                //         }

                //     })
                });


            })(ARE);


        }

        // var swiper = new Swiper('.swiper-container', {
        //     // direction: 'vertical',
        //     effect: 'fade',
        //     preventClicks: false,
        //     // onlyExternal: true,
        //     onSlideChangeEnd: function(swiper) {
        //         swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        //         var activeIndex = swiper.activeIndex;
        //         $('.coin-1, .coin-2, .coin-3, .text-eat').removeClass('sway');
        //         switch (activeIndex) {
        //             case 0:
        //                 addAnimation();
        //                 break;
        //             case 1:
        //                 $('.swiper-slide-1').hide();
        //                 initGame();
        //                 break;
        //         }
        //     },
        //     onInit: function(swiper) {
        //         swiperAnimateCache(swiper); //隐藏动画元素 
        //         swiperAnimate(swiper); //初始化完成开始动画
        //         addAnimation();
        //         var activeIndex = swiper.activeIndex;
        //         switch (activeIndex) {
        //             case 0:
        //                 var fireworksArray = $('#tpl-fireworks').html();
        //                 $('.fireworks-container').empty();
        //                 for (var i = 0; i < 8; i++) {
        //                     $('.fireworks-container').append(fireworksArray);
        //                 }
        //                 $('.fireworks-container .fireworks').each(function(index, item) {
        //                     $(item).css('animation', 'falling-' + (index % 2 + 1) + ' ' + (Math.random() * 5 + 5) + 's linear both ' + (Math.random() * 10) + 's');
        //                 });
        //                 break;
        //         }
        //     }
        // });

        //显示游戏规则
        $(document).on('click', '#showRule', function(e) {
            e.preventDefault();
            $('.envelope').removeClass('slideOutUp').addClass('slideInDown').show();
            $('.swiper-slide-1').append('<div class="modal-backdrop fade"></div>');
        });

        //隐藏游戏规则，显示游戏启动画面
        $(document).on('click', '#hideEnvelope', function(e) {
            e.preventDefault();
            $('.envelope').removeClass('slideInDown').addClass('slideOutUp');
            window.setTimeout(function() {
                $('.envelope').hide();
                $('.modal-backdrop').remove();
            }, 500);
        });

        //进入游戏界面
        $('.start').on('click', function() {
            $('.swiper-slide-1').hide();
            initGame();
            // swiper.slideNext();

            // swiper.removeSlide(0);
        });
        $('.restart').on('click', function(e) {
            e.preventDefault();
            $('.swiper-slide-1').hide();
            $('#game').remove();
            $('.swiper-slide-2').append('<canvas id="game"></canvas>');
            hideResult(initGame);
        });

    });
});
