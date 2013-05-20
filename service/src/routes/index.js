var request = require("request");
var $ = require("jquery");
var mongojs = require("mongojs");
var mongoapi = require("../mongoapi");
var db = mongojs('uidev.media.daum.net:27017/primarynews')


var index = function(req, res){
	res.render("index", {})
};

var api = function(req, res){

	var collection = db.collection(req.params.collection),
		id = req.params.id,
		query = req.query.body ? JSON.parse(req.query.body) : req.body,
		method = req.method,
		callback = function(err, doc){
			console.log("callback:", err, doc)
			if(err !== null){
				res.json(500, err);	
			} else {
				res.json(doc);
			}
		};


	switch(method){
		case "POST":
			mongoapi.create(collection, query, callback);
		break;
		
		case "GET":
			if(id){
				query._id = new mongojs.ObjectId(id);
				mongoapi.readOne(collection, query, callback);
			} else {
				mongoapi.read(collection, query, callback);
			}
		break;

		case "PUT":
			mongoapi.update(collection, query, callback);
		break;

		case "DELETE":
			query._id = new mongojs.ObjectId(id);
			mongoapi.del(collection, query, callback);
		break;
	}
};


exports.index = index;
exports.api = api;
