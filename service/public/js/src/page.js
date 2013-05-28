define(["backbone", "hammer", "text!/public/template/page.html"], function(Backbone, hammer, html){

	var Model = Backbone.Model.extend({
		"defaults": {
			"title": "",
			"article": null
		},
		"initialize": function(model, options){
		}
	});

	var View = Backbone.View.extend({
		"template": _.template(html),
		"className": "item",
		"events": {
			"click .back": "backClickHandler",
			"page:show": "showHandler"
		},
		"initialize": function(options){
			_.extend(this, {}, options);

			this.$el.html(this.template(this.model.toJSON()));

			this.$el.attr("id", this.model.cid);
			
			this.$title = this.$(".toolbar h1");
			this.$content = this.$(".content");

			this.$el.data("view", this);

			//console.log(this);
		},
		"backClickHandler": function(e){
			e.preventDefault();
			history.back();
		},
		"showHandler": function(e){
		}
	});

	return {
		"Model": Model,
		"View": View
	};
});