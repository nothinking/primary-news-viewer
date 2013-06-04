define(["backbone", "page", "article", "menu", "kontext"], function(Backbone, Page, Article, Menu){

	var App = Backbone.View.extend({
		"el": "#jqt",
		"events": {
			"drag #view": "dragHandler",
			"dragend #view": "dragEndHandler"
		},
		"router": null,
		"initialize": function(options){
			_.extend(this, {
				"router": new Backbone.Router({
					"routes": {
						"": "category",
						":category": "list",
						":category/:id": "view"
					}
				})
			}, options);

			this.listenTo(this.router, "route:category", this.routeCategoryHandler);
			this.listenTo(this.router, "route:list", this.routeListHandler);
			this.listenTo(this.router, "route:view", this.routeViewHandler);


		    this.k = kontext(this.el);

		    this.menu = new Menu();

			!Backbone.History.started && Backbone.history.start({ "pushState": true });
		},
		"prepare": function(categoryKey){
			if(!this.list){
				this.list = new Article.List({
					"title": categoryKey,
					"categoryKey": categoryKey
				});
			}
			
			if(!this.view){
				this.view = new Article.View({
					"title": "",
					"categoryKey": categoryKey
				});
			}
		},
		"routeCategoryHandler": function(){
			if(this.$el.find("> .show").length){
				this.k.show(0);
			} else {
				this.$("#category").addClass("show");
			}
		},
		"routeListHandler": function(categoryKey){
			this.prepare(categoryKey);
			if(this.$el.find("> .show").length){
				this.k.show(1);
			} else {
				this.list.$el.addClass("show");
			}
		},
		"routeViewHandler": function(categoryKey, id){
			this.prepare(categoryKey);
			this.view.select(id);
			if(this.$el.find("> .show").length){
				this.k.show(2);
			} else {
				this.view.$el.addClass("show");
			}
		},
		"dragHandler": function(e){
			/*
			switch(e.gesture.direction){
				case "down":
					if(window.scrollY <= 200){
						$(".fixed-bottom").hide();
					} else if(e.gesture.velocityY > 0.3){
						$(".fixed-bottom").show();
					} else {
						$(".fixed-bottom").hide();
					}
				break;
				default:
					$(".fixed-bottom").hide();
				break;
			}
			*/
		},
		"dragEndHandler": function(e){
		},
		"show": function(e){

		}
	});

	return App;
});