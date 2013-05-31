define(["backbone", "page", "article", "circlemenu", "kontext"], function(Backbone, Page, Article){

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
						":category": "list",
						":category/:id": "view"
					}
				})
			}, options);

			this.listenTo(this.router, "route:list", this.routeListHandler);
			this.listenTo(this.router, "route:view", this.routeViewHandler);


			$(".circlemenu").circleMenu({
		        "direction": "top-right"
		    }).show();

		    this.k = kontext(this.el);

		    console.log(this.k);

		    
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
		"routeListHandler": function(categoryKey){
			this.prepare(categoryKey);

			/*
			this.$el.children().hide();
			this.list.$el.show();
			*/

			this.k.show(0);

			$(".fixed-bottom").hide();

			window.scrollTo(0, 1);
		},
		"routeViewHandler": function(categoryKey, id){
			this.prepare(categoryKey);
			this.view.select(id);
			this.k.show(1);
			/*
			this.$el.children().hide();
			this.view.$el.show();
			*/
			window.scrollTo(0, 1);
			window.view = this.view;
		},
		"dragHandler": function(e){
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
		},
		"dragEndHandler": function(e){
		}
	});

	return App;
});