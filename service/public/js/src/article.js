define(["backbone", "text!/template/articleItem.html", "text!/template/articleView.html"], function(Backbone, itemHTML, viewHTML){
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

	var List = Backbone.View.extend({
		"tagName": "ul",
		"view": Item,
		"initialize": function(options){
			_.extend(this, {}, options);
			this.listenTo(this.collection, "sync", this.render);
		},
		"render": function(){
			this.collection.each(this.append, this);
			this.trigger("render", this);
		},
		"append": function(model){
			var view = new this.view({"model": model});
			this.$el.append(view.render().$el);
		}
	});

	var View = Item.extend({
		"template": _.template(viewHTML),
		"events": {
		},
		"initialize": function(options){
			Item.prototype.initialize.apply(this, arguments);

			this.$title = this.$(".toolbar h1");
			this.$info = this.$(".info");
		},
		"render": function(){
			this.$title.html( this.model.get("title") );
			this.$info.html( this.model.get("content") );
			this.trigger("render", this);
			return this;
		}
	});

	return {
		"Model": Model,
		"Collection": Collection,
		"Item": Item,
		"List": List,
		"View": View
	}
});