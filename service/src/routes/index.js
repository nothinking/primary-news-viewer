var request = require("request");
var $ = require("jquery");



// TODO move to config
var BACKBONE_API_URL = "http://uidev.media.daum.net:3000";
var DB_REMOTE_SERVER = "uidev.media.daum.net";
var DB_NAME = "primarynews";

// var r = request.defaults({"proxy": "http://10.10.159.45:13128"});


var index = function(req, res){
	res.render("index", {})
};


var api = function(req, res){
	var path = [ req.params.collection, req.params.id ].join("/");
	console.log(BACKBONE_API_URL + "/" + DB_NAME + "/" + path);

	request(
		{
			"method": req.method,
			"content-type": "application/json",
			"uri": BACKBONE_API_URL + "/" + DB_NAME + "/" + path + "?" + $.param(req.query)
		}, 
		function(err, response, body){
			res.json(response.statusCode, JSON.parse(body));
		}
	);
};


exports.index = index;
exports.api = api;
