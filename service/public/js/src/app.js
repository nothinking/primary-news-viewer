define(["backbone", "page", "article", "pager"], function(Backbone, Page, Article){

	var App = Backbone.View.extend({
		"el": "#jqt",
		"router": null,
		"events": {
			"dragstart": "dragstartHandler",
			"drag": "dragHandler"
		},
		"initialize": function(options){
			_.extend(this, {
				"router": new Backbone.Router({
					"routes": {
						":category": "list",
						":category/:id": "view"
					}
				})
			}, options);

			this.pager = this.$el.pager().data("pager");

			this.listenTo(this.router, "route:list", this.routeListHandler);
			this.listenTo(this.router, "route:view", this.routeViewHandler);

			!Backbone.History.started && Backbone.history.start({ "pushState": true });
		},
		"addPage": function(page){
			if(this.currentPage){
				if(this.currentPage.index() < page.index()){
					this.currentPage.$el.after(page.$el);
				} else {
					this.currentPage.$el.before(page.$el);
				}
			} else {
				this.$el.append(page.$el);
			}
		},
		"select": function(categoryKey, id){
			var page = Article.Factory.getView.apply(Article.Factory, arguments);
			if(page.$el.parent().length === 0){
				this.addPage(page);
			}
			this.pager.select(page.$el);
			this.currentPage = page;
			return this;
		},
		"routeListHandler": function(categoryKey){
			this.select(categoryKey);
			this.currentPage.model.get("article").fetch();
		},
		"routeViewHandler": function(categoryKey, id){
			this.select(categoryKey, id);
			this.currentPage.render();
		},
		"dragstartHandler": function(e){
			var model, page;
			switch(e.gesture.direction){
				case "left":
					model = this.currentPage.model.get("article").next();
					break;
				case "right":
					model = this.currentPage.model.get("article").prev();
					break;
			}

			if(model){
				page = Article.Factory.getView(model.get("categoryKey"), model.id);
				page.render();
				this.addPage(page);
			}
		},
		"dragHandler": function(e){
			// console.log(e.gesture.distance);
		}
	});

	return App;
});