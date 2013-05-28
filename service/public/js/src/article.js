define(["backbone", "page", "text!/public/template/pagelist.html", "text!/public/template/articleItem.html"], function(Backbone, Page, listHTML, itemHTML){
	var Model = Backbone.Model.extend({
		"idAttribute": "_id",
		"defaults": {
			"newsId": "",
			"title": "",
			"content": "",
			"img": ""
		},
		"parse": function(response, jqXHR, options){
			if(response.content === undefined && response.newsId !== undefined){
				this.load(response.newsId);
			};
			response.content = response.content.replace(/<object.*<\/object>/ig, "");
			return response;
		},
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
		},
		"index": function(){
			return this.collection.indexOf(this);
		}
	});

	var Collection = Backbone.Collection.extend({
		"model": Model,
		"url": function(){
			return "/api/" + this.categoryKey;
		},
		"comparator": function(model){
			return model.get("newsId");
		},
		"initialize": function(models, options){

			_.extend(this, {
				"categoryKey": "top"
			}, options);

			this.params = {
			};
		},
		"getOrAdd": function(id){
			console.log(id)
			var model = this.get(id);
			if(!model){
				model = new this.model({
					"_id": id,
					"categoryKey": this.categoryKey
				});
				this.add(model);
				model.fetch();
			}

			return model;
		}
	});

	var Item = Backbone.View.extend({
		"tagName": "li",
		"template": _.template(itemHTML),
		"events": {
		},
		"initialize": function(options){
			_.extend(this, {}, options);
			this.listenTo(this.model, "change", this.render);

		},
		"render": function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}	
	});

	var List = Page.View.extend({
		"view": Item,
		"template": _.template(listHTML),
		"initialize": function(options){
			options = _.extend({
				"parent": "category",
				"child": "list"
			}, options);
			Page.View.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model.get("article"), "sync", this.render);
		},
		"render": function(){
			this.$title.html( this.model.get("title") );
			this.$content.empty();
			this.model.get("article").each(this.append, this);
		},
		"append": function(model){
			var view = new this.view({"model": model});
			this.$content.append(view.render().$el);
		},
		"showHandler": function(e){
			Backbone.history.navigate("/" + this.model.get("article").categoryKey);
		},
		"index": function(){
			return -1;
		}
	});

	var View = Page.View.extend({
		"events": _.extend(Page.View.prototype.events, {
			"page:shown": "shownHandler"
		}),
		"initialize": function(options){
			options = _.extend({
				"parent": "list",
				"child": "null"
			}, options);

			Page.View.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model.get("article"), "change", this.render);
			this.listenTo(this.model.get("article"), "sync", this.render);
			// this.model && this.listenTo(this.model, "change", this.render);
		},
		"render": function(){
			this.$title.html( this.model.get("article").get("title") );
			this.$content.html( this.model.get("article").get("content") );
			return this;
		},
		"showHandler": function(e){
			// Backbone.history.navigate("/" + this.model.get("article").get("categoryKey") + "/" + this.model.get("article").get("_id"));
		},
		"shownHandler": function(e){
			Backbone.history.navigate("/" + this.model.get("article").get("categoryKey") + "/" + this.model.get("article").get("_id"), { "trigger": true });
		},
		"backClickHandler": function(e){
			e.preventDefault();
			Backbone.history.navigate("/" + this.model.get("article").get("categoryKey"), { "trigger": true });
		},
		"index": function(){
			return this.model.get("article").index();
		}
	});

	var Factory = {
		// NOT IMPLEMENTED
		"collections": {},
		"lists": {},
		"views": {},
		"getList": function(key){
			var list = this.lists[key];

			// 리스트 페이지가 없으면 
			if(list === undefined){
				list = new List({
					"model": new Page.Model({
						"title": key,
						"article": this.getCollection(key)
					})
				});
				this.lists[key] = list;
			}

			list.model.categoryKey = key;

			return list;
		},
		"getView": function(key, id){
			var view;

			if(id === undefined){
				view = this.getList(key);
			} else {
				view = this.views[id];
				if(view === undefined){
					view = new View({
						"model": new Page.Model({
							"article": this.getModel(key, id)
						})
					});
					this.views[id] = view;
				}
			}

			return view;
		},
		"getCollection": function(key){
			var collection = this.collections[key] || (this.collections[key] = new Collection(null, {"categoryKey": key}));
			if(collection.length === 0){
				collection.fetch();
			}
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