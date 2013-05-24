define(["backbone", "page", "article", "pager"], function(Backbone, Page, Article){

	var App = Backbone.View.extend({
		"el": "#jqt",
		"router": null,
		"pages": {},
		"initialize": function(options){
			_.extend(this, {
				"router": new Backbone.Router({
					"routes": {
						":collection": "list",
						":collection/:id": "view"
					}
				})
			}, options);

			this.listenTo(this.router, "route", this.routeHandler);
			!Backbone.History.started && Backbone.history.start({ "pushState": true });
		},
		"routeHandler": function(key, params){
			this.render(key, params);
		},
		"render": function(key, params){
			var page = this.pages[key];
			if(!page) {
				switch(key){
					case "list":
						var collection = Article.Factory.getCollection( params[0] );
						var model = new Page.Model({
							"title": "top",
							"content": collection
						});
						var view = new Article.List({
							"model": model
						});
					break;
					case "view":
						var model = Article.Factory.getModel(params[0], params[1])
						var view = new Article.View({
							"model": model
						});
					break;
				}

				page = this.pages[key] = view;
				page.model.fetch();

				this.$el.append(page.$el);

			} else {
				switch(key){
					case "list":
						page.model.get("content").categoryKey = params[0];
						page.model.fetch();
					break;
					case "view":
						page.model.set("selectedId", params[1]);
						page.select();
					break;
				}
			}

			this.$el.pager(page.$el);
		}
	});

	return App;
});