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

        //初始化游戏场景
        var initGame = function() {

            (function(ARE) {
                var w = $(document).width();
                var h = $(document).height();
                $('canvas#game').prop('width', w).prop('height', h);
                var Stage = ARE.Stage,
                    Bitmap = ARE.Bitmap,
                    Loader = ARE.Loader,
                    To = ARE.To;

                var ld = new Loader(),
                    cloud1, cloud2, cloud3, cloud4, cloud5, cloud6;
                var stage = new Stage("#game", localStorage.webgl == "1");

                //载入云层资源
                ld.loadRes([{
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
                ld.complete(function() {

                    var clouds = [];
                    //定义云层的初始值
                    cloud1 = new Bitmap(ld.get("cloud1"));
                    cloud1.originX = 0.5;
                    cloud1.originY = 0.5;
                    cloud1.scaleX = 0.5;
                    cloud1.scaleY = 0.5;
                    cloud1.x = w / 2;
                    cloud1.y = 0;

                    cloud2 = new Bitmap(ld.get("cloud2"));
                    cloud2.originX = 0.5;
                    cloud2.originY = 0.5;
                    cloud2.scaleX = 0.5;
                    cloud2.scaleY = 0.5;
                    cloud2.x = 0;
                    cloud2.y = 0;

                    cloud3 = new Bitmap(ld.get("cloud3"));
                    cloud3.originX = 0.5;
                    cloud3.originY = 0.5;
                    cloud3.scaleX = 0.5;
                    cloud3.scaleY = 0.5;
                    cloud3.x = w;
                    cloud3.y = 0;

                    cloud4 = new Bitmap(ld.get("cloud4"));
                    cloud4.originX = 0.5;
                    cloud4.originY = 0.5;
                    cloud4.scaleX = 0.5;
                    cloud4.scaleY = 0.5;
                    cloud4.x = w / 2;
                    cloud4.y = h - 10;

                    cloud5 = new Bitmap(ld.get("cloud5"));
                    cloud5.originX = 0.5;
                    cloud5.originY = 0.5;
                    cloud5.scaleX = 0.5;
                    cloud5.scaleY = 0.5;
                    cloud5.x = 50;
                    cloud5.y = h - 10;

                    cloud6 = new Bitmap(ld.get("cloud6"));
                    cloud6.originX = 0.5;
                    cloud6.originY = 0.5;
                    cloud6.scaleX = 0.5;
                    cloud6.scaleY = 0.5;
                    cloud6.x = w - 50;
                    cloud6.y = h - 10;

                    clouds = [
                        cloud1, cloud2, cloud3, cloud4, cloud5, cloud6
                    ];

                    stage.add(cloud2);
                    stage.add(cloud3);
                    stage.add(cloud1);
                    stage.add(cloud5);
                    stage.add(cloud6);
                    stage.add(cloud4);

                    var step = 0.01;
                    //定义云层的运动速度和范围
                    var steps = [{
                        x: 0.1,
                        y: 0.0,
                        xRange: [w / 2 - w / 20, w / 2 + w / 20],
                        yRange: [-5, 5]
                    }, {
                        x: 0.15,
                        y: 0.0,
                        xRange: [-20, 20],
                        yRange: [-5, 5]
                    }, {
                        x: -0.12,
                        y: 0.0,
                        xRange: [w - 20, w + 20],
                        yRange: [-5, 5]
                    }, {
                        x: 0.1,
                        y: 0.0,
                        xRange: [w / 2 - w / 20, w / 2 + w / 20],
                        yRange: [-5, 5]
                    }, {
                        x: -0.12,
                        y: 0.0,
                        xRange: [30, 70],
                        yRange: [-5, 5]
                    }, {
                        x: 0.15,
                        y: 0.0,
                        xRange: [w - 70, w - 30],
                        yRange: [-5, 5]
                    }];
                    //在舞台的循环事件中定义运动逻辑
                    stage.onTick(function() {
                        
                        //云层的运动逻辑
                        for (var i = 0; i < clouds.length; i++) {
                            console.log(clouds.length);
                            if (clouds[i].x <= steps[i].xRange[0] || clouds[i].x >= steps[i].xRange[1]) {
                                steps[i].x *= -1;
                            }
                            clouds[i].x += steps[i].x;
                        }

                    })
                });


            })(ARE);


        }

        var swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            effect: 'fade',
            preventClicks: false,
            onlyExternal: true,
            onSlideChangeEnd: function(swiper) {
                swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
                var activeIndex = swiper.activeIndex;
                $('.coin-1, .coin-2, .coin-3, .text-eat').removeClass('sway');
                switch (activeIndex) {
                    case 0:
                        addAnimation();
                        break;
                    case 1:
                        initGame();
                        break;
                }
            },
            onInit: function(swiper) {
                swiperAnimateCache(swiper); //隐藏动画元素 
                swiperAnimate(swiper); //初始化完成开始动画
                addAnimation();
                var activeIndex = swiper.activeIndex;
                switch (activeIndex) {
                    case 0:
                        {
                            var fireworksArray = $('#tpl-fireworks').html();
                            $('.fireworks-container').empty();
                            for (var i = 0; i < 8; i++) {
                                $('.fireworks-container').append(fireworksArray);
                            }
                            $('.fireworks-container .fireworks').each(function(index, item) {
                                $(item).css('animation', 'falling-' + (index % 2 + 1) + ' ' + (Math.random() * 5 + 5) + 's linear both ' + (Math.random() * 10) + 's');
                            });
                        }
                }
            }
        });

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
            swiper.slideNext();
        });

    });
});


