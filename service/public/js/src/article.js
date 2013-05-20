define(["backbone"], function(Backbone){
	var queue = [];

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
					"async": false,
					"dataType": "jsonp",
					"contentType": "application/json",
					"wait": true,
					"success": function(data){
						var func = function(){
							that.save(data, {
								"success": function(){
									var func = queue.shift();
									func && func();
								}
							});
						}

						if(queue.length === 0){
							func();
						}
						queue.push(func);

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