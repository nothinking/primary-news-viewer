define(["backbone"], function(Backbone){
	var Model = Backbone.Model.extend({
		"idAttribute": "_id",
		"defaults": {
			"newsId": "",
			"title": ""
		},
		"parse": function(response){
			console.log(response.content);
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
						console.log("success")
						that.set(data);
						console.log(that.toJSON())
						// that.set(data).save();
					},
					"fail": function(data, textStatus, jqXHR){
						that.trigger("error", this, jqXHR, options);
					}
				}, options);
			console.log("load");
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