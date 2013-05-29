define(["backbone", "page", "text!/public/template/pagelist.html", "text!/public/template/articleItem.html", "flicker"], function(Backbone, Page, listHTML, itemHTML){
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
				return response;
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
			var i = this.index(),
				prevIndex = i - 1;

			return prevIndex >= 0 && this.collection.at(prevIndex);
		},
		"next": function(){
			var i = this.index(),
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
		"el": "#list",
		"view": Item,
		"template": _.template(listHTML),
		"initialize": function(options){
			_.defaults(options, {
				"collection": Factory.getCollection(options.categoryKey),
			});
			Page.View.prototype.initialize.apply(this, arguments);
			this.listenTo(this.collection, "sync", this.render);
		},
		"render": function(){
			Page.View.prototype.render.apply(this, arguments);
			this.$content.empty();
			this.collection.each(this.append, this);
		},
		"append": function(model){
			var view = new this.view({"model": model});
			this.$content.append(view.render().$el);
		}
	});

	var ContentItem = Backbone.View.extend({
		"tagName": "div",
		"className": "item",
		"initialize": function(options){
			_.extend(this, {}, options);
		},
		"render": function(){
			this.$el.attr("id", this.model.cid);
			this.$el.html(this.model.get("content"));
			return this;
		}
	});

	var View = Page.View.extend({
		"el": "#view",
		"events": _.extend(Page.View.prototype.events, {
			"dragstart:before .flicker": "dragStartHandler"
		}),
		"initialize": function(options){
			_.defaults(options, {
				"collection": Factory.getCollection(options.categoryKey)
			});
			Page.View.prototype.initialize.apply(this, arguments);

			this.flicker = this.$content.flicker().data("flicker");
			this.cids = [];
			this.items = [];
		},
		"select": function(id){
			var that = this;

			$.when(this.collection.deferred).done(function(){
				var model = that.collection.get(id),
					item = that.insert(model),
					selectedItem = that.selectedItem || item;
				that.flicker.activate(item.$el, selectedItem.$el);
				that.selectedItem = item;
			});

		},
		"insert": function(model){
			var i = model.index(),
				item = this.items[i],
				found = false;

			if(item){
				console.log("이미 추가된 아이템");
			} 
			else {
				item = this.items[i] = new ContentItem({ "model": model });
				
				if(!this.selectedItem){
					console.log("최초의 아이템");
					this.$content.append(item.render().$el);
				}
				else {
					console.log("최초는 아니지만 처음 들어가는 아이템");
					for(var j = i; j < this.cids.length; j++){
						if(this.cids[j]){
							this.items[j].$el.before(item.render().$el);
							found = true;
							break;
						}
					}
					if(!found){
						this.$content.append(item.render().$el);
					}
				}
			}
			this.cids[i] = model.cid;
			
			return item;
		},
		"backClickHandler": function(e){
			e.preventDefault();
			Backbone.history.navigate("/" + this.collection.categoryKey, { "trigger": true });
		},
		"dragStartHandler": function(e){
			var model, item;
			switch(e.gesture.direction){
				case "left":
					model = this.selectedItem.model.next();
					break;
				case "right":
					model = this.selectedItem.model.prev();
					break;
			}
			if(model){
				this.insert(model);
			}
		}
	});

	var Factory = {
		// NOT IMPLEMENTED
		"collections": {},
		"getCollection": function(key){
			var isNew = this.collections[key] === undefined,
				collection = this.collections[key] || (this.collections[key] = new Collection(null, {"categoryKey": key}));
			if(isNew){
				collection.deferred = collection.fetch();
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