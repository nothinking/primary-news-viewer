define(["backbone", "page", "article", "circlemenu"], function(Backbone, Page, Article){

	var App = Backbone.View.extend({
		"el": "#jqt",
		"router": null,
		"initialize": function(options){
			_.extend(this, {
				"router": new Backbone.Router({
					"routes": {
						":category": "list",
						":category/:id": "view"
					}
				})
			}, options);

			this.listenTo(this.router, "route:list", this.routeListHandler);
			this.listenTo(this.router, "route:view", this.routeViewHandler);

			!Backbone.History.started && Backbone.history.start({ "pushState": true });

			$(".circlemenu").circleMenu({
		        "direction": "top-right"
		    }).show();
		},
		"routeListHandler": function(categoryKey){
			if(!this.list){
				this.list = new Article.List({
					"title": categoryKey,
					"categoryKey": categoryKey
				});
				this.list.collection.fetch();
			}
			this.$el.children().hide();
			this.list.$el.show();
		},
		"routeViewHandler": function(categoryKey, id){
			if(!this.view){
				this.view = new Article.View({
					"title": "",
					"categoryKey": categoryKey
				});
			}
			this.view.select(id);
			this.$el.children().hide();
			this.view.$el.show();

			window.view = this.view;
		}
	});

	return App;
});