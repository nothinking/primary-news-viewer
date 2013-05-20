define(["backbone"], function(Backbone){
	var Model = Backbone.Model.extend({
		"idAttribute": "_id",
		"defaults": {
			"newsId": "",
			"title": ""
		},
		"parse": function(response, jqXHR, options){
			if(response.content === undefined && response.newsId !== undefined){
				this.load(response.newsId);
			} 
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
						that.save(data, {});
					},
					"fail": function(data, textStatus, jqXHR){
						that.trigger("error", this, jqXHR, options);
					}
				};
			that.sync("read", that, options);
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

	return {
		"Model": Model,
		"Collection": Collection
	}
});