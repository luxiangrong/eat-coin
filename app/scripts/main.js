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
        console.log('done');
        $('.pace-pack').remove();
        //在过场动画结束后添加动画场景动画效果
        var addAnimation = function() {
            window.setTimeout(function() {
                $('.coin-1, .coin-2, .coin-3').addClass('sway');
            }, 1000)
            window.setTimeout(function() {
                $('.text-eat').addClass('sway');
            }, 3000)
        }

        var parseToMatrix = function(str) {
            var reg = /^matrix\((-?\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)\)$/;
            var matches = str.match(reg);
            if ($.isArray(matches) && matches.length == 7) {
                matches.splice(0, 1);
                return matches;
            }
            return [0, 0, 0, 0, 0, 0];
        };

        var scoreGradeA = 500,
            scoreGradeB = 1500,
            scoreGradeC = 2500;

        swiperAnimateCache();
        swiperAnimate($('.swiper-slide-1').get(0));
        addAnimation();

        var soundBg = new buzz.sound("images/s04.mp3");
        var soundGold = new buzz.sound("images/s01.mp3");
        var soundSuccess = new buzz.sound("images/s02.mp3");
        var soundFail = new buzz.sound("images/s03.mp3");


        soundBg.loop().play();

        var showResult = function(score) {
            console.log('游戏结束，你获得了' + score + '分');
            $('.result').removeClass('slideOutUp').addClass('slideInDown').show();
            $('.swiper-slide-2').append('<div class="modal-backdrop fade"></div>');

            if (score < scoreGradeA) {
                $('.result .title').attr('src', 'images/p44.png').attr('srcset', 'images/p44@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').removeClass('light');
                $('.result .star').addClass('dark');
                soundFail.play();
            } else {
                soundSuccess.play();
            }

            if (score >= scoreGradeA && score < scoreGradeB) {
                $('.result .title').attr('src', 'images/p49.png').attr('srcset', 'images/p49@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').addClass('dark');
                $('.result .star').eq(0).removeClass('dark');
                $('.result .star').eq(0).addClass('light');

            }

            if (score >= scoreGradeB && score < scoreGradeC) {
                $('.result .title').attr('src', 'images/p36.png').attr('srcset', 'images/p36@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').addClass('dark');
                $('.result .star').eq(0).removeClass('dark');
                $('.result .star').eq(0).addClass('light');
                $('.result .star').eq(1).removeClass('dark');
                $('.result .star').eq(1).addClass('light');
            }

            if (score >= scoreGradeC) {
                $('.result .title').attr('src', 'images/p43.png').attr('srcset', 'images/p43@2x.png 2x');
                $('.result .score').text(score + '分');
                $('.result .star').removeClass('dark');
                $('.result .star').addClass('light');
            }

            $('.copyright').show();

        }

        var hideResult = function(fn) {
            $('.result').removeClass('slideInDown').addClass('slideOutUp');
            $('.copyright').hide();
            window.setTimeout(function() {
                $('.result').hide();
                $('.modal-backdrop').remove();
                fn();
            }, 500);
        }

        // var soundLoader = new ARE.Loader();
        // soundLoader.loadRes([{
        //     id: 'success-sound',
        //     src: "images/s01.mp3"
        // }, {
        //     id: 'fail-sound',
        //     src: "images/s01.mp3"
        // }]);


        var startCD, startGame;

        //初始化游戏场景
        var initGame = function() {



            (function(ARE) {
                var w = $(document).width();
                var h = $(document).height();

                var cdTime = 20 * 1000;
                var gameStart = false;

                var Stage = ARE.Stage,
                    Bitmap = ARE.Bitmap,
                    Loader = ARE.Loader,
                    RectShape = ARE.RectShape,
                    Tween = ARE.TWEEN.Tween,
                    Text = ARE.Text,
                    Container = ARE.Container,
                    To = ARE.To;

                var ld = new Loader();
                var stage;
                var stageCd;

                //游戏相关配置参数
                var startPerSecond = 2; // 开始时每秒掉落金币数
                var endPerSecond = 6; //结束时每秒掉落金币数
                var totalSecond = 40; //游戏总时间(毫秒)
                var scoreGold = 50,
                    scoreSilver = 30,
                    scoreCopper = 10;
                //根据开始时每秒金币出现速度， 结束时每秒金币出现速度, 总时间, 当前经过时间, 计算出金币出现的时间间隔
                var intervalTime = function(a, b, c, t) {
                    var r = (1000 * (a - b) / (c * b * a) * t + 1000 / a);
                    if (r < 1000 / b) {
                        return 1000 / b;
                    }
                    return r;
                }

                //显示倒计时画面
                startCD = function() {
                    var canvasCD = $('<canvas id="layer-cd"></canvas>');
                    canvasCD.prop('width', w).prop('height', h);
                    $('.canvas-container').append(canvasCD);
                    stageCd = new Stage(canvasCD.get(0), localStorage.webgl == "1");

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
                    stageCd.add(paperContainer);
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

                    var mask = new RectShape(w, h, 'black', false);
                    mask.alpha = 0.5;
                    mask.x = w / 2;
                    mask.y = h / 2;
                    stageCd.add(mask);
                    var cd = new Bitmap(loader.get("cd-3"));
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
                            cd.useImage(loader.get("cd-2"));
                            cd.scaleX = cd.scaleY = 0;
                            cd.alpha = 0;
                        })
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            cd.useImage(loader.get("cd-1"));
                            cd.scaleX = cd.scaleY = 0;
                            cd.alpha = 0;
                        })
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            cd.useImage(loader.get("cd-go"));
                            cd.scaleX = cd.scaleY = 0;
                            cd.alpha = 0;
                        })
                        .to()
                        .scaleX(0.5, 1000, To.elasticOut)
                        .scaleY(0.5, 1000, To.elasticOut)
                        .alpha(1, 500)
                        .end(function() {
                            stageCd.remove(cd);
                            stageCd.remove(mask);
                            gameStart = true;
                            stageCd.remove(paperContainer);
                            stageCd.destroy();
                            //主游戏开始
                            startGame();
                        })
                        .start();
                    stageCd.add(cd);
                }

                startGame = function(debug) {
                    var canvas = $('<canvas id="game"></canvas>');
                    canvas.prop('width', w).prop('height', h);
                    $('.canvas-container').append(canvas);
                    stage = new Stage(canvas.get(0), localStorage.webgl == "1");
                    stage.debug = debug || false;

                    var coinArray = [{
                        el: '<i class="coin gold"></i>',
                        score: 50
                    }, {
                        el: '<i class="coin silver"></i>',
                        score: 30
                    }, {
                        el: '<i class="coin copper"></i>',
                        score: 10
                    }];
                    var coinPosArray = ['16.667%', '50%', '83.333%'];

                    var startTime = new Date().valueOf(); //游戏开始时间
                    var lastTime = new Date().valueOf(); //上一次出现金币的时间
                    var nowTime = new Date().valueOf(); //当前时间
                    var xArray = [w / 5, w / 2, w / 5 * 4]; //默认金币出现的位置
                    var remainSecond; //游戏剩余时间
                    var $textScore = $('#text-score');
                    var $textCD = $('#text-cd');
                    $textScore.text('0分');
                    $textCD.text(totalSecond.toFixed(1) + '秒');

                    var currentScore = 0; //当前得分
                    stage.onTick(function() {
                        if (!gameStart) {
                            startTime = new Date().valueOf();
                            lastTime = new Date().valueOf();
                            return
                        };
                        nowTime = new Date().valueOf();
                        remainSecond = totalSecond - (nowTime - startTime) / 1000;
                        if (remainSecond <= 0) {
                            gameStart = false;
                            window.setTimeout(function() {
                                showResult(currentScore);
                                stage.destroy();
                            }, intervalTime(0.333, 0.75, totalSecond * 1000, nowTime - startTime));
                        }
                        $textCD.text(Math.abs(remainSecond).toFixed(1) + '秒');
                        if (nowTime - lastTime > intervalTime(startPerSecond, endPerSecond, totalSecond * 1000, nowTime - startTime)) {
                            var r = _.random(0, 2);
                            var coinData = coinArray[_.random(0, 2)];
                            var coin = $(coinData.el);
                            coin.css('left', coinPosArray[_.random(0, 2)]);
                            coin.css('transition', 'opacity 1000ms,  transform ' + intervalTime(.5, 1, totalSecond * 1000, nowTime - startTime) + 'ms' + ' linear');
                            coin.css('-webkit-transition', 'opacity 1000ms,  -webkit-transform ' + intervalTime(.5, 1, totalSecond * 1000, nowTime - startTime) + 'ms' + ' linear');
                            coin.on('transitionEnd webkitTransitionEnd', function() {
                                $('#debug').text('remove');
                                coin.remove();
                            });
                            coin.on('touchstart', function() {
                                // var matrix = parseToMatrix(coin.css('transform'));
                                currentScore += coinData.score;
                                $textScore.text(currentScore + '分');
                                coin.css('opacity', 0);
                                coin.css('transform', 'scale(1.5) translate3d(0, ' + (h + 75) + 'px, 0)');
                            });
                            $('.coin-container').append(coin);
                            window.setTimeout(function() {
                                coin.css('transform', 'translate3d(0, ' + (h + 75) + 'px, 0)');
                                coin.css('-webkit-transform', 'translate3d(0, ' + (h + 75) + 'px, 0)');
                            }, 100);

                            lastTime = nowTime;
                        }
                    });
                };


                /**-------------------- 游戏开始倒计时 start -------------------**/

                var loader = new Loader();
                loader.loadRes([{
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
                }, {
                    id: "gold",
                    src: "images/p30.png"
                }, {
                    id: "silver",
                    src: "images/p31.png"
                }, {
                    id: "copper",
                    src: "images/p32.png"
                }]);
                loader.complete(function() {
                    //开始游戏倒计时
                    startCD();
                });

            })(ARE);
        }

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
                $('.swiper-slide-1').hide();
                initGame();
            }, 500);
        });

        //进入游戏界面
        $('.start').on('click', function() {
            $('.swiper-slide-1').hide();
            initGame();
        });
        //重新开始游戏
        $('.restart').on('click', function(e) {
            e.preventDefault();
            $('.swiper-slide-1').hide();
            hideResult(startCD);
        });
        var showShareGuild = function() {
            $('body').append('<div class="modal-backdrop modal-share fade"><img src="images/p47.png" srcset="images/p47@2x.png 2x"/><img src="images/p48.png" class="hack" /></div>');
        };
        var hideShareGuild = function() {
                $('.modal-share').remove();
            }
            //分享
        $('.share').on('click', function(e) {
            e.preventDefault();
            showShareGuild();
        });
        $(document).on('click', '.modal-share', function() {
            hideShareGuild();
        });

        $('.collapse .toggle').click(function() {
            $(this).closest('.collapse').toggleClass('in');
        });
    });
});
