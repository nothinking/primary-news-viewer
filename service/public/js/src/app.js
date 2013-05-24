define(["backbone", "page", "article", "pager"], function(Backbone, Page, Article){

	var App = Backbone.View.extend({
		"el": "#jqt",
		"router": null,
		"pages": {
			"list": {},
			"view": {}
		},
		"events": {

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
		"routeHandler": function(key, params){
			this.render(key, params);
		},
		"routeListHandler": function(categoryKey){
			var page = this.pages.list[categoryKey];

			// 리스트 페이지가 없으면 
			if(page === undefined){
				var view = new Article.List({
					"model": new Page.Model({
						"title": categoryKey,
						"article": Article.Factory.getCollection(categoryKey)
					})
				});
				this.$el.prepend(view.$el);
				page = this.pages.list[categoryKey] = view;
			}
			page.model.categoryKey = categoryKey;
			page.model.get("article").fetch();
			this.pager.select(page.$el);
		},
		"routeViewHandler": function(categoryKey, id){
			var page = (this.pages.view[categoryKey] || (this.pages.view[categoryKey] = {}))[id];

			if(page === undefined){
				var view = new Article.View({
					"model": new Page.Model({
						"article": Article.Factory.getModel(categoryKey, id)
					})
				});
				this.$el.append(view.$el);
				page = this.pages.view[categoryKey][id] = view;
			}
			// page.model.get("article").fetch();
			this.pager.select(page.render().$el);
		}
	});

	return App;
});