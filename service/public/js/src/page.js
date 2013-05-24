define(["backbone", "hammer", "text!/public/template/page.html"], function(Backbone, hammer, html){

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
		"template": _.template(html),
		"className": "item",
		"events": {
		},
		"initialize": function(options){
			_.extend(this, {}, options);

			this.$el.html(this.template(this.model.toJSON()));
			
			this.$title = this.$(".toolbar h1");
			this.$content = this.$(".content");

			//console.log(this);
		}
	});

	return {
		"Model": Model,
		"View": View
	};
});