define(["backbone", "text!/public/template/page.html"], function(Backbone, html){

	var Model = Backbone.Model.extend({
		"defaults": {
			"title": "",
			"collection": null
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
			_.extend(this, {
				"model": new Model({
					"title": options.title
				}),
			}, options);

			// this.$el.html(this.template(this.model.toJSON()));

			// this.$el.attr("id", this.model.cid);
			
			this.$title = this.$(".toolbar h1");
			this.$content = this.$(".content");

			this.$el.data("view", this);

			//console.log(this);
		},
		"render": function(){
			this.$title.html( this.model.get("title") );
			return this;
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