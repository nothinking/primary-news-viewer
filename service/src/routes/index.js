var request = require("request");
// var r = request.defaults({"proxy": "http://10.10.159.45:13128"});

// TODO move to config
var BACKBONE_API_URL = "http://uidev.media.daum.net:3000";
var DB_NAME = "primarynews";

var index = function(req, res){
	res.render("index", {})
};


var api = function(req, res){
	var path = [ req.params.collection, req.params.id ].join("/");
	console.log(BACKBONE_API_URL + "/" + DB_NAME + "/" + path);
	// request(BACKBONE_API_URL + "/" + DB_NAME + "/" + path);

	res.json({});
};

exports.index = index;
exports.api = api;
