define(["backbone", "text!/template/articleItem.html", "text!/template/articleView.html"], function(Backbone, itemHTML, viewHTML){
	var Model = Backbone.Model.extend({
		"idAttribute": "_id",
		"defaults": {
			"newsId": "",
			"title": ""
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
			"click a" : "view"
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

	var List = Backbone.View.extend({
		"tagName": "ul",
		"view": Item,
		"initialize": function(options){
			_.extend(this, {}, options);
			this.listenTo(this.collection, "sync", this.render);
		},
		"render": function(){
			this.collection.each(this.append, this);
		},
		"append": function(model){
			var view = new this.view({"model": model});
			this.$el.append(view.render().$el);
		}
	});

	var View = Item.extend({
		"tagName": "div",
		"className": "viewWrap",
		"template": _.template(viewHTML),
		"events": {

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