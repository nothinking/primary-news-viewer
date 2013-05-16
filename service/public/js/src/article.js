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
					"success": function(data, textStatus, jqXHR){
						console.log("success");
						console.log(data);
						console.log(that);
						//that.save(data);
					},
					"fail": function(data, textStatus, jqXHR){
						that.trigger("error", this, jqXHR, options);
					}
				});
			$.getJSON("http://media.daum.net/api/service/news/view.jsonp?callback=?&newsId=" + this.get("newsId"), options);
		}
	});

	var Collection = Backbone.Collection.extend({
		"model": Model,
		"url": function(){
			return "/api/primarynews/" + this.categoryKey + "?" + $.param(this.params);
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