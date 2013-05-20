var mongojs = require("mongojs");

exports.create = function(collection, query, callback){
	collection.insert(query, callback);
};
exports.read = function(collection, query, callback){
	collection.find(query, callback);
};
exports.readOne = function(collection, query, callback){
	collection.findOne(query, callback);
};
exports.update = function(collection, query, callback){

	var _id = new mongojs.ObjectId(query._id);
	delete query._id;

	collection.findAndModify({
		"query": { "_id": _id },
		"update": {
			"$set": query
		},
		"new": true
	}, callback);
};
exports.del = function(collection, query, callback){
	collection.remove(query, true, callback);
};
