
require(["hammer", "bootstrap"], function(Hammer) {
    var directionMap = {
        "left": "next",
        "right": "prev"
    }; 
    var translateX = function($element, x){
        $element.css("-webkit-transform", x !== "" ? ("translateX(" + x + "px)") : "");
    };
    var Pager = function(element, options){
        this.$element = $(element);
        this.options = $.extend({}, options);
        this.initialize();
    };
    Pager.prototype = {
        "initialize": function(){
            this.hammer = Hammer(this.$element);
            this.$element
                .on("dragstart", $.proxy(this.dragStartHandler, this))
                .on("dragend", $.proxy(this.dragEndHandler, this));

        },
        "select": function(element){
            this.$element.find("> .active").removeClass("active");
            element.addClass("active");
        },
        "animate": function(element, direction){
            var $active = $(element),
                $next = $active[directionMap[direction]](),
                className = ($active.data("animate") || "slide") + direction;

            if($next.length > 0){
                $active.addClass(className + " out").one("webkitAnimationEnd animationend", function(e){
                    $(this).removeClass(className + " out active").css("-webkit-transform", "");
                });
                $next.addClass(className + " in active").one("webkitAnimationEnd animationend", function(e){
                    $(this).removeClass(className + " in").css("-webkit-transform", "");
                });
            }
        },
        "swipeHandler": function(e){
            switch(e.gesture.direction){
                case "left":
                case "right":
                    this.animate(e.target, e.gesture.direction);
                    break;
            }
        },
        "dragHandler": function(e){
            var $active = $(e.target),
                $next = $active[directionMap[e.gesture.direction]](),
                width = $active.width() * -1;

            switch(e.gesture.direction){
                case "left":
                    width *= -1;
                case "right":
                    translateX($active, e.gesture.deltaX);
                    translateX($next, e.gesture.deltaX + width);
                    break;
            }
            return;
        },
        "dragStartHandler": function(e){
            var $active = $(e.target),
                $next = $active[directionMap[e.gesture.direction]]();

            switch(e.gesture.direction){
                case "left":
                case "right":
                    $next.addClass("active");
                    this.$element.on("drag", this.dragHandler);
                    break;
            }
        },
        "dragEndHandler": function(e){
            var $active = $(e.target),
                $next = $active[directionMap[e.gesture.direction]]();

            switch(e.gesture.direction){
                case "left":
                case "right":
                    // 끌어올 페이지가 없을 때 제자리로 
                    if($next.length === 0){
                        translateX($active, "");
                        translateX($next, "");
                    }
                    // swipe일 때 
                    else if(e.gesture.velocityX >= this.hammer.options.swipe_velocity){
                        this.animate(e.target, e.gesture.direction);
                    }
                    // 드래그가 반을 넘지 못했을 때
                    else if($active.width() > Math.abs(e.gesture.deltaX) * 2){
                        // 원래 자리로 보낸다.
                        translateX($active, "");
                        translateX($next, "");
                    } 
                    // 드래그가 반을 넘었을 때
                    else {
                        this.animate(e.target, e.gesture.direction);
                    } 
                    break;
            };
        }
    };

    $.fn.pager = function(options){
        return this.each(function(){
            var $this = $(this),
                data = $this.data("pager"),
                option = typeof options === "object" && options;
            if(!data) $this.data("pager", (data = new Pager(this, option)));
            if(typeof option === "string") data[option]();
            else if(option instanceof $) data.select(option);
        });
    };
    $.fn.pager.Constructor = Pager;

    $(function(){
        $(".pager").pager();
    });
});