
define(["jquery", "hammer", "bootstrap"], function($, Hammer) {
    var directionMap = {
        "left": "next",
        "right": "prev"
    };
    var translateX = function($element, x){
        $element.css("-webkit-transform", x !== "" ? ("translate3d(0,0,0) rotate(0) scale(1) translateX(" + x + "px)") : "");
    };
    var Pager = function(element, options){
        this.$element = $(element);
        this.options = $.extend({}, options);
        this.initialize();
    };
    Pager.prototype = {
        "isMoving": false,
        "initialize": function(){
            this.hammer = Hammer(this.$element);
            this.$element
                .on("dragstart.data-api", ".item", $.proxy(this.dragStartHandler, this))
                .on("dragend.data-api", ".item", $.proxy(this.dragEndHandler, this));

        },
        "select": function($element){
            var $fromElement = this.$element.find("> .active"),
                $toElement = $element,
                direction = $fromElement.index() > $toElement.index() ? "right" : "left";

            this.animate($fromElement, $toElement, direction);
        },
        "animate": function(fromElement, toElement, direction){
            var $fromElement = $(fromElement),
                $toElement = $(toElement),
                className = ($toElement.data("animate") || "slide") + direction,
                that = this;

            if(!$fromElement.is($toElement) && $fromElement.length > 0 && $toElement.length > 0){
                $fromElement.css("-webkit-transform", function(){
                    return this.style.webkitTransform || "translateX(" + ( direction === "left" ? "0" : "0" ) + ")";
                });

                $toElement.css("-webkit-transform", function(){
                    return this.style.webkitTransform || "translateX(" + ( direction === "left" ? "100%" : "-100%" ) + ")";
                });

                window.setTimeout(function(){
                    $fromElement
                        .addClass(className + " out")
                        .one("webkitAnimationEnd animationend", function(e){
                            $(this).removeClass(className + " dragging active out")
                                .css("-webkit-transform", "")
                                .trigger(new $.Event("page:hidden", { "target": $toElement[0], "relatedTarget": $fromElement[0] }));
                            that.isMoving = false;
                        })
                        .trigger(new $.Event("page:hide", { "target": $toElement[0], "relatedTarget": $fromElement[0] }));

                    $toElement
                        .addClass(className + " in")
                        .one("webkitAnimationEnd animationend", function(e){
                            $(this).siblings(".dragging").removeClass("dragging");
                            $(this).addClass("active").removeClass(className + " dragging in")
                                .css("-webkit-transform", "")
                                .trigger(new $.Event("page:shown", { "target": $toElement[0], "relatedTarget": $fromElement[0] }));
                            that.isMoving = false;
                        })
                        .trigger(new $.Event("page:show", { "target": $toElement[0], "relatedTarget": $fromElement[0] }));
                }, 0);
            } else {
                $toElement.addClass("active");
            }

            this.$active = $toElement;
        },
        "dragHandler": function(e){
            var $active = $(e.currentTarget),
                width = $active.width() * -1;

            switch(e.gesture.direction){
                case "left":
                    width *= -1;
                case "right":
                    $next = $active[directionMap[e.gesture.direction]]();
                    $next.addClass("dragging");
                    translateX($active, e.gesture.deltaX);
                    translateX($next, e.gesture.deltaX + width);
                    break;
            }
            return;
        },
        "dragStartHandler": function(e){
            var $active = $(e.currentTarget),
                $next;

            if(this.isMoving) return;

            switch(e.gesture.direction){
                case "left":
                case "right":
                    $next = $active[directionMap[e.gesture.direction]]();
                    $active.addClass("dragging");
                    $next.addClass("dragging");
                    $active.on("drag", this.dragHandler);
                    break;
            }
            this.isMoving = true;

        },
        "dragEndHandler": function(e){
            var $active = $(e.currentTarget),
                $next,
                oppositeClassName = "left",
                that = this;

            e.preventDefault();

            switch(e.gesture.direction){
                case "left":
                    oppositeClassName = "right";
                case "right":
                    $next = $active[directionMap[e.gesture.direction]]();
                    // 끌어올 페이지가 없을 때 제자리로 
                    if($next.length === 0){
                        $active.addClass("slide" + e.gesture.direction + " in").one("webkitAnimationEnd animationend", function(){
                            $active.removeClass("dragging slide" + e.gesture.direction + " in");
                            translateX($active, "");
                            that.isMoving = false;
                        });
                    }
                    // swipe일 때 
                    else if(e.gesture.velocityX >= this.hammer.options.swipe_velocity){
                        this.animate($active, $next, e.gesture.direction);
                    }
                    // 드래그가 반을 넘지 못했을 때
                    else if($active.width() > Math.abs(e.gesture.deltaX) * 2){
                        this.animate($next, $active, oppositeClassName);
                    } 
                    // 드래그가 반을 넘었을 때
                    else {
                        this.animate($active, $next, e.gesture.direction);
                    }
                    break;
            };

            $active.off("drag", this.dragHandler);
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

});