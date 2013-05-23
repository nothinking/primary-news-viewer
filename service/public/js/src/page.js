define(["backbone", "hammer"], function(Backbone, hammer){

	var Model = Backbone.Model.extend({
		"defaults": {
			"title": "",
			"content": null,
		},
		"initialize": function(model, options){
		},
		"fetch": function(){
			if(this.attributes.content instanceof Backbone.Collection){
				this.attributes.content.fetch.apply(this.attributes.content, arguments);
			} else {
				Backbone.Model.prototype.fetch.apply(this, arguments);
			}
		}
	});

	var View = Backbone.View.extend({
		"events": {
			"click .back": "backBtnClickHandler",
			"swipeleft": "swipeleftHandler",
			"swiperight": "swiperightHandler",
			"drag": "dragHandler",
			"dragend": "dragendHandler"
		},
		"initialize": function(options){
			_.extend(this, {}, options);
			this.$title = this.$(".toolbar h1");
			this.$content = this.$(".content");
			this.$el.hammer();

			//console.log(this);
		},

		"animate": function(className){
			this.$el.addClass(className);
			this.$el.one("webkitAnimationEnd animationend", function(){
				$(this).removeClass(className).css("left", "auto");

			});
			return this;
		},

		"backBtnClickHandler" : function(e) {
			e.preventDefault();

			history.back();

		},
		"swipeleftHandler": function(e) {
			return;
		},
		"swiperightHandler": function(e) {
			return;
		},
		"dragHandler": function(e) {
			return;
		},
		"dragendHandler": function(e){
			return
		}
	});

	return {
		"Model": Model,
		"View": View
	};
});