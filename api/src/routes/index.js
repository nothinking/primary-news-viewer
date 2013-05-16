var index = function(req, res){
	res.render("index", {})
};
exports.index = index;

// TODO move to config
var BACKBONE_API_URL = "http://uidev.media.daum.net:3000";
var DB_NAME = "primarynews";

var api = function(req, res){


}
exports.api = api;
