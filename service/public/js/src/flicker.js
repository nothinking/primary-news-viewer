define(["jquery", "hammer"], function($) {

	var Flicker = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, options);
		this.initialize();
	};

	Flicker.prototype = {
		"initialize": function() {
			this.hammer = this.$element.hammer().data("hammer");
			this.$element
				.on("dragstart.data-api", ".item", $.proxy(this.dragStartHandler, this))
				.on("dragend.data-api", ".item", $.proxy(this.dragEndHandler, this));
		},
		"getRelatedItem": function($target, direction){
			var $related;
			switch (direction) {
				case "left":
					$related = $target.next();
					break;
				case "right":
					$related = $target.prev();
					break;
			}
			return $related;
		},
		"drag": function($target, $related, gesture){
			var targetLeft = gesture.deltaX,
				relatedLeft = this.$element.width() * ( gesture.direction === "left" ? 1 : -1 ) + gesture.deltaX
			$target.css("left", targetLeft);
			$related.addClass("dragging").css("left", relatedLeft);
		},
		"activate": function($target, $related, direction){
			var targetLeft = "0",
				direction = direction || ($target.index() > $related.index() ? "left" : "right"),
				relatedLeft = ((direction === "left") !== $target.is(".active")) ? "-100%" : "100%";

			if($target.is($related)){
				$target.removeClass("related").addClass("active");
			} else {
				$target.addClass("transition");
				$related.addClass("transition");
				setTimeout(function(){
					$target.css("left", targetLeft).one("transitionEnd, webkitTransitionEnd", function(e){
						$target.addClass("active").removeClass("related transition dragging").css("left", "");
						$related.removeClass("active transition related dragging").css("left", "");
					});
					$related.css("left", relatedLeft);
				}, 0);
			}
			$target.trigger("active");
		},
		"dragStartHandler": function(e) {
			var $target = $(e.currentTarget),
				$related,
				direction = e.gesture.direction;


			switch (direction) {
				case "left":
				case "right":
					this.$element.trigger(new $.Event("dragstart:before", {
						"gesture": e.gesture
					}));

					$related = this.getRelatedItem($target, direction);

					this.$element.on("drag.data-api", ".item", $.proxy(this.dragHandler, this));
					
					e.gesture.preventDefault();
					e.preventDefault();
					break;
				default:
					this.$element.off("drag.data-api");
					console.log("cancel");
					break;
			}
		},
		"dragEndHandler": function(e){
			var $target = $(e.currentTarget),
				$related,
				direction = e.gesture.direction,
				canActivate;

			switch (direction) {
				case "left":
				case "right":
					$related = this.getRelatedItem($target, direction);
					canActivate = $related.length !== 0 && (e.gesture.distance * 3 >= $target.width() || e.gesture.velocityX >= this.hammer.options.swipe_velocity);

					if(canActivate){
						this.activate($related, $target, e.gesture.direction);
					} else {
						this.activate($target, $related, e.gesture.direction);
					}
					e.gesture.preventDefault();
					e.preventDefault();
					break;
				default:
					this.$element.find(".item").removeClass("dragging");
					break;
			}


			this.$element.off("drag.data-api");
		},
		"dragHandler": function(e){
			var $target = $(e.currentTarget),
				$related,
				direction = e.gesture.direction;

			switch (direction) {
				case "left":
				case "right":
					$related = this.getRelatedItem($target, direction);
					this.drag($target, $related, e.gesture);
					break;
			}
		}
	};

	$.fn.flicker = function(options) {
		return this.each(function() {
			var $this = $(this),
				data = $this.data("flicker"),
				option = typeof options === "object" && options;
			if (!data) $this.data("flicker", (data = new Flicker(this, option)));
			if (typeof option === "string") data[option]();
			else if (option instanceof $) data.select(option);
		});
	};
	$.fn.flicker.Constructor = Flicker;
});