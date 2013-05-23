define(["backbone", "page", "text!/public/template/articleItem.html", "text!/public/template/articleView.html"], function(Backbone, Page, itemHTML, viewHTML){
	var Model = Page.Model.extend({
		"idAttribute": "_id",
		"defaults": _.extend({}, Page.Model.prototype.defaults, {
			"newsId": "",
			"title": "",
			"content": "",
			"img": ""
		}),
		"parse": function(response, jqXHR, options){
			if(response.content === undefined && response.newsId !== undefined){
				this.load(response.newsId);
			};
			return response;
		},
		"parent": "list",
		"child": null,
		"load": function(newsId){
			var that = this,
				options = {
					"url": "http://media.daum.net/api/service/news/view.jsonp?callback=?&newsId=" + newsId,
					"dataType": "jsonp",
					"contentType": "application/json",
					"wait": true,
					"success": function(data){
						that.save(data);
					},
					"fail": function(data, textStatus, jqXHR){
						that.trigger("error", that, jqXHR, options);
					}
				};
			this.sync("read", this, options);
		},
		"url": function(){
			return "/api/" + this.attributes.categoryKey + "/" + this.id;
		},
		"prev": function(){
			var i = this.collection.indexOf(this),
				prevIndex = i - 1;

			return prevIndex >= 0 && this.collection.at(prevIndex);
		},
		"next": function(){
			var i = this.collection.indexOf(this),
				nextIndex = i + 1;

			return nextIndex < this.collection.length && this.collection.at(nextIndex);
		}
	});

	var Collection = Backbone.Collection.extend({
		"model": Model,
		"url": function(){
			return "/api/" + this.categoryKey;
		},
		"initialize": function(models, options){

			_.extend(this, {
				"categoryKey": "top"
			}, options);

			this.params = {
			};
		},
		"getOrAdd": function(id){
			var model = this.get(id);
			if(!model){
				model = new this.model({
					"_id": id,
					"categoryKey": this.categoryKey
				});
				this.add(model);
			}

			return model;
		}
	});

	var Item = Backbone.View.extend({
		"tagName": "li",
		"template": _.template(itemHTML),
		"events": {
			"click" : "clickHandler"
		},
		"initialize": function(options){
			_.extend(this, {}, options);
			this.listenTo(this.model, "change", this.render);

		},
		"render": function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		"clickHandler": function(e){
			// window.jQT
		}	
	});

	var List = Page.View.extend({
		"view": Item,
		"initialize": function(options){
			options = _.extend({
				"parent": "category",
				"child": "list"
			}, options);
			Page.View.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model.get("content"), "sync", this.render);
		},
		"render": function(){
			this.$title.html( this.model.get("title") );
			this.$content.empty();
			this.model.get("content").each(this.append, this);
		},
		"append": function(model){
			var view = new this.view({"model": model});
			this.$content.append(view.render().$el);
		}
	});

	var View = Page.View.extend({
		"template": _.template(viewHTML),
		"events": _.extend(Page.View.prototype.events, {

		}),
		"initialize": function(options){
			options = _.extend({
				"parent": "list",
				"child": "null"
			}, options);
			
			Page.View.prototype.initialize.apply(this, arguments);

			this.views = {};

			this.collection = this.model.get("content");

			this.listenToOnce(this.collection, "sync", this.select);

			// this.model && this.listenTo(this.model, "change", this.render);
		},
		"select": function(){
			var id = this.model.get("selectedId"),
				model = this.collection.get(id);
			this.selectedModel = model;
			this.render(this.selectedModel);
		},
		"render": function(model){
			var view = this.views[model.cid],
				prevModel = model.prev(),
				nextModel = model.next(),
				prevView = this.views[prevModel.cid],
				nextView = this.views[nextModel.cid];

				console.log(prevModel, nextModel)

			if(!view) {

				view = $("<div>", { "id": this.selectedModel.cid, "class": "active" });

				this.$content.append($("<div>", { "id": prevModel.cid }).html(prevModel.get("content")));
				this.$content.append(view);
				this.$content.append($("<div>", { "id": nextModel.cid }).html(nextModel.get("content")));
				view.html(model.get("content"));
			}

			this.$title.html( model.get("title") );

			// this.$content.append( this.selectedModel.get("content") );
			return this;
		},
		"setModel": function(model){
			this.selectedModel = model;
			return this;
		},
		"_setNextModel": function(){
			var model = this.selectedModel.next();
			if(model){
				this.setModel(model).select();
			}
			console.log("next")
		},
		"_setPrevModel": function(){
			console.log("prev")
			var model = this.selectedModel.prev();
			if(model){
				this.setModel(model).select();
			}
		},
		"swipeleftHandler": function(e) {
			this._setNextModel();
		},
		"swiperightHandler": function(e) {
			this._setPrevModel();
		},
		"dragHandler": function(e) {
			switch(e.gesture.direction){
				case "left":
				case "right":
					this.$content.css("left", e.gesture.deltaX);
					break;
			}
			return;
		},
		"dragendHandler": function(e){
			var isReached = this.$el.width() < Math.abs(e.gesture.distance) * 2;
			if(isReached){
				this.animate("slide" + e.gesture.direction + " out");
			} else {
				this.$content.css("left", "auto");
			}
		}
	});

	var Factory = {
		// NOT IMPLEMENTED
		"collections": {},
		"getCollection": function(key){
			var collection = this.collections[key] || (this.collections[key] = new Collection(null, {"categoryKey": key}));
			return collection;
		},
		"getModel": function(key, id){
			var collection = this.getCollection(key);
			var model = collection.getOrAdd(id);
			return model;
		}
	};

	return {
		"Model": Model,
		"Collection": Collection,
		"Item": Item,
		"List": List,
		"View": View,
		"Factory": Factory
	}
});