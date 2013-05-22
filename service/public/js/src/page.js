define(["backbone", "hammer"], function(Backbone, hammer){
	var View = Backbone.View.extend({
		"events": {
			"click .back": "backBtnClickHandler",
			"swipeleft": "swipeleftHandler"
		},
		"initialize": function(options){
			_.extend(this, {}, options);
			this.$title = this.$(".toolbar h1");
			this.$content = this.$(".content");

			this.$el.hammer();

			console.log(this);
		},
		"backBtnClickHandler" : function(e) {
			e.preventDefault();

			history.back();

		},
		"swipeleftHandler": function(e) {
			
		}
	});

	return {
		"View": View
	};
});