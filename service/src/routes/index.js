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
	var path = [ req.params.collection, req.params.id ].join("/"),
		options = {
			"method": req.method,
			"headers": {
				"Content-type": "application/json"
			},
			"url": BACKBONE_API_URL + "/" + DB_NAME + "/" + path + "?" + $.param(req.query),
			"body": JSON.stringify(req.body)
		};

	request(options, function(err, response, body){
		console.log(err, response)
		if(err){
			res.json(500, err);
		} else {
			res.json(response.statusCode || 500, JSON.parse(body));
		}
	});
};


exports.index = index;
exports.api = api;
