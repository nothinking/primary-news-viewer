define(["backbone", "page", "text!/template/articleItem.html", "text!/template/articleView.html"], function(Backbone, Page, itemHTML, viewHTML){
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
		},
		"prev": function(){
			var i = this.collection.indexOf(this),
				prevIndex = i - 1;

			return prevIndex >= 0 && this.collection.at(prevIndex);
		},
		"next": function(){
			var i = this.collection.indexOf(this),
				nextIndex = i + 1;

			return prevIndex < this.collection.length && this.collection.at(nextIndex);
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

	var List = Page.View.extend({
		"view": Item,
		"initialize": function(options){
			Page.View.prototype.initialize.apply(this, arguments);
			this.listenTo(this.collection, "sync", this.render);
		},
		"render": function(){
			this.$content.empty();
			this.collection.each(this.append, this);
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
			Page.View.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, "change", this.render);
		},
		"render": function(){
			this.$title.html( this.model.get("title") );
			this.$content.html( this.model.get("content") );
			return this;
		},
		"swipeleftHandler": function() {
			var m = this.model.next();
			console.log(m.get("id"));
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