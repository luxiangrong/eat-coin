var paceOptions = {

};

Pace.on('done', function() {
    jQuery(function($) {
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
                        {
                            window.setTimeout(function() {
                                $('.coin-1, .coin-2, .coin-3').addClass('sway');
                            }, 1000)
                            window.setTimeout(function() {
                                $('.text-eat').addClass('sway');
                            }, 1500)
                        }
                }
            },
            onInit: function(swiper) {
                swiperAnimateCache(swiper); //隐藏动画元素 
                swiperAnimate(swiper); //初始化完成开始动画
                window.setTimeout(function() {
                    $('.coin-1, .coin-2, .coin-3').addClass('sway');
                }, 1000)
                window.setTimeout(function() {
                    $('.text-eat').addClass('sway');
                }, 1500)
                var activeIndex = swiper.activeIndex;
                switch (activeIndex) {
                    case 0:
                        {
                            var fireworksArray = $('#tpl-fireworks').html();
                            $('.fireworks-container').empty();
                            for (var i = 0; i < 15; i++) {
                                $('.fireworks-container').append(fireworksArray);
                            }
                            $('.fireworks-container .fireworks').each(function(index, item) {
                                $(item).css('animation', 'falling-' + (index % 2 + 1) + ' ' + (Math.random() * 5 + 5) + 's linear ' + (Math.random() * 10) + 's');
                            });
                        }
                }
            }
        });


        $('.start').on('click', function() {
            swiper.slideNext();
        });

    });
});




// (function(ARE) {
//  var w = $('body').width();
//  var h = $('body').height();
//  $('#ourCanvas').prop('width', w).prop('height', h);

//     var Stage = ARE.Stage, Bitmap = ARE.Bitmap, ParticleSystem = ARE.ParticleSystem, Vector2 = ARE.Vector2, FPS = ARE.FPS;

//             var pgBmp, stage = new Stage("#ourCanvas", true);
//             stage.debug = true;

//             var ps = new ParticleSystem({
//                 emitX: w/2,
//                 emitY: 0,
//                 speed: 10,
//                 angle: 90,
//                 angleRange: 10,
//                 emitArea: [w, 0],
//                 gravity: new Vector2(0, 1),
//                 texture: "data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=",
//                 filter: [0.8, 0.2, 0.8, 1],
//                 emitCount: 1,
//                 maxCount: 10,
//                 hideSpeed: 0.005,
//             });

//             stage.add(ps);

//             stage.on("mousemove", function (evt) {
//                 // ps.emitX = evt.stageX;
//                 // ps.emitY = evt.stageY;
//             })

// })(ARE);
