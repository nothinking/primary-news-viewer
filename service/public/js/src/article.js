define(["backbone"], function(Backbone){
	var Model = Backbone.Model.extend({
		"idAttribute": "_id",
		"defaults": {
			"newsId": "",
			"title": ""
		},
		"parse": function(response){
			if(response.content === undefined){
				this.load(response.newsId);
			} 
			return response;
		},
		"load": function(newsId, options){
			var that = this,
				options = _.extend({
					"url": "http://media.daum.net/api/service/news/view.jsonp?callback=?&newsId=" + newsId,
					"async": false,
					"dataType": "jsonp",
					"contentType": "application/json",
					"success": function(data){
						console.log(data);
						that.save(data);
					},
					"fail": function(data, textStatus, jqXHR){
						that.trigger("error", this, jqXHR, options);
					}
				});

			$.ajax(options);
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