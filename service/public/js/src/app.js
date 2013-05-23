define(["backbone", "page", "article"], function(Backbone, Page, Article){

	var App = function(){
		this.initialize.apply(this, arguments);
	};
	_.extend(App.prototype, Backbone.Events, {
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
			console.log(key, params)
			this.render(key, params)
		},
		"render": function(key, params){
			var page = this.pages[key];
			if(!page) {
				switch(key){
					case "list":
						// categoryKey를 받아올 것 
						var collection = Article.Factory.getCollection( params[0] );
						var model = new Page.Model({
							// top은 category로 부터 받거나 어쩌거나 
							"title": "top",
							"content": collection
						});
						var view = new Article.List({
							"el": "#list",
							"model": model
						});
					break;
					case "view":
						var collection = Article.Factory.getCollection( params[0] );
						var model = new Page.Model({
							// top은 category로 부터 받거나 어쩌거나 
							"title": "top",
							"content": collection,
							"selectedId": params[1]
						});
						var view = new Article.View({
							"el": "#view",
							"model": model,
							"parent": "list",
							"child": null
						});
					break;
				}

				page = this.pages[key] = view;
				page.model.fetch();

			} else {
				switch(key){
					case "list":
						page.model.get("content").categoryKey = params[0];
						page.model.fetch();
					break;
					case "view":
						var model = Article.Factory.getModel(params[0], params[1]);
						page.setModel(model);
						if(model.get("content")){
							page.render();
						} else {
							model.fetch();
						}
					break;
				}
			}

			this._animate(page);

		},
		"_animate": function(targetPage){
			
			targetPage.$el.addClass("current");


			window.setTimeout(function(){
				if(this.currentPage){
					var targetAnimate = targetPage.$el.data("animate") || "slide",
						direction = this.currentPage.child === targetPage.parent ? "left" : "right";

					targetPage.animate(targetAnimate + direction + " in");
					this.currentPage.animate(targetAnimate + direction + " out")
						.$el.one("webkitAnimationEnd animationend", function(){
							console.log(this);
							$(this).removeClass("current");
							window.scrollTo(0, 1)
						});
				} 
				
				this.currentPage = targetPage;

			}.bind(this), 0);

		}
	});

	return App;
});